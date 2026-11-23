import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  fetchGcsObject: vi.fn(),
}));

vi.mock("@/lib/tiles/gcsObject", () => ({
  fetchGcsObject: mocks.fetchGcsObject,
}));

async function loadHandlers() {
  vi.resetModules();
  const mod = await import("../[...path]/route");
  return mod;
}

describe("/api/v1/tiles GCS proxy", () => {
  beforeEach(() => {
    mocks.fetchGcsObject.mockReset();
  });

  it("returns 400 for invalid paths (would 403 on legacy R2)", async () => {
    const { GET } = await loadHandlers();
    const req = new NextRequest("http://localhost/api/v1/tiles/evil/../../etc/passwd");
    const res = await GET(req, {
      params: Promise.resolve({ path: ["evil", "..", "..", "etc", "passwd"] }),
    });
    expect(res.status).toBe(400);
    expect(mocks.fetchGcsObject).not.toHaveBeenCalled();
  });

  it("proxies HEAD for a valid PMTiles key", async () => {
    mocks.fetchGcsObject.mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: {
          "Content-Length": "12345",
          "Accept-Ranges": "bytes",
        },
      }),
    );

    const { HEAD } = await loadHandlers();
    const req = new NextRequest(
      "http://localhost/api/v1/tiles/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      { method: "HEAD" },
    );
    const res = await HEAD(req, {
      params: Promise.resolve({
        path: ["tiles", "v1", "ca_nrcan_transmission_lines.pmtiles"],
      }),
    });

    expect(res.status).toBe(200);
    expect(mocks.fetchGcsObject).toHaveBeenCalledWith(
      "tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      expect.objectContaining({ method: "HEAD" }),
    );
  });

  it("proxies GET with Range and returns 206 with Content-Range", async () => {
    mocks.fetchGcsObject.mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 206,
        headers: {
          "Content-Range": "bytes 0-2/12345",
          "Content-Length": "3",
          "Accept-Ranges": "bytes",
        },
      }),
    );

    const { GET } = await loadHandlers();
    const req = new NextRequest(
      "http://localhost/api/v1/tiles/tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      {
        headers: { Range: "bytes=0-2" },
      },
    );
    const res = await GET(req, {
      params: Promise.resolve({
        path: ["tiles", "v1", "ca_nrcan_transmission_lines.pmtiles"],
      }),
    });

    expect(res.status).toBe(206);
    expect(res.headers.get("Content-Range")).toBe("bytes 0-2/12345");
    expect(mocks.fetchGcsObject).toHaveBeenCalledWith(
      "tiles/v1/ca_nrcan_transmission_lines.pmtiles",
      expect.objectContaining({ method: "GET", range: "bytes=0-2" }),
    );
  });
});