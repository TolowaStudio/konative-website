import { beforeAll, describe, expect, it } from "vitest";
import { resolveCanonicalUrl } from "@/lib/seo/resolveCanonicalUrl";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
});

describe("canonical metadata (TS-4170)", () => {
  it("uses metadataBase https://konative.com in frontend layout", async () => {
    const { metadata: layoutMetadata } = await import(
      "@/app/(frontend)/layout"
    );
    expect(layoutMetadata.metadataBase?.toString()).toBe("https://konative.com/");
  });

  it("resolves absolute canonical URLs for / and /markets/*", async () => {
    const { metadata: layoutMetadata } = await import(
      "@/app/(frontend)/layout"
    );
    const base = layoutMetadata.metadataBase as URL;

    const { metadata: homeMetadata } = await import("@/app/(frontend)/page");
    expect(
      resolveCanonicalUrl(String(homeMetadata.alternates?.canonical), base),
    ).toBe("https://konative.com/");

    const { metadata: marketsIndexMetadata } = await import(
      "@/app/(frontend)/markets/page"
    );
    expect(
      resolveCanonicalUrl(
        String(marketsIndexMetadata.alternates?.canonical),
        base,
      ),
    ).toBe("https://konative.com/markets");

    const { generateMetadata } = await import(
      "@/app/(frontend)/markets/[state]/page"
    );
    const marketMeta = await generateMetadata({
      params: Promise.resolve({ state: "virginia" }),
    });
    expect(
      resolveCanonicalUrl(String(marketMeta.alternates?.canonical), base),
    ).toBe("https://konative.com/markets/virginia");
  });
});