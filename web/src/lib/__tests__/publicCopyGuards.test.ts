import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  regionalUsCanadaBrokerageLimit,
  stillOpenTbcpNegpCopy,
} from "@/lib/qa/campaignPublicCopy";

const webRoot = process.cwd();

describe("public copy guards (TS-4169)", () => {
  it("does not describe TBCP 3 / NEGP as still open on in-scope campaign surfaces", () => {
    const surfaces = [
      "src/app/(frontend)/HomePage.tsx",
      "src/app/(frontend)/ntia/page.tsx",
      "src/app/(frontend)/news/page.tsx",
      "public/llms.txt",
      "public/llms-full.txt",
    ];
    for (const rel of surfaces) {
      const contents = readFileSync(resolve(webRoot, rel), "utf8");
      expect(contents, rel).not.toMatch(stillOpenTbcpNegpCopy);
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