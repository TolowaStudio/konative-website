# Supabase decommission checklist — Konative

**Target:** Turn off Supabase project `tcbworxmlmxoyzcvdjhh` after D1 migration verified in production.

## Pre-flight

- [ ] `npm run d1:provision` — creates D1 + KV, patches `wrangler.jsonc`, applies schema
- [ ] `npm run d1:migrate-from-supabase` — copies all tables to D1
- [ ] Deploy Worker with D1/KV/AE bindings (`deploy.yml`)
- [ ] Verify `/tribal/index` loads from D1 (check Worker logs — no Supabase fallback)
- [ ] Verify `/api/v1/map-data`, `/projects`, sponsors work on D1
- [ ] Wire Analytics Engine for `/api/v1/analytics/*` (replace `analytics_events` table)
- [ ] Update ingest scripts to write D1 instead of Supabase
- [ ] D1 backup workflow → R2 (`motion-backups/konative-intel/`)

## Remove from Cloudflare Worker secrets

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Code cleanup (after 1 week stable)

- [ ] Remove `@supabase/supabase-js` from `package.json`
- [ ] Delete `web/src/lib/supabase.ts`
- [ ] Remove Supabase fallbacks from read paths
- [ ] Archive `web/supabase/` and `web/scripts/migrations/` (Postgres era)

## Supabase dashboard

- [ ] Export final backup from Supabase dashboard
- [ ] Pause or delete project `tcbworxmlmxoyzcvdjhh`
- [ ] Cancel Supabase billing

## Cost impact

Supabase Pro ~$25–45/mo → Cloudflare marginal ~$0 (within Workers Paid $5/mo plan).

## TOL-324 status (2026-11-17): what still reads Supabase

Slice 1 (#106) made the TBCP read paths honest: `tribal/index`, `tribal/awards`,
`tribal/awards/[slug]` and `lib/data/tbcp.ts` go through
`readWithSupabaseFallback` (`web/src/lib/db/supabaseFallback.ts`).

Slice 2 does the same for the API routes that already read a primary store first:
`api/v1/map-data` (facilities, network, power), `api/v1/queue`,
`api/v1/availability-score` (new: it read Supabase only before), `api/v1/sponsors/placement`
and `api/v1/analytics/sponsors`. Where "no rows" can be a real answer (no active
sponsor right now) the route checks that the primary table has any row at all
(`isD1SponsorshipReady`, `isD1QueueReady`) and only then calls `noteSupabaseFallback`.

Every fallback logs `{event: "supabase_fallback", site}` (greppable); a Supabase read
that itself fails logs `{event: "supabase_fallback_error", site}` instead of
looking like an empty result. `KONATIVE_SUPABASE_FALLBACK=off` makes an unmigrated
site throw. Default behaviour is unchanged.

Still reading Supabase directly with no primary read first. These need a query
module per table, which depends on the database choice below, so they are not
agent-doable yet:

| Group | Files | Note |
| --- | --- | --- |
| Supabase-only | `projects/page.tsx`, `projects/[id]/page.tsx`, `markets/[state]/page.tsx`, `dashboard/page.tsx`, `api/v1/deals/route.ts`, `api/v1/analytics/track/route.ts` | no D1 query module exists for `dc_availability_scores`, `investment_deals`, `feed_sources`, `market_intel_articles`, `analytics_events` |
| Health | `api/v1/health/route.ts` | `water_sites` stays on Supabase (not migrated) |

Log search that proves a site is migrated: zero `supabase_fallback` hits for that
`site` over a week of normal traffic.

## Jeramey-only steps (cannot be done by an agent)

1. Pick the target database. The 2026-07-09 decision was Cloudflare D1, but the shop
   stack prohibits Cloudflare and `web/src/lib/db/runtime.ts` already has a Cloud Run +
   Postgres path (TOL-314 / TOL-321). Until one is chosen, "finish the migration" has two
   different meanings.
2. Run the data copy (`npm run d1:migrate-from-supabase`, or the Postgres equivalent) with
   Supabase and target credentials, and deploy.
3. On a preview with `KONATIVE_SUPABASE_FALLBACK=off`, load `/tribal/index`,
   `/tribal/awards`, one `/tribal/awards/<slug>` and the homepage TBCP block. Any page that
   throws is not migrated. After a normal deploy, search the logs for
   `supabase_fallback`; zero hits over a week is the green light for the "Code cleanup"
   section above.
