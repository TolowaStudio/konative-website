import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

const mockCreate = vi.fn().mockResolvedValue({ _id: "mock-id-123" });

// Mock Sanity write client
vi.mock("@/sanity/writeClient", () => ({
  getSanityWriteClient: () => ({
    create: mockCreate,
    patch: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      commit: vi.fn().mockResolvedValue({ _id: "mock-id-123" }),
    }),
  }),
}));

// Mock fetch for Resend / CRM webhook calls
const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
vi.stubGlobal("fetch", mockFetch);

const { submitForm } = await import("@/lib/forms/submit");

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

describe("submitForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ _id: "mock-id-123" });
    mockFetch.mockResolvedValue({ ok: true, text: async () => "" });
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM = "Konative <test@example.com>";
    process.env.RESEND_TO = "owner@example.com";
    delete process.env.CRM_WEBHOOK_REQUIRED;
    delete process.env.TWENTY_INTAKE_WEBHOOK_URL;
    delete process.env.INQUIRY_WEBHOOK_URL;
    delete process.env.TWENTY_INTAKE_WEBHOOK_TOKEN;
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_EMAIL_API_TOKEN;
  });

  it("returns ok:true with an id when valid data is submitted", async () => {
    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.id).toBe("mock-id-123");
    }
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns ok:false with errors when validation fails", async () => {
    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "", email: "not-an-email" },
      emailSubject: "Test Contact",
    });
    expect(result.ok).toBe(false);
    if (!result.ok && result.errors) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns ok:false when RESEND_API_KEY is missing (fail-closed)", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });
    expect(result.ok).toBe(false);
    if (!result.ok && !result.errors) {
      expect(result.message).toBe("Failed to send notification. Please try again.");
      expect(result.stage).toBe("notify");
      expect(result.id).toBe("mock-id-123");
    }
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("persists the lead before a Resend send failure (fail-closed)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403, text: async () => "domain not verified" });
    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });
    expect(result.ok).toBe(false);
    if (!result.ok && !result.errors) {
      expect(result.message).toBe("Failed to send notification. Please try again.");
      expect(result.stage).toBe("notify");
      expect(result.id).toBe("mock-id-123");
    }
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("trimmed trailing newline in RESEND_TO does not break send", async () => {
    process.env.RESEND_TO = "owner@example.com\n";
    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });
    expect(result.ok).toBe(true);
    const resendCall = mockFetch.mock.calls.find(([url]) => url === "https://api.resend.com/emails");
    expect(resendCall).toBeDefined();
    const body = JSON.parse((resendCall![1] as { body: string }).body);
    expect(body.to).toBe("owner@example.com");
  });

  it("returns ok:true when optional CRM webhook fails (lead and email already succeeded)", async () => {
    process.env.TWENTY_INTAKE_WEBHOOK_URL = "https://crm.example.com/webhook";
    mockFetch
      .mockResolvedValueOnce({ ok: true, text: async () => "" }) // Resend
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "crm down" }); // CRM

    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });

    expect(result.ok).toBe(true);
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("returns ok:false when CRM_WEBHOOK_REQUIRED=true and webhook fails (fail-closed after persist)", async () => {
    process.env.CRM_WEBHOOK_REQUIRED = "true";
    process.env.TWENTY_INTAKE_WEBHOOK_URL = "https://crm.example.com/webhook";
    mockFetch
      .mockResolvedValueOnce({ ok: true, text: async () => "" }) // Resend
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "crm down" }); // CRM

    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });

    expect(result.ok).toBe(false);
    if (!result.ok && !result.errors) {
      expect(result.message).toBe("Failed to route inquiry. Please try again.");
      expect(result.stage).toBe("crm");
      expect(result.id).toBe("mock-id-123");
    }
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("returns ok:false when CRM_WEBHOOK_REQUIRED=true but webhook URL is missing", async () => {
    process.env.CRM_WEBHOOK_REQUIRED = "true";

    const result = await submitForm({
      schemaType: "contactInquiry",
      zodSchema: testSchema,
      payload: { name: "Jane Doe", email: "jane@example.com" },
      emailSubject: "Test Contact",
    });

    expect(result.ok).toBe(false);
    if (!result.ok && !result.errors) {
      expect(result.message).toBe("Failed to route inquiry. Please try again.");
      expect(result.stage).toBe("crm");
      expect(result.id).toBe("mock-id-123");
    }
    expect(mockCreate).toHaveBeenCalledOnce();
  });
});

import { contactSchema } from "@/lib/forms/schemas/contact";

describe("contactSchema audience field", () => {
  it("preserves a known audience slug on the parsed payload", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      organization: "Test",
      audience: "tribes",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.audience).toBe("tribes");
    }
  });

  it("treats audience as optional", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      organization: "Test",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("contactSchema campaign metadata", () => {
  it("preserves tribal scope builder metadata on the parsed payload", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      organization: "Test Tribe",
      audience: "tribes",
      context: "tbcp3-negp-scope-builder",
      campaign: "tribal-2026",
      segment: "A",
      awardSlug: "test-tribe",
      lane: "tbcp3",
      source: "konative.com",
      approvalStatus: "needs-review",
      scopeTool: "tribal-voice-to-scope",
      scopeMarkdown: "# Scope",
      scopeAnswers: [
        {
          id: "locations",
          label: "Locations",
          prompt: "Which sites?",
          value: "Clinic and government center",
        },
      ],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.context).toBe("tbcp3-negp-scope-builder");
      expect(parsed.data.scopeAnswers?.[0]?.id).toBe("locations");
    }
  });
});
