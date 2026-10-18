import type { CampaignBatch } from "@/lib/outreach/campaign/batchLifecycle";
import { transitionCanaryToSending } from "@/lib/outreach/campaign/batchLifecycle";
import type { SendSafetyGateDeps } from "@/lib/jev/sendSafetyGate";
import { sendOutreachEmail, type OutreachEmail, type OutreachResult } from "@/lib/outreach/mailgun";

export type DispatchCanarySendResult =
  | { ok: true; batch: CampaignBatch; send: OutreachResult }
  | { ok: false; batch: CampaignBatch; reason: string; send?: OutreachResult };

/**
 * Mailgun dispatch for an existing canary batch. Runs send_safety at canary→sending
 * immediately before the first Mailgun API call.
 */
export async function dispatchCanaryBatchMailgun(args: {
  batch: CampaignBatch;
  to: string | string[];
  tags?: string[];
  dryRun?: boolean;
  gate?: Partial<SendSafetyGateDeps>;
}): Promise<DispatchCanarySendResult> {
  const transition = await transitionCanaryToSending({ batch: args.batch, gate: args.gate });
  if (!transition.ok) {
    return { ok: false, batch: transition.batch, reason: transition.reason };
  }

  const email: OutreachEmail = {
    to: args.to,
    subject: args.batch.touch.subject,
    html: args.batch.touch.html,
    text: args.batch.touch.text,
    tags: args.tags,
    dryRun: args.dryRun,
  };

  const send = await sendOutreachEmail(email);
  if (!send.ok) {
    return { ok: false, batch: args.batch, reason: send.reason ?? "mailgun-failed", send };
  }

  args.batch.status = "completed";
  return { ok: true, batch: args.batch, send };
}
