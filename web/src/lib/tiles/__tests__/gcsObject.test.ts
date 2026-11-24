import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  getAccessToken: vi.fn(async () => ({ token: "test-token" })),
}));

vi.mock("google-auth-library", () => ({
  GoogleAuth: class MockGoogleAuth {
    getClient = vi.fn(async () => ({
      getAccessToken: authMocks.getAccessToken,
    }));
  },
}));

describe("gcsXmlObjectUrl / fetchGcsObject", () => {
  beforeEach(() => {
    authMocks.getAccessToken.mockClear();
    vi.unstubAllGlobals();
  });

  it("uses the GCS XML API (not JSON ?alt=media) and forwards Range", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 206 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.resetModules();
    const { fetchGcsObject, gcsXmlObjectUrl } = await import("../gcsObject");

    expect(
      gcsXmlObjectUrl("konative-tiles", "tiles/v1/ca_nrcan_transmission_lines.pmtiles"),
    ).toBe(
      "https://storage.googleapis.com/konative-tiles/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
    );
    expect(gcsXmlObjectUrl("konative-tiles", "tiles/v1/x.pmtiles")).not.toContain(
      "storage/v1/b/",
    );

    process.env.GCS_TILES_BUCKET = "konative-tiles";
    await fetchGcsObject("tiles/v1/sample.pmtiles", {
      method: "GET",
      range: "bytes=0-99",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.googleapis.com/konative-tiles/tiles/v1/sample.pmtiles",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          Range: "bytes=0-99",
        }),
      }),
    );
  });
});