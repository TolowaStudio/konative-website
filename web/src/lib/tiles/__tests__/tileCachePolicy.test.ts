import { describe, expect, it } from "vitest";
import { tileProxyCacheControl } from "../tileCachePolicy";

describe("tileProxyCacheControl", () => {
  it("caches successful tile responses", () => {
    expect(tileProxyCacheControl(200)).toContain("max-age=86400");
    expect(tileProxyCacheControl(206)).toContain("max-age=86400");
  });

  it("does not cache 403 responses", () => {
    expect(tileProxyCacheControl(403)).toBe("no-store");
  });
});