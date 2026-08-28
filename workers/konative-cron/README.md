# konative-cron (recovered, read-only)

This is the Cloudflare Worker `konative-cron`, deployed 2026-06-21 and, as of
2026-08-18, live in the `Tolowa Studio` Cloudflare account
(`e2b6ede12b96c7be2fe252c4b1e74bcf`). Its source did not previously exist
anywhere in this repo, in `~/repos/konative-website`, or on the local
machine — `grep -rl 'konative-cron'` across all local repos returned zero
hits (see TOL-322).

`index.js` here is the exact bundle pulled 2026-08-18 via the Cloudflare
Workers API (`workers_get_worker_code`), a read-only script-download. It is
committed **for visibility only** — this is not a build target, there is no
deploy pipeline wired to this directory, and no `wrangler.toml` is included
on purpose. Do not add one without first resolving TOL-322 (four competing
scheduler surfaces for the same jobs — this Worker fires the same two
Monday crons `.github/workflows/ingest-weekly.yml` also fired).

## What it does

Two scheduled triggers, both Monday UTC:

| Cron | Target |
|---|---|
| `0 7 * * 1` | `GET https://konative.com/api/ingest-canada-queue` |
| `0 8 * * 1` | `GET https://konative.com/api/ingest-ieso` |

Both requests carry `Authorization: Bearer ${CRON_SECRET}`. No Durable
Objects, no other bindings referenced — this closed the DO question in
TOL-319 (no Durable Object exists anywhere in Konative's infrastructure;
the exit audit's claim was stale).

## Status (2026-08-28)

**GitHub Actions:** `ingest-weekly.yml` schedule removed (TOL-322). Manual dispatch fails fast.

**Cloudflare Worker:** Still deployed with Monday cron triggers until an operator runs
`scripts/cloudflare-clear-konative-cron.mjs`. See `docs/konative-leftover-compute.md`.

Pick **one** scheduler surface before re-enabling weekly ingest — not GHA + Worker in parallel.

## Railway note

`workers/index.js` (sibling directory) defines a `node-cron` Railway worker that was
**never deployed** for Konative. No Railway service to stop for TOL-322.
