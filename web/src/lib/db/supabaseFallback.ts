/**
 * One choke point for the Supabase read fallback that still sits behind the
 * D1/Postgres reads while the Supabase -> D1 migration finishes (TOL-324).
 *
 * Before this, a page whose D1 read came back empty silently re-read Supabase
 * and, on a Supabase error, rendered an empty page. Nothing recorded that the
 * migration was not done. Now every fallback read:
 *
 *  - logs one structured `supabase_fallback` line (greppable in Worker/Cloud Run
 *    logs: that is the "is anything still reading Supabase?" check in
 *    docs/supabase-decommission-checklist.md), and
 *  - can be switched off with `KONATIVE_SUPABASE_FALLBACK=off`, after which an
 *    empty primary read throws instead of quietly reading Supabase. Flip that on
 *    a preview first; the pages that throw are the ones not migrated yet.
 *
 * Default is unchanged behaviour (fallback allowed) so live pages do not change.
 */

export class SupabaseFallbackDisabledError extends Error {
  readonly site: string;
  constructor(site: string) {
    super(
      `${site}: the primary database returned no rows and the Supabase fallback is disabled (KONATIVE_SUPABASE_FALLBACK=off).`,
    );
    this.name = "SupabaseFallbackDisabledError";
    this.site = site;
  }
}

export function isSupabaseFallbackDisabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return (env.KONATIVE_SUPABASE_FALLBACK ?? "").trim().toLowerCase() === "off";
}

function hasData<T>(value: T | null | undefined): value is T {
  if (value == null) return false;
  return Array.isArray(value) ? value.length > 0 : true;
}

/**
 * Record that a request is about to read Supabase instead of the primary
 * database, or throw when the fallback is switched off. For call sites that
 * decide "the primary has no data" themselves (a readiness check on the table)
 * rather than from the rows they just read: a legitimately empty result, such
 * as "no active sponsor right now", must not count as a miss.
 */
export function noteSupabaseFallback(
  site: string,
  reason = "primary database returned no rows",
): void {
  const disabled = isSupabaseFallbackDisabled();
  console.error("Konative Supabase fallback", {
    event: "supabase_fallback",
    site,
    reason,
    fallbackDisabled: disabled,
  });
  if (disabled) throw new SupabaseFallbackDisabledError(site);
}

/**
 * A Supabase fallback read that itself failed. Callers that degrade to an empty
 * result instead of throwing must call this first, so the failure is in the
 * logs instead of looking like "no data".
 */
export function logSupabaseFallbackError(site: string, error: unknown): void {
  console.error("Konative Supabase fallback read failed", {
    event: "supabase_fallback_error",
    site,
    error: describeError(error),
  });
}

/** supabase-js and PostgREST return `{ message }` objects, not Error instances. */
function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

/**
 * Read from the primary database; if it has nothing, fall back to Supabase
 * (visibly), or throw when the fallback is switched off.
 *
 * `primary` must return `null`/`undefined`/`[]` for "no data". Errors thrown by
 * `primary` propagate: a broken D1 binding is not an empty table.
 */
export async function readWithSupabaseFallback<T>(
  site: string,
  primary: () => Promise<T | null | undefined>,
  supabase: () => Promise<T>,
): Promise<T> {
  const primaryResult = await primary();
  if (hasData(primaryResult)) return primaryResult;

  noteSupabaseFallback(site);
  return supabase();
}
