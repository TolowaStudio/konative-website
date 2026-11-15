import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const ACTIVE_FACT_SURFACES = [
  "src/app/(frontend)/HomePage.tsx",
  "src/app/(frontend)/ntia/page.tsx",
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

  // TBCP Round 3 and NEGP closed 2026-11-17 11:59 p.m. ET (TOL-3549). Public pages
  // must not say they are still open or offer application-window sessions.
  const PUBLIC_SITE_SURFACES = [
    "src/app/(frontend)/HomePage.tsx",
    "src/app/(frontend)/ntia/page.tsx",
    "src/app/(frontend)/answers/page.tsx",
    "src/app/(frontend)/tribal/page.tsx",
    "src/app/(frontend)/tribal/grants/page.tsx",
    "src/app/(frontend)/tribal/funding-navigator/page.tsx",
    "src/app/(frontend)/tribal/funding-navigator/DeadlineCountdown.tsx",
    "src/components/Footer.tsx",
    "public/llms.txt",
    "public/llms-full.txt",
  ] as const;

  const stillOpenCopy =
    /\b(?:close|closes|due|by)\s+Nov(?:ember|\.)?\s+17|application-window|during the application window|window is open|framing TBCP applications/i;

  it.each(PUBLIC_SITE_SURFACES)("does not describe TBCP 3 / NEGP as still open in %s", (path) => {
    const contents = readFileSync(resolve(process.cwd(), path), "utf8");
    expect(contents).not.toMatch(stillOpenCopy);
  });

  it("keeps the homepage cohort status exact and approval-gated", () => {
    const homepage = readFileSync(
      resolve(process.cwd(), "src/app/(frontend)/HomePage.tsx"),
      "utf8",
    );

    expect(homepage).not.toMatch(/GTM engine|proposed tribal contacts|gaming and casino contacts/i);
  });

  // Jeramey, TOL-3559 (2026-11-15): no public copy promising cold outreach or
  // paid list-building. Warm introductions and opt-in newsletters are fine.
  it.each([
    "src/app/(frontend)/HomePage.tsx",
    "src/app/(frontend)/data-center-connectivity/page.tsx",
    "src/app/(frontend)/ntia/page.tsx",
  ])("does not promise outreach campaigns or list-building in %s", (path) => {
    const contents = readFileSync(resolve(process.cwd(), path), "utf8");
    expect(contents).not.toMatch(
      /map-backed outreach|target outreach|context for outreach|outreach and planning|grant campaign|list[- ]building|lead lists?|prospect lists?|cold (?:outreach|email)/i,
    );
  });
});
