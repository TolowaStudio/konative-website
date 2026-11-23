import {
  pmtilesProbeErrorFromHttpStatus,
  pmtilesProbeNetworkErrorMessage,
} from "./pmtilesProbe";

export type PmtilesHeadProbeResult =
  | { ok: true }
  | { ok: false; message: string };

export async function runPmtilesHeadProbe(
  probeUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<PmtilesHeadProbeResult> {
  try {
    const res = await fetchImpl(probeUrl, { method: "HEAD" });
    if (res.ok) return { ok: true };
    return { ok: false, message: pmtilesProbeErrorFromHttpStatus(res.status) };
  } catch {
    return { ok: false, message: pmtilesProbeNetworkErrorMessage() };
  }
}

export function mergePmtilesHeadProbeResult(
  errors: Record<string, string>,
  layerId: string,
  result: PmtilesHeadProbeResult,
): Record<string, string> {
  if (result.ok) {
    if (!errors[layerId]) return errors;
    const next = { ...errors };
    delete next[layerId];
    return next;
  }
  return { ...errors, [layerId]: result.message };
}

/** Mirrors DataCenterMap PMTiles branch — no <Source> when probe reported an error. */
export function shouldMountPmtilesInfraSource(
  layerId: string,
  errors: Record<string, string>,
): boolean {
  return !errors[layerId];
}

export function pmtilesErrorBannerLayerIds(
  errors: Record<string, string>,
): string[] {
  return Object.keys(errors);
}