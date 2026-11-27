import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(resolve(process.cwd(), "src/app/(frontend)/privacy/page.tsx"), "utf8");

describe("privacy policy (TS-4372)", () => {
  it("is no longer a placeholder", () => {
    expect(page).not.toMatch(/placeholder|published here later/i);
    expect(page).toMatch(/Last updated/);
  });

  it("names the required processors", () => {
    for (const name of ["Ghost", "Resend", "Twenty", "Cal.com", "analytics"]) {
      expect(page, name).toContain(name);
    }
  });

  it("covers the US, Canada and Mexico", () => {
    for (const term of ["CAN-SPAM", "PIPEDA", "CASL", "LFPDPPP", "ARCO"]) {
      expect(page, term).toContain(term);
    }
  });

  it("explains consent and unsubscribe", () => {
    expect(page).toContain('title: "Consent"');
    expect(page).toContain('title: "Unsubscribe"');
  });
});
