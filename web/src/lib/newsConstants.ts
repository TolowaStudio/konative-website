/** Shared news filter metadata (formerly Payload `NewsSources` constants). */

/** Public /news desk only surfaces stories this recent — not the full Sanity archive. */
export const NEWS_CURATION_WINDOW_DAYS = 7;

/** ISO timestamp for the start of the live curation window (UTC). */
export function newsCurationSinceIso(now = new Date()): string {
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - NEWS_CURATION_WINDOW_DAYS);
  return since.toISOString();
}

export const NEWS_SOURCE_COUNTRY_OPTIONS = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
] as const;

export const NEWS_TOPIC_OPTIONS = [
  { label: "Tribal Data Centers", value: "tribal-data-center" },
  { label: "Tribal Energy & Power", value: "tribal-energy" },
  { label: "Tribal Broadband", value: "tribal-broadband" },
  { label: "Grants & Funding", value: "grants-funding" },
  { label: "Data Center Construction", value: "construction" },
  { label: "Permitting and Zoning", value: "permitting" },
  { label: "Rules and Regulations", value: "regulations" },
  { label: "Capital Spend and Investment", value: "investment" },
  { label: "Utility and Power", value: "power" },
  { label: "Sustainability and Water", value: "sustainability" },
  { label: "Tax and Incentives", value: "tax" },
] as const;

export type NewsTopicValue = (typeof NEWS_TOPIC_OPTIONS)[number]["value"];

/** Topics surfaced in the default tribal-focused news view. */
export const TRIBAL_NEWS_TOPIC_VALUES = [
  "tribal-data-center",
  "tribal-energy",
  "tribal-broadband",
  "grants-funding",
] as const satisfies readonly NewsTopicValue[];

export function isNewsTopicValue(value: string): value is NewsTopicValue {
  return (NEWS_TOPIC_OPTIONS as readonly { value: string }[]).some((option) => option.value === value);
}
