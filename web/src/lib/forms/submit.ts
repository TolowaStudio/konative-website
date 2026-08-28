import { ZodSchema } from "zod";
import { getSanityWriteClient } from "@/sanity/writeClient";
import { scoreInquiry, type TriageResult } from "@/lib/forms/triage";

export type SubmitFailureStage = "persist" | "notify" | "crm";

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; errors: { path: string; message: string }[]; message?: undefined; stage?: undefined; id?: undefined }
  | { ok: false; errors?: undefined; message: string; stage: SubmitFailureStage; id?: string };

export interface SubmitOptions<T> {
  schemaType: string;
  zodSchema: ZodSchema<T>;
  payload: unknown;
  emailSubject: string;
  emailHtml?: string;
  /** Optional receipt email sent to the submitter themselves, alongside the internal notification. */
  confirmationEmail?: { to: string; subject: string; html: string };
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function isCrmWebhookRequired(): boolean {
  return trimEnv(process.env.CRM_WEBHOOK_REQUIRED).toLowerCase() === "true";
}

/** Fail-closed Resend send — throws when credentials are missing or Resend rejects the request. */
async function sendResendEmail(args: { to: string; from: string; subject: string; html: string; logLabel: string }) {
  const apiKey = trimEnv(process.env.RESEND_API_KEY);
  if (!apiKey) {
    console.error(`[submitForm] RESEND_API_KEY not set — cannot send ${args.logLabel}`);
    throw new Error("RESEND_API_KEY not configured");
  }

  const from = trimEnv(args.from);
  const to = trimEnv(args.to);
  if (!from) {
    console.error(`[submitForm] RESEND_FROM not set — cannot send ${args.logLabel}`);
    throw new Error("RESEND_FROM not configured");
  }
  if (!to) {
    console.error(`[submitForm] RESEND_TO not set — cannot send ${args.logLabel}`);
    throw new Error("RESEND_TO not configured");
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: args.subject, html: args.html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[submitForm] Resend non-OK response for ${args.logLabel}: ${res.status} ${body}`);
    throw new Error(`Resend send failed (${res.status})`);
  }
}

async function forwardToCrm(args: {
  schemaType: string;
  docId: string;
  data: Record<string, unknown>;
  triage: TriageResult | null;
}): Promise<void> {
  const crmWebhookUrl = trimEnv(process.env.TWENTY_INTAKE_WEBHOOK_URL) || trimEnv(process.env.INQUIRY_WEBHOOK_URL);
  const crmRequired = isCrmWebhookRequired();

  if (!crmWebhookUrl) {
    if (crmRequired) {
      console.error(
        `[submitForm] CRM_WEBHOOK_REQUIRED=true but TWENTY_INTAKE_WEBHOOK_URL is not set — ${args.schemaType} (doc ${args.docId})`,
      );
      throw new Error("CRM webhook URL not configured");
    }
    console.warn(
      `[submitForm] CRM intake webhook not set — ${args.schemaType} remains in Sanity (doc ${args.docId})`,
    );
    return;
  }

  const token = trimEnv(process.env.TWENTY_INTAKE_WEBHOOK_TOKEN);
  const res = await fetch(crmWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      source: "konative.com",
      schemaType: args.schemaType,
      sanityDocumentId: args.docId,
      submittedAt: new Date().toISOString(),
      data: args.data,
      triage: args.triage,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(
      `[submitForm] CRM webhook non-OK response for ${args.schemaType} (doc ${args.docId}): ${res.status} ${body}`,
    );
    if (crmRequired) {
      throw new Error(`CRM webhook failed (${res.status})`);
    }
  }
}

/** Validate → persist to Sanity → notify via Resend and CRM automation (fail-closed). */
export async function submitForm<T extends Record<string, unknown>>(
  options: SubmitOptions<T>,
): Promise<SubmitResult> {
  const { schemaType, zodSchema, payload, emailSubject, emailHtml, confirmationEmail } = options;

  // 1. Validate
  const parsed = zodSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map(e => ({
        path: e.path.join("."),
        message: e.message,
      })),
    };
  }

  // 2. Persist to Sanity — always first, source of truth
  let docId: string;
  try {
    const client = getSanityWriteClient();
    const doc = await client.create({
      _type: schemaType,
      ...(parsed.data as Record<string, unknown>),
      submittedAt: new Date().toISOString(),
    });
    docId = doc._id;
  } catch (err) {
    console.error(`[submitForm] Sanity write failed for ${schemaType}:`, err);
    return {
      ok: false,
      stage: "persist",
      message: "Failed to save submission. Please try again.",
    };
  }

  // 3. Triage — pure, non-throwing scoring so the team can prioritize
  // response order. Best-effort patch onto the Sanity doc; a triage or patch
  // failure must never affect the user-facing submission result.
  let triage: TriageResult | null = null;
  try {
    triage = scoreInquiry({ schemaType, fields: parsed.data as Record<string, unknown> });
    const client = getSanityWriteClient();
    await client
      .patch(docId)
      .set({
        triageScore: triage.score,
        triageTier: triage.tier,
        lane: triage.lane,
        routeTo: triage.routeTo,
        slaHours: triage.slaHours,
      })
      .commit();
  } catch (err) {
    console.error(`[submitForm] Triage scoring/patch failed for ${schemaType} (doc ${docId}):`, err);
  }

  // 4. Notify via Resend — awaited, fail-closed. Persist already succeeded.
  // .trim() guards against secrets set with a trailing newline (e.g. `echo`
  // instead of `printf` into `wrangler secret put`).
  const notifyTo = trimEnv(process.env.RESEND_TO);
  const from = trimEnv(process.env.RESEND_FROM);

  const triageHtml = triage
    ? `<div style="margin:0 0 12px;padding:10px;background:#f5f5f5;font:13px monospace">` +
      `<strong>[${triage.tier.toUpperCase()} · ${triage.lane} · SLA ${triage.slaHours}h]</strong> ` +
      `score ${triage.score} · route <strong>${triage.routeTo}</strong>` +
      `<ul style="margin:8px 0 0;padding-left:20px">${triage.reasons.map(r => `<li>${r}</li>`).join("")}</ul>` +
      `</div>`
    : "";
  const finalSubject = triage ? `[${triage.tier.toUpperCase()} · ${triage.lane}] ${emailSubject}` : emailSubject;
  const baseHtml =
    emailHtml ||
    `<h2>${emailSubject}</h2><pre>${JSON.stringify(parsed.data, null, 2)}</pre><p>Sanity doc: ${docId}</p>`;

  try {
    await sendResendEmail({
      to: notifyTo,
      from,
      subject: finalSubject,
      html: `${triageHtml}${baseHtml}`,
      logLabel: `internal notification for ${schemaType} (doc ${docId})`,
    });

    if (confirmationEmail) {
      await sendResendEmail({
        to: confirmationEmail.to,
        from,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        logLabel: `confirmation email for ${schemaType} (doc ${docId})`,
      });
    }
  } catch (err) {
    console.error(`[submitForm] Resend error for ${schemaType} (doc ${docId}):`, err);
    return {
      ok: false,
      stage: "notify",
      id: docId,
      message: "Failed to send notification. Please try again.",
    };
  }

  // 5. Forward to Twenty/n8n when configured. Optional by default; fail-closed when
  // CRM_WEBHOOK_REQUIRED=true. Lead and email are already durable at this point.
  try {
    await forwardToCrm({
      schemaType,
      docId,
      data: parsed.data as Record<string, unknown>,
      triage,
    });
  } catch (err) {
    console.error(`[submitForm] CRM webhook error for ${schemaType} (doc ${docId}):`, err);
    return {
      ok: false,
      stage: "crm",
      id: docId,
      message: "Failed to route inquiry. Please try again.",
    };
  }

  return { ok: true, id: docId };
}
