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

const d1Row = { id: "q1", capacity_mw: 100, poi_lat: 51, poi_lng: -114, distance_km: 10 };
const req = () => new NextRequest("http://localhost/api/v1/availability-score?lat=51&lng=-114");

function logs(spy: ReturnType<typeof vi.spyOn>, event: string) {
  return spy.mock.calls.map((c) => c[1] as Record<string, unknown>).filter((p) => p?.event === event);
}

describe("GET /api/v1/availability-score queue source (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://sb.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.isD1QueueReady.mockReset().mockResolvedValue(true);
    mocks.queryInterconnectionQueueRadius.mockReset().mockResolvedValue([d1Row]);
    mocks.rpc.mockReset().mockResolvedValue({ data: [d1Row], error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  async function get() {
    const { GET } = await import("../route");
    return GET(req());
  }

  it("reads the queue from D1 first: no Supabase rpc, no fallback log", async () => {
    const res = await get();
    expect(res.status).toBe(200);
    expect(mocks.queryInterconnectionQueueRadius).toHaveBeenCalledWith(51, -114, 50);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(logs(errorSpy, "supabase_fallback")).toHaveLength(0);
  });

  it("logs a supabase_fallback and uses the rpc when the D1 queue table is empty", async () => {
    mocks.isD1QueueReady.mockResolvedValue(false);
    await get();
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(logs(errorSpy, "supabase_fallback")[0]).toMatchObject({ site: "api/v1/availability-score" });
  });

  it("an unreachable primary store still degrades to the fallback, visibly, by default", async () => {
    const { DatabaseUnavailableError } = await import("@/lib/db");
    mocks.isD1QueueReady.mockRejectedValue(new DatabaseUnavailableError("no DATABASE_URI"));
    const res = await get();
    expect(res.status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(logs(errorSpy, "supabase_fallback")[0]).toMatchObject({
      reason: expect.stringContaining("no DATABASE_URI"),
    });
  });

  it("throws instead of reading Supabase when KONATIVE_SUPABASE_FALLBACK=off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    mocks.isD1QueueReady.mockResolvedValue(false);
    await expect(get()).rejects.toMatchObject({ name: "SupabaseFallbackDisabledError" });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("logs a supabase_fallback_error instead of a silent all-zero queue when the rpc fails", async () => {
    mocks.isD1QueueReady.mockResolvedValue(false);
    mocks.rpc.mockResolvedValue({ data: null, error: { message: "rpc down" } });
    const res = await get();
    expect(res.status).toBe(200);
    expect(logs(errorSpy, "supabase_fallback_error")[0]).toMatchObject({
      site: "api/v1/availability-score",
      error: "rpc down",
    });
  });
});
