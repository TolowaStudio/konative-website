# Konative n8n intake deployment

Import `konative-twenty-intake.workflow.json` into the Tolowa n8n instance.
The workflow is intentionally inactive after import so its test URL can be
verified before production activation.

## Required n8n environment variables

- `KONATIVE_INTAKE_TOKEN`: a new random secret used only for this webhook
- `TWENTY_API_TOKEN` (preferred) or `TWENTY_API_KEY`: the existing Twenty workspace API credential
- `TWENTY_API_URL`: the existing Twenty GraphQL base URL

## Required Cloud Run environment variables

- `TWENTY_INTAKE_WEBHOOK_URL=https://<n8n-host>/webhook/konative-intake`
- `TWENTY_INTAKE_WEBHOOK_TOKEN=<same value as KONATIVE_INTAKE_TOKEN>`
- `CRM_WEBHOOK_REQUIRED=true` (set in deploy workflow once n8n intake is verified)

## Safe activation sequence

1. Import the workflow and leave it inactive.
2. Configure the three n8n environment variables.
3. Execute the workflow in test mode with a synthetic inquiry.
4. Confirm one company, person, opportunity, and follow-up task in Twenty.
5. Repeat the same payload and confirm the opportunity is not duplicated.
6. Activate the workflow.
7. Add the webhook secrets to Cloud Run (GCP Secret Manager `konative-*`), then redeploy.
8. Submit one labeled production test inquiry and verify the Sanity and Twenty
   record IDs.

This workflow performs inbound CRM intake only. It does not send email, enroll
contacts in a sequence, or change approval status to `Approved for outreach`.
