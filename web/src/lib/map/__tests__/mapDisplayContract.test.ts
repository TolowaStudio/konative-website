import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  KONATIVE_MAP_CARTO_BASEMAP_STYLE,
  KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID,
} from "../mapDisplayContract";

describe("/map display contract", () => {
  it("exposes Carto basemap and project-points source ids", () => {
    expect(KONATIVE_MAP_CARTO_BASEMAP_STYLE).toContain("cartocdn.com");
    expect(KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID).toBe("dc");
  });

  it("wires DataCenterMap to basemap style and project Source", () => {
    const mapComponentPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../../components/DataCenterMap.tsx",
    );
    const src = readFileSync(mapComponentPath, "utf8");
    expect(src).toContain("KONATIVE_MAP_CARTO_BASEMAP_STYLE");
    expect(src).toContain("KONATIVE_MAP_PROJECTS_GEOJSON_SOURCE_ID");
    expect(src).toContain("mapStyle={KONATIVE_MAP_CARTO_BASEMAP_STYLE}");
  });
});