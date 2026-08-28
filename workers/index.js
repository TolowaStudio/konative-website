import cron from 'node-cron';

// Legacy Railway cron worker — NEVER DEPLOYED for Konative (TOL-322).
// Schedules below are stale; see docs/konative-leftover-compute.md.

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '');
const CRON_SECRET = process.env.CRON_SECRET;

if (!SITE_URL) throw new Error('SITE_URL env var required (e.g. https://konative.com)');
if (!CRON_SECRET) throw new Error('CRON_SECRET env var required');

async function callEndpoint(path) {
  const url = `${SITE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
      signal: AbortSignal.timeout(120_000),
    });
    const body = await res.text();
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${path} → ${res.status} (${ms}ms): ${body.slice(0, 300)}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ${path} FAILED:`, err.message);
  }
}

// ── Daily jobs ──────────────────────────────────────────────────────────────
cron.schedule('0 6 * * *',  () => callEndpoint('/api/ingest-news'));      // 6:00 UTC
cron.schedule('30 6 * * *', () => callEndpoint('/api/extract-projects')); // 6:30 UTC
cron.schedule('0 7 * * *',  () => callEndpoint('/api/v1/queue/ingest'));  // 7:00 UTC

// ── Weekly jobs (Sunday) ────────────────────────────────────────────────────
cron.schedule('0 4 * * 0',  () => callEndpoint('/api/ingest-osm'));       // Sun 4:00 UTC
cron.schedule('30 4 * * 0', () => callEndpoint('/api/ingest-wikidata')); // Sun 4:30 UTC
cron.schedule('0 5 * * 0',  () => callEndpoint('/api/ingest-ieso'));      // Sun 5:00 UTC

console.log(`[${new Date().toISOString()}] konative-workers started — targeting ${SITE_URL}`);
