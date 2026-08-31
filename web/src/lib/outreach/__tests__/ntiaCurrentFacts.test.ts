import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ACTIVE_FACT_SURFACES = [
  "src/app/(frontend)/HomePage.tsx",
  "src/app/(frontend)/ntia/page.tsx",
  "src/app/(frontend)/tribal/page.tsx",
  "src/app/(frontend)/tribal/grants/page.tsx",
  "src/app/(frontend)/tribal/funding-navigator/page.tsx",
  "src/app/(frontend)/tribal/funding-navigator/DeadlineCountdown.tsx",
  "src/lib/outreach/ntiaTemplate.ts",
  "public/llms.txt",
  "public/llms-full.txt",
  "docs/strategy/ntia-round-3-playbook.md",
  "scripts/draft-tribal-brief.ts",
  "scripts/ntia-outreach-send.ts",
  "scripts/seed-curated-tribal-news.ts",
  "../docs/tribal-campaign-readiness-plan.md",
  "../docs/2026-08-25-konative-m2-execution-control.md",
] as const;

const formerDeadline = new RegExp(
  `${"Sep"}(?:tember)?\\.?\\s+${"17"}(?:,\\s+2026)?|2026-${"09"}-${"17"}`,
  "i",
);

describe("current NTIA facts", () => {
  it.each(ACTIVE_FACT_SURFACES)("does not publish the former deadline in %s", (path) => {
    const contents = readFileSync(resolve(process.cwd(), path), "utf8");
    expect(contents).not.toMatch(formerDeadline);
  });

  it("keeps the homepage cohort status exact and approval-gated", () => {
    const homepage = readFileSync(
      resolve(process.cwd(), "src/app/(frontend)/HomePage.tsx"),
      "utf8",
    );

    expect(homepage).toContain(
      "164\", \"proposed tribal contacts — pending review, 0 approved for campaign",
    );
  });
});
