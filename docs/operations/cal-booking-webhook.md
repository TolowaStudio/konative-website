# Cal.com booking → Twenty opportunity + notification (TOL-3556)

**What this adds.** `POST /api/cal/webhook` receives Cal.com `BOOKING_CREATED`,
verifies `X-Cal-Signature-256` (HMAC-SHA256 of the raw body), and:

1. forwards the booking to the existing n8n intake (`TWENTY_INTAKE_WEBHOOK_URL`)
   in the same envelope the contact form uses (`schemaType: "calBooking"`,
   `sanityDocumentId: "cal-<booking uid>"`), so the workflow upserts the person
   and company, creates the opportunity and the follow-up task. The opportunity
   name embeds the booking uid, so a Cal.com retry does not duplicate it;
2. emails `RESEND_TO` (Resend) with who, what and when.

No n8n workflow change is required. The route is fail-closed: no
`CAL_WEBHOOK_SECRET` → 503, bad signature → 401, CRM or email failure → 502
(Cal.com retries). Unlike the contact form it treats a missing or failing CRM
webhook as an error regardless of `CRM_WEBHOOK_REQUIRED`, because a webhook
caller has no user to show a retry message to. Non-creation events (cancel,
reschedule, `PING`) are acknowledged and ignored.

## Not done by this PR (needs an owner with Cal.com / Cloud Run access)

1. **Secret.** Create GCP Secret Manager `konative-cal-webhook-secret` in project
   `tolowa-studio` (random 32+ bytes; pipe with `printf`, never `echo`) and map it
   to Cloud Run env `CAL_WEBHOOK_SECRET` on `konative-website-staging`.
2. **Deploy** this PR through the normal Konative deploy.
3. **Cal.com subscriber.** Settings → Developer → Webhooks → New: subscriber URL
   `https://konative.com/api/cal/webhook`, trigger **Booking created**, secret =
   the value from step 1. Use "Test webhook" (PING): expect HTTP 200 with
   `{"success":true,"ignored":"trigger PING not handled"}`.
4. **Smoke.** Book one labeled test slot; expect one `calBooking` opportunity and
   task in Twenty and one email to `RESEND_TO`; delete the synthetic records.

## Known gap: one Cal.com account serves every venture

Only `cal.com/jeramey-james` is a valid booking URL (per-venture slugs 404), so
an account-level webhook also fires for Tolowa Studio bookings. Scope the
webhook to the event types the Konative site links to (`/15min`, per
`CalEmbed.tsx`) or add a metadata/source filter before enabling it broadly;
otherwise non-Konative bookings create Konative opportunities.

## Also noticed (not changed here)

`docs/operations/n8n/runtime-notes.md` records that the live workflow's
Opportunity `lane` enum is `TRIBAL | DATACENTER | GENERAL`, while the checked-in
`konative-twenty-intake.workflow.json` still emits `DATA_CENTER`, `GAMING`,
`TRAVEL`, `ENTERPRISE`. The JSON export is stale against the live workflow.
