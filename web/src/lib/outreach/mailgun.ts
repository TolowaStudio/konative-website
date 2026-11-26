/**
 * Mailgun outreach send path.
 *
 * Mailgun is for CAMPAIGN OUTREACH only (e.g. the NTIA Round 3 motion) — it is
 * deliberately separate from the transactional path (Resend / Cloudflare) used
 * by form submissions. It talks to the Mailgun HTTP API:
 *   POST https://api.mailgun.net/v3/<domain>/messages   (form-encoded body)
 *   Basic auth: user "api", password = MAILGUN_API_KEY
 *
 * EU region: set MAILGUN_BASE_URL=https://api.eu.mailgun.net to route EU.
 *
 * Design contract (mirrors the Resend step in `@/lib/forms/submit`):
 *   - ENV-GATED: no MAILGUN_API_KEY / MAILGUN_DOMAIN → log a warning, no-op,
 *     return `{ ok:false }`.
 *   - NON-THROWING: every network call is wrapped; failures log loudly and
 *     return `{ ok:false }`.
 *   - `dryRun`: log the fully-built request and send NOTHING.
 *
 * The pure helpers (`buildAuthHeader`, `buildMessagesUrl`, `buildMessageBody`)
 * are exported for unit tests; the network layer is thin.
 *
 * The live send has NOT been verified (no MAILGUN_API_KEY in this repo's env).
 * It requires the key + a canary send before it can be considered working.
 */

import { assertNotSuppressed, type SuppressionChecker } from "@/lib/outreach/suppression";

export interface OutreachEmail {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Mailgun `o:tag` values — used for campaign analytics/segmentation. */
  tags?: string[];
  /** When true, build everything and log it but send nothing. */
  dryRun?: boolean;
}

export interface OutreachResult {
  ok: boolean;
  id?: string;
  /** Present when ok:false — short reason for logs. */
  reason?: string;
  /** Present when reason is "suppressed": the recipients that were blocked. */
  blocked?: string[];
  /** True when the send was skipped because dryRun was set. */
  dryRun?: boolean;
}

const DEFAULT_BASE_URL = "https://api.mailgun.net";
const DEFAULT_FROM = "Konative <outreach@mg.konative.com>";

interface MailgunConfig {
  apiKey: string;
  domain: string;
  baseUrl: string;
  from: string;
  replyTo?: string;
}

/** Returns config only when enabled (key + domain present), else null. */
export function getMailgunConfig(): MailgunConfig | null {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;
  return {
    apiKey,
    domain,
    baseUrl: (process.env.MAILGUN_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ""),
    from: process.env.MAILGUN_FROM || DEFAULT_FROM,
    replyTo: process.env.MAILGUN_REPLY_TO || undefined,
  };
}

// --- Pure helpers (unit-tested) ---------------------------------------------

/** HTTP Basic auth header for user "api" + the Mailgun API key. */
export function buildAuthHeader(apiKey: string): string {
  const token = Buffer.from(`api:${apiKey}`).toString("base64");
  return `Basic ${token}`;
}

/** Messages endpoint URL for a base + domain. */
export function buildMessagesUrl(baseUrl: string, domain: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/v3/${domain}/messages`;
}

/**
 * Build the form-encoded Mailgun message body. Mailgun expects
 * `application/x-www-form-urlencoded`, with repeated `to` and `o:tag` keys for
 * multiple values.
 */
export function buildMessageBody(
  email: OutreachEmail,
  cfg: { from: string; replyTo?: string },
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("from", cfg.from);

  const recipients = Array.isArray(email.to) ? email.to : [email.to];
  for (const r of recipients) {
    if (r && r.trim()) params.append("to", r.trim());
  }

  params.set("subject", email.subject);
  params.set("html", email.html);
  if (email.text) params.set("text", email.text);
  if (cfg.replyTo) params.set("h:Reply-To", cfg.replyTo);

  for (const tag of email.tags ?? []) {
    if (tag && tag.trim()) params.append("o:tag", tag.trim());
  }
  return params;
}

// --- Network layer (env-gated, non-throwing) --------------------------------

/**
 * Send a campaign outreach email through Mailgun.
 *
 * ENV-GATED + NON-THROWING. Returns `{ ok:false }` when unconfigured, on any
 * network/HTTP error, and NEVER rejects. With `dryRun:true` it logs the built
 * request and returns `{ ok:true, dryRun:true }` without sending.
 */
export async function sendOutreachEmail(
  email: OutreachEmail,
  deps: { suppression?: SuppressionChecker } = {},
): Promise<OutreachResult> {
  const cfg = getMailgunConfig();
  if (!cfg) {
    console.warn(
      "[mailgun] MAILGUN_API_KEY / MAILGUN_DOMAIN not set — skipping outreach send",
    );
    return { ok: false, reason: "not-configured" };
  }

  // K-09: one suppression check for every send path (fail-closed, applies to dry runs too).
  const cleared = await assertNotSuppressed(email.to, deps.suppression);
  if (!cleared.ok) {
    console.warn(`[mailgun] send blocked: ${cleared.reason}`);
    return { ok: false, reason: cleared.reason, blocked: cleared.blocked };
  }

  const url = buildMessagesUrl(cfg.baseUrl, cfg.domain);
  const body = buildMessageBody(email, { from: cfg.from, replyTo: cfg.replyTo });

  if (email.dryRun) {
    const recipients = Array.isArray(email.to) ? email.to.join(", ") : email.to;
    console.log(
      `[mailgun][dry-run] would POST ${url}\n` +
        `  from: ${cfg.from}\n` +
        `  to: ${recipients}\n` +
        `  subject: ${email.subject}\n` +
        `  tags: ${(email.tags ?? []).join(", ") || "(none)"}`,
    );
    return { ok: true, dryRun: true };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: buildAuthHeader(cfg.apiKey),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error(
        `[mailgun] send → HTTP ${res.status}:`,
        typeof parsed === "object" ? JSON.stringify(parsed) : String(parsed),
      );
      return { ok: false, reason: `http-${res.status}` };
    }

    const id =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>).id
        : undefined;
    return { ok: true, id: typeof id === "string" ? id : undefined };
  } catch (err) {
    console.error("[mailgun] send network error:", err);
    return { ok: false, reason: "network-error" };
  }
}
