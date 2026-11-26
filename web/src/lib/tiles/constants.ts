/** Private GCS bucket — served only via /api/v1/tiles (Cloud Run ADC). */
export const DEFAULT_GCS_TILES_BUCKET = "konative-tiles";

export const TILES_OBJECT_PREFIX = "tiles/v1";

/** Legacy R2 public host (retired TOL-316). Manifests may still reference until rewritten. */
export const LEGACY_R2_TILES_CDN =
  "https://pub-70584c42a8ad4fb1a38f5273a1665067.r2.dev/";

export const TILE_PROXY_PATH = "/api/v1/tiles/";

/** Layers with no PMTiles wiring — hidden from /map until ETL ships tiles. */
export const MAP_HIDDEN_LAYER_IDS = new Set([
  "politics_governors",
  "politics_stalled_projects",
  "politics_tribal_projects",
  "vi-water",
  "vi-power",
  "vi-fiber",
  "vi-broadband",
]);