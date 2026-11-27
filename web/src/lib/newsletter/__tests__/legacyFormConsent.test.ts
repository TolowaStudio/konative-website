import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = join(import.meta.dirname, "../../..");

const LEGACY_NEWSLETTER_FORMS = [
  "app/(frontend)/_sections/MarketIntel.tsx",
  "app/(frontend)/market-intel/page.tsx",
  "app/(frontend)/power-markets/page.tsx",
  "components/PremiumGate.tsx",
] as const;

describe("legacy newsletter signup forms", () => {
  it("require an explicit consent checkbox and consent:true in the API payload", () => {
    for (const rel of LEGACY_NEWSLETTER_FORMS) {
      const src = readFileSync(join(ROOT, rel), "utf8");
      expect(src, rel).toMatch(/NewsletterConsentCheckbox/);
      expect(src, rel).toMatch(/consent:\s*true/);
    }
  });
});