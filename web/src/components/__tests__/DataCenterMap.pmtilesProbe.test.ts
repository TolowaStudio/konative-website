// @vitest-environment happy-dom
import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FeatureCollection } from "geojson";
import type { LayerManifestEntry } from "@/types/map-layers";
import {
  KONATIVE_MAP_CARTO_BASEMAP_STYLE,
  KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID,
} from "@/lib/map/mapDisplayContract";

let lastDcGeoJsonSource: FeatureCollection | undefined;

vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}));

vi.mock("pmtiles", () => ({
  Protocol: class {
    tile = vi.fn();
  },
}));

vi.mock("maplibre-gl", () => ({
  default: {
    addProtocol: vi.fn(),
  },
}));

vi.mock("react-map-gl/maplibre", () => {
  const React = require("react") as typeof import("react");
  return {
    Map: ({
      children,
      mapStyle,
    }: {
      children?: React.ReactNode;
      mapStyle?: string;
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "konative-map",
          "data-map-style": mapStyle,
        },
        children,
      ),
    Source: ({
      id,
      data,
    }: {
      id: string;
      data?: FeatureCollection;
    }) => {
      if (id === KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID) {
        lastDcGeoJsonSource = data;
      }
      return React.createElement("div", {
        "data-testid": `map-source-${id}`,
      });
    },
    Layer: () => null,
    Popup: () => null,
  };
});

const PMTILES_LAYER_ID = "ca_nrcan_transmission_lines";

const PMTILES_LAYER: LayerManifestEntry = {
  id: PMTILES_LAYER_ID,
  title: "NRCAN transmission",
  category: "power",
  country: "CA",
  tilesUrl: "/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
  sourceLayer: "transmission_lines",
  minZoom: 4,
  maxZoom: 12,
  license: "OGL-Canada-2.0",
  attribution: "NRCAN",
  sourceUrl: "https://open.canada.ca",
  lastUpdated: "2026-01-01T00:00:00.000Z",
  geometryHint: "line",
  sourceType: "pmtiles",
};

const MOCK_PROJECT_FEATURE = {
  type: "Feature" as const,
  geometry: { type: "Point" as const, coordinates: [-96.5, 45.2] },
  properties: { name: "Probe Test DC", layer: "projects", country: "US" },
};

const MOCK_PROJECTS: FeatureCollection = {
  type: "FeatureCollection",
  features: [MOCK_PROJECT_FEATURE],
};

describe("DataCenterMap PMTiles HEAD probe wiring", () => {
  beforeEach(() => {
    lastDcGeoJsonSource = undefined;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("http://localhost:3000/map"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method =
          init?.method ??
          (input instanceof Request ? input.method : "GET");

        if (url.includes("/api/v1/layer-manifest")) {
          return new Response(
            JSON.stringify({
              version: 1,
              generatedAt: "2026-01-01T00:00:00.000Z",
              layers: [PMTILES_LAYER],
            }),
          );
        }

        if (url.includes("/api/v1/map-data")) {
          const empty = { type: "FeatureCollection", features: [] };
          return new Response(
            JSON.stringify({
              layers: {
                projects: empty,
                facilities: empty,
                network: empty,
                power: empty,
              },
              counts: {
                projects: 1,
                facilities: 0,
                network: 0,
                power: 0,
                total: 1,
              },
            }),
          );
        }

        if (method === "HEAD" && url.includes(".pmtiles")) {
          return new Response(null, { status: 403 });
        }

        return new Response("{}");
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows error banner and does not mount infra PMTiles Source on HEAD 403", async () => {
    const DataCenterMap = (await import("../DataCenterMap")).default;

    render(
      createElement(DataCenterMap, {
        layerData: {
          projects: MOCK_PROJECTS,
          facilities: { type: "FeatureCollection", features: [] },
          network: { type: "FeatureCollection", features: [] },
          power: { type: "FeatureCollection", features: [] },
        },
        counts: {
          projects: 1,
          facilities: 0,
          network: 0,
          power: 0,
          total: 1,
        },
        initialInfraEnabled: { power: true },
      }),
    );

    const mapEl = screen.getByTestId("konative-map");
    expect(mapEl.getAttribute("data-map-style")).toBe(
      KONATIVE_MAP_CARTO_BASEMAP_STYLE,
    );
    expect(
      screen.getByTestId(`map-source-${KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID}`),
    ).toBeTruthy();
    expect(lastDcGeoJsonSource?.features.length).toBeGreaterThan(0);
    expect(lastDcGeoJsonSource?.features[0]?.properties?.name).toBe(
      "Probe Test DC",
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("pmtiles-infra-error-banner")).toBeTruthy();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/HTTP 403/)).toBeTruthy();
    expect(
      screen.queryByTestId(`map-source-infra-${PMTILES_LAYER_ID}`),
    ).toBeNull();
  });
});