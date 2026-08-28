# Transactional email setup for form submissions

## Current provider: Resend

`web/src/lib/forms/submit.ts` sends transactional notifications (form submission alerts) via **Resend**.

## Setup steps

1. Create or log into a Resend account: [https://resend.com](https://resend.com).
2. Add sending domain (`konative.com` or subdomain like `mail.konative.com`).
3. Add DNS records Resend provides (SPF, DKIM, optional DMARC) in the **Bunny DNS** panel for `konative.com` (see `web/docs/dns-setup.md`).
4. Verify the domain in Resend.
5. Create an API key scoped to production mail sending.
6. Set secrets:
   - **Production:** GCP Secret Manager → Cloud Run at deploy (`konative-RESEND_API_KEY`, `konative-RESEND_FROM`, `konative-RESEND_TO` via `.github/workflows/deploy-cloud-run.yml`)
   - **Local dev:** `web/.env.local`:
     - `RESEND_API_KEY`
     - `RESEND_FROM` (example: `Konative <team@konative.com>`)
     - `RESEND_TO` (notification recipient)

## Bulk / campaign email

Newsletter and outreach blasts use separate paths (Ghost for newsletter; Mailgun for outreach scripts). See `web/src/lib/outreach/mailgun.ts` and related docs — not Resend.

## Historical note

Earlier versions of this doc referenced **Cloudflare Email Sending** migration and **Cloudflare Worker secrets** (`wrangler secret put`). Cloudflare Workers are retired for Konative application hosting; production mail credentials belong in **GCP Secret Manager**, not Worker bindings or Vercel env.
