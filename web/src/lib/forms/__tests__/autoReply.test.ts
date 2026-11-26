import { describe, it, expect, vi } from "vitest";
import {
  decideAutoReply,
  getAutoReplyConfig,
  isAutoReplyEnabled,
  renderAcknowledgementEmail,
  BOOKING_URL,
} from "@/lib/forms/autoReply";

const cfg = { postalAddress: "1 Test St, Seattle, WA 98101", unsubscribeUrl: "https://konative.com/unsub?t=x" };
const ok = { enabled: true, config: cfg, isSuppressed: async () => false };
const who = { name: "Ada Lovelace", email: "ada@example.org" };

describe("auto-reply template", () => {
  const r = renderAcknowledgementEmail(who, cfg);
  it("has thanks, next steps, booking, sender, postal, unsubscribe", () => {
    expect(r.text).toMatch(/Thanks for contacting Konative/);
    expect(r.text).toMatch(/What happens next/);
    expect(r.text).toContain(BOOKING_URL);
    expect(r.text).toMatch(/Tolowa Pacific LLC/);
    expect(r.text).toContain(cfg.postalAddress);
    expect(r.text).toContain(cfg.unsubscribeUrl);
    expect(r.html).toContain(cfg.unsubscribeUrl);
  });
  it("makes no carrier, price, on-net or certification claims (G3, G9)", () => {
    const all = `${r.subject} ${r.text} ${r.html}`;
    expect(all).not.toMatch(/\$\d|per month|\/mo\b|on-net|lit building|budgetary|commission|certified|Verizon|AT&T|Lumen|Comcast|T-Mobile/i);
  });
  it("escapes the name in HTML", () => {
    expect(renderAcknowledgementEmail({ name: "<b>x</b>" }, cfg).html).not.toContain("<b>x");
  });
});

describe("decideAutoReply", () => {
  it("is OFF by default", () => {
    expect(isAutoReplyEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isAutoReplyEnabled({ INQUIRY_AUTO_REPLY_ENABLED: "true" } as unknown as NodeJS.ProcessEnv)).toBe(true);
  });
  it("sends nothing when disabled", async () => {
    expect(await decideAutoReply(who, { ...ok, enabled: false })).toEqual({ send: false, reason: "disabled" });
  });
  it("excludes funding-field inquiries (G7)", async () => {
    expect(await decideAutoReply({ ...who, fundingProgram: "BEAD" }, ok)).toEqual({ send: false, reason: "funding-field-filled" });
  });
  it("skips suppressed addresses and fails closed when the check errors or is absent", async () => {
    expect(await decideAutoReply(who, { ...ok, isSuppressed: async () => true })).toEqual({ send: false, reason: "suppressed" });
    expect(await decideAutoReply(who, { ...ok, isSuppressed: vi.fn().mockRejectedValue(new Error("x")) })).toEqual({ send: false, reason: "suppression-check-failed" });
    expect(await decideAutoReply(who, { enabled: true, config: cfg })).toEqual({ send: false, reason: "no-suppression-check" });
  });
  it("blocks unresolved postal address / unsubscribe placeholders", async () => {
    const d = getAutoReplyConfig({} as NodeJS.ProcessEnv);
    expect((await decideAutoReply(who, { ...ok, config: d })).send).toBe(false);
    expect(await decideAutoReply(who, { ...ok, config: { ...cfg, unsubscribeUrl: "{{UNSUBSCRIBE_URL}}" } })).toEqual({ send: false, reason: "unsubscribe-unresolved" });
  });
  it("allows a clean inquiry", async () => {
    expect(await decideAutoReply(who, ok)).toEqual({ send: true });
  });
  it("rejects invalid email", async () => {
    expect(await decideAutoReply({ ...who, email: "nope" }, ok)).toEqual({ send: false, reason: "invalid-email" });
  });
});
