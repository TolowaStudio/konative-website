import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ATTEMPT_DEADLINE,
  CRON_SECRET_NAME,
  INGEST_JOBS,
  REDACTED,
  buildJobArgs,
  secretAccessArgs,
} from "../../../scripts/scheduler/jobs";
import { planJobs, run, type Gcloud } from "../../../scripts/scheduler/apply";

const SECRET = "s3cr3t-token-value";
const webRoot = path.resolve(__dirname, "../../..");

function routeFile(p: string): string {
  return path.join(webRoot, "src/app/(frontend)", p, "route.ts");
}

describe("job definitions", () => {
  it("cover exactly the two retired weekly jobs, on their old Monday UTC slots", () => {
    expect(INGEST_JOBS.map((j) => [j.path, j.schedule])).toEqual([
      ["/api/ingest-canada-queue", "0 7 * * 1"],
      ["/api/ingest-ieso", "0 8 * * 1"],
    ]);
  });

  it("point at routes that exist and are guarded by the CRON_SECRET bearer", () => {
    for (const job of INGEST_JOBS) {
      const file = routeFile(job.path);
      expect(existsSync(file), `${job.path} route missing`).toBe(true);
      expect(readFileSync(file, "utf8")).toContain("Bearer ${process.env.CRON_SECRET}");
    }
  });

  it("allow the scheduler attempt deadline to outlast the routes' maxDuration", () => {
    const deadline = Number.parseInt(ATTEMPT_DEADLINE, 10);
    for (const job of INGEST_JOBS) {
      const src = readFileSync(routeFile(job.path), "utf8");
      const maxDuration = Number(/maxDuration\s*=\s*(\d+)/.exec(src)?.[1]);
      expect(maxDuration).toBeGreaterThan(0);
      expect(deadline).toBeGreaterThan(maxDuration);
    }
  });
});

describe("buildJobArgs", () => {
  const job = INGEST_JOBS[0];

  it("uses --headers on create and --update-headers on update, with the bearer token", () => {
    expect(buildJobArgs(job, { mode: "create", secret: SECRET })).toContain(`--headers=Authorization=Bearer ${SECRET}`);
    expect(buildJobArgs(job, { mode: "update", secret: SECRET })).toContain(
      `--update-headers=Authorization=Bearer ${SECRET}`,
    );
  });

  it("targets the production site over GET in UTC", () => {
    const args = buildJobArgs(job, { mode: "create", secret: SECRET });
    expect(args).toContain("--uri=https://konative.com/api/ingest-canada-queue");
    expect(args).toContain("--http-method=GET");
    expect(args).toContain("--time-zone=Etc/UTC");
    expect(args).toContain(`--attempt-deadline=${ATTEMPT_DEADLINE}`);
  });

  it("reads the secret from the name the Cloud Run deploy binds as CRON_SECRET", () => {
    expect(secretAccessArgs()).toContain(`--secret=${CRON_SECRET_NAME}`);
    const deploy = readFileSync(path.resolve(webRoot, "../.github/workflows/deploy-cloud-run.yml"), "utf8");
    expect(deploy).toContain(`CRON_SECRET=${CRON_SECRET_NAME}:latest`);
  });
});

function fakeGcloud(opts: {
  existing?: string[];
  describeError?: string;
  secretCode?: number;
  createCode?: number;
}): { gcloud: Gcloud; calls: string[][] } {
  const calls: string[][] = [];
  const gcloud: Gcloud = (args) => {
    calls.push(args);
    if (args[0] === "secrets") {
      return opts.secretCode
        ? { code: opts.secretCode, stdout: "", stderr: "denied" }
        : { code: 0, stdout: `${SECRET}\n`, stderr: "" };
    }
    if (args[2] === "describe") {
      if (opts.describeError) return { code: 1, stdout: "", stderr: opts.describeError };
      return opts.existing?.includes(args[3])
        ? { code: 0, stdout: "{}", stderr: "" }
        : { code: 1, stdout: "", stderr: "ERROR: NOT_FOUND: Job not found" };
    }
    return { code: opts.createCode ?? 0, stdout: "", stderr: opts.createCode ? `failed with ${SECRET}` : "" };
  };
  return { gcloud, calls };
}

describe("planJobs", () => {
  it("creates missing jobs and updates existing ones", () => {
    const { gcloud } = fakeGcloud({ existing: ["konative-ingest-ieso"] });
    expect(planJobs(gcloud).map((p) => p.mode)).toEqual(["create", "update"]);
  });

  it("stops on an auth/API error instead of treating it as a missing job", () => {
    const { gcloud } = fakeGcloud({ describeError: "PERMISSION_DENIED: caller lacks cloudscheduler.jobs.get" });
    expect(() => planJobs(gcloud)).toThrow(/not a missing-job error/);
  });
});

describe("run", () => {
  it("dry run changes nothing and never reads the secret", () => {
    const { gcloud, calls } = fakeGcloud({});
    const out: string[] = [];
    run(gcloud, { apply: false, log: (s) => out.push(s) });
    expect(calls.some((c) => c[0] === "secrets")).toBe(false);
    expect(calls.some((c) => c[2] === "create" || c[2] === "update")).toBe(false);
    expect(out.join("\n")).toContain(REDACTED);
    expect(out.join("\n")).not.toContain(SECRET);
  });

  it("--apply creates both jobs carrying the secret, and never logs it", () => {
    const { gcloud, calls } = fakeGcloud({});
    const out: string[] = [];
    run(gcloud, { apply: true, log: (s) => out.push(s) });
    const writes = calls.filter((c) => c[2] === "create");
    expect(writes.map((c) => c[4])).toEqual(INGEST_JOBS.map((j) => j.name));
    for (const w of writes) expect(w).toContain(`--headers=Authorization=Bearer ${SECRET}`);
    expect(out.join("\n")).not.toContain(SECRET);
  });

  it("refuses to write when the secret cannot be read", () => {
    const { gcloud, calls } = fakeGcloud({ secretCode: 1 });
    expect(() => run(gcloud, { apply: true, log: () => {} })).toThrow(/konative-CRON_SECRET/);
    expect(calls.some((c) => c[2] === "create" || c[2] === "update")).toBe(false);
  });

  it("redacts the secret from a failed write's error", () => {
    const { gcloud } = fakeGcloud({ createCode: 1 });
    try {
      run(gcloud, { apply: true, log: () => {} });
      throw new Error("expected run to throw");
    } catch (err) {
      expect(String(err)).not.toContain(SECRET);
      expect(String(err)).toContain(REDACTED);
    }
  });
});
