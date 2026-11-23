import { createServer, type Server } from "node:http";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_OG_IMAGE_PATH } from "@/lib/seo/siteOpenGraph";

const webRoot = process.cwd();
const CAL_URL = "https://cal.com/jeramey-james/15min";

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

/** Minimal static server mirroring Next.js `public/` → 200 for existing files. */
function startPublicStaticServer(publicDir: string): Promise<{ baseUrl: string; close: () => void }> {
  return new Promise((resolvePromise, reject) => {
    const server: Server = createServer((req, res) => {
      const pathname = (req.url ?? "/").split("?")[0]!;
      const rel = pathname.replace(/^\//, "");
      const file = join(publicDir, rel);
      if (!rel || !existsSync(file) || statSync(file).isDirectory()) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.end(readFileSync(file));
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("could not bind static test server"));
        return;
      }
      resolvePromise({
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () => server.close(),
      });
    });
    server.on("error", reject);
  });
}

describe("campaign-ready public surface (TS-4169)", () => {
  it("serves a canonical og-image asset at /og-image.png", () => {
    const file = resolve(webRoot, "public", SITE_OG_IMAGE_PATH.replace(/^\//, ""));
    expect(existsSync(file)).toBe(true);
    const { width, height } = pngDimensions(file);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });

  it("returns HTTP 200 for /og-image.png from the public static tree", async () => {
    const { baseUrl, close } = await startPublicStaticServer(resolve(webRoot, "public"));
    try {
      const res = await fetch(`${baseUrl}${SITE_OG_IMAGE_PATH}`);
      expect(res.status).toBe(200);
    } finally {
      close();
    }
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

  it("preserves the canonical Cal.com 15-minute booking link on surfaces that use it", () => {
    for (const path of [
      "src/components/Footer.tsx",
      "src/app/(frontend)/call/page.tsx",
      "public/llms.txt",
      "public/llms-full.txt",
    ]) {
      const contents = readFileSync(resolve(webRoot, path), "utf8");
      expect(contents, path).toContain(CAL_URL);
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
    expect(dc).toMatch(/Native American–owned, vendor-neutral/i);
    expect(dc).toMatch(/domestic and international/i);
    expect(dc).not.toMatch(/(?:NMSDC|SBA 8\(a\)).*certified|certified.*(?:NMSDC|SBA 8\(a\))/i);
  });
});