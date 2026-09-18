/**
 * ntia-outreach-send.ts
 *
 * NTIA Round 3 first-touch outreach campaign. Reads TBCP awardees from
 * Supabase `tbcp_awards` (service-role key), selects the segment that hasn't
 * been contacted yet, renders a personalized first-touch email (Konative
 * brokers the operational connectivity layer TBCP grants don't fund —
 * vendor-neutral, sovereignty-aware, $0 to the Tribe; NTIA Round 3 NOFO
 * deadline September 17, 2026), sends via Mailgun (`sendOutreachEmail`), and
 * — only on a successful send — marks that row's `outreach_status` as
 * 'outreach_sent'.
 *
 * NON-DESTRUCTIVE BY DEFAULT: this script defaults to --dry-run. It prints
 * what it would send and updates NOTHING unless --send is explicitly passed.
 * No DROP/DELETE/TRUNCATE anywhere; the only write is a single-column status
 * update, and only after a confirmed successful send.
 *
 * Run (dry run, default):
 *   npx tsx --env-file=.env.local scripts/ntia-outreach-send.ts
 *   npx tsx --env-file=.env.local scripts/ntia-outreach-send.ts --dry-run
 *
 * Run (live send — requires MAILGUN_API_KEY + MAILGUN_DOMAIN in env):
 *   npx tsx --env-file=.env.local scripts/ntia-outreach-send.ts --send
 *
 * Optional flags:
 *   --limit=<n>       Cap the number of rows processed (default 25; be polite).
 *   --round=<label>   Only rows whose nofo_round matches (default "Round 3").
 *                      Pass --round=any to disable this filter.
 *
 * STATUS: the Mailgun send path in this script has NOT been verified against
 * the live Mailgun API (no MAILGUN_API_KEY in this repo's env). Requires the
 * key plus a canary send (--limit=1 --send to a real test inbox) before this
 * campaign can be considered working end-to-end.
 *
 * SCHEMA GAP (confirmed against scripts/migrations/001_konative_intelligence_tables.sql):
 * `tbcp_awards` as migrated has NO `email` column — the awardee's contact
 * email is not part of this table today. The SELECT below asks for `email`
 * defensively; if the column does not exist in the live database, Supabase
 * will error on that query and this script logs it clearly rather than
 * silently sending to nobody. Before this campaign can run for real, either
 * (a) add an `email` column (migration) and populate it via enrichment
 * (e.g. Apollo), or (b) join against another table that holds contact
 * emails for these grantees. Do not assume this gap is already resolved.
 */

import { createClient } from "@supabase/supabase-js";
import { createCanaryBatch, transitionCanaryToSending } from "../src/lib/outreach/campaign/batchLifecycle";
import { sendOutreachEmail } from "../src/lib/outreach/mailgun";
import { renderNtiaRound3Email, type TbcpAwardRow } from "../src/lib/outreach/ntiaTemplate";
import { resolveOutreachScriptSendGateMode } from "../src/lib/jev/sendGateMode";

interface CampaignRow extends TbcpAwardRow {
  id: string;
  slug: string;
  outreach_status: string | null;
  email: string | null;
}

function parseArgs(argv: string[]) {
  const send = argv.includes("--send");
  const limitArg = argv.find(a => a.startsWith("--limit="));
  const roundArg = argv.find(a => a.startsWith("--round="));
  return {
    dryRun: !send,
    limit: limitArg ? Math.max(1, parseInt(limitArg.split("=")[1], 10) || 25) : 25,
    round: roundArg ? roundArg.split("=")[1] : "Round 3",
  };
}

/**
 * "Untouched" segment selection. The table's real default is
 * `outreach_status = 'not_started'` (see
 * scripts/migrations/001_konative_intelligence_tables.sql), but this also
 * tolerates NULL or the literal 'new' in case rows were seeded before that
 * default existed or written by another process.
 */
const UNTOUCHED_STATUSES = ["not_started", "new"];

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Source web/.env.local first.",
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  console.log("Konative — NTIA Round 3 outreach campaign");
  console.log(
    `Mode: ${args.dryRun ? "DRY RUN (no sends, no writes)" : "LIVE SEND"} | limit=${args.limit} | round=${args.round}`,
  );

  let query = supabase
    .from("tbcp_awards")
    .select("id, slug, grantee_name, tribe_name, state, award_amount_usd, nofo_round, outreach_status, email")
    .or(UNTOUCHED_STATUSES.map(s => `outreach_status.eq.${s}`).concat("outreach_status.is.null").join(","))
    .limit(args.limit);

  if (args.round !== "any") {
    query = query.eq("nofo_round", args.round);
  }

  const { data: rows, error } = await query;

  if (error) {
    console.error("Read failed:", error.message);
    if (/column .*email.* does not exist/i.test(error.message)) {
      console.error(
        "\nSCHEMA GAP: `tbcp_awards.email` does not exist in this database (see the" +
          " SCHEMA GAP note at the top of this script). Add an email column + populate it" +
          " via enrichment before this campaign can select real recipients.",
      );
    }
    process.exit(1);
  }
  if (!rows || rows.length === 0) {
    console.log("No untouched rows matched the segment. Nothing to do.");
    return;
  }

  console.log(`Selected ${rows.length} row(s) for this batch.`);

  const sampleRow = rows[0] as CampaignRow;
  const sampleRendered = renderNtiaRound3Email(sampleRow);
  const gateMode = resolveOutreachScriptSendGateMode(args.dryRun);
  const canaryBatch = await createCanaryBatch({
    audience: `ntia-round3-tbcp-${args.round}`,
    touch: {
      subject: sampleRendered.subject,
      html: sampleRendered.html,
      text: sampleRendered.text,
    },
    suppression_checked: true,
    canary_recipient_count: Math.min(args.limit, rows.length),
    gate: { getMode: () => gateMode },
  });

  if (!canaryBatch.ok) {
    console.error(
      `Send safety gate blocked canary batch creation (${canaryBatch.reason}). ` +
        `Batch remains planned; receipts=${canaryBatch.batch.receipts.length}.`,
    );
    process.exit(1);
  }

  console.log(
    `Canary batch ${canaryBatch.batch.run_id} status=${canaryBatch.batch.status} ` +
      `(KONATIVE_JEV_SEND_GATE=${gateMode})`,
  );

  let sent = 0;
  let skippedNoEmail = 0;
  let failed = 0;
  const failedSamples: string[] = [];

  for (const row of rows as CampaignRow[]) {
    const to = (row.email || "").trim();
    if (!to) {
      skippedNoEmail++;
      console.log(`  - skip (no email on file): ${row.grantee_name} [${row.slug}]`);
      continue;
    }

    const rendered = renderNtiaRound3Email(row);

    if (!args.dryRun && canaryBatch.batch.status === "canary") {
      const transition = await transitionCanaryToSending({
        batch: canaryBatch.batch,
        gate: { getMode: () => gateMode },
      });
      if (!transition.ok) {
        console.error(
          `Send safety gate blocked canary→sending (${transition.reason}). No Mailgun calls made.`,
        );
        process.exit(1);
      }
    }

    const result = await sendOutreachEmail({
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      tags: ["ntia-round3", "tbcp-awardee"],
      dryRun: args.dryRun,
    });

    if (!result.ok) {
      failed++;
      if (failedSamples.length < 10) {
        failedSamples.push(`${row.grantee_name} (${result.reason ?? "unknown"})`);
      }
      console.log(`  ✗ send failed: ${row.grantee_name} [${row.slug}] — ${result.reason}`);
      continue;
    }

    if (args.dryRun) {
      console.log(`  · would send: ${row.grantee_name} [${row.slug}] → ${to}`);
      continue;
    }

    sent++;
    console.log(`  ✓ sent: ${row.grantee_name} [${row.slug}] → ${to} (id=${result.id ?? "n/a"})`);

    // Only update status after a CONFIRMED successful send. Single-column
    // write, no destructive operations.
    const { error: updErr } = await supabase
      .from("tbcp_awards")
      .update({ outreach_status: "outreach_sent" })
      .eq("id", row.id);

    if (updErr) {
      console.error(`    ! status update failed for ${row.slug}: ${updErr.message}`);
    }
  }

  console.log("");
  console.log(`Batch size            : ${rows.length}`);
  console.log(`${args.dryRun ? "Would send" : "Sent"}             : ${args.dryRun ? rows.length - skippedNoEmail - failed : sent}`);
  console.log(`Skipped (no email)     : ${skippedNoEmail}`);
  console.log(`Failed                 : ${failed}`);
  if (failedSamples.length) console.log("Failed samples         :", failedSamples.join(", "));
  console.log(
    args.dryRun
      ? "\nDRY RUN — no emails sent, no rows updated. Pass --send to go live."
      : "\nDone.",
  );
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
