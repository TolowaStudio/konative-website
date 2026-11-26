/**
 * K-10 (TS-4377): acknowledgement-only auto-reply for inbound inquiries.
 *
 * Content is deliberately thin (G3): thanks, what happens next, booking link,
 * sender identity, postal address, unsubscribe. No carriers, prices, on-net
 * claims or analysis. Inquiries with the funding field filled are excluded and
 * route to a human (G7, 2 CFR 200.318(c)).
 *
 * OFF by default: nothing is sent unless INQUIRY_AUTO_REPLY_ENABLED === "true",
 * and the gate (Jake) turns that on after approving this template. Every path
 * fails closed: missing suppression checker, unresolved placeholder, bad email.
 */

export const BOOKING_URL = "https://cal.com/jeramey-james";
export const POSTAL_PLACEHOLDER = "{{POSTAL_ADDRESS}}";
export const UNSUBSCRIBE_PLACEHOLDER = "{{UNSUBSCRIBE_URL}}";

export interface AutoReplyInquiry {
  name?: string;
  email?: string;
  fundingProgram?: string;
}

export interface AutoReplyConfig {
  postalAddress: string;
  unsubscribeUrl: string;
}

export interface RenderedAutoReply {
  subject: string;
  html: string;
  text: string;
}

export type AutoReplyDecision = { send: true } | { send: false; reason: string };

export function isAutoReplyEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return (env.INQUIRY_AUTO_REPLY_ENABLED ?? "").trim().toLowerCase() === "true";
}

export function getAutoReplyConfig(env: NodeJS.ProcessEnv = process.env): AutoReplyConfig {
  return {
    postalAddress: (env.POSTAL_ADDRESS ?? "").trim() || POSTAL_PLACEHOLDER,
    unsubscribeUrl: (env.AUTO_REPLY_UNSUBSCRIBE_URL ?? "").trim() || UNSUBSCRIBE_PLACEHOLDER,
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Pure render. Placeholders pass through unresolved; `decideAutoReply` blocks those. */
export function renderAcknowledgementEmail(
  inquiry: AutoReplyInquiry,
  cfg: AutoReplyConfig,
): RenderedAutoReply {
  const first = (inquiry.name ?? "").trim().split(/\s+/)[0] || "there";
  const subject = "We received your message — Konative";
  const lines = [
    `Hi ${first},`,
    "",
    "Thanks for contacting Konative. This is an automatic acknowledgement that your message reached us.",
    "",
    "What happens next: a person on our team will read your message and reply personally. This note is only a receipt and does not contain any analysis or recommendation.",
    "",
    `If you would like to pick a time to talk, you can book here: ${BOOKING_URL}`,
    "",
    "— Konative, a service of Tolowa Pacific LLC",
    cfg.postalAddress,
    "",
    `Do not want to hear from us? Unsubscribe: ${cfg.unsubscribeUrl}`,
  ];
  const text = lines.join("\n");
  const html =
    `<p>Hi ${esc(first)},</p>` +
    `<p>Thanks for contacting Konative. This is an automatic acknowledgement that your message reached us.</p>` +
    `<p><strong>What happens next:</strong> a person on our team will read your message and reply personally. This note is only a receipt and does not contain any analysis or recommendation.</p>` +
    `<p>If you would like to pick a time to talk, you can <a href="${BOOKING_URL}">book here</a>.</p>` +
    `<p>— Konative, a service of Tolowa Pacific LLC<br>${esc(cfg.postalAddress)}</p>` +
    `<p style="font-size:12px;color:#666">Do not want to hear from us? <a href="${esc(cfg.unsubscribeUrl)}">Unsubscribe</a>.</p>`;
  return { subject, html, text };
}

export interface DecideDeps {
  enabled: boolean;
  config: AutoReplyConfig;
  /** Twenty suppression lookup (G5). Required: absent means fail closed. */
  isSuppressed?: (email: string) => Promise<boolean>;
}

/** Gate: should this inquiry get the acknowledgement? Never throws. */
export async function decideAutoReply(
  inquiry: AutoReplyInquiry,
  deps: DecideDeps,
): Promise<AutoReplyDecision> {
  if (!deps.enabled) return { send: false, reason: "disabled" };
  if ((inquiry.fundingProgram ?? "").trim()) return { send: false, reason: "funding-field-filled" };
  const email = (inquiry.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { send: false, reason: "invalid-email" };
  if (deps.config.postalAddress.includes("{{") || !deps.config.postalAddress.trim()) {
    return { send: false, reason: "postal-address-unresolved" };
  }
  if (deps.config.unsubscribeUrl.includes("{{") || !deps.config.unsubscribeUrl.trim()) {
    return { send: false, reason: "unsubscribe-unresolved" };
  }
  if (!deps.isSuppressed) return { send: false, reason: "no-suppression-check" };
  try {
    if (await deps.isSuppressed(email)) return { send: false, reason: "suppressed" };
  } catch {
    return { send: false, reason: "suppression-check-failed" };
  }
  return { send: true };
}
