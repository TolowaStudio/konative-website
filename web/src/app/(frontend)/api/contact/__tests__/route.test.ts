import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_HONEYPOT_FIELD, resetContactRateLimitForTests } from "@/lib/forms/contactAntiSpam";

const submitFormMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/forms/submit", () => ({
  submitForm: submitFormMock,
}));

async function loadPost() {
  vi.resetModules();
  const { POST } = await import("../route");
  return POST;
}

const validPayload = {
  name: "Test User",
  email: "test@example.com",
  organization: "Test Org",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    submitFormMock.mockReset();
    submitFormMock.mockResolvedValue({ ok: true, id: "sanity-doc-1" });
    resetContactRateLimitForTests();
  });

  it("returns 200 success without persisting when honeypot is filled", async () => {
    const POST = await loadPost();
    const response = await POST(
      new Request("https://konative.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validPayload, [CONTACT_HONEYPOT_FIELD]: "https://spam.test" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, id: "dropped" });
    expect(submitFormMock).not.toHaveBeenCalled();
  });

  it("returns 429 when the per-IP rate limit is exceeded", async () => {
    const POST = await loadPost();
    const headers = {
      "Content-Type": "application/json",
      "x-forwarded-for": "198.51.100.44",
    };

    for (let i = 0; i < 5; i++) {
      const ok = await POST(
        new Request("https://konative.com/api/contact", {
          method: "POST",
          headers,
          body: JSON.stringify(validPayload),
        }),
      );
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(
      new Request("https://konative.com/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify(validPayload),
      }),
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(submitFormMock).toHaveBeenCalledTimes(5);
  });

  it("forwards clean payloads to submitForm", async () => {
    const POST = await loadPost();
    const response = await POST(
      new Request("https://konative.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validPayload, [CONTACT_HONEYPOT_FIELD]: "" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(submitFormMock).toHaveBeenCalledOnce();
    expect(submitFormMock.mock.calls[0][0].payload).toEqual(validPayload);
  });
});
