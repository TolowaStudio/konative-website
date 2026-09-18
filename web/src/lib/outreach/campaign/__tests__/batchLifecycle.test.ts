import { describe, expect, it, vi } from "vitest";

import { createCanaryBatch, transitionCanaryToSending } from "@/lib/outreach/campaign/batchLifecycle";
import { dispatchCanaryBatchMailgun } from "@/lib/outreach/campaign/dispatchBatchMailgun";
import { createInMemoryReceiptWriter } from "@/lib/jev/receipts";

describe("campaign batch lifecycle + send gate", () => {
  const touch = {
    subject: "TBCP implementation connectivity",
    html: "<p>Personalized touch</p>",
    text: "Personalized touch",
  };

  it("createCanaryBatch stays planned when gate transport fails", async () => {
    const fetchImpl = vi.fn(async () => new Response("error", { status: 500 }));
    const created = await createCanaryBatch({
      audience: "tbcp-segment-a",
      touch,
      suppression_checked: true,
      gate: {
        getMode: () => "shadow",
        resolveApiKey: () => "key",
        fetchImpl,
      },
    });
    expect(created.ok).toBe(false);
    expect(created.batch.status).toBe("planned");
    expect(created.batch.receipts).toHaveLength(1);
  });

  it("does not reach sending when canary→sending gate fails", async () => {
    const global: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    let calls = 0;
    const fetchImpl = vi.fn(async () => {
      calls += 1;
      if (calls === 1) {
        return Response.json({ nouls: { send_safe: { noul: 0.95 } } });
      }
      return new Response("fail", { status: 502 });
    });

    const created = await createCanaryBatch({
      audience: "tbcp-segment-a",
      touch,
      suppression_checked: true,
      gate: {
        getMode: () => "shadow",
        resolveApiKey: () => "key",
        fetchImpl,
        writeReceipt: createInMemoryReceiptWriter(global),
      },
    });
    expect(created.ok).toBe(true);
    expect(created.batch.status).toBe("canary");

    const transition = await transitionCanaryToSending({
      batch: created.batch,
      gate: {
        getMode: () => "shadow",
        resolveApiKey: () => "key",
        fetchImpl,
      },
    });
    expect(transition.ok).toBe(false);
    expect(transition.batch.status).toBe("canary");
  });

  it("dispatchCanaryBatchMailgun never calls mailgun when gate blocks", async () => {
    const mailgun = await import("@/lib/outreach/mailgun");
    const sendSpy = vi.spyOn(mailgun, "sendOutreachEmail").mockResolvedValue({ ok: true, id: "x" });

    const created = await createCanaryBatch({
      audience: "tbcp-segment-a",
      touch,
      suppression_checked: true,
      gate: {
        getMode: () => "shadow",
        resolveApiKey: () => "key",
        fetchImpl: vi.fn(async () => new Response("nope", { status: 401 })),
      },
    });
    expect(created.ok).toBe(false);

    const batch = {
      ...created.batch,
      status: "canary" as const,
    };

    const dispatch = await dispatchCanaryBatchMailgun({
      batch,
      to: "test@example.com",
      gate: {
        getMode: () => "shadow",
        resolveApiKey: () => "key",
        fetchImpl: vi.fn(async () => new Response("nope", { status: 401 })),
      },
    });

    expect(dispatch.ok).toBe(false);
    expect(dispatch.batch.status).toBe("canary");
    expect(sendSpy).not.toHaveBeenCalled();
    sendSpy.mockRestore();
  });
});
