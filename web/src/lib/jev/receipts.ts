import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import type { SendGateMode } from "@/lib/jev/sendGateMode";

export type SendSafetyHook = "canary_batch_create" | "canary_to_sending";

export type CampaignBatchStatus = "planned" | "canary" | "sending" | "completed" | "blocked";

export interface TouchBodyDigest {
  body_sha256: string;
  body_preview: string;
  subject?: string;
}

export interface SendSafetyReceiptV1 {
  schema: "konative.jev-send-safety-receipt.v1";
  receipt_id: string;
  at: string;
  hook: SendSafetyHook;
  mode: SendGateMode;
  channel: "mailgun";
  audience: string;
  suppression_checked: boolean;
  run_id: string;
  batch_status: CampaignBatchStatus;
  approved_by?: string;
  touch: TouchBodyDigest;
  gate: {
    work_type: "gate.send_safety";
    transport_ok: boolean;
    decision?: "allow" | "deny" | "escalate";
    baton_receipt_id?: string;
    noul?: number;
    confidence?: number;
    error_code?: string;
    http_status?: number;
  };
}

export function digestTouchBody(args: {
  html: string;
  text?: string;
  subject?: string;
  previewChars?: number;
}): TouchBodyDigest {
  const previewChars = args.previewChars ?? 240;
  const canonical = args.text?.trim() || stripHtml(args.html);
  const body_sha256 = createHash("sha256").update(canonical, "utf8").digest("hex");
  const body_preview =
    canonical.length <= previewChars ? canonical : `${canonical.slice(0, previewChars)}…`;
  return {
    body_sha256,
    body_preview,
    subject: args.subject,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export type ReceiptWriter = (receipt: SendSafetyReceiptV1) => Promise<void>;

export function createInMemoryReceiptWriter(store: SendSafetyReceiptV1[]): ReceiptWriter {
  return async (receipt) => {
    store.push(receipt);
  };
}

export function createJsonlReceiptWriter(args: {
  directory: string;
  runId: string;
}): ReceiptWriter {
  const filePath = path.join(args.directory, `${args.runId}-jev-send-safety.jsonl`);
  let dirReady: Promise<void> | null = null;
  return async (receipt) => {
    if (!dirReady) {
      dirReady = mkdir(args.directory, { recursive: true }).then(() => undefined);
    }
    await dirReady;
    await appendFile(filePath, `${JSON.stringify(receipt)}\n`, { encoding: "utf8", mode: 0o600 });
  };
}

export function newReceiptId(): string {
  return randomUUID();
}
