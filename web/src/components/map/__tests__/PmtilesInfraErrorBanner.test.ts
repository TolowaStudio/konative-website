import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PmtilesInfraErrorBanner } from "../PmtilesInfraErrorBanner";
import {
  mergePmtilesHeadProbeResult,
  runPmtilesHeadProbe,
} from "@/lib/tiles/pmtilesLayerProbe";
import { PMTILES_ERROR_BANNER_HEADING } from "@/lib/tiles/pmtilesProbe";

describe("PmtilesInfraErrorBanner (map visible error)", () => {
  it("renders banner markup when enabled layer HEAD returns 403", async () => {
    const layerId = "ca_nrcan_transmission_lines";
    const probe = await runPmtilesHeadProbe(
      "https://konative.com/api/v1/tiles/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      async () => new Response(null, { status: 403 }),
    );
    const errors = mergePmtilesHeadProbeResult({}, layerId, probe);

    const html = renderToStaticMarkup(
      createElement(PmtilesInfraErrorBanner, { errors }),
    );

    expect(html).toContain('data-testid="pmtiles-infra-error-banner"');
    expect(html).toContain(PMTILES_ERROR_BANNER_HEADING);
    expect(html).toContain(layerId);
    expect(html).toContain("HTTP 403");
  });

  it("renders nothing when there are no layer errors", () => {
    const html = renderToStaticMarkup(
      createElement(PmtilesInfraErrorBanner, { errors: {} }),
    );
    expect(html).toBe("");
  });
});