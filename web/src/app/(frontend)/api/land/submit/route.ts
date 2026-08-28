import { NextResponse } from "next/server";
import { submitForm } from "@/lib/forms/submit";
import { submitFormResponse } from "@/lib/forms/formResponse";
import { landFullSchema } from "@/lib/forms/schemas/land";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, string>;
  const result = await submitForm({
    schemaType: "landSubmission",
    zodSchema: landFullSchema,
    payload: body,
    emailSubject: `New Land Inquiry: ${b?.name ?? "Unknown"} in ${b?.county ?? "Unknown"}, ${b?.state ?? "Unknown"}`,
  });

  return submitFormResponse(result);
}
