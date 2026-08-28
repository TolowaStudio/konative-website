# DNS setup for konative.com

**Updated 2026-08-27.** Public traffic for **konative.com** and **www** is served by **Google Cloud Run** (`konative-website-staging`, GCP project `tolowa-studio`, region `us-west1`). DNS is managed at **Bunny**; **Porkbun** is the registrar only — do not move nameservers to Porkbun.

## Current stack

| Layer | Provider | Notes |
|-------|----------|-------|
| **Registrar** | Porkbun | Domain registration only |
| **DNS** | Bunny | Nameservers: `kiki.bunny.net`, `coco.bunny.net` |
| **Public runtime** | Cloud Run | Service `konative-website-staging` serves production hostnames |

## Operator notes

- Record changes (A/CNAME, TLS, redirects) happen in the **Bunny DNS** panel for the `konative.com` zone — not in Vercel, Builder.io, or Cloudflare Workers.
- Deploy path and runtime health: see root **`CLAUDE.md`** → Deploy.
- If `konative.com` stops resolving, check (in order): Bunny nameservers still delegated at Porkbun, Bunny records still point at the live Cloud Run front door, Cloud Run service is healthy (`curl -sf https://konative.com -o /dev/null -w "%{http_code}\n"` expects `200`).

## Verification

```bash
curl -sf https://konative.com -o /dev/null -w "homepage: %{http_code}\n"
curl -sf https://www.konative.com -o /dev/null -w "www: %{http_code}\n"
curl -sf https://konative.com/api/v1/health
```

## Historical note

Earlier docs described **Cloudflare Workers** custom domains and **Vercel** A-record cutovers. Those platforms are **retired for application hosting** on Konative. Leftover Cloudflare account assets may still exist elsewhere in the org, but they are not the operator path for this site.
