import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
});

describe("canonical metadata (TS-4170)", () => {
  it("sets canonical on homepage", async () => {
    const { metadata: homeMetadata } = await import("@/app/(frontend)/page");
    expect(homeMetadata.alternates?.canonical).toBe("/");
  });

  it("sets canonical on markets index", async () => {
    const { metadata: marketsIndexMetadata } = await import(
      "@/app/(frontend)/markets/page"
    );
    expect(marketsIndexMetadata.alternates?.canonical).toBe("/markets");
  });

  it("sets canonical on a sample market page", async () => {
    const { generateMetadata } = await import(
      "@/app/(frontend)/markets/[state]/page"
    );
    const meta = await generateMetadata({
      params: Promise.resolve({ state: "virginia" }),
    });
    expect(meta.alternates?.canonical).toBe("/markets/virginia");
  });
});