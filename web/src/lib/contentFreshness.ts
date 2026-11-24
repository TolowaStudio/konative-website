/** Public surfaces should not imply live stats without an as-of when data is older than this. */
export const PUBLIC_STATS_MAX_AGE_DAYS = 30;

export function formatAsOfLabel(iso?: string, now = new Date()): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.valueOf())) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function isFreshTimestamp(iso: string | undefined, maxAgeDays = PUBLIC_STATS_MAX_AGE_DAYS, now = new Date()): boolean {
  if (!iso) return false;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.valueOf())) return false;
  const ageMs = now.getTime() - parsed.getTime();
  return ageMs <= maxAgeDays * 24 * 60 * 60 * 1000;
}

export type FreshStatDisplay<T> =
  | { kind: "live"; value: T; asOfLabel: string }
  | { kind: "hidden"; reason: "stale" | "missing" };

export function resolveFreshStat<T>(
  value: T | null | undefined,
  asOfIso: string | undefined,
  now = new Date(),
): FreshStatDisplay<T> {
  if (value === null || value === undefined) {
    return { kind: "hidden", reason: "missing" };
  }
  if (!isFreshTimestamp(asOfIso, PUBLIC_STATS_MAX_AGE_DAYS, now)) {
    return { kind: "hidden", reason: "stale" };
  }
  const asOfLabel = formatAsOfLabel(asOfIso, now);
  if (!asOfLabel) {
    return { kind: "hidden", reason: "missing" };
  }
  return { kind: "live", value, asOfLabel };
}