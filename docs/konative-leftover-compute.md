# Konative leftover compute — disable runbook

**Linear:** TOL-316 (R2 → GCS tiles), TOL-322 (`konative-cron` Worker scheduler)  
**Updated:** 2026-08-28

Live site runs on **Cloud Run**. This doc covers cron/tile automation that still pointed at retired Cloudflare R2 or duplicate Worker schedulers.

## What this PR stops (GitHub Actions)

| Workflow | Was firing | Now |
|----------|------------|-----|
| `refresh-tiles.yml` | Monthly/quarterly R2 uploads (403 / NotEntitled) | Schedule removed; `workflow_dispatch` fails fast |
| `ingest-news.yml` | Daily news ingest (frozen product rule) | Schedule removed; manual run fails fast |
| `ingest-weekly.yml` | Monday Canada queue + IESO (duplicated CF Worker) | Schedule removed; manual run fails fast |

No DNS changes. No Cloud Run deploy required for these workflow edits.

## Human action still required — TOL-322 Cloudflare Worker

The Worker **`konative-cron`** is still deployed in Tolowa Studio Cloudflare (`e2b6ede12b96c7be2fe252c4b1e74bcf`). It has **no wrangler deploy path** in this repo; recovered source is `workers/konative-cron/` (read-only).

| Cron (UTC) | Target |
|------------|--------|
| `0 7 * * 1` | `GET https://konative.com/api/ingest-canada-queue` |
| `0 8 * * 1` | `GET https://konative.com/api/ingest-ieso` |

**Clear schedules** (does not delete the Worker script):

```bash
# Inspect first
CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-clear-konative-cron.mjs --dry-run

# Remove all cron triggers
CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-clear-konative-cron.mjs
```

Token needs **Workers Scripts:Edit** on the Tolowa Studio account. `CLOUDFLARE_API_TOKEN` may already exist as a GitHub Actions secret for legacy D1 workflows.

**Railway:** `workers/index.js` + `workers/railway.toml` were never deployed for Konative cron — no Railway cron to clear.

## Human action still required — TOL-316 GCS tiles

R2 buckets **`konative-tiles`** and **`konative-data`** are off (account R2 restriction). Do **not** re-enable R2 or restore `refresh-tiles.yml` schedules until GCS is live.

### Provision (operator / `motion-ops`)

1. **GCS bucket** in `tolowa-studio` (suggested names):
   - `konative-tiles` — public PMTiles (`tiles/v1/*.pmtiles`, `manifest.json`)
   - `konative-data` — optional dataset snapshots (if still needed)

2. **Public read** for map tiles (pick one):
   - Cloud CDN + backend bucket + `allUsers` objectViewer on tile prefix, or
   - Signed URLs / Cloud Run proxy only (current pattern: `web/src/app/(frontend)/api/v1/tiles/[...path]/route.ts` still proxies hardcoded R2 URL)

3. **GitHub / runtime env** (after bucket exists):
   - `GCS_TILES_BUCKET` (or equivalent) for upload workflow
   - `TILES_PUBLIC_BASE_URL` or proxy-only (no public bucket)
   - Service account for Actions: `konative-deployer` or dedicated ETL SA with `storage.objectAdmin` on tile prefix

4. **Rewrite `refresh-tiles.yml`**:
   - Replace `aws s3 cp` R2 uploads with `gcloud storage cp` or `gsutil`
   - Remove gate job; restore schedule only after first successful manual run
   - Update `tiles/v1/manifest.json` `tilesUrl` values to GCS/CDN base

5. **App code** (separate PR):
   - `web/src/app/(frontend)/api/v1/tiles/[...path]/route.ts` — stop proxying `pub-*.r2.dev`
   - ETL scripts under `web/scripts/etl/` that reference `R2_BUCKET` / `R2_ENDPOINT`

### Verify after GCS cutover

```bash
curl -sfI "https://konative.com/api/v1/tiles/tiles/v1/manifest.json"  # or CDN URL
# Map page loads infrastructure layers without R2 host
```

## Re-enable checklist (do not merge until all checked)

- [ ] `konative-cron` Worker schedules cleared (API shows 0 schedules)
- [ ] GCS bucket + IAM + public/CDN path verified
- [ ] `refresh-tiles.yml` migrated off R2; one manual layer refresh succeeds
- [ ] Tiles proxy / manifest URLs point at GCS, not R2
- [ ] News ingest still **off** unless product explicitly approves
- [ ] Only **one** scheduler surface for weekly ingest (GHA **or** Worker — not both)

## References

- `workers/konative-cron/README.md` — recovered Worker bundle
- `web/AGENTS.md` — frozen news ingest / no R2 platform guidance
- Root `CLAUDE.md` — Cloud Run platform truth
