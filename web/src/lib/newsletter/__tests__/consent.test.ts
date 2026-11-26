import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({ _id: "sub-1" });
vi.mock("@/sanity/writeClient", () => ({
  getSanityWriteClient: () => ({
    create: mockCreate,
    patch: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      commit: vi.fn().mockResolvedValue({}),
    }),
  }),
}));
vi.mock("next/server", async (orig) => ({
  ...(await orig<typeof import("next/server")>()),
  after: (fn: () => unknown) => fn(),
}));

const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
vi.stubGlobal("fetch", mockFetch);

const { POST } = await import("@/app/(frontend)/api/newsletter/subscribe/route");
const { CONSENT_WORDING, CONSENT_VERSION, postalAddress } = await import("@/lib/newsletter/consent");

const req = (body: unknown) =>
  new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;

describe("newsletter signup consent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ _id: "sub-1" });
    mockFetch.mockResolvedValue({ ok: true, text: async () => "" });
    process.env.RESEND_API_KEY = "k";
    process.env.RESEND_FROM = "Konative <a@example.com>";
    process.env.RESEND_TO = "o@example.com";
    process.env.GHOST_URL = "https://ghost.example.com";
  });

  it("rejects a signup without consent and stores nothing", async () => {
    const res = await POST(req({ email: "a@b.com", source: "blog" }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("rejects consent:false", async () => {
    const res = await POST(req({ email: "a@b.com", consent: false }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("stores a consent record with time, form and exact wording (server-stamped)", async () => {
    const res = await POST(
      req({ email: "A@B.com ", source: "dispatch_archive", consent: true, consentWording: "forged" }),
    );
    expect(res.status).toBe(200);
    const doc = mockCreate.mock.calls[0][0];
    expect(doc._type).toBe("newsletterSubscriber");
    expect(doc.email).toBe("a@b.com");
    expect(doc.consentGiven).toBe(true);
    expect(doc.consentWording).toBe(CONSENT_WORDING);
    expect(doc.consentVersion).toBe(CONSENT_VERSION);
    expect(doc.consentFormId).toBe("dispatch_archive");
    expect(Number.isNaN(Date.parse(doc.consentAt))).toBe(false);
    expect(doc.optInStatus).toBe("pending_confirmation");
  });

  it("double opt-in: asks Ghost for a confirmation link, never creates a member via Admin API", async () => {
    await POST(req({ email: "a@b.com", source: "blog", consent: true }));
    const ghostCalls = mockFetch.mock.calls.filter(([u]) => String(u).startsWith("https://ghost.example.com"));
    expect(ghostCalls).toHaveLength(1);
    expect(String(ghostCalls[0][0])).toContain("/members/api/send-magic-link/");
    expect(JSON.parse(ghostCalls[0][1].body).emailType).toBe("signup");
    expect(ghostCalls.some(([u]) => String(u).includes("/admin/"))).toBe(false);
  });

  it("footer postal address falls back to the placeholder", () => {
    delete process.env.NEXT_PUBLIC_POSTAL_ADDRESS;
    expect(postalAddress()).toBe("{{POSTAL_ADDRESS}}");
  });
});
