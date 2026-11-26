import { NextRequest, NextResponse, after } from "next/server";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { newsletterRecordSchema, newsletterSchema } from "@/lib/forms/schemas/newsletter";
import { buildConsentRecord } from "@/lib/newsletter/consent";
import { ghostUrl, KONATIVE_NEWSLETTER_NAME } from "@/lib/ghost";

// Newsletter signup → consent record in CMS + Ghost double opt-in (TS-4378).
//
//   1. Validate: `consent` must be literally true (no implied opt-in).
//   2. submitForm stores a `newsletterSubscriber` record with the consent
//      record (time, form id, EXACT wording shown, wording version). The
//      wording is stamped server-side from lib/newsletter/consent.ts.
//   3. Ghost's public Members API sends the signup confirmation (magic link).
//      The member is only created and subscribed to Konative Dispatch when
//      they click it — that is the double opt-in. We never create a member
//      through the Admin API here (that would subscribe without confirmation).
//
// No newsletter issue is sent by this route. Ghost failures never lose the lead:
// the CMS record is canonical and flagged `pending_confirmation`.

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid submission",
        errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }

  const { consent: _consent, ...fields } = parsed.data;
  void _consent;
  const email = fields.email.toLowerCase().trim();
  const record = {
    ...fields,
    email,
    ...buildConsentRecord(fields.source || "unknown"),
  };

  const result = await submitForm({
    schemaType: "newsletterSubscriber",
    zodSchema: newsletterRecordSchema,
    payload: record,
    emailSubject: `New newsletter signup (pending confirmation): ${email}`,
  });

  if (!result.ok) {
    return submitFormResponse(result, "Subscription failed");
  }

  const base = ghostUrl();
  if (base) {
    after(async () => {
      try {
        const res = await fetch(`${base}/members/api/send-magic-link/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: base },
          body: JSON.stringify({
            email,
            name: fields.name || undefined,
            emailType: "signup",
            newsletters: [{ name: KONATIVE_NEWSLETTER_NAME }],
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn(`[newsletter] Ghost confirmation ${res.status}:`, text.slice(0, 300));
        }
      } catch (err) {
        console.error("[newsletter] Ghost confirmation error:", err);
      }
    });
  }

  return NextResponse.json({
    success: true,
    message: "Almost done — check your email and click the confirmation link to finish subscribing.",
  });
}
