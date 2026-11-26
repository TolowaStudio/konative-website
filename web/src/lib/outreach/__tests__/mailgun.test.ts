import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  buildAuthHeader,
  buildMessagesUrl,
  buildMessageBody,
  getMailgunConfig,
  sendOutreachEmail,
} from "@/lib/outreach/mailgun";

describe("buildAuthHeader", () => {
  it("builds a Basic auth header for user 'api' + the API key", () => {
    const header = buildAuthHeader("test-key-123");
    expect(header).toBe(`Basic ${Buffer.from("api:test-key-123").toString("base64")}`);
    expect(header.startsWith("Basic ")).toBe(true);
  });
});

describe("buildMessagesUrl", () => {
  it("builds the v3/<domain>/messages path", () => {
    expect(buildMessagesUrl("https://api.mailgun.net", "mg.konative.com")).toBe(
      "https://api.mailgun.net/v3/mg.konative.com/messages",
    );
  });

  it("strips trailing slashes from the base URL", () => {
    expect(buildMessagesUrl("https://api.eu.mailgun.net/", "mg.konative.com")).toBe(
      "https://api.eu.mailgun.net/v3/mg.konative.com/messages",
    );
  });
});

describe("buildMessageBody", () => {
  it("builds a form-encoded body with from/to/subject/html", () => {
    const params = buildMessageBody(
      { to: "lead@example.com", subject: "Hello", html: "<p>Hi</p>" },
      { from: "Konative <outreach@mg.konative.com>" },
    );
    expect(params.get("from")).toBe("Konative <outreach@mg.konative.com>");
    expect(params.getAll("to")).toEqual(["lead@example.com"]);
    expect(params.get("subject")).toBe("Hello");
    expect(params.get("html")).toBe("<p>Hi</p>");
    expect(params.has("text")).toBe(false);
  });

  it("appends repeated 'to' entries for multiple recipients", () => {
    const params = buildMessageBody(
      { to: ["a@example.com", "b@example.com"], subject: "S", html: "<p>H</p>" },
      { from: "Konative <outreach@mg.konative.com>" },
    );
    expect(params.getAll("to")).toEqual(["a@example.com", "b@example.com"]);
  });

  it("includes text and h:Reply-To when provided", () => {
    const params = buildMessageBody(
      {
        to: "lead@example.com",
        subject: "S",
        html: "<p>H</p>",
        text: "Plain text body",
      },
      { from: "Konative <outreach@mg.konative.com>", replyTo: "hello@konative.com" },
    );
    expect(params.get("text")).toBe("Plain text body");
    expect(params.get("h:Reply-To")).toBe("hello@konative.com");
  });

  it("appends repeated o:tag entries for campaign tags", () => {
    const params = buildMessageBody(
      {
        to: "lead@example.com",
        subject: "S",
        html: "<p>H</p>",
        tags: ["ntia-round3", "tbcp-awardee"],
      },
      { from: "Konative <outreach@mg.konative.com>" },
    );
    expect(params.getAll("o:tag")).toEqual(["ntia-round3", "tbcp-awardee"]);
  });

  it("skips blank recipients and tags", () => {
    const params = buildMessageBody(
      {
        to: ["", "  ", "real@example.com"],
        subject: "S",
        html: "<p>H</p>",
        tags: ["", "  ", "valid-tag"],
      },
      { from: "Konative <outreach@mg.konative.com>" },
    );
    expect(params.getAll("to")).toEqual(["real@example.com"]);
    expect(params.getAll("o:tag")).toEqual(["valid-tag"]);
  });
});

describe("getMailgunConfig", () => {
  const ENV_KEYS = [
    "MAILGUN_API_KEY",
    "MAILGUN_DOMAIN",
    "MAILGUN_BASE_URL",
    "MAILGUN_FROM",
    "MAILGUN_REPLY_TO",
  ];
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("returns null when MAILGUN_API_KEY or MAILGUN_DOMAIN is missing (env-gated no-op)", () => {
    expect(getMailgunConfig()).toBeNull();
    process.env.MAILGUN_API_KEY = "key-only";
    expect(getMailgunConfig()).toBeNull();
  });

  it("returns config with defaults when key + domain are set", () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    const cfg = getMailgunConfig();
    expect(cfg).toEqual({
      apiKey: "test-key",
      domain: "mg.konative.com",
      baseUrl: "https://api.mailgun.net",
      from: "Konative <outreach@mg.konative.com>",
      replyTo: undefined,
    });
  });

  it("respects MAILGUN_BASE_URL override for EU region", () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    process.env.MAILGUN_BASE_URL = "https://api.eu.mailgun.net";
    expect(getMailgunConfig()?.baseUrl).toBe("https://api.eu.mailgun.net");
  });
});

const ALLOW = { suppression: async () => ({ ok: true as const, blocked: [] }) };

describe("sendOutreachEmail", () => {
  beforeEach(() => {
    delete process.env.MAILGUN_API_KEY;
    delete process.env.MAILGUN_DOMAIN;
    vi.restoreAllMocks();
  });

  it("returns {ok:false, reason:'not-configured'} and never calls fetch when unconfigured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await sendOutreachEmail({
      to: "lead@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    });

    expect(result).toEqual({ ok: false, reason: "not-configured" });
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("dryRun logs and returns {ok:true, dryRun:true} without calling fetch, even when configured", async () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await sendOutreachEmail({
      to: "lead@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
      dryRun: true,
    }, ALLOW);

    expect(result).toEqual({ ok: true, dryRun: true });
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("returns {ok:false} on a non-2xx HTTP response without throwing", async () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      }),
    );

    const result = await sendOutreachEmail({
      to: "lead@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    }, ALLOW);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("http-401");
    vi.unstubAllGlobals();
  });

  it("returns {ok:false} on a network error without throwing", async () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const result = await sendOutreachEmail({
      to: "lead@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    }, ALLOW);

    expect(result).toEqual({ ok: false, reason: "network-error" });
    vi.unstubAllGlobals();
  });

  it("returns {ok:true, id} on a successful send", async () => {
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "mg.konative.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "<mailgun-id@mg.konative.com>", message: "Queued" }),
      }),
    );

    const result = await sendOutreachEmail({
      to: "lead@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    }, ALLOW);

    expect(result).toEqual({ ok: true, id: "<mailgun-id@mg.konative.com>" });
    vi.unstubAllGlobals();
  });
});
