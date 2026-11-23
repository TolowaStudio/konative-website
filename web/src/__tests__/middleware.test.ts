import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * TS-4169: /cms, /studio, /dashboard must not be world-readable when admin token is unset.
 * This test fails if middleware passes through on verifyAdminAccess "disabled".
 */
describe("admin middleware (TS-4169)", () => {
  it("does not leave admin paths public when ADMIN_ACCESS_TOKEN is unset", () => {
    const source = readFileSync(resolve(process.cwd(), "src/middleware.ts"), "utf8");
    expect(source).not.toMatch(/access === "disabled"[\s\S]*NextResponse\.next\(\)/);
    expect(source).toMatch(/access === "disabled"/);
  });
});