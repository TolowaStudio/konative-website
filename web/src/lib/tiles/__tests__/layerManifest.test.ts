import { describe, expect, it } from "vitest";
import type { LayerManifest, LayerManifestEntry } from "@/types/map-layers";
import {
  isLayerVisibleOnMap,
  mergeLayerManifests,
  normalizeManifestTilesUrl,
} from "../layerManifest";

function layer(
  partial: Partial<LayerManifestEntry> & Pick<LayerManifestEntry, "id">,
): LayerManifestEntry {
  return {
    title: partial.id,
    category: "power",
    country: "CA",
    tilesUrl: "/tiles/v1/sample.pmtiles",
    sourceLayer: "x",
    minZoom: 4,
    maxZoom: 12,
    license: "OGL-Canada-2.0",
    attribution: "test",
    sourceUrl: "https://example.com",
    lastUpdated: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

describe("normalizeManifestTilesUrl", () => {
  it("rewrites retired R2 URLs to same-origin proxy paths", () => {
    expect(
      normalizeManifestTilesUrl(
        "https://pub-70584c42a8ad4fb1a38f5273a1665067.r2.dev/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      ),
    ).toBe("/tiles/v1/ca_nrcan_transmission_lines.pmtiles");
  });
});

describe("isLayerVisibleOnMap", () => {
  it("hides unwired PMTiles layers with empty tilesUrl", () => {
    expect(isLayerVisibleOnMap(layer({ id: "ca_nrcan_transmission_lines" }))).toBe(true);
    expect(
      isLayerVisibleOnMap(
        layer({ id: "ca_nrcan_transmission_lines", tilesUrl: "" }),
      ),
    ).toBe(false);
  });

  it("hides the seven unwired layer ids", () => {
    expect(isLayerVisibleOnMap(layer({ id: "vi-fiber", sourceType: "geojson", tilesUrl: "" }))).toBe(
      false,
    );
    expect(
      isLayerVisibleOnMap(
        layer({ id: "politics_governors", sourceType: "geojson", tilesUrl: "" }),
      ),
    ).toBe(false);
  });
});

describe("mergeLayerManifests", () => {
  it("drops hidden layers and rewrites R2 tilesUrl", () => {
    const manifests: LayerManifest[] = [
      {
        version: 1,
        generatedAt: "2026-01-01T00:00:00.000Z",
        layers: [
          layer({
            id: "ca_nrcan_transmission_lines",
            tilesUrl:
              "https://pub-70584c42a8ad4fb1a38f5273a1665067.r2.dev/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
          }),
          layer({ id: "vi-fiber", sourceType: "geojson", tilesUrl: "" }),
        ],
      },
    ];

    const merged = mergeLayerManifests(manifests);
    expect(merged.layers.map((l) => l.id)).toEqual(["ca_nrcan_transmission_lines"]);
    expect(merged.layers[0]?.tilesUrl).toBe(
      "/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
    );
  });
});