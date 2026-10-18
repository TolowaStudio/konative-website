/**
 * NTIA Round 3 first-touch email template.
 *
 * Pure rendering logic, split out from `scripts/ntia-outreach-send.ts` so it is
 * unit-testable without touching Supabase or Mailgun. Renders a personalized
 * first-touch email for a TBCP awardee: Konative brokers the operational
 * connectivity layer TBCP grants don't fund — vendor-neutral, sovereignty-aware,
 * $0 to the Tribe. NTIA Round 3 NOFO deadline: November 17, 2026.
 */

/** Minimal shape of a `tbcp_awards` row needed to personalize the email. */
export interface TbcpAwardRow {
  grantee_name: string;
  tribe_name: string | null;
  state: string | null;
  award_amount_usd: number | null;
  nofo_round: string | null;
}

export interface RenderedOutreachEmail {
  subject: string;
  html: string;
  text: string;
}

const ROUND3_DEADLINE = "November 17, 2026";

function formatUsd(amount: number | null): string | null {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return null;
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

/** Human-friendly recipient organization name: prefer tribe_name, else grantee_name. */
export function recipientOrgName(row: TbcpAwardRow): string {
  const tribe = (row.tribe_name || "").trim();
  if (tribe) return tribe;
  return (row.grantee_name || "").trim() || "your organization";
}

/**
 * Render the personalized NTIA Round 3 first-touch email for a TBCP award row.
 * Pure function — no I/O. Must never leave an unresolved `{{token}}` in output.
 */
export function renderNtiaRound3Email(row: TbcpAwardRow): RenderedOutreachEmail {
  const org = recipientOrgName(row);
  const state = (row.state || "").trim();
  const stateClause = state ? ` in ${state}` : "";
  const priorAward = formatUsd(row.award_amount_usd);
  const priorRound = (row.nofo_round || "").trim();

  const priorAwardSentence =
    priorAward && priorRound
      ? `We saw ${org} received a ${priorAward} TBCP ${priorRound} award${stateClause} — congratulations on getting that funded.`
      : priorAward
        ? `We saw ${org} received a ${priorAward} TBCP award${stateClause} — congratulations on getting that funded.`
        : `We've been tracking TBCP awardees${stateClause}, and ${org} is on our radar as a Round 3 candidate.`;

  const subject = `${org} — the connectivity layer TBCP doesn't fund (Round 3 deadline ${ROUND3_DEADLINE})`;

  const text = [
    `Hi there,`,
    ``,
    priorAwardSentence,
    ``,
    `TBCP funds the network build — fiber, towers, middle mile. It does not fund the ongoing` +
      ` operational layer: carrier contracts, capacity procurement, vendor management, and the` +
      ` day-to-day work of actually running connectivity once it's built.`,
    ``,
    `Konative brokers exactly that layer for Tribal nations: vendor-neutral, sovereignty-aware,` +
      ` and at $0 cost to the Tribe. We get paid by the carriers and vendors we place, not by ${org}.`,
    ``,
    `With the NTIA Round 3 NOFO deadline on ${ROUND3_DEADLINE}, we're reaching out now so the` +
      ` operational plan is ready alongside the grant application — not bolted on after the award.`,
    ``,
    `Worth a 20-minute call to see if this fits?`,
    ``,
    `— Konative`,
  ].join("\n");

  const html = `
    <p>Hi there,</p>
    <p>${priorAwardSentence}</p>
    <p>TBCP funds the network build — fiber, towers, middle mile. It does not fund the ongoing
    operational layer: carrier contracts, capacity procurement, vendor management, and the
    day-to-day work of actually running connectivity once it's built.</p>
    <p><strong>Konative brokers exactly that layer</strong> for Tribal nations: vendor-neutral,
    sovereignty-aware, and at <strong>$0 cost to the Tribe</strong>. We get paid by the carriers
    and vendors we place, not by ${org}.</p>
    <p>With the NTIA Round 3 NOFO deadline on <strong>${ROUND3_DEADLINE}</strong>, we're reaching
    out now so the operational plan is ready alongside the grant application — not bolted on after
    the award.</p>
    <p>Worth a 20-minute call to see if this fits?</p>
    <p>— Konative</p>
  `.trim();

  return { subject, html, text };
}
