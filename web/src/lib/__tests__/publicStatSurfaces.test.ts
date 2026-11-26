import { describe, expect, it } from "vitest";

import {
  buildCanadaLiveStatsView,
  buildMarketSignalsHeroView,
  buildTbcpAwardsDatasetView,
  buildTribalProjectsCountStripView,
} from "../publicStatSurfaces";

const now = new Date("2026-11-23T12:00:00.000Z");

describe("publicStatSurfaces page wiring", () => {
  it("hides Market Signals stat spans when dataset updatedAt is stale", () => {
    const hero = buildMarketSignalsHeroView(
      { stalled: 36, focusGovernors: 12, updatedAt: "2026-08-01T00:00:00.000Z" },
      now,
    );
    expect(hero.showStalledCount).toBe(false);
    expect(hero.showGovernorCount).toBe(false);
    expect(hero.stalledHiddenMessage).toContain("hidden");
  });

  it("shows Market Signals counts and as-of when fresh", () => {
    const hero = buildMarketSignalsHeroView(
      { stalled: 36, focusGovernors: 12, updatedAt: "2026-11-01T00:00:00.000Z" },
      now,
    );
    expect(hero.showStalledCount).toBe(true);
    expect(hero.stalledCount).toBe(36);
    expect(hero.showGovernorCount).toBe(true);
    expect(hero.governorCount).toBe(12);
    expect(hero.stalledAsOfLabel).toBe("Nov 1, 2026");
  });

  it("hides Tribal DC Tracker count strip when metadata is stale", () => {
    const view = buildTribalProjectsCountStripView("2026-07-01T00:00:00.000Z", 24, now);
    expect(view.showLiveCounts).toBe(false);
    expect(view.asOfLabel).toBeNull();
  });

  it("hides Canada dynamic headline stats when updatedAt is stale", () => {
    const view = buildCanadaLiveStatsView(
      {
        operational: 4,
        pipeline: 12,
        stalled: 2,
        totalMw: 800,
        updatedAt: "2026-06-01T00:00:00.000Z",
      },
      now,
    );
    expect(view.liveFresh).toBe(false);
    expect(view.headlineStats).toEqual([]);
    expect(view.heroUsesLiveCounts).toBe(false);
  });

  it("omits TBCP Awards loaded label when dataset timestamp is stale", () => {
    const view = buildTbcpAwardsDatasetView(120, "2026-06-01T00:00:00.000Z", now);
    expect(view.datasetAsOf).toBeUndefined();
  });

  it("shows TBCP Awards loaded label from dataset timestamp when fresh", () => {
    const view = buildTbcpAwardsDatasetView(120, "2026-11-10T12:00:00.000Z", now);
    expect(view.datasetAsOf).toBe("Nov 10, 2026");
  });
});