import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  querySponsorshipPlacements: vi.fn(),
  isD1SponsorshipReady: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/lib/db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db")>()),
  querySponsorshipPlacements: mocks.querySponsorshipPlacements,
  isD1SponsorshipReady: mocks.isD1SponsorshipReady,
}));
vi.mock("@/lib/supabase", () => ({ supabase: { from: mocks.from } }));

function supabaseReturns(result: unknown) {
  const b: unknown = new Proxy(
    {},
    { get: (_t, p) => (p === "then" ? (r: (v: unknown) => void) => r(result) : () => b) },
  );
  mocks.from.mockReturnValue(b);
}

const req = () => new NextRequest("http://localhost/api/v1/analytics/sponsors?sponsor_name=zzz");

function fallbackLogs(spy: ReturnType<typeof vi.spyOn>) {
  return spy.mock.calls.map((c) => c[1] as Record<string, unknown>).filter((p) => p?.event === "supabase_fallback");
}

describe("GET /api/v1/analytics/sponsors Supabase fallback (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.querySponsorshipPlacements.mockReset().mockResolvedValue([]);
    mocks.isD1SponsorshipReady.mockReset().mockResolvedValue(true);
    mocks.from.mockReset();
    supabaseReturns({ data: [{ id: "sb", impressions: 10, clicks: 1 }], error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  async function get() {
    const { GET } = await import("../route");
    return GET(req());
  }

  it("an empty filtered result is the answer when D1 has rows: no Supabase read, no log", async () => {
    expect((await (await get()).json()).placements).toEqual([]);
    expect(mocks.from).not.toHaveBeenCalled();
    expect(fallbackLogs(errorSpy)).toHaveLength(0);
  });

  it("logs a supabase_fallback and reads Supabase when the D1 sponsorship table is empty", async () => {
    mocks.isD1SponsorshipReady.mockResolvedValue(false);
    expect((await (await get()).json()).placements).toHaveLength(1);
    expect(fallbackLogs(errorSpy)[0]).toMatchObject({ site: "api/v1/analytics/sponsors" });
  });

  it("throws instead of reading Supabase when KONATIVE_SUPABASE_FALLBACK=off and D1 is empty", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    mocks.isD1SponsorshipReady.mockResolvedValue(false);
    await expect(get()).rejects.toMatchObject({ name: "SupabaseFallbackDisabledError" });
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
