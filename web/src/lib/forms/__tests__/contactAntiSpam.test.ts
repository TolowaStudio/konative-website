import { describe, expect, it, beforeEach } from "vitest";
import {
  checkContactRateLimit,
  CONTACT_RATE_LIMIT_NO_IP_KEY,
  getClientIpFromRequest,
  getContactRateBucketCountForTests,
  isContactHoneypotTripped,
  pickTrustedClientIpFromForwardedFor,
  resetContactRateLimitForTests,
  stripContactHoneypot,
  CONTACT_HONEYPOT_FIELD,
} from "@/lib/forms/contactAntiSpam";

describe("contactAntiSpam", () => {
  beforeEach(() => {
    resetContactRateLimitForTests();
  });

  it("detects a filled honeypot", () => {
    expect(isContactHoneypotTripped({ [CONTACT_HONEYPOT_FIELD]: "http://spam.test" })).toBe(true);
    expect(isContactHoneypotTripped({ [CONTACT_HONEYPOT_FIELD]: "" })).toBe(false);
    expect(isContactHoneypotTripped({ name: "ok" })).toBe(false);
  });

  it("uses the renamed honeypot field name (not company/website autofill targets)", () => {
    expect(CONTACT_HONEYPOT_FIELD).toBe("meshLedgerSlot");
    expect(isContactHoneypotTripped({ companyWebsite: "https://example.com" })).toBe(false);
    expect(isContactHoneypotTripped({ meshLedgerSlot: "filled" })).toBe(true);
  });

  it("strips the honeypot field before validation", () => {
    const payload = { name: "Ada", [CONTACT_HONEYPOT_FIELD]: "" };
    expect(stripContactHoneypot(payload)).toEqual({ name: "Ada" });
  });

  it("trusts the rightmost X-Forwarded-For hop (Google appends client IP)", () => {
    expect(pickTrustedClientIpFromForwardedFor("203.0.113.10, 198.51.100.44")).toBe("198.51.100.44");
    expect(pickTrustedClientIpFromForwardedFor("203.0.113.10, 198.51.100.44, 192.0.2.1", 2)).toBe(
      "198.51.100.44",
    );
  });

  it("ignores a spoofed leftmost X-Forwarded-For hop", () => {
    const spoofed = "1.2.3.4, 203.0.113.55";
    expect(pickTrustedClientIpFromForwardedFor(spoofed)).toBe("203.0.113.55");
    const request = new Request("https://konative.com/api/contact", {
      headers: { "x-forwarded-for": spoofed },
    });
    expect(getClientIpFromRequest(request)).toBe("203.0.113.55");
  });

  it("allows up to five submissions per IP per window", () => {
    const ip = "203.0.113.10";
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) {
      expect(checkContactRateLimit(ip, t0 + i)).toEqual({ allowed: true });
    }
    const blocked = checkContactRateLimit(ip, t0 + 5);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("resets the window after the limit duration", () => {
    const ip = "203.0.113.11";
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) {
      checkContactRateLimit(ip, t0);
    }
    const afterWindow = t0 + 10 * 60 * 1000;
    expect(checkContactRateLimit(ip, afterWindow)).toEqual({ allowed: true });
  });

  it("prunes expired buckets and enforces a hard entry cap", () => {
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 12_000; i++) {
      checkContactRateLimit(`198.51.100.${i}`, t0);
    }
    expect(getContactRateBucketCountForTests()).toBeLessThanOrEqual(10_000);

    const afterExpiry = t0 + 10 * 60 * 1000 + 1;
    for (let i = 0; i < 65; i++) {
      checkContactRateLimit(`203.0.113.${i}`, afterExpiry);
    }
    expect(getContactRateBucketCountForTests()).toBeLessThan(10_000);
  });

  it("applies a more generous limit when no client IP is available", () => {
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 40; i++) {
      expect(checkContactRateLimit(CONTACT_RATE_LIMIT_NO_IP_KEY, t0 + i)).toEqual({ allowed: true });
    }
    const blocked = checkContactRateLimit(CONTACT_RATE_LIMIT_NO_IP_KEY, t0 + 40);
    expect(blocked.allowed).toBe(false);
  });
});
