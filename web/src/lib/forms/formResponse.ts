import { NextResponse } from "next/server";
import type { SubmitResult } from "@/lib/forms/submit";

/** Map submitForm results to API responses with distinguishable failure stages. */
export function submitFormResponse(result: SubmitResult, fallbackError = "Submission failed") {
  if (result.ok) {
    return NextResponse.json({ success: true, id: result.id });
  }

  if (result.errors) {
    return NextResponse.json({ error: "Validation failed", errors: result.errors }, { status: 400 });
  }

  const body: { error: string; stage?: string; id?: string } = {
    error: result.message ?? fallbackError,
  };
  if (result.stage) body.stage = result.stage;
  if (result.id) body.id = result.id;

  return NextResponse.json(body, { status: 500 });
}
