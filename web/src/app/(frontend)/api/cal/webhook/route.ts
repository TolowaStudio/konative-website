import { NextResponse } from "next/server";
import {
  CAL_BOOKING_SCHEMA_TYPE,
  CAL_SIGNATURE_HEADER,
  bookingEmail,
  bookingToCrmData,
  eventSlugAllowed,
  parseCalWebhook,
  parseEventSlugAllowlist,
  verifyCalSignature,
} from "@/lib/forms/calBooking";
import { forwardToCrm, sendResendEmail } from "@/lib/forms/submit";

/**
 * Cal.com booking webhook (TOL-3556). A signed BOOKING_CREATED creates the Twenty
 * opportunity (via the same n8n intake the contact form uses) and emails the team.
 * Fail-closed: no secret → 503, bad signature → 401, CRM or email failure → 502 so
 * Cal.com retries. The n8n opportunity name is keyed on the booking uid, so a retry
 * does not duplicate the opportunity.
 */
export async function POST(request: Request) {
  const secret = (process.env.CAL_WEBHOOK_SECRET ?? "").trim();
  if (!secret) {
    console.error("[cal-webhook] CAL_WEBHOOK_SECRET not set — refusing to process bookings");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifyCalSignature(rawBody, request.headers.get(CAL_SIGNATURE_HEADER), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseCalWebhook(json);
  if (parsed.kind === "invalid") {
    return NextResponse.json({ error: parsed.reason }, { status: 400 });
  }
  if (parsed.kind === "ignored") {
    return NextResponse.json({ success: true, ignored: parsed.reason });
  }

  const { booking } = parsed;

  const allowlist = parseEventSlugAllowlist(process.env.CAL_WEBHOOK_EVENT_SLUGS);
  if (!eventSlugAllowed(allowlist, booking.eventSlug)) {
    return NextResponse.json({
      success: true,
      ignored: `event type "${booking.eventSlug || "unknown"}" not in CAL_WEBHOOK_EVENT_SLUGS`,
    });
  }

  try {
    await forwardToCrm({
      schemaType: CAL_BOOKING_SCHEMA_TYPE,
      docId: booking.externalId,
      data: bookingToCrmData(booking),
      triage: null,
      required: true,
    });
  } catch (err) {
    console.error(`[cal-webhook] CRM forward failed for ${booking.externalId}:`, err);
    return NextResponse.json({ error: "Failed to route booking" }, { status: 502 });
  }

  try {
    const mail = bookingEmail(booking);
    await sendResendEmail({
      to: (process.env.RESEND_TO ?? "").trim(),
      from: (process.env.RESEND_FROM ?? "").trim(),
      subject: mail.subject,
      html: mail.html,
      logLabel: `booking notification (${booking.externalId})`,
    });
  } catch (err) {
    console.error(`[cal-webhook] notification failed for ${booking.externalId}:`, err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 502 });
  }

  return NextResponse.json({ success: true, id: booking.externalId });
}
