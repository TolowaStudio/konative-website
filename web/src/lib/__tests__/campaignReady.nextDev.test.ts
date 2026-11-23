import { type ChildProcess, spawn } from "node:child_process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SITE_OG_IMAGE_PATH } from "@/lib/seo/siteOpenGraph";

const DEV_PORT = 31_500 + Math.floor(Math.random() * 500);
const BASE_URL = `http://127.0.0.1:${DEV_PORT}`;

function devEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "test",
    NEXT_PUBLIC_SANITY_DATASET: "production",
    NEXT_PUBLIC_SITE_URL: BASE_URL,
  };
}

async function waitForNextReady(child: ChildProcess): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("next dev did not become ready in time")), 90_000);

    const onStdout = (chunk: Buffer) => {
      if (chunk.toString().includes("Ready")) {
        clearTimeout(timeout);
        child.stdout?.off("data", onStdout);
        resolve();
      }
    };

    child.stdout?.on("data", onStdout);
    child.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`next dev exited early with code ${code}`));
      }
    });
  });
}

describe("Next dev static routes (TS-4169)", () => {
  let child: ChildProcess;

  beforeAll(async () => {
    child = spawn(
      "npx",
      ["next", "dev", "-p", String(DEV_PORT), "--hostname", "127.0.0.1"],
      {
        cwd: process.cwd(),
        env: devEnv(),
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    await waitForNextReady(child);
  }, 120_000);

  afterAll(async () => {
    if (!child) return;
    child.kill("SIGTERM");
    await new Promise<void>((resolve) => {
      child.on("exit", () => resolve());
      setTimeout(() => resolve(), 5_000);
    });
  });

  it(
    "serves /og-image.png as image/png with HTTP 200 from the running Next app",
    async () => {
      const res = await fetch(`${BASE_URL}${SITE_OG_IMAGE_PATH}`);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toMatch(/image\/png/i);
    },
    30_000,
  );

  it(
    "serves /privacy and /terms with HTTP 200",
    async () => {
      for (const path of ["/privacy", "/terms"] as const) {
        const res = await fetch(`${BASE_URL}${path}`);
        expect(res.status, path).toBe(200);
      }
    },
    30_000,
  );
});