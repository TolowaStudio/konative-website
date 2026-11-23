import { describe, expect, it } from "vitest";
import { toGcsObjectKey } from "../proxyPath";

describe("toGcsObjectKey", () => {
  it("accepts tiles/v1/*.pmtiles paths from the proxy", () => {
    expect(
      toGcsObjectKey([
        "tiles",
        "v1",
        "ca_nrcan_transmission_lines.pmtiles",
      ]),
    ).toBe("tiles/v1/ca_nrcan_transmission_lines.pmtiles");
  });

  it("rejects traversal", () => {
    expect(toGcsObjectKey(["tiles", "v1", "..", "secret.pmtiles"])).toBeNull();
  });
});