import { randomUUID } from "node:crypto";

import {
  createInMemoryReceiptWriter,
  type CampaignBatchStatus,
  type SendSafetyReceiptV1,
} from "@/lib/jev/receipts";
import { runSendSafetyGate, type SendSafetyGateDeps, type SendSafetyState } from "@/lib/jev/sendSafetyGate";

export interface CampaignTouch {
  subject: string;
  html: string;
  text?: string;
}

export interface CampaignBatch {
  run_id: string;
  status: CampaignBatchStatus;
  audience: string;
  suppression_checked: boolean;
  approved_by?: string;
  touch: CampaignTouch;
  canary_recipient_count: number;
  receipts: SendSafetyReceiptV1[];
}

export type CreateCanaryBatchResult =
  | { ok: true; batch: CampaignBatch }
  | { ok: false; batch: CampaignBatch; reason: string };

export type TransitionToSendingResult =
  | { ok: true; batch: CampaignBatch }
  | { ok: false; batch: CampaignBatch; reason: string };

function buildGateState(batch: CampaignBatch): SendSafetyState {
  return {
    audience: batch.audience,
    suppression_checked: batch.suppression_checked,
    run_id: batch.run_id,
    batch_status: batch.status,
    approved_by: batch.approved_by,
    subject: batch.touch.subject,
    html: batch.touch.html,
    text: batch.touch.text,
  };
}

function mergeDeps(
  batch: CampaignBatch,
  overrides?: Partial<SendSafetyGateDeps>,
): SendSafetyGateDeps {
  const extraWriter = overrides?.writeReceipt;
  return {
    ...overrides,
    writeReceipt: async (receipt) => {
      batch.receipts.push(receipt);
      if (extraWriter) await extraWriter(receipt);
    },
  };
}

/**
 * Call site #1 — create a canary batch (status `canary`) after `gate.send_safety`.
 * Does not call Mailgun.
 */
export async function createCanaryBatch(args: {
  audience: string;
  touch: CampaignTouch;
  suppression_checked: boolean;
  canary_recipient_count?: number;
  approved_by?: string;
  run_id?: string;
  gate?: Partial<SendSafetyGateDeps>;
}): Promise<CreateCanaryBatchResult> {
  const batch: CampaignBatch = {
    run_id: args.run_id ?? randomUUID(),
    status: "planned",
    audience: args.audience,
    suppression_checked: args.suppression_checked,
    approved_by: args.approved_by,
    touch: args.touch,
    canary_recipient_count: args.canary_recipient_count ?? 1,
    receipts: [],
  };

  const gate = await runSendSafetyGate({
    hook: "canary_batch_create",
    state: { ...buildGateState(batch), batch_status: "planned" },
    deps: mergeDeps(batch, args.gate),
  });

  if (!gate.ok) {
    batch.status = "planned";
    return { ok: false, batch, reason: gate.reason };
  }

  batch.status = "canary";
  return { ok: true, batch };
}

/**
 * Call site #2 — transition canary → sending after `gate.send_safety`, before Mailgun.
 */
export async function transitionCanaryToSending(args: {
  batch: CampaignBatch;
  gate?: Partial<SendSafetyGateDeps>;
}): Promise<TransitionToSendingResult> {
  const batch = args.batch;
  if (batch.status !== "canary") {
    return { ok: false, batch, reason: `expected canary, got ${batch.status}` };
  }

  const gate = await runSendSafetyGate({
    hook: "canary_to_sending",
    state: buildGateState(batch),
    deps: mergeDeps(batch, args.gate),
  });

  if (!gate.ok) {
    return { ok: false, batch, reason: gate.reason };
  }

  batch.status = "sending";
  return { ok: true, batch };
}

export function createBatchReceiptStore(): {
  batches: CampaignBatch[];
  gate: SendSafetyGateDeps;
} {
  const globalReceipts: SendSafetyReceiptV1[] = [];
  const batches: CampaignBatch[] = [];
  const gate: SendSafetyGateDeps = {
    writeReceipt: createInMemoryReceiptWriter(globalReceipts),
  };
  return { batches, gate };
}
