import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const SECRET = "test-cal-secret";

const bookingBody = {
  triggerEvent: "BOOKING_CREATED",
  createdAt: "2026-11-16T20:00:00.000Z",
  payload: {
    uid: "abc123",
    title: "15 min between Jeramey James and Pat Rivers",
    startTime: "2026-11-18T17:00:00.000Z",
    endTime: "2026-11-18T17:15:00.000Z",
    additionalNotes: "Tribal broadband",
    attendees: [{ name: "Pat Rivers", email: "Pat@Example.org", timeZone: "America/Los_Angeles" }],
    responses: { organization: { value: "Example Nation", isHidden: false } },
  },
};

function sign(raw: string, secret = SECRET) {
  return createHmac("sha256", secret).update(raw).digest("hex");
}

async function post(body: unknown, opts: { signature?: string | null; raw?: string } = {}) {
  vi.resetModules();
  const { POST } = await import("../route");
  const raw = opts.raw ?? JSON.stringify(body);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const sig = opts.signature === undefined ? sign(raw) : opts.signature;
  if (sig !== null) headers["x-cal-signature-256"] = sig;
  return POST(new Request("https://konative.com/api/cal/webhook", { method: "POST", headers, body: raw }));
}

const crmCalls = () => mockFetch.mock.calls.filter(([url]) => url === "https://n8n.test/webhook/konative-intake");
const resendCalls = () => mockFetch.mock.calls.filter(([url]) => url === "https://api.resend.com/emails");

describe("POST /api/cal/webhook", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ ok: true, text: async () => "" });
    process.env.CAL_WEBHOOK_SECRET = SECRET;
    process.env.TWENTY_INTAKE_WEBHOOK_URL = "https://n8n.test/webhook/konative-intake";
    process.env.TWENTY_INTAKE_WEBHOOK_TOKEN = "intake-token";
    process.env.RESEND_API_KEY = "rk";
    process.env.RESEND_FROM = "Konative <team@konative.com>";
    process.env.RESEND_TO = "owner@example.com";
    delete process.env.CRM_WEBHOOK_REQUIRED;
    delete process.env.CAL_WEBHOOK_EVENT_SLUGS;
  });

  it("returns 503 and does nothing when CAL_WEBHOOK_SECRET is unset", async () => {
    delete process.env.CAL_WEBHOOK_SECRET;
    const res = await post(bookingBody);
    expect(res.status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects a missing signature with 401 and forwards nothing", async () => {
    const res = await post(bookingBody, { signature: null });
    expect(res.status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects a signature made with the wrong secret with 401", async () => {
    const raw = JSON.stringify(bookingBody);
    const res = await post(bookingBody, { raw, signature: sign(raw, "other-secret") });
    expect(res.status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects a body altered after signing with 401", async () => {
    const signed = sign(JSON.stringify(bookingBody));
    const tampered = JSON.stringify({ ...bookingBody, payload: { ...bookingBody.payload, uid: "evil" } });
    const res = await post(null, { raw: tampered, signature: signed });
    expect(res.status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("creates the CRM opportunity envelope and emails the team on BOOKING_CREATED", async () => {
    const res = await post(bookingBody);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, id: "cal-abc123" });

    const crm = crmCalls();
    expect(crm).toHaveLength(1);
    const init = crm[0][1] as { headers: Record<string, string>; body: string };
    expect(init.headers.Authorization).toBe("Bearer intake-token");
    const sent = JSON.parse(init.body);
    expect(sent.source).toBe("konative.com");
    expect(sent.schemaType).toBe("calBooking");
    expect(sent.sanityDocumentId).toBe("cal-abc123");
    expect(sent.data).toMatchObject({
      name: "Pat Rivers",
      email: "pat@example.org",
      organization: "Example Nation",
    });
    expect(sent.data.requirement).toContain("2026-11-18T17:00:00.000Z");
    expect(sent.data.requirement).toContain("Tribal broadband");

    const mail = resendCalls();
    expect(mail).toHaveLength(1);
    const mailBody = JSON.parse((mail[0][1] as { body: string }).body);
    expect(mailBody.to).toBe("owner@example.com");
    expect(mailBody.subject).toContain("Pat Rivers");
  });

  it("returns 502 (so Cal.com retries) when the CRM webhook is not configured, even with CRM_WEBHOOK_REQUIRED unset", async () => {
    delete process.env.TWENTY_INTAKE_WEBHOOK_URL;
    const res = await post(bookingBody);
    expect(res.status).toBe(502);
    expect(resendCalls()).toHaveLength(0);
  });

  it("returns 502 when the CRM webhook answers non-OK, even with CRM_WEBHOOK_REQUIRED unset", async () => {
    mockFetch.mockImplementation(async (url: string) =>
      url === "https://n8n.test/webhook/konative-intake"
        ? { ok: false, status: 500, text: async () => "boom" }
        : { ok: true, text: async () => "" },
    );
    const res = await post(bookingBody);
    expect(res.status).toBe(502);
    expect(resendCalls()).toHaveLength(0);
  });

  it("returns 502 when the notification email fails", async () => {
    mockFetch.mockImplementation(async (url: string) =>
      url === "https://api.resend.com/emails"
        ? { ok: false, status: 500, text: async () => "boom" }
        : { ok: true, text: async () => "" },
    );
    const res = await post(bookingBody);
    expect(res.status).toBe(502);
  });

  it("acknowledges non-creation events without touching the CRM or email", async () => {
    const res = await post({ triggerEvent: "BOOKING_CANCELLED", payload: bookingBody.payload });
    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 400 for a signed booking with no attendee email", async () => {
    const res = await post({
      triggerEvent: "BOOKING_CREATED",
      payload: { uid: "x1", attendees: [{ name: "No Email" }] },
    });
    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  describe("CAL_WEBHOOK_EVENT_SLUGS (TOL-3556)", () => {
    const withType = (type?: string) => ({ ...bookingBody, payload: { ...bookingBody.payload, ...(type ? { type } : {}) } });

    it("routes a listed event type", async () => {
      process.env.CAL_WEBHOOK_EVENT_SLUGS = "15min";
      const res = await post(withType("15min"));
      expect(res.status).toBe(200);
      expect(crmCalls()).toHaveLength(1);
      expect(resendCalls()).toHaveLength(1);
    });

    it("ignores another venture's event type: 200, no opportunity, no email", async () => {
      process.env.CAL_WEBHOOK_EVENT_SLUGS = "15min";
      const res = await post(withType("tolowa-intro"));
      expect(res.status).toBe(200);
      expect((await res.json()).ignored).toContain("tolowa-intro");
      expect(crmCalls()).toHaveLength(0);
      expect(resendCalls()).toHaveLength(0);
    });

    it("ignores a booking with no event type when a list is set", async () => {
      process.env.CAL_WEBHOOK_EVENT_SLUGS = "15min";
      const res = await post(withType());
      expect(res.status).toBe(200);
      expect(crmCalls()).toHaveLength(0);
    });

    it("routes every event type when the list is unset (current behaviour)", async () => {
      const res = await post(withType("tolowa-intro"));
      expect(res.status).toBe(200);
      expect(crmCalls()).toHaveLength(1);
    });
  });
});
