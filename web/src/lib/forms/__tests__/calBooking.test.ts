import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { bookingEmail, bookingToCrmData, eventSlugAllowed, parseCalWebhook, parseEventSlugAllowlist, verifyCalSignature } from "@/lib/forms/calBooking";

describe("verifyCalSignature", () => {
  const raw = '{"a":1}';
  const good = createHmac("sha256", "s").update(raw).digest("hex");
  it("accepts the HMAC-SHA256 hex digest", () => expect(verifyCalSignature(raw, good, "s")).toBe(true));
  it("rejects a different length or secret or empty inputs", () => {
    expect(verifyCalSignature(raw, "abc", "s")).toBe(false);
    expect(verifyCalSignature(raw, good, "t")).toBe(false);
    expect(verifyCalSignature(raw, null, "s")).toBe(false);
    expect(verifyCalSignature(raw, good, "")).toBe(false);
  });
});

describe("parseCalWebhook", () => {
  it("falls back to responses.email and bookingId when attendees/uid are sparse", () => {
    const r = parseCalWebhook({
      triggerEvent: "BOOKING_CREATED",
      payload: { bookingId: 42, attendees: [], responses: { email: { value: "A@B.co" }, name: "Plain String" } },
    });
    expect(r.kind).toBe("booking");
    if (r.kind === "booking") {
      expect(r.booking.externalId).toBe("cal-42");
      expect(r.booking.email).toBe("a@b.co");
      expect(r.booking.name).toBe("Plain String");
    }
  });
  it("marks a booking without uid or bookingId invalid", () => {
    expect(parseCalWebhook({ triggerEvent: "BOOKING_CREATED", payload: { attendees: [{ email: "a@b.co" }] } }).kind).toBe("invalid");
  });
  it("ignores PING and other triggers", () => {
    expect(parseCalWebhook({ triggerEvent: "PING" }).kind).toBe("ignored");
  });
});

describe("bookingEmail", () => {
  it("escapes HTML in attacker-controlled attendee fields", () => {
    const html = bookingEmail({
      externalId: "cal-1", name: "<script>x</script>", email: "a@b.co", organization: "", phone: "",
      title: "t", eventSlug: "", startTime: "", endTime: "", timeZone: "", notes: "<img src=x>",
    }).html;
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
  });
});

describe("bookingToCrmData", () => {
  it("omits the notes clause when there are none", () => {
    const d = bookingToCrmData({
      externalId: "cal-1", name: "N", email: "a@b.co", organization: "", phone: "",
      title: "Call", eventSlug: "", startTime: "", endTime: "", timeZone: "", notes: "",
    });
    expect(String(d.requirement)).not.toContain("Notes:");
  });
});

describe("event slug allowlist (TOL-3556)", () => {
  it("parses a comma list, trimmed and lowercased; unset or blank is empty", () => {
    expect(parseEventSlugAllowlist(" 15min, Intro-Call ,,")).toEqual(["15min", "intro-call"]);
    expect(parseEventSlugAllowlist(undefined)).toEqual([]);
    expect(parseEventSlugAllowlist("  ")).toEqual([]);
  });
  it("allows everything when the list is empty, otherwise only listed slugs (a missing slug is not listed)", () => {
    expect(eventSlugAllowed([], "anything")).toBe(true);
    expect(eventSlugAllowed(["15min"], "15MIN")).toBe(true);
    expect(eventSlugAllowed(["15min"], "tolowa-intro")).toBe(false);
    expect(eventSlugAllowed(["15min"], "")).toBe(false);
  });
  it("reads the slug from payload.type", () => {
    const r = parseCalWebhook({ triggerEvent: "BOOKING_CREATED", payload: { uid: "u", type: "15Min", attendees: [{ email: "a@b.co" }] } });
    expect(r.kind === "booking" && r.booking.eventSlug).toBe("15min");
  });
});
