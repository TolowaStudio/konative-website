import { resolveTypesafeApiKey } from "@/lib/jev/typesafeApiKey";
import {
  digestTouchBody,
  newReceiptId,
  type CampaignBatchStatus,
  type ReceiptWriter,
  type SendSafetyHook,
  type SendSafetyReceiptV1,
} from "@/lib/jev/receipts";
import { getSendGateMode, isSendGateInvokeEnabled, type SendGateMode } from "@/lib/jev/sendGateMode";

const TYPESAFE_SYSTEMONE_URL =
  (process.env.TYPESAFE_SYSTEMONE_URL ?? "https://api.typesafe.ai/v1/systemone").replace(/\/+$/, "");

const SEND_SAFE_NOUL_THRESHOLD = 0.72;

export interface SendSafetyState {
  audience: string;
  suppression_checked: boolean;
  run_id: string;
  batch_status: CampaignBatchStatus;
  approved_by?: string;
  subject: string;
  html: string;
  text?: string;
}

export type SendSafetyGateResult =
  | { ok: true; receipt: SendSafetyReceiptV1; skipped: true }
  | { ok: true; receipt: SendSafetyReceiptV1; allow: true }
  | { ok: false; receipt: SendSafetyReceiptV1; blocked: true; reason: string };

export interface SendSafetyGateDeps {
  fetchImpl?: typeof fetch;
  resolveApiKey?: (env?: NodeJS.ProcessEnv) => string | null;
  getMode?: (env?: NodeJS.ProcessEnv) => SendGateMode;
  batonInvokeUrl?: string;
  batonInvokeToken?: string;
  writeReceipt: ReceiptWriter;
  env?: NodeJS.ProcessEnv;
}

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function mapNoulToDecision(noul: number | undefined): "allow" | "deny" | "escalate" {
  if (noul === undefined || Number.isNaN(noul)) return "escalate";
  if (noul >= SEND_SAFE_NOUL_THRESHOLD) return "allow";
  if (noul <= 1 - SEND_SAFE_NOUL_THRESHOLD) return "deny";
  return "escalate";
}

function shouldBlockForDecision(args: {
  mode: SendGateMode;
  hook: SendSafetyHook;
  decision: "allow" | "deny" | "escalate";
}): boolean {
  if (args.mode === "steer") return false;
  if (args.mode !== "shadow") return false;
  if (args.hook === "canary_to_sending") {
    return args.decision !== "allow";
  }
  // canary_batch_create: fail-closed on deny/escalate in shadow (safer pre-canary)
  return args.decision !== "allow";
}

async function invokeBatonSendSafety(args: {
  fetchImpl: typeof fetch;
  url: string;
  token: string | undefined;
  apiKey: string;
  state: Record<string, unknown>;
}): Promise<
  | { transport_ok: true; decision: "allow" | "deny" | "escalate"; baton_receipt_id?: string; noul?: number; confidence?: number }
  | { transport_ok: false; error_code: string; http_status?: number }
> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${args.apiKey}`,
  };
  if (args.token) headers["X-Baton-Principal-Token"] = args.token;

  let res: Response;
  try {
    res = await args.fetchImpl(args.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        workType: "gate.send_safety",
        state: args.state,
      }),
    });
  } catch {
    return { transport_ok: false, error_code: "network_error" };
  }

  if (!res.ok) {
    return { transport_ok: false, error_code: "http_error", http_status: res.status };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { transport_ok: false, error_code: "invalid_json", http_status: res.status };
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const composed = record.composed && typeof record.composed === "object"
    ? (record.composed as Record<string, unknown>)
    : {};
  const decisionRaw = record.decision ?? composed.allow;
  let decision: "allow" | "deny" | "escalate";
  if (decisionRaw === true || decisionRaw === "allow") decision = "allow";
  else if (decisionRaw === false || decisionRaw === "deny") decision = "deny";
  else if (decisionRaw === "escalate") decision = "escalate";
  else {
    const noul =
      typeof record.noul === "number"
        ? record.noul
        : typeof (record.nouls as Record<string, { noul?: number }> | undefined)?.send_safe?.noul ===
            "number"
          ? (record.nouls as Record<string, { noul: number }>).send_safe.noul
          : undefined;
    decision = mapNoulToDecision(noul);
  }

  const baton_receipt_id =
    typeof record.receipt_id === "string"
      ? record.receipt_id
      : typeof record.receiptId === "string"
        ? record.receiptId
        : undefined;

  const noul =
    typeof record.noul === "number"
      ? record.noul
      : typeof (record.nouls as Record<string, { noul?: number }> | undefined)?.send_safe?.noul ===
          "number"
        ? (record.nouls as Record<string, { noul: number }>).send_safe.noul
        : undefined;

  const confidence =
    typeof record.confidence === "number"
      ? record.confidence
      : typeof (record.nouls as Record<string, { confidence?: number }> | undefined)?.send_safe
            ?.confidence === "number"
        ? (record.nouls as Record<string, { confidence: number }>).send_safe.confidence
        : undefined;

  return { transport_ok: true, decision, baton_receipt_id, noul, confidence };
}

async function invokeTypesafeSendSafety(args: {
  fetchImpl: typeof fetch;
  apiKey: string;
  state: Record<string, unknown>;
}): Promise<
  | { transport_ok: true; decision: "allow" | "deny" | "escalate"; noul?: number; confidence?: number }
  | { transport_ok: false; error_code: string; http_status?: number }
> {
  let res: Response;
  try {
    res = await args.fetchImpl(TYPESAFE_SYSTEMONE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: trimEnv(process.env.TYPESAFE_JEV_MODEL) || "jev-latest",
        state: args.state,
        questions: {
          send_safe: {
            type: "noul",
            instructions:
              "Given suppression_checked is true, the channel is outbound email, and the touch matches the stated audience, is it safe to proceed with this send step?",
          },
        },
      }),
    });
  } catch {
    return { transport_ok: false, error_code: "network_error" };
  }

  if (res.status === 401 || res.status === 403) {
    return { transport_ok: false, error_code: "auth_error", http_status: res.status };
  }
  if (!res.ok) {
    return { transport_ok: false, error_code: "http_error", http_status: res.status };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { transport_ok: false, error_code: "invalid_json", http_status: res.status };
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const nouls = record.nouls as Record<string, { noul?: number; confidence?: number }> | undefined;
  const sendSafe = nouls?.send_safe;
  const noul = typeof sendSafe?.noul === "number" ? sendSafe.noul : undefined;
  const confidence = typeof sendSafe?.confidence === "number" ? sendSafe.confidence : undefined;
  if (noul === undefined) {
    return { transport_ok: false, error_code: "invalid_response", http_status: res.status };
  }
  return { transport_ok: true, decision: mapNoulToDecision(noul), noul, confidence };
}

export async function runSendSafetyGate(args: {
  hook: SendSafetyHook;
  state: SendSafetyState;
  deps: SendSafetyGateDeps;
}): Promise<SendSafetyGateResult> {
  const env = args.deps.env ?? process.env;
  const mode = args.deps.getMode?.(env) ?? getSendGateMode(env);
  const touch = digestTouchBody({
    html: args.state.html,
    text: args.state.text,
    subject: args.state.subject,
  });

  const baseReceipt: SendSafetyReceiptV1 = {
    schema: "konative.jev-send-safety-receipt.v1",
    receipt_id: newReceiptId(),
    at: new Date().toISOString(),
    hook: args.hook,
    mode,
    channel: "mailgun",
    audience: args.state.audience,
    suppression_checked: args.state.suppression_checked,
    run_id: args.state.run_id,
    batch_status: args.state.batch_status,
    approved_by: args.state.approved_by,
    touch,
    gate: {
      work_type: "gate.send_safety",
      transport_ok: true,
    },
  };

  if (!isSendGateInvokeEnabled(mode)) {
    baseReceipt.gate = {
      work_type: "gate.send_safety",
      transport_ok: true,
      decision: "allow",
      error_code: "skipped_off",
    };
    await args.deps.writeReceipt(baseReceipt);
    return { ok: true, receipt: baseReceipt, skipped: true };
  }

  const fetchImpl = args.deps.fetchImpl ?? fetch;
  const apiKey = args.deps.resolveApiKey?.(env) ?? resolveTypesafeApiKey(env);
  if (!apiKey) {
    baseReceipt.gate = {
      work_type: "gate.send_safety",
      transport_ok: false,
      error_code: "missing_api_key",
    };
    await args.deps.writeReceipt(baseReceipt);
    return {
      ok: false,
      receipt: baseReceipt,
      blocked: true,
      reason: "missing typesafe api key",
    };
  }

  const jevState = {
    channel: "mailgun",
    audience: args.state.audience,
    suppression_checked: args.state.suppression_checked,
    run_id: args.state.run_id,
    batch_status: args.state.batch_status,
    approved_by: args.state.approved_by ?? null,
    subject: args.state.subject,
    body_sha256: touch.body_sha256,
    body_preview: touch.body_preview,
  };

  const batonUrl =
    args.deps.batonInvokeUrl ??
    trimEnv(env.KONATIVE_BATON_JEV_INVOKE_URL) ??
    trimEnv(env.BATON_JEV_INVOKE_URL);
  const batonToken =
    args.deps.batonInvokeToken ??
    trimEnv(env.KONATIVE_BATON_JEV_INVOKE_TOKEN) ??
    trimEnv(env.BATON_JEV_INVOKE_TOKEN);

  const gateResult = batonUrl
    ? await invokeBatonSendSafety({
        fetchImpl,
        url: batonUrl,
        token: batonToken || undefined,
        apiKey,
        state: jevState,
      })
    : await invokeTypesafeSendSafety({ fetchImpl, apiKey, state: jevState });

  baseReceipt.gate = {
    work_type: "gate.send_safety",
    transport_ok: gateResult.transport_ok,
    decision: gateResult.transport_ok ? gateResult.decision : undefined,
    baton_receipt_id: gateResult.transport_ok && "baton_receipt_id" in gateResult
      && typeof gateResult.baton_receipt_id === "string"
      ? gateResult.baton_receipt_id
      : undefined,
    noul: gateResult.transport_ok ? gateResult.noul : undefined,
    confidence: gateResult.transport_ok ? gateResult.confidence : undefined,
    error_code: gateResult.transport_ok ? undefined : gateResult.error_code,
    http_status: gateResult.transport_ok ? undefined : gateResult.http_status,
  };

  await args.deps.writeReceipt(baseReceipt);

  if (!gateResult.transport_ok) {
    return {
      ok: false,
      receipt: baseReceipt,
      blocked: true,
      reason: gateResult.error_code,
    };
  }

  if (shouldBlockForDecision({ mode, hook: args.hook, decision: gateResult.decision })) {
    return {
      ok: false,
      receipt: baseReceipt,
      blocked: true,
      reason: `gate ${gateResult.decision}`,
    };
  }

  return { ok: true, receipt: baseReceipt, allow: true };
}
