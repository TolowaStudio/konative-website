import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  regionalUsCanadaBrokerageLimit,
  stillOpenTbcpNegpCopy,
} from "@/lib/qa/campaignPublicCopy";

const webRoot = process.cwd();

function walkFiles(dir: string, match: RegExp, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, match, acc);
    } else if (match.test(entry) && !full.includes("__tests__")) {
      acc.push(full);
    }
  }
  return acc;
}

describe("public copy guards (TS-4169)", () => {
  it("does not describe TBCP 3 / NEGP as still open on any public app page", () => {
    const frontendRoot = resolve(webRoot, "src/app/(frontend)");
    const pages = walkFiles(frontendRoot, /^page\.tsx$/);
    expect(pages.length).toBeGreaterThan(0);

    for (const file of pages) {
      const contents = readFileSync(file, "utf8");
      expect(contents, file).not.toMatch(stillOpenTbcpNegpCopy);
    }
  });

  it("does not scope campaign brokerage copy to US and Canada only on key surfaces", () => {
    const surfaces = [
      "src/app/(frontend)/HomePage.tsx",
      "src/app/(frontend)/page.tsx",
      "src/app/(frontend)/about/page.tsx",
      "src/app/(frontend)/data-center-connectivity/page.tsx",
      "src/app/(frontend)/contact/layout.tsx",
      "src/app/(frontend)/call/page.tsx",
      "src/app/(frontend)/news/page.tsx",
      "public/llms.txt",
      "public/llms-full.txt",
    ];

    for (const rel of surfaces) {
      const contents = readFileSync(resolve(webRoot, rel), "utf8");
      expect(contents, rel).not.toMatch(regionalUsCanadaBrokerageLimit);
      expect(contents, rel).not.toMatch(/\bacross North America\b/i);
    }
  });
});