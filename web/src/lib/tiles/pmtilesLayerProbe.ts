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

/** Mirrors DataCenterMap PMTiles branch — no <Source> while probing or after error. */
export function shouldMountPmtilesInfraSource(
  layerId: string,
  errors: Record<string, string>,
  pendingLayerIds?: ReadonlySet<string>,
): boolean {
  if (pendingLayerIds?.has(layerId)) return false;
  return !errors[layerId];
}

export function clearPmtilesErrorsForLayerIds(
  errors: Record<string, string>,
  layerIds: Iterable<string>,
): Record<string, string> {
  let changed = false;
  const next = { ...errors };
  for (const id of layerIds) {
    if (next[id]) {
      delete next[id];
      changed = true;
    }
  }
  return changed ? next : errors;
}

export function pmtilesErrorBannerLayerIds(
  errors: Record<string, string>,
): string[] {
  return Object.keys(errors);
}