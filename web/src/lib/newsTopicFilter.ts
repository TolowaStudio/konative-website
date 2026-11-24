import type { NewsTopicValue } from "./newsConstants";

export type NewsTextFields = {
  title?: string;
  summary?: string;
  topics?: string[];
};

/** Patterns that disqualify CRE / lifestyle / unrelated energy headlines from the public desk. */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bpickleball\b/i,
  /\btaco\b/i,
  /\brestaurant\s+lease/i,
  /\boffice\s+survey\b/i,
  /\boffice\s+absorption\b/i,
  /\bpermian\b/i,
  /\bshale\s+oil\b/i,
  /\bcrude\s+oil\b/i,
  /\bmultifamily\b/i,
  /\bapartment\s+building/i,
  /\bretail\s+lease/i,
  /\bstrip\s+mall/i,
  /\btennis\s+court/i,
  /\bgolf\s+course\b/i,
];

/** Require at least one infrastructure / connectivity signal in title + summary. */
const ON_TOPIC_PATTERNS: RegExp[] = [
  /\bdata\s*cent(er|re)\b/i,
  /\bcolocation\b/i,
  /\bcolo\b/i,
  /\bhyperscale\b/i,
  /\bfiber\b/i,
  /\bbroadband\b/i,
  /\bconnectivity\b/i,
  /\binterconnect/i,
  /\btransmission\b/i,
  /\bsubstation\b/i,
  /\butility\s+grid\b/i,
  /\bpower\s+plant\b/i,
  /\belectrification\b/i,
  /\bntia\b/i,
  /\btbcp\b/i,
  /\bbead\b/i,
  /\btribal\b/i,
  /\bindigenous\b/i,
  /\bfirst\s+nations\b/i,
  /\bpermitting\b/i,
  /\binterconnection\s+queue\b/i,
  /\bcooling\s+tower\b/i,
  /\bmegawatt\b/i,
  /\b\sMW\b/,
  /\bai\s+infrastructure\b/i,
  /\bsovereign\s+ai\b/i,
  /\bpolicy\b/i,
  /\bfederal\b/i,
  /\bgrant\b/i,
  /\bfunding\b/i,
  /\bappropriation\b/i,
];

const TOPIC_HINTS: { pattern: RegExp; topic: NewsTopicValue }[] = [
  { pattern: /\btribal\b|\bindigenous\b|\bfirst\s+nations\b/i, topic: "tribal-data-center" },
  { pattern: /\bbroadband\b|\bntia\b|\btbcp\b|\bbead\b/i, topic: "tribal-broadband" },
  { pattern: /\bgrant\b|\bfunding\b|\baward\b/i, topic: "grants-funding" },
  { pattern: /\bsolar\b|\brenewable\b|\bwind\b|\benergy\b/i, topic: "tribal-energy" },
  { pattern: /\bconstruction\b|\bbuild\b|\bcampus\b/i, topic: "construction" },
  { pattern: /\bpermit/i, topic: "permitting" },
  { pattern: /\bregulat/i, topic: "regulations" },
  { pattern: /\binvest|\bcapital\b|\bacquisition\b/i, topic: "investment" },
  { pattern: /\bpower\b|\bgrid\b|\bsubstation\b|\butility\b/i, topic: "power" },
  { pattern: /\bwater\b|\bcooling\b/i, topic: "sustainability" },
  { pattern: /\btax\b|\bincentive\b/i, topic: "tax" },
];

function haystack(fields: NewsTextFields): string {
  return `${fields.title ?? ""} ${fields.summary ?? ""}`.replace(/\s+/g, " ").trim();
}

export function isOffTopicNewsItem(fields: NewsTextFields): boolean {
  const text = haystack(fields);
  if (!text) return true;
  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}

export function hasOnTopicSignal(fields: NewsTextFields): boolean {
  const text = haystack(fields);
  if (!text) return false;
  if (ON_TOPIC_PATTERNS.some((pattern) => pattern.test(text))) return true;
  const tribalTopicHits = (fields.topics ?? []).filter((t) =>
    ["tribal-data-center", "tribal-energy", "tribal-broadband", "grants-funding"].includes(t),
  );
  return tribalTopicHits.length > 0 && text.length > 40;
}

/** Public desk eligibility — default /news filter when topic is "all". */
export function isNewsDeskEligible(fields: NewsTextFields): boolean {
  if (isOffTopicNewsItem(fields)) return false;
  return hasOnTopicSignal(fields);
}

export function inferNewsTopicsFromText(fields: NewsTextFields, fallback: NewsTopicValue[]): NewsTopicValue[] {
  const text = haystack(fields);
  const inferred = TOPIC_HINTS.filter(({ pattern }) => pattern.test(text)).map(({ topic }) => topic);
  const merged = [...new Set([...inferred, ...fallback])];
  return merged.length > 0 ? merged : fallback.length > 0 ? fallback : ["construction"];
}