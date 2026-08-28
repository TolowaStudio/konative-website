import { NextResponse } from "next/server";
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

  const b = body as Record<string, string>;
  const result = await submitForm({
    schemaType: "contactInquiry",
    zodSchema: contactSchema,
    payload: body,
    emailSubject: `New Konative Contact: ${b?.name ?? "Unknown"} from ${b?.organization ?? "Unknown"}`,
  });

  return submitFormResponse(result);
}
