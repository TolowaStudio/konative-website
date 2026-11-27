/** URL params the contact page copies into the submitted payload (attribution + context). */
export const CONTACT_URL_PARAM_KEYS = [
  "context",
  "campaign",
  "segment",
  "awardSlug",
  "lane",
  "source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Merge URL params into form data without overriding fields the visitor filled. Values are trimmed. */
export function mergeContactUrlParams(
  data: Record<string, unknown>,
  search: string | URLSearchParams,
): Record<string, unknown> {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const out = { ...data };
  for (const key of CONTACT_URL_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value && !out[key]) out[key] = value;
  }
  return out;
}
