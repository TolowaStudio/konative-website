import { describe, expect, it } from "vitest";

import { isFreshTimestamp, resolveFreshStat } from "../contentFreshness";

describe("contentFreshness", () => {
  const now = new Date("2026-11-23T12:00:00.000Z");

  it("treats timestamps within 30 days as fresh", () => {
    expect(isFreshTimestamp("2026-11-01T00:00:00.000Z", 30, now)).toBe(true);
  });

  it("hides stale stats", () => {
    const result = resolveFreshStat(36, "2026-08-01T00:00:00.000Z", now);
    expect(result.kind).toBe("hidden");
  });
});