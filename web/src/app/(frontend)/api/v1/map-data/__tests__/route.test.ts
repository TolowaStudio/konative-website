import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  queryDcFacilitiesMap: vi.fn(),
  queryNetworkFacilitiesMap: vi.fn(),
  queryGenerationPipelineMap: vi.fn(),
  supabaseFrom: vi.fn(),
}));

vi.mock("@/lib/db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db")>()),
  queryDcFacilitiesMap: mocks.queryDcFacilitiesMap,
  queryNetworkFacilitiesMap: mocks.queryNetworkFacilitiesMap,
  queryGenerationPipelineMap: mocks.queryGenerationPipelineMap,
}));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch: vi.fn().mockResolvedValue([]) }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: mocks.supabaseFrom }) }));

/** Awaitable query builder: any chained method returns the builder itself. */
function builder(result: unknown) {
  const b: unknown = new Proxy(
    {},
    {
      get: (_t, prop) =>
        prop === "then" ? (resolve: (v: unknown) => void) => resolve(result) : () => b,
    },
  );
  return b;
}

const d1Facility = {
  id: "f1", name: "D1 DC", operator: "op", city: "c", state: "WA", country: "US",
  status: "operational", capacity_mw: 10, facility_type: "colo", source: "im3", source_url: null,
  lng: -120, lat: 47,
};
const d1Network = {
  pdb_id: 1, name: "D1 Net", org_name: "o", city: "c", state: "WA", country: "US",
  net_count: 1, ix_count: 1, carrier_count: 1, status: "ok", lng: -120, lat: 47,
};
const d1Power = {
  plant_id: "p1", plant_name: "D1 Plant", utility_name: "u", state: "WA", county: "k",
  technology: "solar", capacity_mw: 5, planned_year: 2027, status_code: "P",
  balancing_authority: "BA", lng: -120, lat: 47,
};

function fallbackLogs(spy: ReturnType<typeof vi.spyOn>, event: string) {
  return spy.mock.calls.map((c) => c[1] as Record<string, unknown>).filter((p) => p?.event === event);
}

async function loadGet() {
  vi.resetModules();
  const { GET } = await import("../route");
  return GET;
}

describe("GET /api/v1/map-data Supabase fallbacks (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.queryDcFacilitiesMap.mockReset().mockResolvedValue([d1Facility]);
    mocks.queryNetworkFacilitiesMap.mockReset().mockResolvedValue([d1Network]);
    mocks.queryGenerationPipelineMap.mockReset().mockResolvedValue([d1Power]);
    mocks.supabaseFrom.mockReset().mockImplementation(() => builder({ data: [], error: null }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  it("serves all three layers from D1 without touching Supabase or logging a fallback", async () => {
    const res = await (await loadGet())();
    const body = await res.json();
    expect(body.counts.facilities).toBe(1);
    expect(body.counts.network).toBe(1);
    expect(body.counts.power).toBe(1);
    expect(mocks.supabaseFrom).not.toHaveBeenCalled();
    expect(fallbackLogs(errorSpy, "supabase_fallback")).toHaveLength(0);
  });

  it.each([
    ["facilities", "queryDcFacilitiesMap", "dc_facilities_map"],
    ["network", "queryNetworkFacilitiesMap", "network_facilities_map"],
    ["power", "queryGenerationPipelineMap", "generation_pipeline_map"],
  ] as const)("logs a supabase_fallback for the %s layer when D1 is empty", async (layer, query, table) => {
    mocks[query].mockResolvedValue([]);
    const res = await (await loadGet())();
    expect(res.status).toBe(200);
    expect(mocks.supabaseFrom).toHaveBeenCalledWith(table);
    const logs = fallbackLogs(errorSpy, "supabase_fallback");
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ site: `api/v1/map-data:${layer}`, fallbackDisabled: false });
  });

  it.each([
    ["facilities", "queryDcFacilitiesMap"],
    ["network", "queryNetworkFacilitiesMap"],
    ["power", "queryGenerationPipelineMap"],
  ] as const)(
    "throws instead of reading Supabase for the %s layer when KONATIVE_SUPABASE_FALLBACK=off",
    async (layer, query) => {
      vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
      mocks[query].mockResolvedValue([]);
      const GET = await loadGet();
      await expect(GET()).rejects.toMatchObject({
        name: "SupabaseFallbackDisabledError",
        site: `api/v1/map-data:${layer}`,
      });
      expect(mocks.supabaseFrom).not.toHaveBeenCalled();
    },
  );

  it("logs a supabase_fallback_error instead of silently returning an empty layer", async () => {
    mocks.queryDcFacilitiesMap.mockResolvedValue([]);
    mocks.supabaseFrom.mockImplementation(() => builder({ data: null, error: { message: "boom" } }));
    const res = await (await loadGet())();
    expect(res.status).toBe(200);
    const errors = fallbackLogs(errorSpy, "supabase_fallback_error");
    expect(errors.map((e) => e.site)).toContain("api/v1/map-data:facilities");
  });
});
