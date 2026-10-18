import { describe, it, expect } from "vitest";
import {
  renderNtiaRound3Email,
  recipientOrgName,
  type TbcpAwardRow,
} from "@/lib/outreach/ntiaTemplate";

function makeRow(overrides: Partial<TbcpAwardRow> = {}): TbcpAwardRow {
  return {
    grantee_name: "Acme Tribe Corp",
    tribe_name: "Acme Tribe",
    state: "WA",
    award_amount_usd: 4_500_000,
    nofo_round: "Round 2",
    ...overrides,
  };
}

/** Any {{token}}-style placeholder left unresolved in rendered output. */
const UNRESOLVED_PLACEHOLDER = /\{\{.*?\}\}|\$\{.*?\}|<%.*?%>/;

describe("recipientOrgName", () => {
  it("prefers tribe_name when present", () => {
    expect(recipientOrgName(makeRow({ tribe_name: "Acme Tribe", grantee_name: "Acme Tribe Corp LLC" }))).toBe(
      "Acme Tribe",
    );
  });

  it("falls back to grantee_name when tribe_name is null", () => {
    expect(recipientOrgName(makeRow({ tribe_name: null, grantee_name: "Acme Tribe Corp" }))).toBe(
      "Acme Tribe Corp",
    );
  });

  it("falls back to grantee_name when tribe_name is blank", () => {
    expect(recipientOrgName(makeRow({ tribe_name: "   ", grantee_name: "Acme Tribe Corp" }))).toBe(
      "Acme Tribe Corp",
    );
  });

  it("falls back to a generic label when both are missing", () => {
    expect(recipientOrgName(makeRow({ tribe_name: null, grantee_name: "" }))).toBe(
      "your organization",
    );
  });
});

describe("renderNtiaRound3Email", () => {
  it("personalizes the subject and body with the recipient org name", () => {
    const row = makeRow({ tribe_name: "Acme Tribe" });
    const rendered = renderNtiaRound3Email(row);
    expect(rendered.subject).toContain("Acme Tribe");
    expect(rendered.html).toContain("Acme Tribe");
    expect(rendered.text).toContain("Acme Tribe");
  });

  it("mentions the prior award amount and round when present", () => {
    const row = makeRow({ award_amount_usd: 4_500_000, nofo_round: "Round 2", state: "WA" });
    const rendered = renderNtiaRound3Email(row);
    expect(rendered.text).toContain("$4,500,000");
    expect(rendered.text).toContain("Round 2");
    expect(rendered.text).toContain("WA");
  });

  it("falls back to a no-prior-award sentence when award_amount_usd is null", () => {
    const row = makeRow({ award_amount_usd: null, nofo_round: null });
    const rendered = renderNtiaRound3Email(row);
    expect(rendered.text).toContain("Round 3 candidate");
    expect(rendered.text).not.toContain("received a $");
  });

  it("omits the state clause when state is missing", () => {
    const row = makeRow({ state: null, award_amount_usd: null, nofo_round: null });
    const rendered = renderNtiaRound3Email(row);
    expect(rendered.text).not.toMatch(/ in null/i);
    expect(rendered.text).not.toContain("in undefined");
  });

  it("always mentions the Konative connectivity-layer offer and the Round 3 deadline", () => {
    const rendered = renderNtiaRound3Email(makeRow());
    expect(rendered.text).toContain("Konative");
    expect(rendered.text).toContain("$0 cost to the Tribe");
    expect(rendered.text).toContain("November 17, 2026");
    expect(rendered.html).toContain("November 17, 2026");
    expect(rendered.text).not.toContain("September 17, 2026");
    expect(rendered.html).not.toContain("September 17, 2026");
  });

  it("never leaves an unresolved template placeholder in subject, html, or text", () => {
    const rows: Partial<TbcpAwardRow>[] = [
      {},
      { tribe_name: null, grantee_name: "", state: null, award_amount_usd: null, nofo_round: null },
      { tribe_name: "Only Tribe Name" },
      { award_amount_usd: 0 },
    ];
    for (const overrides of rows) {
      const rendered = renderNtiaRound3Email(makeRow(overrides));
      expect(rendered.subject).not.toMatch(UNRESOLVED_PLACEHOLDER);
      expect(rendered.html).not.toMatch(UNRESOLVED_PLACEHOLDER);
      expect(rendered.text).not.toMatch(UNRESOLVED_PLACEHOLDER);
    }
  });

  it("treats a non-positive award amount as no prior award", () => {
    const row = makeRow({ award_amount_usd: 0 });
    const rendered = renderNtiaRound3Email(row);
    expect(rendered.text).not.toContain("received a $0");
  });
});
