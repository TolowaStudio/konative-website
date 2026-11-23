import { TILES_OBJECT_PREFIX } from "./constants";

const PMTILES_NAME = /^[a-z0-9_]+\.pmtiles$/i;

/**
 * Normalize the catch-all path segments to a GCS object key under tiles/v1/.
 * Rejects traversal and unexpected shapes before any upstream fetch.
 */
export function toGcsObjectKey(pathSegments: string[]): string | null {
  if (pathSegments.length === 0) return null;

  const joined = pathSegments.join("/").replace(/\\/g, "/");
  if (joined.includes("..")) return null;

  if (pathSegments.length === 2 && pathSegments[0] === "tiles" && pathSegments[1] === "v1") {
    return null;
  }

  if (
    pathSegments.length >= 3 &&
    pathSegments[0] === "tiles" &&
    pathSegments[1] === "v1"
  ) {
    const filename = pathSegments[pathSegments.length - 1] ?? "";
    if (!PMTILES_NAME.test(filename)) return null;
    return joined;
  }

  if (pathSegments.length === 1 && PMTILES_NAME.test(pathSegments[0]!)) {
    return `${TILES_OBJECT_PREFIX}/${pathSegments[0]}`;
  }

  return null;
}