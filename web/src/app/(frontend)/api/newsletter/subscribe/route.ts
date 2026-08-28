import { NextRequest, NextResponse, after } from "next/server";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { newsletterSchema } from "@/lib/forms/schemas/newsletter";
import {
  ghostAdminFetch,
  ghostAdminKey,
  KONATIVE_NEWSLETTER_ID,
} from "@/lib/ghost";

// Newsletter signup → CMS + Ghost.
//
// Two-stage write so a Ghost outage doesn't lose the lead:
//   1. submitForm saves a `newsletterSubscriber` record in the CMS (canonical
//      record of intent, with provenance fields).
//   2. Ghost Admin API creates a member subscribed to the Konative Dispatch
//      newsletter — fire-and-don't-fail so a Ghost hiccup returns 200 to the
//      user while we still have the lead in CMS for backfill.
//
// Beehiiv was dropped 2026-05-23 — see STRATEGY.md B6.

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await submitForm({
    schemaType: "newsletterSubscriber",
    zodSchema: newsletterSchema,
    payload: body,
    emailSubject: `New newsletter subscriber: ${(body as Record<string, string>)?.email ?? "unknown"}`,
  });

  if (!result.ok) {
    return submitFormResponse(result, "Subscription failed");
  }

  // Ghost member upsert (non-blocking — never fail the user signup on Ghost
  // problems; the CMS record is the canonical lead capture).
  const b = body as Record<string, string>;
  const email = b.email?.toLowerCase().trim();
  if (email && ghostAdminKey()) {
    const memberPayload = {
      members: [
        {
          email,
          name: b.name || b.fullName || undefined,
          newsletters: [{ id: KONATIVE_NEWSLETTER_ID }],
          subscribed: true,
          labels: [{ name: "konative" }],
          note: b.utmSource || b.source ? `source: ${b.utmSource || b.source}` : undefined,
        },
      ],
    };
    // `after()` extends the Worker's execution past the response (maps to
    // Cloudflare's ctx.waitUntil() via OpenNext) — a plain un-awaited
    // fetch().then() can be silently killed the instant the response is
    // sent on Workers (see web/src/lib/forms/submit.ts for the same fix).
    after(async () => {
      try {
        const res = await ghostAdminFetch("/ghost/api/admin/members/", {
          method: "POST",
          body: JSON.stringify(memberPayload),
        });
        if (!res.ok && res.status !== 422) {
          // 422 = member already exists, which is fine.
          const text = await res.text().catch(() => "");
          console.warn(`[newsletter] Ghost member create ${res.status}:`, text.slice(0, 300));
        }
      } catch (err) {
        console.error("[newsletter] Ghost member create error:", err);
      }
    });
  }

  return NextResponse.json({ success: true, message: "Subscribed!" });
}
