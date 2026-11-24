import { formatAsOfLabel, isFreshTimestamp, resolveFreshStat } from "./contentFreshness";
import type { MarketSignalsStats } from "./marketSignalsStats";

export type MarketSignalsHeroView = {
  showStalledAsOf: boolean;
  stalledAsOfLabel: string | null;
  showStalledCount: boolean;
  stalledCount: number | null;
  stalledHiddenMessage: string;
  showGovernorCount: boolean;
  governorCount: number | null;
  governorFallbackMessage: string;
};

export function buildMarketSignalsHeroView(
  stats: MarketSignalsStats | null,
  now = new Date(),
): MarketSignalsHeroView {
  const stalledStat = resolveFreshStat(stats?.stalled, stats?.updatedAt, now);
  const governorStat = resolveFreshStat(stats?.focusGovernors, stats?.updatedAt, now);

  return {
    showStalledAsOf: stalledStat.kind === "live",
    stalledAsOfLabel: stalledStat.kind === "live" ? stalledStat.asOfLabel : null,
    showStalledCount: stalledStat.kind === "live",
    stalledCount: stalledStat.kind === "live" ? stalledStat.value : null,
    stalledHiddenMessage: "Stalled project counts temporarily hidden — dataset refresh pending",
    showGovernorCount: governorStat.kind === "live",
    governorCount: governorStat.kind === "live" ? governorStat.value : null,
    governorFallbackMessage: "Governor context layer",
  };
}

export type TribalProjectsCountStripView = {
  showLiveCounts: boolean;
  asOfLabel: string | null;
};

export function buildTribalProjectsCountStripView(
  datasetUpdatedAt: string | undefined,
  projectCount: number,
  now = new Date(),
): TribalProjectsCountStripView {
  const showLiveCounts = isFreshTimestamp(datasetUpdatedAt, undefined, now) && projectCount > 0;
  const asOfLabel = showLiveCounts ? formatAsOfLabel(datasetUpdatedAt, now) : null;
  return { showLiveCounts, asOfLabel };
}

export type CanadaLiveStatsView = {
  liveFresh: boolean;
  asOfLabel: string | null;
  headlineStats: { v: string; l: string }[];
  heroUsesLiveCounts: boolean;
};

export type CanadaLiveStatsInput = {
  operational: number;
  pipeline: number;
  stalled: number;
  totalMw?: number;
  updatedAt?: string;
};

export function buildCanadaLiveStatsView(
  live: CanadaLiveStatsInput | null,
  now = new Date(),
): CanadaLiveStatsView {
  const liveFresh = Boolean(live && isFreshTimestamp(live.updatedAt, undefined, now));
  const asOfLabel = liveFresh ? formatAsOfLabel(live?.updatedAt, now) : null;
  const headlineStats = liveFresh && live
    ? [
        {
          v: live.totalMw ? `${Math.round(live.totalMw).toLocaleString()} MW` : "—",
          l: "Tracked Canadian DC capacity (MW sum)",
        },
        {
          v: `${live.operational} / ${live.pipeline}`,
          l: "Operational / pipeline (live dataset)",
        },
      ]
    : [];

  return {
    liveFresh,
    asOfLabel,
    headlineStats,
    heroUsesLiveCounts: liveFresh,
  };
}

export type TbcpAwardsDatasetView = {
  datasetAsOf: string | undefined;
};

export function buildTbcpAwardsDatasetView(
  awardCount: number,
  datasetUpdatedAt: string | undefined,
  now = new Date(),
): TbcpAwardsDatasetView {
  const fresh = resolveFreshStat(awardCount > 0 ? awardCount : null, datasetUpdatedAt, now);
  return {
    datasetAsOf: fresh.kind === "live" ? fresh.asOfLabel : undefined,
  };
}