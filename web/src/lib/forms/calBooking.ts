import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Cal.com booking webhook → Konative CRM intake (TOL-3556, W6+W7).
 *
 * The contact form already reaches Twenty through `forwardToCrm` (see submit.ts).
 * A booking made on https://cal.com/jeramey-james never touched that path, so a
 * discovery call left no opportunity and no alert. This module turns a signed
 * Cal.com `BOOKING_CREATED` event into the SAME envelope the n8n intake
 * workflow already accepts, so no n8n change is needed to receive it.
 */

export const CAL_SIGNATURE_HEADER = "x-cal-signature-256";
export const CAL_BOOKING_SCHEMA_TYPE = "calBooking";

/** Cal.com signs the raw body with HMAC-SHA256 and sends the lowercase hex digest. */
export function verifyCalSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!secret || !header) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const supplied = header.trim().toLowerCase();
  if (supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied, "utf8"), Buffer.from(expected, "utf8"));
}

export interface CalBooking {
  /** Stable per-booking id; the n8n workflow keys its idempotent opportunity name on it. */
  externalId: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  title: string;
  /** Cal.com event-type slug (payload.type, e.g. "15min"); "" when the payload omits it. */
  eventSlug: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  notes: string;
}

export type CalParseResult =
  | { kind: "booking"; booking: CalBooking }
  | { kind: "ignored"; reason: string }
  | { kind: "invalid"; reason: string };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Cal.com `responses.<field>` entries are `{ value, isHidden }`; older payloads use bare strings. */
function response(responses: unknown, key: string): string {
  if (!responses || typeof responses !== "object") return "";
  const entry = (responses as Record<string, unknown>)[key];
  if (entry && typeof entry === "object") return str((entry as { value?: unknown }).value);
  return str(entry);
}

export function parseCalWebhook(body: unknown): CalParseResult {
  if (!body || typeof body !== "object") return { kind: "invalid", reason: "body is not an object" };
  const event = body as { triggerEvent?: unknown; payload?: unknown };
  const trigger = str(event.triggerEvent);

  // Cal.com's "Test webhook" button and every non-creation lifecycle event: acknowledge, do nothing.
  if (trigger !== "BOOKING_CREATED") {
    return { kind: "ignored", reason: trigger ? `trigger ${trigger} not handled` : "no triggerEvent" };
  }

  const payload = event.payload as Record<string, unknown> | undefined;
  if (!payload || typeof payload !== "object") return { kind: "invalid", reason: "payload missing" };

  const uid = str(payload.uid) || (typeof payload.bookingId === "number" ? String(payload.bookingId) : "");
  if (!uid) return { kind: "invalid", reason: "booking uid missing" };

  const attendees = Array.isArray(payload.attendees) ? (payload.attendees as Record<string, unknown>[]) : [];
  const attendee = attendees[0] ?? {};
  const responses = payload.responses;
  const email = (str(attendee.email) || response(responses, "email")).toLowerCase();
  if (!email) return { kind: "invalid", reason: "attendee email missing" };

  return {
    kind: "booking",
    booking: {
      externalId: `cal-${uid}`,
      name: str(attendee.name) || response(responses, "name"),
      email,
      organization: response(responses, "organization") || response(responses, "company"),
      phone: str(attendee.phoneNumber) || response(responses, "attendeePhoneNumber"),
      title: str(payload.title) || str(payload.eventTitle) || "Discovery call",
      eventSlug: str(payload.type).toLowerCase(),
      startTime: str(payload.startTime),
      endTime: str(payload.endTime),
      timeZone: str(attendee.timeZone),
      notes: str(payload.additionalNotes) || response(responses, "notes"),
    },
  };
}

/**
 * One Cal.com account (cal.com/jeramey-james) serves every venture, so an account-level webhook also
 * fires for non-Konative bookings. `CAL_WEBHOOK_EVENT_SLUGS` (comma list, e.g. "15min") limits which
 * event types become Konative opportunities. Unset/empty = no filter. When set, a booking whose slug
 * is missing or not listed is ignored (fail-closed on the filter), never routed.
 */
export function parseEventSlugAllowlist(raw: string | undefined): string[] {
  return (raw ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}

export function eventSlugAllowed(allowlist: string[], slug: string): boolean {
  return allowlist.length === 0 || allowlist.includes(slug.toLowerCase());
}

/**
 * Shape the booking as the `data` object the n8n "Validate + Normalize" node reads
 * (email / name / organization / phone / requirement / audience).
 */
export function bookingToCrmData(b: CalBooking): Record<string, unknown> {
  const when = b.startTime ? ` at ${b.startTime}${b.timeZone ? ` (${b.timeZone})` : ""}` : "";
  return {
    name: b.name,
    email: b.email,
    organization: b.organization,
    phone: b.phone,
    requirement: `Booked "${b.title}"${when}.${b.notes ? ` Notes: ${b.notes}` : ""}`,
    bookingUid: b.externalId,
    bookingStart: b.startTime,
    bookingEnd: b.endTime,
  };
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export function bookingEmail(b: CalBooking): { subject: string; html: string } {
  const who = b.name || b.email;
  return {
    subject: `New Konative call booked: ${who}${b.startTime ? ` · ${b.startTime}` : ""}`,
    html:
      `<h2>New Konative call booked</h2>` +
      `<ul>` +
      `<li><strong>Who:</strong> ${esc(who)} &lt;${esc(b.email)}&gt;${b.organization ? ` · ${esc(b.organization)}` : ""}</li>` +
      `<li><strong>What:</strong> ${esc(b.title)}</li>` +
      `<li><strong>When:</strong> ${esc(b.startTime || "unknown")}${b.timeZone ? ` (${esc(b.timeZone)})` : ""}</li>` +
      (b.notes ? `<li><strong>Notes:</strong> ${esc(b.notes)}</li>` : "") +
      `<li><strong>Booking:</strong> ${esc(b.externalId)}</li>` +
      `</ul>` +
      `<p>An opportunity and a follow-up task are created in Twenty by the intake workflow.</p>`,
  };
}
