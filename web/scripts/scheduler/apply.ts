/**
 * Create or update the Konative weekly ingest jobs on Cloud Scheduler (TOL-547).
 *
 *   npx tsx scripts/scheduler/apply.ts            # dry run: reads job state, prints redacted commands
 *   npx tsx scripts/scheduler/apply.ts --apply    # reads konative-CRON_SECRET, creates/updates jobs
 *
 * Needs the caller's gcloud login to hold cloudscheduler.admin and
 * secretmanager.secretAccessor on konative-CRON_SECRET. Safe to re-run: existing
 * jobs are updated to the same definition. The token ends up in each job's
 * header (Scheduler has no secret references), so rotating konative-CRON_SECRET
 * means running --apply again.
 */
import { spawnSync } from "node:child_process";
import {
  INGEST_JOBS,
  REDACTED,
  buildJobArgs,
  describeArgs,
  secretAccessArgs,
  type IngestJob,
} from "./jobs";

export interface GcloudResult {
  code: number;
  stdout: string;
  stderr: string;
}
export type Gcloud = (args: string[]) => GcloudResult;

export interface PlanEntry {
  job: IngestJob;
  mode: "create" | "update";
}

/** A missing job is the only reason to create; any other describe failure (auth, API off) stops the run. */
export function planJobs(gcloud: Gcloud, jobs: readonly IngestJob[] = INGEST_JOBS): PlanEntry[] {
  return jobs.map((job) => {
    const res = gcloud(describeArgs(job));
    if (res.code === 0) return { job, mode: "update" as const };
    if (/NOT_FOUND|not found/i.test(res.stderr)) return { job, mode: "create" as const };
    throw new Error(`gcloud describe ${job.name} failed (not a missing-job error): ${res.stderr.trim() || res.code}`);
  });
}

/** Dry run only ever holds the REDACTED placeholder, never the token. */
export function printable(args: string[]): string {
  return `gcloud ${args.join(" ")}`;
}

export function run(gcloud: Gcloud, opts: { apply: boolean; log?: (s: string) => void }): PlanEntry[] {
  const log = opts.log ?? console.log;
  const plan = planJobs(gcloud);
  if (!opts.apply) {
    for (const { job, mode } of plan) log(`[dry-run] ${printable(buildJobArgs(job, { mode, secret: REDACTED }))}`);
    log("Dry run only. Re-run with --apply to change Cloud Scheduler.");
    return plan;
  }
  const secretRes = gcloud(secretAccessArgs());
  const secret = secretRes.stdout.trim();
  if (secretRes.code !== 0 || !secret) {
    throw new Error("could not read konative-CRON_SECRET from Secret Manager (check gcloud login and secretAccessor)");
  }
  for (const { job, mode } of plan) {
    const res = gcloud(buildJobArgs(job, { mode, secret }));
    if (res.code !== 0) {
      throw new Error(`gcloud ${mode} ${job.name} failed: ${res.stderr.split(secret).join(REDACTED).trim()}`);
    }
    log(`${mode}d ${job.name} (${job.schedule} UTC -> ${job.path})`);
  }
  return plan;
}

function realGcloud(args: string[]): GcloudResult {
  const r = spawnSync("gcloud", args, { encoding: "utf8" });
  return { code: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

if (process.argv[1] && /scheduler[\\/]apply\.[tj]s$/.test(process.argv[1])) {
  try {
    run(realGcloud, { apply: process.argv.includes("--apply") });
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
