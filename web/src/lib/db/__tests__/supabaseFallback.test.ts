import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  readWithSupabaseFallback,
  SupabaseFallbackDisabledError,
  isSupabaseFallbackDisabled,
} from "../supabaseFallback";

describe("readWithSupabaseFallback (TOL-324)", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errorSpy.mockRestore();
  });

  it("returns primary rows and never touches Supabase or the log", async () => {
    const supabase = vi.fn(async () => [{ id: "sb" }]);
    const rows = await readWithSupabaseFallback("t", async () => [{ id: "d1" }], supabase);
    expect(rows).toEqual([{ id: "d1" }]);
    expect(supabase).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs a structured supabase_fallback event when it falls back", async () => {
    const rows = await readWithSupabaseFallback(
      "tribal/index",
      async () => [],
      async () => [{ id: "sb" }],
    );
    expect(rows).toEqual([{ id: "sb" }]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][1]).toMatchObject({
      event: "supabase_fallback",
      site: "tribal/index",
      fallbackDisabled: false,
    });
  });

  it("treats null and undefined primary results as a miss too", async () => {
    expect(await readWithSupabaseFallback("a", async () => null, async () => "sb")).toBe("sb");
    expect(await readWithSupabaseFallback("b", async () => undefined, async () => "sb")).toBe("sb");
  });

  it("throws instead of reading Supabase when KONATIVE_SUPABASE_FALLBACK=off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    const supabase = vi.fn(async () => [{ id: "sb" }]);
    await expect(
      readWithSupabaseFallback("tribal/awards", async () => [], supabase),
    ).rejects.toBeInstanceOf(SupabaseFallbackDisabledError);
    expect(supabase).not.toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][1]).toMatchObject({ fallbackDisabled: true });
  });

  it("still returns primary rows when the fallback is off", async () => {
    vi.stubEnv("KONATIVE_SUPABASE_FALLBACK", "off");
    expect(await readWithSupabaseFallback("t", async () => [1], async () => [2])).toEqual([1]);
  });

  it("does not swallow a primary error as an empty table", async () => {
    const supabase = vi.fn(async () => [{ id: "sb" }]);
    await expect(
      readWithSupabaseFallback(
        "t",
        async () => {
          throw new Error("D1 binding gone");
        },
        supabase,
      ),
    ).rejects.toThrow("D1 binding gone");
    expect(supabase).not.toHaveBeenCalled();
  });

  it("only the literal value 'off' disables the fallback", () => {
    expect(isSupabaseFallbackDisabled({ KONATIVE_SUPABASE_FALLBACK: "OFF " })).toBe(true);
    expect(isSupabaseFallbackDisabled({ KONATIVE_SUPABASE_FALLBACK: "on" })).toBe(false);
    expect(isSupabaseFallbackDisabled({})).toBe(false);
  });
});
