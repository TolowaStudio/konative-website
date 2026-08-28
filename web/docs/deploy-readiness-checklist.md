# Konative deploy readiness checklist

**Updated 2026-08-27.** Use this before treating a production deploy as ready. Platform truth: **Cloud Run** (`konative-website-staging`), **Sanity** CMS, **Supabase** datastore, deploy via **`.github/workflows/deploy-cloud-run.yml`**.

## GitHub → GCP auth

- [ ] Repository vars set: `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` (see `scripts/gcp-provision-konative.sh`)
- [ ] Workflow `Deploy to Cloud Run (staging)` runs on push to `main` when `web/**` changes (or trigger manually)

## Build secrets (GitHub Actions)

These are passed as Docker build args in the workflow:

- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_GHOST_URL`, `NEXT_PUBLIC_GHOST_CONTENT_API_KEY`
- [ ] Optional: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_SENTRY_DSN`

## Runtime secrets (GCP Secret Manager → Cloud Run)

Bound at deploy via `--set-secrets` in the workflow (prefix `konative-`):

- [ ] `SANITY_API_TOKEN`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`
- [ ] Ghost: `GHOST_URL`, `GHOST_ADMIN_API_KEY`, `GHOST_CONTENT_API_KEY`
- [ ] Intake / ops: `TWENTY_INTAKE_WEBHOOK_URL`, `TWENTY_INTAKE_WEBHOOK_TOKEN`, `CRON_SECRET`, `NEWS_INGEST_TOKEN`, `ANTHROPIC_API_KEY`
- [ ] Optional Postgres path: `DATABASE_URI` (when Cloud SQL is provisioned)

## Post-deploy verification

```bash
gh run list --workflow=deploy-cloud-run.yml --branch main
curl -sf https://konative.com -o /dev/null -w "homepage: %{http_code}\n"   # expect 200
curl -sf https://konative.com/api/v1/health                                  # expect healthy JSON
```

- [ ] Homepage returns `200`
- [ ] `/api/v1/health` returns `200` when Supabase (and optional `DATABASE_URI`) are configured
- [ ] Sanity Studio reachable at `/studio` when CMS env is set
- [ ] DNS still points at the live Cloud Run front door (see `web/docs/dns-setup.md`)

## Not in scope (retired platforms)

Do **not** use these for Konative application hosting or production secrets:

- Vercel project env / deploy hooks
- Builder.io hosting or preview as the live site source
- Cloudflare Workers / OpenNext / `wrangler secret put` for this app

## Reference

- Root platform table: **`CLAUDE.md`**
- DNS: **`web/docs/dns-setup.md`**
- Data layer: **`web/docs/database-setup.md`**
- Email: **`web/docs/email-setup.md`**
