import { getD1, rethrowD1OperationFailure } from "./client";

let cachedReady: boolean | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

/** True when the reachable D1 tbcp_awards table has at least one row. */
export async function isD1TbcpReady(): Promise<boolean> {
  const db = await getD1();
  try {
    const row = await db
      .prepare("SELECT 1 AS ok FROM tbcp_awards LIMIT 1")
      .first<{ ok: number }>();
    return !!row;
  } catch (error) {
    return rethrowD1OperationFailure("isD1TbcpReady", error);
  }
}

/** True when the reachable D1 interconnection_queue table has at least one row. */
export async function isD1QueueReady(): Promise<boolean> {
  const db = await getD1();

  const now = Date.now();
  if (cachedReady !== null && now - cachedAt < CACHE_MS) {
    return cachedReady;
  }

  try {
    const row = await db
      .prepare("SELECT 1 AS ok FROM interconnection_queue LIMIT 1")
      .first<{ ok: number }>();
    cachedReady = !!row;
  } catch (error) {
    return rethrowD1OperationFailure("isD1QueueReady", error);
  }
  cachedAt = now;
  return cachedReady;
}

/**
 * True when the reachable D1 sponsorship_placements table has any row at all
 * (active or not). Sponsor reads trust D1 once it has rows: "no active
 * sponsor right now" is a real answer, not a reason to re-read Supabase.
 */
export async function isD1SponsorshipReady(): Promise<boolean> {
  const db = await getD1();
  try {
    const row = await db
      .prepare("SELECT 1 AS ok FROM sponsorship_placements LIMIT 1")
      .first<{ ok: number }>();
    return !!row;
  } catch (error) {
    return rethrowD1OperationFailure("isD1SponsorshipReady", error);
  }
}

export function resetD1ReadyCache(): void {
  cachedReady = null;
  cachedAt = 0;
}
