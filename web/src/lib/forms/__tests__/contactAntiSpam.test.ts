import { describe, expect, it, beforeEach } from "vitest";
import {
  checkContactRateLimit,
  isContactHoneypotTripped,
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

  it("strips the honeypot field before validation", () => {
    const payload = { name: "Ada", [CONTACT_HONEYPOT_FIELD]: "" };
    expect(stripContactHoneypot(payload)).toEqual({ name: "Ada" });
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
});
