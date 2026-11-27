// Fail-closed Twenty suppression check for the newsletter confirmation path (G5).
// Uses the same list and matching rules as outreach (TS-4376): doNotContact,
// outreachStatus DNC / OPTED_OUT / BOUNCED, and additionalEmails.

import { assertNotSuppressed, createTwentySuppressionChecker } from "@/lib/outreach/suppression";

export type SuppressionResult =
  | { suppressed: false }
  | { suppressed: true; reason: "listed" | "twenty_not_configured" | "twenty_error" };

export async function checkTwentySuppression(email: string): Promise<SuppressionResult> {
  const result = await assertNotSuppressed(email, createTwentySuppressionChecker());
  if (result.ok) return { suppressed: false };
  if (result.reason === "suppressed") return { suppressed: true, reason: "listed" };
  if (result.reason === "suppression-source-not-configured") {
    return { suppressed: true, reason: "twenty_not_configured" };
  }
  return { suppressed: true, reason: "twenty_error" };
}