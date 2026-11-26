# News Aggregator Source Plan (US + Canada Datacenters)

This document defines the first ingestion set for the Konative datacenter intelligence hub.

## Coverage goals
- Datacenter construction activity and campus announcements
- Permitting, zoning, and utility interconnection updates
- State/provincial and federal policy and regulation changes
- Capital spend/investment announcements and ecosystem moves

## Top 10 ingestion sources
1. **Google News RSS (US datacenter query)**  
   - Purpose: broad US signal capture for construction + policy events.
2. **Google News RSS (Canada datacentre query)**  
   - Purpose: broad Canada signal capture for investment + policy events.
3. **Data Center Dynamics** (`datacenterdynamics.com`)  
   - Purpose: hyperscaler/colo buildout and market analysis.
4. **DataCenterKnowledge** (`datacenterknowledge.com`)  
   - Purpose: infrastructure, utility, and operator announcements.
5. **US White House Presidential Actions feed**  
   - Purpose: federal executive actions impacting datacenter permitting.
6. **US Permitting Council newsroom** (`permitting.gov`)  
   - Purpose: FAST-41 and federal permit process milestones.
7. **ISED Canada newsroom**  
   - Purpose: federal Canadian AI/datacenter policy and support signals.
8. **CNW/Newswire Canada**  
   - Purpose: Canadian enterprise announcements tied to projects/spend.
9. **Bell Canada enterprise newsroom**  
   - Purpose: sovereign AI/datacenter build announcements in Canada.
10. **DataCenter.fyi tracker**  
   - Purpose: permit and project pipeline intelligence (US + Canada).

## Data model implemented
- `news-sources`: source registry, feed metadata, country/topic tagging, health status.
- `news-items`: normalized article records, dedupe fingerprint, publish state, source attribution.
- `ingestion-runs`: run-level observability for monitoring and troubleshooting ingestion jobs.

## Operational commands
- Seed source registry:
  - `npm run seed:news-sources`
- Ingest active feeds:
  - `npm run ingest:news`

## Scheduled ingest (production)

GitHub Actions workflow `.github/workflows/ingest-news.yml`:

- **Schedule:** `0 6 * * *` (daily 06:00 UTC)
- **Target:** `GET https://konative.com/api/ingest-news`
- **Auth:** Bearer token fetched at runtime from GCP Secret Manager (`konative-NEWS_INGEST_TOKEN` or `konative-CRON_SECRET`) via the repo WIF service account — not stored in GitHub secrets.

Manual local run: `npm run ingest-news` (requires `SANITY_API_TOKEN` in `.env.local`).

## Cron-ready API endpoint
- Endpoint: `GET` or `POST` `/api/ingest-news`
- Auth: pass token in either:
  - `x-news-ingest-token: <NEWS_INGEST_TOKEN>`
  - `Authorization: Bearer <NEWS_INGEST_TOKEN>`
- Optional query parameter:
  - `source=<source-slug>` to ingest one source only

Example:

```bash
curl -X POST "https://konative.com/api/ingest-news" \
  -H "x-news-ingest-token: $NEWS_INGEST_TOKEN"
```

## Notes on source reliability
- Some government/newsroom endpoints do not provide RSS.  
  These are still seeded for editorial/manual workflows and future API connectors.
- Google News RSS is intentionally used for broad discovery and should be complemented by high-signal direct feeds.
