import { LEGACY_R2_TILES_CDN, TILE_PROXY_PATH } from "./constants";

/**
 * Build a pmtiles:// URL the MapLibre protocol handler can load (same-origin proxy).
 */
export function resolveTileUrl(tilesUrl: string, origin: string): string {
  const base = origin.replace(/\/$/, "");

  if (!tilesUrl || tilesUrl.trim() === "") {
    return "";
  }

  if (tilesUrl.startsWith(LEGACY_R2_TILES_CDN)) {
    const objectPath = tilesUrl.slice(LEGACY_R2_TILES_CDN.length);
    return `pmtiles://${base}${TILE_PROXY_PATH}${objectPath}`;
  }

  if (tilesUrl.startsWith("http://") || tilesUrl.startsWith("https://")) {
    return `pmtiles://${tilesUrl}`;
  }

  const path = tilesUrl.startsWith("/") ? tilesUrl : `/${tilesUrl}`;
  const proxyPath = path.startsWith("/tiles/")
    ? `${TILE_PROXY_PATH}${path.slice(1)}`
    : `${TILE_PROXY_PATH}${path.replace(/^\//, "")}`;

  return `pmtiles://${base}${proxyPath}`;
}

/** HEAD/GET URL for availability probes (non-pmtiles://). */
export function tileProxyHttpUrl(tilesUrl: string, origin: string): string | null {
  if (!tilesUrl || tilesUrl.trim() === "") return null;

  if (tilesUrl.startsWith(LEGACY_R2_TILES_CDN)) {
    const objectPath = tilesUrl.slice(LEGACY_R2_TILES_CDN.length);
    return `${origin.replace(/\/$/, "")}${TILE_PROXY_PATH}${objectPath}`;
  }

  if (tilesUrl.startsWith("http://") || tilesUrl.startsWith("https://")) {
    return tilesUrl;
  }

  const path = tilesUrl.startsWith("/") ? tilesUrl : `/${tilesUrl}`;
  if (path.startsWith("/tiles/v1/") && path.endsWith(".pmtiles")) {
    return `${origin.replace(/\/$/, "")}${TILE_PROXY_PATH}${path.slice(1)}`;
  }

  return null;
}