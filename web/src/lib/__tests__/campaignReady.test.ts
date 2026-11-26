import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DATA_CENTER_OFFER, TRIBAL_OFFER } from "@/content/offers";
import { bookingUrl } from "@/lib/booking";
import { SITE_OG_IMAGE_PATH } from "@/lib/seo/siteOpenGraph";

const webRoot = process.cwd();
const CAL_URL = "https://cal.com/jeramey-james?utm_source=konative.com";

const CANONICAL_ROUTE_FILES: Array<{ path: string; canonical: string }> = [
  { path: "src/app/(frontend)/page.tsx", canonical: "/" },
  { path: "src/app/(frontend)/about/page.tsx", canonical: "/about" },
  {
    path: "src/app/(frontend)/data-center-connectivity/page.tsx",
    canonical: "/data-center-connectivity",
  },
  { path: "src/app/(frontend)/contact/layout.tsx", canonical: "/contact" },
  { path: "src/app/(frontend)/call/page.tsx", canonical: "/call" },
];

const GLOBAL_COPY_SURFACES = [
  "src/app/(frontend)/HomePage.tsx",
  "src/app/(frontend)/data-center-connectivity/page.tsx",
  "src/app/(frontend)/news/page.tsx",
  "public/llms.txt",
  "public/llms-full.txt",
] as const;

function walkSourceFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkSourceFiles(full, files);
    } else if (/\.(tsx|ts|jsx|js|mdx)$/.test(entry) && !full.includes("__tests__")) {
      files.push(full);
    }
  }
  return files;
}

function pngDimensions(filePath: string): { width: number; height: number } {
  const buf = readFileSync(filePath);
  expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

describe("campaign-ready public surface (TS-4169)", () => {
  it("serves a canonical og-image asset at /og-image.png", () => {
    const file = resolve(webRoot, "public", SITE_OG_IMAGE_PATH.replace(/^\//, ""));
    expect(existsSync(file)).toBe(true);
    const { width, height } = pngDimensions(file);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });

  it("uses Tolowa Pacific LLC in the footer legal line", () => {
    const footer = readFileSync(resolve(webRoot, "src/components/Footer.tsx"), "utf8");
    expect(footer).toContain("Tolowa Pacific LLC");
    expect(footer).not.toMatch(/Total Pacific LLC/);
  });

  it("does not link to the removed /#team anchor anywhere under src/", () => {
    const srcRoot = resolve(webRoot, "src");
    const files = walkSourceFiles(srcRoot);
    for (const file of files) {
      const contents = readFileSync(file, "utf8");
      expect(contents, file).not.toMatch(/\/#team/);
    }
  });

  it("defines /privacy and /terms as publishable app routes (not redirects)", () => {
    for (const segment of ["privacy", "terms"] as const) {
      const pagePath = resolve(webRoot, `src/app/(frontend)/${segment}/page.tsx`);
      expect(existsSync(pagePath)).toBe(true);
      const contents = readFileSync(pagePath, "utf8");
      expect(contents).toMatch(/export default function/);
      expect(contents).not.toMatch(/\bnotFound\s*\(/);
      expect(contents).not.toMatch(/\bredirect\s*\(/);
    }
  });

  it("sets alternates.canonical on each key campaign route", () => {
    for (const { path, canonical } of CANONICAL_ROUTE_FILES) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).toMatch(
        new RegExp(`alternates:\\s*\\{\\s*canonical:\\s*["']${canonical.replace("/", "\\/")}["']`),
      );
    }
  });

  it("sets og:image on key campaign routes", () => {
    for (const { path } of CANONICAL_ROUTE_FILES) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).toMatch(/siteOpenGraphImage\(\)/);
    }
  });

  it("keeps /contact og:image on the layout (client page must not export metadata)", () => {
    const layout = readFileSync(
      resolve(webRoot, "src/app/(frontend)/contact/layout.tsx"),
      "utf8",
    );
    const page = readFileSync(resolve(webRoot, "src/app/(frontend)/contact/page.tsx"), "utf8");
    expect(layout).toMatch(/siteOpenGraphImage\(\)/);
    expect(page).toMatch(/^"use client"/m);
    expect(page).not.toMatch(/export const metadata/);
  });

  it("uses the one canonical Cal.com booking link with UTMs on every surface", () => {
    for (const path of ["public/llms.txt", "public/llms-full.txt"]) {
      expect(readFileSync(resolve(webRoot, path), "utf8"), path).toContain(CAL_URL);
    }
    for (const path of [
      "src/components/Footer.tsx",
      "src/app/(frontend)/call/page.tsx",
      "src/app/(frontend)/contact/page.tsx",
    ]) {
      expect(readFileSync(resolve(webRoot, path), "utf8"), path).toContain("bookingUrl(");
    }
    expect(bookingUrl("footer")).toBe(
      "https://cal.com/jeramey-james?utm_source=konative.com&utm_medium=site&utm_campaign=booking&utm_content=footer",
    );
  });

  it("has no hard-coded booking URL in any source file (.ts or .tsx)", () => {
    const offenders = walkSourceFiles(resolve(webRoot, "src"))
      .filter((f) => !f.endsWith(join("lib", "booking.ts")))
      .filter((f) =>
        readFileSync(f, "utf8")
          .split("\n")
          .some(
            (l) =>
              !/^\s*(\*|\/\/|\/\*)/.test(l) &&
              /cal\.com\/jeramey-james/.test(l) &&
              !/>cal\.com\/jeramey-james</.test(l),
          ),
      );
    expect(offenders).toEqual([]);
  });

  it("uses one offer name per lane from content/offers.ts", () => {
    const read = (p: string) => readFileSync(resolve(webRoot, p), "utf8");
    const tribal = read("src/app/(frontend)/tribal/page.tsx");
    const dc = read("src/app/(frontend)/data-center-connectivity/page.tsx");
    const home = read("src/content/homeConnectivity.ts");
    expect(TRIBAL_OFFER).toBe("Continuity Snapshot");
    expect(DATA_CENTER_OFFER).toBe("One-Page Site Brief");
    expect(tribal).toContain("TRIBAL_OFFER");
    expect(dc).toContain("DATA_CENTER_OFFER");
    expect(home).toContain("DATA_CENTER_OFFER");
    for (const c of [tribal, dc, home]) {
      expect(c).not.toMatch(/Get a Site Brief|Continuity Brief|Connectivity Snapshot/i);
    }
  });

  it("describes international as global brokerage on public copy surfaces", () => {
    for (const path of GLOBAL_COPY_SURFACES) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).toMatch(/domestic and international/i);
      expect(contents, path).not.toMatch(/across the US and Canada/i);
    }

    const dc = readFileSync(
      resolve(webRoot, "src/app/(frontend)/data-center-connectivity/page.tsx"),
      "utf8",
    );
    expect(dc).toMatch(/Native-owned, vendor-neutral/i);
    expect(dc).toMatch(/domestic and international/i);
    expect(dc).toMatch(/any connectivity package/i);
    expect(dc).toMatch(
      /No SBA 8\(a\), NMSDC, or other certification claims beyond ownership/i,
    );
    expect(dc).not.toMatch(/(?:NMSDC|SBA 8\(a\)).*certified|certified.*(?:NMSDC|SBA 8\(a\))/i);
  });
});
describe("TS-4371 site fixes", () => {
  it("lists /privacy and /terms in the sitemap", () => {
    const src = readFileSync(resolve(webRoot, "src/app/sitemap.ts"), "utf8");
    expect(src).toContain("${BASE}/privacy");
    expect(src).toContain("${BASE}/terms");
  });

  it("uses 'Native-owned' only (G9) and no leftover jargon", () => {
    for (const path of [
      "src/app/(frontend)/HomePage.tsx",
      "src/app/(frontend)/data-center-connectivity/page.tsx",
      "src/app/(frontend)/connectivity/page.tsx",
    ]) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).not.toMatch(/Indigenous-owned|Native American[–-]owned|certified Avant/i);
    }
    expect(readFileSync(resolve(webRoot, "src/components/forms/ContactHoneypot.tsx"), "utf8")).not.toMatch(/Mesh ledger/i);
  });
});
