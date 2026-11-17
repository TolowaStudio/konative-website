import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  queryActiveSponsorshipPlacement: vi.fn(),
  isD1SponsorshipReady: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/lib/db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db")>()),
  queryActiveSponsorshipPlacement: mocks.queryActiveSponsorshipPlacement,
  isD1SponsorshipReady: mocks.isD1SponsorshipReady,
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: mocks.from }) }));

const sbRow = { id: "sb", sponsor_name: "SB Sponsor", placement_type: "banner" };

function supabaseReturns(result: unknown) {
  const b: unknown = new Proxy(
    {},
    { get: (_t, p) => (p === "then" ? (r: (v: unknown) => void) => r(result) : () => b) },
  );
  mocks.from.mockReturnValue(b);
}

const req = () => new NextRequest("http://localhost/api/v1/sponsors/placement?variant=banner");

function fallbackLogs(spy: ReturnType<typeof vi.spyOn>, event: string) {
  return spy.mock.calls.map((c) => c[1] as Record<string, unknown>).filter((p) => p?.event === event);
}

describe("GET /api/v1/sponsors/placement Supabase fallback (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://sb.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.queryActiveSponsorshipPlacement.mockReset().mockResolvedValue(null);
    mocks.isD1SponsorshipReady.mockReset().mockResolvedValue(true);
    mocks.from.mockReset();
    supabaseReturns({ data: [sbRow], error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  async function get() {
    const { GET } = await import("../route");
    return GET(req());
  }

  it("returns the D1 placement without touching Supabase", async () => {
    mocks.queryActiveSponsorshipPlacement.mockResolvedValue({ id: "d1", sponsor_name: "D1", placement_type: "banner" });
    expect((await (await get()).json()).placement.id).toBe("d1");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("treats 'no active sponsor' as the answer when D1 has rows: no Supabase read, no fallback log", async () => {
    const body = await (await get()).json();
    expect(body.placement).toBeNull();
    expect(mocks.from).not.toHaveBeenCalled();
    expect(fallbackLogs(errorSpy, "supabase_fallback")).toHaveLength(0);
  });

  it("logs a supabase_fallback and reads Supabase when the D1 sponsorship table is empty", async () => {
    mocks.isD1SponsorshipReady.mockResolvedValue(false);
    expect((await (await get()).json()).placement.id).toBe("sb");
    expect(fallbackLogs(errorSpy, "supabase_fallback")[0]).toMatchObject({ site: "api/v1/sponsors/placement" });
  });

  it("throws instead of reading Supabase when KONATIVE_SUPABASE_FALLBACK=off and D1 is empty", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    mocks.isD1SponsorshipReady.mockResolvedValue(false);
    await expect(get()).rejects.toMatchObject({ name: "SupabaseFallbackDisabledError" });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("does not throw for a legitimately empty sponsor slot when the fallback is off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    const res = await get();
    expect(res.status).toBe(200);
    expect((await res.json()).placement).toBeNull();
  });

  it("logs a supabase_fallback_error when the Supabase read fails", async () => {
    mocks.isD1SponsorshipReady.mockResolvedValue(false);
    supabaseReturns({ data: null, error: { message: "sb down" } });
    expect((await (await get()).json()).placement).toBeNull();
    expect(fallbackLogs(errorSpy, "supabase_fallback_error")[0]).toMatchObject({
      site: "api/v1/sponsors/placement",
      error: "sb down",
    });
  });
});
