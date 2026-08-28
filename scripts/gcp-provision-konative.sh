#!/usr/bin/env bash
# Provision the minimum GCP landing zone for Konative Cloud Run staging (TOL-321).
# Run once with gcloud authenticated as a project owner on tolowa-studio.
#
# GitHub OIDC uses the shared WIF pool in tolowa-pacific (project 187819949341).
# No service-account JSON keys are created.

set -euo pipefail

GCP_PROJECT="${GCP_PROJECT:-tolowa-studio}"
GCP_REGION="${GCP_REGION:-us-west1}"
AR_REPO="${AR_REPO:-konative-website}"
GITHUB_REPO="${GITHUB_REPO:-tolowa-studio/konative-website}"
WIF_PROJECT_NUMBER="${WIF_PROJECT_NUMBER:-187819949341}"
WIF_POOL_ID="${WIF_POOL_ID:-github}"
WIF_PROVIDER_ID="${WIF_PROVIDER_ID:-konative-website-github}"
DEPLOYER_SA="konative-deployer@${GCP_PROJECT}.iam.gserviceaccount.com"
RUNTIME_SA="konative-runtime@${GCP_PROJECT}.iam.gserviceaccount.com"
SERVICE_NAME="${SERVICE_NAME:-konative-website-staging}"

echo "== Artifact Registry (${AR_REPO}) =="
gcloud artifacts repositories describe "${AR_REPO}" \
  --project="${GCP_PROJECT}" \
  --location="${GCP_REGION}" 2>/dev/null \
  || gcloud artifacts repositories create "${AR_REPO}" \
    --project="${GCP_PROJECT}" \
    --location="${GCP_REGION}" \
    --repository-format=docker \
    --description="Konative website container images (Cloud Run staging)"

echo "== Service accounts =="
for SA in "${DEPLOYER_SA}" "${RUNTIME_SA}"; do
  gcloud iam service-accounts describe "${SA}" --project="${GCP_PROJECT}" 2>/dev/null \
    || gcloud iam service-accounts create "${SA%%@*}" \
      --project="${GCP_PROJECT}" \
      --display-name="${SA%%@*}"
done

echo "== WIF provider (${WIF_PROVIDER_ID}) in pool ${WIF_POOL_ID} =="
gcloud iam workload-identity-pools providers describe "${WIF_PROVIDER_ID}" \
  --project="${WIF_PROJECT_NUMBER}" \
  --location=global \
  --workload-identity-pool="${WIF_POOL_ID}" 2>/dev/null \
  || gcloud iam workload-identity-pools providers create-oidc "${WIF_PROVIDER_ID}" \
    --project="${WIF_PROJECT_NUMBER}" \
    --location=global \
    --workload-identity-pool="${WIF_POOL_ID}" \
    --display-name="GitHub OIDC for ${GITHUB_REPO}" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-condition="assertion.repository=='${GITHUB_REPO}'"

PRINCIPAL="principalSet://iam.googleapis.com/projects/${WIF_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL_ID}/attribute.repository/${GITHUB_REPO}"

echo "== IAM: deployer SA can be impersonated by GitHub Actions =="
gcloud iam service-accounts add-iam-policy-binding "${DEPLOYER_SA}" \
  --project="${GCP_PROJECT}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="${PRINCIPAL}"

echo "== IAM: deployer SA roles =="
for ROLE in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser roles/cloudsql.admin roles/secretmanager.admin roles/serviceusage.serviceUsageAdmin; do
  gcloud projects add-iam-policy-binding "${GCP_PROJECT}" \
    --member="serviceAccount:${DEPLOYER_SA}" \
    --role="${ROLE}" \
    --condition=None
done

echo "== IAM: runtime SA can read secrets and connect to Cloud SQL =="
gcloud projects add-iam-policy-binding "${GCP_PROJECT}" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None
gcloud projects add-iam-policy-binding "${GCP_PROJECT}" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/cloudsql.client" \
  --condition=None

echo "== Secret Manager placeholders (create if missing; add values separately) =="
SECRETS=(
  SANITY_API_TOKEN
  SUPABASE_SERVICE_ROLE_KEY
  ANTHROPIC_API_KEY
  CRON_SECRET
  NEWS_INGEST_TOKEN
  CLOUDFLARE_ACCOUNT_ID
  CLOUDFLARE_EMAIL_API_TOKEN
  TWENTY_INTAKE_WEBHOOK_URL
  TWENTY_INTAKE_WEBHOOK_TOKEN
  ADMIN_ACCESS_TOKEN
  GHOST_URL
  GHOST_ADMIN_API_KEY
  GHOST_CONTENT_API_KEY
  RESEND_FROM
  RESEND_TO
  DATABASE_URI
)
for NAME in "${SECRETS[@]}"; do
  SECRET_ID="konative-${NAME}"
  gcloud secrets describe "${SECRET_ID}" --project="${GCP_PROJECT}" 2>/dev/null \
    || gcloud secrets create "${SECRET_ID}" \
      --project="${GCP_PROJECT}" \
      --replication-policy="automatic" \
      --labels="app=konative,env=staging"
  echo "  - ${SECRET_ID} (add value: printf 'VALUE' | gcloud secrets versions add ${SECRET_ID} --data-file=- --project=${GCP_PROJECT})"
done

WIF_PROVIDER="projects/${WIF_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WIF_POOL_ID}/providers/${WIF_PROVIDER_ID}"

cat <<EOF

== GitHub repository configuration (tolowa-studio/konative-website) ==

Repository variables:
  GCP_WORKLOAD_IDENTITY_PROVIDER=${WIF_PROVIDER}
  GCP_SERVICE_ACCOUNT=${DEPLOYER_SA}

Repository secrets (already used by Cloudflare deploy; reuse for Cloud Run build args):
  NEXT_PUBLIC_SITE_URL
  NEXT_PUBLIC_SANITY_PROJECT_ID
  NEXT_PUBLIC_SANITY_DATASET
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_GHOST_URL
  NEXT_PUBLIC_GHOST_CONTENT_API_KEY
  NEXT_PUBLIC_GTM_ID
  NEXT_PUBLIC_SENTRY_DSN

Image path:
  ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT}/${AR_REPO}/konative:<sha>

Cloud Run service:
  ${SERVICE_NAME} (${GCP_REGION})

After secrets have values and DATABASE_URI is set (TOL-314), re-run deploy-cloud-run.yml.
EOF
