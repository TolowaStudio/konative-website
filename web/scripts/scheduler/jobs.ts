/**
 * Cloud Scheduler definitions for Konative's weekly ingest jobs (TOL-547).
 *
 * Why this exists: the Canada-queue + IESO ingest was re-homed to a Cloudflare
 * Worker (`konative-cron`) and a GitHub Action, both since disabled (TOL-322),
 * and nothing replaced them. Cloudflare is not part of the stack, so the single
 * scheduler surface is GCP Cloud Scheduler, calling the live Cloud Run site.
 *
 * Pure functions only: no gcloud, no network, no secret reads. `apply.ts` does
 * the I/O. Keep the schedule, paths and deadlines here so a test can pin them.
 */

export const GCP_PROJECT = "tolowa-studio";
export const GCP_LOCATION = "us-west1";
export const SITE_URL = "https://konative.com";
/** Secret Manager name of the bearer token the ingest routes check as CRON_SECRET. */
export const CRON_SECRET_NAME = "konative-CRON_SECRET";
/** Both routes declare `maxDuration = 300`; Scheduler's default 180s deadline would cut them off. */
export const ATTEMPT_DEADLINE = "320s";
export const REDACTED = "<redacted>";

export interface IngestJob {
  name: string;
  /** Unix cron, evaluated in UTC. Same slots the retired Worker used. */
  schedule: string;
  path: string;
  description: string;
}

export const INGEST_JOBS: readonly IngestJob[] = [
  {
    name: "konative-ingest-canada-queue",
    schedule: "0 7 * * 1",
    path: "/api/ingest-canada-queue",
    description: "Weekly Canada interconnection-queue promotion into Sanity (TOL-547)",
  },
  {
    name: "konative-ingest-ieso",
    schedule: "0 8 * * 1",
    path: "/api/ingest-ieso",
    description: "Weekly IESO load-queue ingest into Sanity (TOL-547)",
  },
];

export interface BuildOptions {
  mode: "create" | "update";
  /** The bearer token, or REDACTED when the command is only being printed. */
  secret: string;
  project?: string;
  location?: string;
  siteUrl?: string;
}

/** gcloud args for one job. Create and update share the same flag set, so a re-run converges. */
export function buildJobArgs(job: IngestJob, opts: BuildOptions): string[] {
  const project = opts.project ?? GCP_PROJECT;
  const location = opts.location ?? GCP_LOCATION;
  const siteUrl = (opts.siteUrl ?? SITE_URL).replace(/\/+$/, "");
  const headersFlag = opts.mode === "create" ? "--headers" : "--update-headers";
  return [
    "scheduler",
    "jobs",
    opts.mode,
    "http",
    job.name,
    `--project=${project}`,
    `--location=${location}`,
    `--schedule=${job.schedule}`,
    "--time-zone=Etc/UTC",
    `--uri=${siteUrl}${job.path}`,
    "--http-method=GET",
    `${headersFlag}=Authorization=Bearer ${opts.secret}`,
    `--attempt-deadline=${ATTEMPT_DEADLINE}`,
    "--max-retry-attempts=2",
    "--min-backoff=60s",
    `--description=${job.description}`,
  ];
}

export function describeArgs(job: IngestJob, project = GCP_PROJECT, location = GCP_LOCATION): string[] {
  return ["scheduler", "jobs", "describe", job.name, `--project=${project}`, `--location=${location}`];
}

export function secretAccessArgs(project = GCP_PROJECT): string[] {
  return ["secrets", "versions", "access", "latest", `--secret=${CRON_SECRET_NAME}`, `--project=${project}`];
}
