#!/usr/bin/env node
/**
 * Clear all cron schedules on the Cloudflare Worker `konative-cron` (TOL-322).
 *
 * The Worker has no deploy path in this repo and duplicates ingest-weekly.yml.
 * This script removes its scheduled triggers so only deliberate automation runs.
 *
 * Prerequisites:
 *   CLOUDFLARE_API_TOKEN — Workers Scripts:Edit on Tolowa Studio account
 *   CLOUDFLARE_ACCOUNT_ID — defaults to Tolowa Studio account below
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-clear-konative-cron.mjs
 *   CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-clear-konative-cron.mjs --dry-run
 */
const SCRIPT_NAME = "konative-cron";
const DEFAULT_ACCOUNT_ID = "e2b6ede12b96c7be2fe252c4b1e74bcf";
const API_BASE = "https://api.cloudflare.com/client/v4";

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || DEFAULT_ACCOUNT_ID;
const dryRun = process.argv.includes("--dry-run");

if (!token) {
  console.error("CLOUDFLARE_API_TOKEN is required.");
  process.exit(1);
}

async function api(path, { method = "GET" } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    const detail = body.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(`${method} ${path} failed: ${detail}`);
  }
  return body.result;
}

async function main() {
  const schedules = await api(
    `/accounts/${accountId}/workers/scripts/${SCRIPT_NAME}/schedules`,
  );

  if (!schedules?.length) {
    console.log(`✓ ${SCRIPT_NAME}: no cron schedules (already cleared).`);
    return;
  }

  console.log(`Found ${schedules.length} schedule(s) on ${SCRIPT_NAME}:`);
  for (const s of schedules) {
    console.log(`  - ${s.cron} (id ${s.id})`);
  }

  if (dryRun) {
    console.log("Dry run — no schedules deleted.");
    return;
  }

  for (const s of schedules) {
    await api(
      `/accounts/${accountId}/workers/scripts/${SCRIPT_NAME}/schedules/${s.id}`,
      { method: "DELETE" },
    );
    console.log(`✓ deleted schedule ${s.cron}`);
  }

  const remaining = await api(
    `/accounts/${accountId}/workers/scripts/${SCRIPT_NAME}/schedules`,
  );
  console.log(
    `Done. Remaining schedules: ${remaining?.length ?? 0}. Worker script is still deployed but will not self-trigger.`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
