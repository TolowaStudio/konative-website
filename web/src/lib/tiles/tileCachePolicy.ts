/** Tile proxy cache headers — errors must not stick for 24h after Fleet restores GCS access. */
export function tileProxyCacheControl(upstreamStatus: number): string {
  if (upstreamStatus >= 200 && upstreamStatus < 300) {
    return "public, max-age=86400, stale-while-revalidate=3600";
  }
  return "no-store";
}