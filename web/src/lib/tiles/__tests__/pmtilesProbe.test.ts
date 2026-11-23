import { describe, expect, it } from "vitest";
import {
  PMTILES_ERROR_BANNER_HEADING,
  pmtilesProbeErrorFromHttpStatus,
  pmtilesProbeNetworkErrorMessage,
} from "../pmtilesProbe";

describe("pmtilesProbe copy", () => {
  it("formats HTTP probe failures for the map error banner", () => {
    expect(pmtilesProbeErrorFromHttpStatus(403)).toBe(
      "Layer unavailable (HTTP 403)",
    );
    expect(PMTILES_ERROR_BANNER_HEADING).toBe(
      "Infrastructure overlay unavailable",
    );
  });

  it("formats network probe failures for the map error banner", () => {
    expect(pmtilesProbeNetworkErrorMessage()).toBe(
      "Layer unavailable (network error)",
    );
  });
});