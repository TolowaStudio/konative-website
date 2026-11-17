import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * TOL-3556: `gcloud run deploy --set-secrets` REPLACES the service's secret list, so
 * CAL_WEBHOOK_SECRET must be in the deploy step's list or the next deploy drops it and
 * /api/cal/webhook goes back to 503. This runs the real shell from deploy-cloud-run.yml
 * (up to the `gcloud run deploy` call) against a fake `gcloud` and reads the list it builds.
 */
const WORKFLOW = resolve(__dirname, "../../../../.github/workflows/deploy-cloud-run.yml");

function deployStepScript(): string {
  const lines = readFileSync(WORKFLOW, "utf8").split("\n");
  const start = lines.findIndex(l => l.includes("- name: Deploy to Cloud Run"));
  expect(start).toBeGreaterThan(-1);
  const runAt = lines.findIndex((l, i) => i > start && /^\s+run: \|\s*$/.test(l));
  const indent = lines[runAt + 1].match(/^\s*/)![0].length;
  const body: string[] = [];
  for (const l of lines.slice(runAt + 1)) {
    if (l.trim() !== "" && l.match(/^\s*/)![0].length < indent) break;
    body.push(l.slice(indent));
  }
  const script = body.join("\n");
  const cut = script.indexOf('gcloud run deploy');
  expect(cut).toBeGreaterThan(-1);
  return script.slice(0, cut).replaceAll("${{ env.GCP_PROJECT }}", "test-project");
}

function buildSecretList(existing: string[]): { status: number | null; secrets: string } {
  const dir = mkdtempSync(join(tmpdir(), "fake-gcloud-"));
  // Fake `gcloud secrets describe <name>`: exit 0 only for names listed in EXISTING_SECRETS.
  writeFileSync(
    join(dir, "gcloud"),
    '#!/usr/bin/env bash\nfor a in "$@"; do case ",$EXISTING_SECRETS," in *",$a,"*) exit 0;; esac; done\nexit 1\n',
  );
  chmodSync(join(dir, "gcloud"), 0o755);
  const res = spawnSync("bash", ["-eo", "pipefail", "-c", `${deployStepScript()}\nprintf '%s' "$SECRETS" > "$OUT"`], {
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, EXISTING_SECRETS: existing.join(","), OUT: join(dir, "out") },
    encoding: "utf8",
  });
  let secrets = "";
  try {
    secrets = readFileSync(join(dir, "out"), "utf8");
  } catch {
    /* script failed before writing */
  }
  return { status: res.status, secrets };
}

describe("deploy-cloud-run.yml secret list (TOL-3556)", () => {
  it("binds CAL_WEBHOOK_SECRET when konative-cal-webhook-secret exists", () => {
    const { status, secrets } = buildSecretList(["konative-cal-webhook-secret"]);
    expect(status).toBe(0);
    expect(secrets).toContain("CAL_WEBHOOK_SECRET=konative-cal-webhook-secret:latest");
  });

  it("does not bind it, and does not fail the deploy, while the secret is missing", () => {
    const { status, secrets } = buildSecretList([]);
    expect(status).toBe(0);
    expect(secrets).not.toContain("CAL_WEBHOOK_SECRET");
    // the unconditional list is intact
    expect(secrets).toContain("TWENTY_INTAKE_WEBHOOK_URL=konative-TWENTY_INTAKE_WEBHOOK_URL:latest");
  });

  it("keeps the admin-lock binding independent of the Cal.com one", () => {
    const { secrets } = buildSecretList(["konative-ADMIN_ACCESS_TOKEN", "konative-cal-webhook-secret"]);
    expect(secrets).toContain("ADMIN_ACCESS_TOKEN=konative-ADMIN_ACCESS_TOKEN:latest");
    expect(secrets).toContain("CAL_WEBHOOK_SECRET=konative-cal-webhook-secret:latest");
  });
});
