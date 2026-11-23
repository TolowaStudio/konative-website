/** User-visible copy for the /map PMTiles HEAD probe and error banner. */
export const PMTILES_ERROR_BANNER_HEADING = "Infrastructure overlay unavailable";

export function pmtilesProbeErrorFromHttpStatus(status: number): string {
  return `Layer unavailable (HTTP ${status})`;
}

export function pmtilesProbeNetworkErrorMessage(): string {
  return "Layer unavailable (network error)";
}