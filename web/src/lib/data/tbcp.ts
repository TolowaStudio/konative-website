import {
  CloudflareBindingUnavailableError,
  queryTbcpAwards,
  isD1TbcpReady,
  readWithSupabaseFallback,
  SupabaseFallbackDisabledError,
} from "@/lib/db";
import { supabase } from "@/lib/supabase";

/**
 * Server-side reader for the `tbcp_awards` table (D1 primary, Supabase fallback).
 *
 * The table holds real NTIA Tribal Broadband Connectivity Program Round 1–2
 * awards with public-read RLS ("Public read tbcp_awards" USING (true)), so the
 * anon/public client can read it. This module aggregates that data into a
 * compact, on-brand summary for display on the marketing site.
 *
 * If Supabase is unreachable, misconfigured (missing env vars), or returns
 * nothing, `getTbcpSummary()` returns `null`. A missing Cloudflare D1 binding (or an
 * empty D1 with `KONATIVE_SUPABASE_FALLBACK=off`) is
 * different: it is rethrown so callers do not render missing data as a healthy
 * empty section.
 */

export interface TbcpStateStat {
  state: string;
  count: number;
  totalUsd: number;
}

export interface TbcpRoundSplit {
  round1: { count: number; totalUsd: number };
  round2: { count: number; totalUsd: number };
}

export interface TbcpSummary {
  totalAwards: number;
  totalUsd: number;
  distinctStates: number;
  topStatesByUsd: TbcpStateStat[];
  topStatesByCount: TbcpStateStat[];
  roundSplit: TbcpRoundSplit;
}

interface AwardRow {
  state: string | null;
  award_amount_usd: number | string | null;
  nofo_round: string | null;
}

/** Normalize a NOFO round label to a coarse "1" | "2" | null bucket. */
function roundBucket(raw: string | null): "1" | "2" | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("1")) return "1";
  if (s.includes("2")) return "2";
  return null;
}

function toNumber(v: number | string | null): number {
  if (v == null) return 0;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Aggregate the tbcp_awards table. Cached at the Next.js data-fetch layer via
 * the `revalidate` export on consuming components (public aggregate data).
 *
 * Returns `null` for non-D1 data failures. Missing D1 bindings are rethrown.
 */
async function fetchAwardRows(): Promise<AwardRow[] | null> {
  const rows = await readWithSupabaseFallback<AwardRow[]>(
    "lib/data/tbcp",
    async () =>
      (await isD1TbcpReady())
        ? ((await queryTbcpAwards("state, award_amount_usd, nofo_round")) as
            | AwardRow[]
            | null)
        : null,
    async () => {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        return [];
      }

      const { data, error } = await supabase
        .from("tbcp_awards")
        .select("state, award_amount_usd, nofo_round");

      if (error || !data || data.length === 0) return [];
      return data as AwardRow[];
    },
  );
  return rows.length > 0 ? rows : null;
}

export async function getTbcpSummary(
  topN = 6,
): Promise<TbcpSummary | null> {
  try {
    const rows = await fetchAwardRows();
    if (!rows || rows.length === 0) return null;

    let totalUsd = 0;
    const byState = new Map<string, { count: number; totalUsd: number }>();
    const roundSplit: TbcpRoundSplit = {
      round1: { count: 0, totalUsd: 0 },
      round2: { count: 0, totalUsd: 0 },
    };

    for (const row of rows) {
      const amount = toNumber(row.award_amount_usd);
      totalUsd += amount;

      const state = (row.state || "").trim();
      if (state) {
        const cur = byState.get(state) || { count: 0, totalUsd: 0 };
        cur.count += 1;
        cur.totalUsd += amount;
        byState.set(state, cur);
      }

      const bucket = roundBucket(row.nofo_round);
      if (bucket === "1") {
        roundSplit.round1.count += 1;
        roundSplit.round1.totalUsd += amount;
      } else if (bucket === "2") {
        roundSplit.round2.count += 1;
        roundSplit.round2.totalUsd += amount;
      }
    }

    const stateStats: TbcpStateStat[] = Array.from(byState.entries()).map(
      ([state, v]) => ({ state, count: v.count, totalUsd: v.totalUsd }),
    );

    const topStatesByUsd = [...stateStats]
      .sort((a, b) => b.totalUsd - a.totalUsd)
      .slice(0, topN);

    const topStatesByCount = [...stateStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);

    return {
      totalAwards: rows.length,
      totalUsd,
      distinctStates: byState.size,
      topStatesByUsd,
      topStatesByCount,
      roundSplit,
    };
  } catch (error) {
    if (error instanceof CloudflareBindingUnavailableError) throw error;
    // Fallback switched off and the primary DB is empty: surface, do not render "no data".
    if (error instanceof SupabaseFallbackDisabledError) throw error;
    // Supabase/network failure or unexpected data shape — degrade.
    return null;
  }
}

/** Format a USD figure as a compact, human display string ("$2.14B", "$41.2M"). */
export function formatUsdCompact(usd: number): string {
  if (usd >= 1_000_000_000) {
    return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  }
  if (usd >= 1_000_000) {
    return `$${(usd / 1_000_000).toFixed(1)}M`;
  }
  if (usd >= 1_000) {
    return `$${Math.round(usd / 1_000)}K`;
  }
  return `$${Math.round(usd)}`;
}
