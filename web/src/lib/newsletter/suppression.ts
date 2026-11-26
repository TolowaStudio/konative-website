// Twenty do-not-contact check for the signup confirmation send path (G5).
//
// FAIL-CLOSED: if Twenty is not configured, unreachable or returns an error we
// treat the address as suppressed-unknown and do NOT send the confirmation
// email. The consent record is still stored (pending_confirmation), so nothing
// is lost; the confirmation can be sent later once the check is available.
//
// The Twenty person field holding the marker is configurable because the
// marker's name is set in the CRM, not in this repo.

export type SuppressionResult =
  | { suppressed: false }
  | { suppressed: true; reason: "listed" | "twenty_not_configured" | "twenty_error" };

export async function checkTwentySuppression(email: string): Promise<SuppressionResult> {
  const base = (process.env.TWENTY_API_URL ?? "").trim().replace(/\/$/, "");
  const key = (process.env.TWENTY_API_KEY ?? "").trim();
  if (!base || !key) return { suppressed: true, reason: "twenty_not_configured" };
  const field = (process.env.TWENTY_SUPPRESSION_FIELD ?? "doNotContact").trim();

  try {
    const filter = `emails.primaryEmail[eq]:"${email.replace(/["\\]/g, "")}"`;
    const res = await fetch(`${base}/rest/people?filter=${encodeURIComponent(filter)}&limit=5`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { suppressed: true, reason: "twenty_error" };
    const json = (await res.json()) as {
      data?: { people?: Record<string, unknown>[] } | Record<string, unknown>[];
    };
    const people = Array.isArray(json.data) ? json.data : (json.data?.people ?? []);
    return people.some((p) => Boolean(p[field])) ? { suppressed: true, reason: "listed" } : { suppressed: false };
  } catch {
    return { suppressed: true, reason: "twenty_error" };
  }
}
