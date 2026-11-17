import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  isD1QueueReady: vi.fn(),
  queryInterconnectionQueueRadius: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/lib/db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db")>()),
  isD1QueueReady: mocks.isD1QueueReady,
  queryInterconnectionQueueRadius: mocks.queryInterconnectionQueueRadius,
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: mocks.rpc }) }));

const row = {
  id: "q1", authority: "AESO", project_name: "P", capacity_mw: 100, resource_type: "solar",
  study_phase: "s", queue_date: "2026-01-01", expected_cod: null, poi_name: null,
  poi_lat: 51, poi_lng: -114, source_url: "u", last_updated: "2026-01-01", distance_km: 3,
};

const req = () => new NextRequest("http://localhost/api/v1/queue?lat=51&lng=-114&radius_km=50");

function fallbackLogs(spy: ReturnType<typeof vi.spyOn>, event: string) {
  return spy.mock.calls.map((c) => c[1] as Record<string, unknown>).filter((p) => p?.event === event);
}

async function loadGet() {
  vi.resetModules();
  const { GET } = await import("../route");
  return GET;
}

describe("GET /api/v1/queue Supabase fallback (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://sb.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.isD1QueueReady.mockReset().mockResolvedValue(true);
    mocks.queryInterconnectionQueueRadius.mockReset().mockResolvedValue([row]);
    mocks.rpc.mockReset().mockResolvedValue({ data: [row], error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  it("reads D1 when the queue table is populated: no Supabase call, no fallback log", async () => {
    const res = await (await loadGet())(req());
    expect((await res.json()).rows).toHaveLength(1);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(fallbackLogs(errorSpy, "supabase_fallback")).toHaveLength(0);
  });

  it("logs a supabase_fallback and reads Supabase when the D1 queue table is empty", async () => {
    mocks.isD1QueueReady.mockResolvedValue(false);
    const res = await (await loadGet())(req());
    expect((await res.json()).rows).toHaveLength(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(fallbackLogs(errorSpy, "supabase_fallback")[0]).toMatchObject({
      site: "api/v1/queue",
      fallbackDisabled: false,
    });
  });

  it("throws instead of reading Supabase when KONATIVE_SUPABASE_FALLBACK=off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    mocks.isD1QueueReady.mockResolvedValue(false);
    const GET = await loadGet();
    await expect(GET(req())).rejects.toMatchObject({ name: "SupabaseFallbackDisabledError", site: "api/v1/queue" });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("logs a supabase_fallback_error when the Supabase rpc fails", async () => {
    mocks.isD1QueueReady.mockResolvedValue(false);
    mocks.rpc.mockResolvedValue({ data: null, error: { message: "rpc down" } });
    const res = await (await loadGet())(req());
    expect(res.status).toBe(500);
    expect(fallbackLogs(errorSpy, "supabase_fallback_error")[0]).toMatchObject({
      site: "api/v1/queue",
      error: "rpc down",
    });
  });
});
