import { NextResponse } from "next/server";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { contactSchema } from "@/lib/forms/schemas/contact";
import { summarizeVoiceIntake, buildVoiceIntakeMarkdown, type VoiceAnswer } from "@/lib/forms/voiceIntakeSummary";

interface VoiceIntakeBody {
  name?: string;
  email?: string;
  organization?: string;
  answers?: VoiceAnswer[];
}

export async function POST(request: Request) {
  let body: VoiceIntakeBody;
  try {
    body = (await request.json()) as VoiceIntakeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const answers = Array.isArray(body.answers) ? body.answers : [];
  const contact = { name: body.name ?? "", email: body.email ?? "" };

  const summary = await summarizeVoiceIntake(answers);
  const voiceMarkdown = buildVoiceIntakeMarkdown(answers, summary, contact);

  const internalHtml = `
    <h2>New voice intake: ${escapeHtml(summary.headline)}</h2>
    <p>${escapeHtml(summary.paragraph)}</p>
    <ul>${summary.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
    <pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;font-size:12px">${escapeHtml(voiceMarkdown)}</pre>
  `;

  const confirmationHtml = `
    <h2>Thanks, ${escapeHtml(contact.name || "there")} — we've got your request.</h2>
    <p>${escapeHtml(summary.paragraph)}</p>
    <p>A Konative advisor will review this and follow up shortly. If you'd rather pick a time
    yourself, you can book a call directly: <a href="https://cal.com/jeramey-james/15min">cal.com/jeramey-james</a>.</p>
    <p style="color:#6b7280;font-size:13px">What we captured:</p>
    <ul style="color:#6b7280;font-size:13px">${summary.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
  `;

  const result = await submitForm({
    schemaType: "contactInquiry",
    zodSchema: contactSchema,
    payload: {
      name: contact.name,
      email: contact.email,
      organization: body.organization,
      context: "Voice intake",
      message: summary.paragraph,
      voiceMarkdown,
      voiceAnswers: answers,
    },
    emailSubject: `Voice intake: ${summary.headline}`,
    emailHtml: internalHtml,
    confirmationEmail: contact.email
      ? { to: contact.email, subject: "We've got your connectivity request — Konative", html: confirmationHtml }
      : undefined,
  });

  if (!result.ok) {
    return submitFormResponse(result);
  }

  return NextResponse.json({ success: true, id: result.id, summary });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
