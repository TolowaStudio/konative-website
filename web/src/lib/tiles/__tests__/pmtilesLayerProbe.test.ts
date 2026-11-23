import { describe, expect, it } from "vitest";
import {
  mergePmtilesHeadProbeResult,
  pmtilesErrorBannerLayerIds,
  runPmtilesHeadProbe,
  shouldMountPmtilesInfraSource,
} from "../pmtilesLayerProbe";

describe("PMTiles HEAD probe (TS-4170 visible error)", () => {
  const layerId = "ca_nrcan_transmission_lines";

  it("403 HEAD produces banner entry and blocks PMTiles Source mount", async () => {
    const result = await runPmtilesHeadProbe(
      "https://konative.com/api/v1/tiles/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      async () => new Response(null, { status: 403 }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    const errors = mergePmtilesHeadProbeResult({}, layerId, result);
    expect(errors[layerId]).toBe("Layer unavailable (HTTP 403)");
    expect(pmtilesErrorBannerLayerIds(errors)).toContain(layerId);
    expect(shouldMountPmtilesInfraSource(layerId, errors)).toBe(false);
  });

  it("200 HEAD clears errors and allows Source mount", async () => {
    const prior = { [layerId]: "Layer unavailable (HTTP 403)" };
    const result = await runPmtilesHeadProbe(
      "https://example.com/tile",
      async () => new Response(null, { status: 200 }),
    );
    expect(result.ok).toBe(true);
    const errors = mergePmtilesHeadProbeResult(prior, layerId, result);
    expect(errors[layerId]).toBeUndefined();
    expect(shouldMountPmtilesInfraSource(layerId, errors)).toBe(true);
  });
});