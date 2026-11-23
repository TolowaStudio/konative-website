import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_OG_IMAGE_PATH } from "@/lib/seo/siteOpenGraph";

const webRoot = process.cwd();

describe("campaign-ready public surface (TS-4169)", () => {
  it("serves a canonical og-image asset at /og-image.png", () => {
    const file = resolve(webRoot, "public", SITE_OG_IMAGE_PATH.replace(/^\//, ""));
    expect(existsSync(file)).toBe(true);
  });

  it("uses Tolowa Pacific LLC in the footer legal line", () => {
    const footer = readFileSync(resolve(webRoot, "src/components/Footer.tsx"), "utf8");
    expect(footer).toContain("Tolowa Pacific LLC");
    expect(footer).not.toMatch(/Total Pacific LLC/);
  });

  it("defines /privacy and /terms pages", () => {
    expect(existsSync(resolve(webRoot, "src/app/(frontend)/privacy/page.tsx"))).toBe(true);
    expect(existsSync(resolve(webRoot, "src/app/(frontend)/terms/page.tsx"))).toBe(true);
  });

  it("sets og:image on key campaign routes", () => {
    for (const path of [
      "src/app/(frontend)/page.tsx",
      "src/app/(frontend)/about/page.tsx",
      "src/app/(frontend)/data-center-connectivity/page.tsx",
      "src/app/(frontend)/contact/layout.tsx",
      "src/app/(frontend)/call/page.tsx",
    ]) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).toMatch(/siteOpenGraphImage\(\)/);
    }
  });

  it("describes international as global brokerage on homepage and data-center lane", () => {
    const homepage = readFileSync(resolve(webRoot, "src/app/(frontend)/HomePage.tsx"), "utf8");
    const dc = readFileSync(resolve(webRoot, "src/app/(frontend)/data-center-connectivity/page.tsx"), "utf8");
    expect(homepage).toMatch(/domestic and international, any market/i);
    expect(dc).toMatch(/Native American–owned, vendor-neutral/i);
    expect(dc).toMatch(/domestic and international/i);
    expect(dc).not.toMatch(/(?:NMSDC|SBA 8\(a\)).*certified|certified.*(?:NMSDC|SBA 8\(a\))/i);
  });
});