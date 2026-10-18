import { NextResponse } from "next/server";
import {
  checkContactRateLimit,
  getClientIpFromRequest,
  isContactHoneypotTripped,
  stripContactHoneypot,
} from "@/lib/forms/contactAntiSpam";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { contactSchema } from "@/lib/forms/schemas/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  if (isContactHoneypotTripped(record)) {
    return NextResponse.json({ success: true, id: "dropped" });
  }

  const rate = checkContactRateLimit(getClientIpFromRequest(request));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  const payload = stripContactHoneypot(record);
  const b = payload as Record<string, string>;
  const result = await submitForm({
    schemaType: "contactInquiry",
    zodSchema: contactSchema,
    payload,
    emailSubject: `New Konative Contact: ${b?.name ?? "Unknown"} from ${b?.organization ?? "Unknown"}`,
  });

  return submitFormResponse(result);
}
