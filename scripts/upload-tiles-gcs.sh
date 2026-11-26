#!/usr/bin/env bash
# Upload PMTiles to private GCS bucket konative-tiles (tolowa-studio).
# Recovery: git show f245640:web/public/tiles/v1/<name>.pmtiles
set -euo pipefail

BUCKET="${GCS_TILES_BUCKET:-konative-tiles}"
PROJECT="${GCP_PROJECT:-tolowa-studio}"
PREFIX="tiles/v1"
SOURCE_COMMIT="${TILES_SOURCE_COMMIT:-f245640}"
TMPDIR="${TMPDIR:-/tmp}/konative-tiles-upload-$$"

LAYER_FILES=(
  bc_er_pipeline_installations_permitted
  bc_er_pipelines_permitted
  ca_cer_pipelines
  ca_cirnac_indigenous_lands
  ca_cpcad_protected_areas
  ca_cwfis_fire_zones
  ca_nrcan_power_plants
  ca_nrcan_substations
  ca_nrcan_transmission_lines
  global_wri_aqueduct_water_risk
  osm_ca_industrial
  osm_ca_pipelines
  osm_ca_railways
  osm_ca_transmission
  us_tiger_aiannh
)

mkdir -p "$TMPDIR"
trap 'rm -rf "$TMPDIR"' EXIT

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for name in "${LAYER_FILES[@]}"; do
  echo "Extracting ${name}.pmtiles from ${SOURCE_COMMIT}..."
  git show "${SOURCE_COMMIT}:web/public/tiles/v1/${name}.pmtiles" >"${TMPDIR}/${name}.pmtiles"
done

echo "Uploading to gs://${BUCKET}/${PREFIX}/..."
gcloud storage cp "${TMPDIR}"/*.pmtiles "gs://${BUCKET}/${PREFIX}/" \
  --project="${PROJECT}" \
  --content-type=application/vnd.pmtiles

echo "Done. Verify:"
echo "  gcloud storage ls gs://${BUCKET}/${PREFIX}/ | head"