import { NextResponse } from "next/server";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { capacitySchema } from "@/lib/forms/schemas/capacity";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, string>;
  const result = await submitForm({
    schemaType: "capacityRequest",
    zodSchema: capacitySchema,
    payload: body,
    emailSubject: `New capacity RFP: ${b?.company ?? "unknown"} — ${b?.mwRequired ?? "?"}MW`,
  });

  return submitFormResponse(result);
}
