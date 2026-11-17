import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queryTbcpAwards = vi.fn();
const isD1TbcpReady = vi.fn();
const supabaseFrom = vi.fn();

vi.mock("@/lib/supabase", () => ({ supabase: { from: (...a: unknown[]) => supabaseFrom(...a) } }));
vi.mock("@/lib/db", async () => {
  const fallback = await import("@/lib/db/supabaseFallback");
  class CloudflareBindingUnavailableError extends Error {}
  return {
    CloudflareBindingUnavailableError,
    queryTbcpAwards: (...a: unknown[]) => queryTbcpAwards(...a),
    isD1TbcpReady: () => isD1TbcpReady(),
    readWithSupabaseFallback: fallback.readWithSupabaseFallback,
    SupabaseFallbackDisabledError: fallback.SupabaseFallbackDisabledError,
  };
});

import { getTbcpSummary } from "../tbcp";

const ROWS = [
  { state: "AK", award_amount_usd: 1_000_000, nofo_round: "Round 1" },
  { state: "AZ", award_amount_usd: 2_000_000, nofo_round: "Round 2" },
];

describe("getTbcpSummary Supabase fallback (TOL-324)", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.invalid");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-test");
    supabaseFrom.mockReturnValue({
      select: async () => ({ data: ROWS, error: null }),
    });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    queryTbcpAwards.mockReset();
    isD1TbcpReady.mockReset();
    supabaseFrom.mockReset();
  });

  it("reads D1 and never calls Supabase when D1 has rows", async () => {
    isD1TbcpReady.mockResolvedValue(true);
    queryTbcpAwards.mockResolvedValue(ROWS);
    const summary = await getTbcpSummary();
    expect(summary?.totalAwards).toBe(2);
    expect(supabaseFrom).not.toHaveBeenCalled();
  });

  it("falls back to Supabase and says so when D1 is empty (default)", async () => {
    isD1TbcpReady.mockResolvedValue(false);
    const summary = await getTbcpSummary();
    expect(summary?.totalAwards).toBe(2);
    expect(supabaseFrom).toHaveBeenCalledWith("tbcp_awards");
    expect(console.error).toHaveBeenCalledWith(
      "Konative Supabase fallback",
      expect.objectContaining({ event: "supabase_fallback", site: "lib/data/tbcp" }),
    );
  });

  it("rejects instead of rendering an empty/Supabase section when the fallback is off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    isD1TbcpReady.mockResolvedValue(false);
    await expect(getTbcpSummary()).rejects.toMatchObject({
      name: "SupabaseFallbackDisabledError",
    });
    expect(supabaseFrom).not.toHaveBeenCalled();
  });
});
