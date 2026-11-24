import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  DISPATCH_PUBLICLY_VISIBLE,
  DISPATCH_REDIRECTS,
  hrefIsDispatchPublicPath,
} from "@/lib/dispatchVisibility";
import {
  collectFooterIntelligenceHrefs,
  collectHeaderNavHrefs,
} from "@/lib/siteNavigation";

describe("Dispatch hidden from public site (TS-4181)", () => {
  it("DISPATCH_PUBLICLY_VISIBLE is false — re-enable only when cadence resumes", () => {
    expect(DISPATCH_PUBLICLY_VISIBLE).toBe(false);
  });

  it("fails when Dispatch is re-added to public nav", () => {
    expect(collectHeaderNavHrefs()).not.toContain("/dispatch");
    expect(collectFooterIntelligenceHrefs()).not.toContain("/dispatch");
  });

  it("redirects /dispatch and /dispatch/* to data-center-connectivity", () => {
    expect(DISPATCH_REDIRECTS).toEqual([
      {
        source: "/dispatch",
        destination: "/data-center-connectivity",
        permanent: true,
      },
      {
        source: "/dispatch/:path*",
        destination: "/data-center-connectivity",
        permanent: true,
      },
    ]);
  });

  it("header and footer nav omit Dispatch", () => {
    const header = collectHeaderNavHrefs();
    const footer = collectFooterIntelligenceHrefs();
    for (const href of [...header, ...footer]) {
      expect(hrefIsDispatchPublicPath(href)).toBe(false);
    }
  });

  it("sitemap.ts gates /dispatch entries behind DISPATCH_PUBLICLY_VISIBLE", () => {
    const sitemapPath = resolve(__dirname, "../../app/sitemap.ts");
    const src = readFileSync(sitemapPath, "utf8");
    expect(src).toContain("DISPATCH_PUBLICLY_VISIBLE");
    expect(src).toMatch(/if \(DISPATCH_PUBLICLY_VISIBLE\)[\s\S]*`\$\{BASE\}\/dispatch`/);
    const staticSection = src.slice(
      src.indexOf("const staticRoutes"),
      src.indexOf("const marketRoutes"),
    );
    expect(staticSection).not.toContain("/dispatch");
  });
});