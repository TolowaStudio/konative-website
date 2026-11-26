import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  assertNotSuppressed,
  createTwentySuppressionChecker,
  isSuppressedPerson,
  normalizeEmail,
} from "@/lib/outreach/suppression";
import { sendOutreachEmail } from "@/lib/outreach/mailgun";

const env = { TWENTY_API_TOKEN: "t", TWENTY_API_URL: "https://twenty.test" } as NodeJS.ProcessEnv;

function twentyReturning(nodes: unknown[]) {
  return vi.fn(async () =>
    new Response(JSON.stringify({ data: { people: { edges: nodes.map((node) => ({ node })) } } }), { status: 200 }),
  );
}

describe("suppression", () => {
  it("normalizes display-name addresses", () => {
    expect(normalizeEmail(" Foo <Bar@Example.COM> ")).toBe("bar@example.com");
  });

  it("flags doNotContact and bad outreach statuses only", () => {
    expect(isSuppressedPerson({ doNotContact: true })).toBe(true);
    expect(isSuppressedPerson({ outreachStatus: "opted_out" })).toBe(true);
    expect(isSuppressedPerson({ outreachStatus: "BOUNCED" })).toBe(true);
    expect(isSuppressedPerson({ outreachStatus: "APPROVED" })).toBe(false);
  });

  it("blocks a suppressed test address", async () => {
    const fetchImpl = twentyReturning([
      { emails: { primaryEmail: "Bounced@Example.com", additionalEmails: [] }, doNotContact: false, outreachStatus: "BOUNCED" },
      { emails: { primaryEmail: "ok@example.com" }, doNotContact: false, outreachStatus: "APPROVED" },
    ]);
    const checker = createTwentySuppressionChecker({ fetchImpl, env });
    const r = await assertNotSuppressed(["bounced@example.com", "ok@example.com"], checker);
    expect(r).toEqual({ ok: false, reason: "suppressed", blocked: ["bounced@example.com"] });
  });

  it("clears addresses that are not suppressed", async () => {
    const checker = createTwentySuppressionChecker({ fetchImpl: twentyReturning([]), env });
    expect(await assertNotSuppressed("ok@example.com", checker)).toEqual({ ok: true });
  });

  it("fails closed when Twenty is unconfigured, down, or errors", async () => {
    const none = createTwentySuppressionChecker({ env: {} as NodeJS.ProcessEnv });
    expect((await assertNotSuppressed("a@b.com", none)).ok).toBe(false);
    const down = createTwentySuppressionChecker({ fetchImpl: vi.fn(async () => { throw new Error("x"); }), env });
    expect(await assertNotSuppressed("a@b.com", down)).toEqual({ ok: false, reason: "suppression-source-unreachable" });
    const err = createTwentySuppressionChecker({
      fetchImpl: vi.fn(async () => new Response(JSON.stringify({ errors: [{}] }), { status: 200 })),
      env,
    });
    expect((await assertNotSuppressed("a@b.com", err)).ok).toBe(false);
  });
});

describe("sendOutreachEmail calls the shared check", () => {
  beforeEach(() => {
    process.env.MAILGUN_API_KEY = "k";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    vi.restoreAllMocks();
  });

  it("never reaches Mailgun for a suppressed address", async () => {
    const mailgunFetch = vi.fn();
    vi.stubGlobal("fetch", mailgunFetch);
    const result = await sendOutreachEmail(
      { to: "dnc@example.com", subject: "s", html: "<p>h</p>" },
      { suppression: async () => ({ ok: true, blocked: ["dnc@example.com"] }) },
    );
    expect(result).toMatchObject({ ok: false, reason: "suppressed", blocked: ["dnc@example.com"] });
    expect(mailgunFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("does not send when the suppression source is down", async () => {
    const mailgunFetch = vi.fn();
    vi.stubGlobal("fetch", mailgunFetch);
    const result = await sendOutreachEmail(
      { to: "a@example.com", subject: "s", html: "<p>h</p>" },
      { suppression: async () => ({ ok: false, reason: "suppression-source-unreachable" }) },
    );
    expect(result.ok).toBe(false);
    expect(mailgunFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
