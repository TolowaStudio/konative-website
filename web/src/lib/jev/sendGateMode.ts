export type SendGateMode = "shadow" | "steer" | "off";

const VALID: SendGateMode[] = ["shadow", "steer", "off"];

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

/** Default is shadow when unset (desk GO 2026-09-17). */
export function getSendGateMode(env: NodeJS.ProcessEnv = process.env): SendGateMode {
  const raw = trimEnv(env.KONATIVE_JEV_SEND_GATE).toLowerCase();
  if (!raw) return "shadow";
  if ((VALID as string[]).includes(raw)) return raw as SendGateMode;
  console.warn(
    `[jev-send-gate] invalid KONATIVE_JEV_SEND_GATE="${raw}" — treating as shadow`,
  );
  return "shadow";
}

export function isSendGateInvokeEnabled(mode: SendGateMode): boolean {
  return mode !== "off";
}

/**
 * CLI outreach scripts: honor explicit KONATIVE_JEV_SEND_GATE; otherwise shadow for
 * live sends and off for dry-run (so local previews do not require TypeSafe keys).
 */
export function resolveOutreachScriptSendGateMode(
  dryRun: boolean,
  env: NodeJS.ProcessEnv = process.env,
): SendGateMode {
  if (trimEnv(env.KONATIVE_JEV_SEND_GATE)) {
    return getSendGateMode(env);
  }
  return dryRun ? "off" : "shadow";
}
