import type { LayerManifest, LayerManifestEntry } from "@/types/map-layers";
import { LEGACY_R2_TILES_CDN, MAP_HIDDEN_LAYER_IDS } from "./constants";

const R2_PREFIX = LEGACY_R2_TILES_CDN;

/** Same-origin proxy paths — object keys stay `tiles/v1/*.pmtiles` in GCS. */
export function normalizeManifestTilesUrl(tilesUrl: string): string {
  if (!tilesUrl) return "";
  if (tilesUrl.startsWith(R2_PREFIX)) {
    const key = tilesUrl.slice(R2_PREFIX.length);
    return key.startsWith("tiles/") ? `/${key}` : `/tiles/v1/${key}`;
  }
  if (tilesUrl.startsWith("http://") || tilesUrl.startsWith("https://")) {
    try {
      const u = new URL(tilesUrl);
      const idx = u.pathname.indexOf("/tiles/v1/");
      if (idx >= 0) return u.pathname.slice(idx);
    } catch {
      /* keep original */
    }
  }
  return tilesUrl.startsWith("/") ? tilesUrl : `/${tilesUrl}`;
}

export function isLayerVisibleOnMap(layer: LayerManifestEntry): boolean {
  if (MAP_HIDDEN_LAYER_IDS.has(layer.id)) return false;

  const sourceType = layer.sourceType ?? "pmtiles";
  if (sourceType === "pmtiles") {
    return Boolean(layer.tilesUrl?.trim());
  }

  return true;
}

export function mergeLayerManifests(manifests: LayerManifest[]): LayerManifest {
  const seen = new Set<string>();
  const layers: LayerManifestEntry[] = [];

  for (const m of manifests) {
    for (const layer of m.layers ?? []) {
      if (seen.has(layer.id)) continue;
      if (!isLayerVisibleOnMap(layer)) continue;

      seen.add(layer.id);
      layers.push({
        ...layer,
        tilesUrl: normalizeManifestTilesUrl(layer.tilesUrl),
      });
    }
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    layers,
  };
}