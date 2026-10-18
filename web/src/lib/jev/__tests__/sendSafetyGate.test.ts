import { describe, expect, it, vi } from "vitest";

import { createInMemoryReceiptWriter } from "@/lib/jev/receipts";
import { getSendGateMode, isSendGateInvokeEnabled } from "@/lib/jev/sendGateMode";
import { runSendSafetyGate } from "@/lib/jev/sendSafetyGate";

describe("sendGateMode", () => {
  it("defaults to shadow", () => {
    expect(getSendGateMode({})).toBe("shadow");
  });

  it("honors off", () => {
    expect(getSendGateMode({ KONATIVE_JEV_SEND_GATE: "off" })).toBe("off");
    expect(isSendGateInvokeEnabled("off")).toBe(false);
  });
});

describe("runSendSafetyGate", () => {
  const baseState = {
    audience: "ntia-round3-tbcp",
    suppression_checked: true,
    run_id: "run-test-1",
    batch_status: "canary" as const,
    subject: "Konative connectivity review",
    html: "<p>Hello</p>",
    text: "Hello",
  };

  it("off mode skips invoke and writes receipt", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const fetchImpl = vi.fn();
    const result = await runSendSafetyGate({
      hook: "canary_to_sending",
      state: baseState,
      deps: {
        getMode: () => "off",
        writeReceipt: createInMemoryReceiptWriter(store),
        fetchImpl,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok && "skipped" in result) expect(result.skipped).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(store).toHaveLength(1);
    expect(store[0]?.gate.error_code).toBe("skipped_off");
  });

  it("shadow mode blocks on missing api key", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const result = await runSendSafetyGate({
      hook: "canary_to_sending",
      state: baseState,
      deps: {
        getMode: () => "shadow",
        resolveApiKey: () => null,
        writeReceipt: createInMemoryReceiptWriter(store),
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/missing/);
    expect(store[0]?.gate.transport_ok).toBe(false);
  });

  it("shadow mode blocks sending transition on HTTP 503", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const fetchImpl = vi.fn(async () => new Response("upstream", { status: 503 }));
    const result = await runSendSafetyGate({
      hook: "canary_to_sending",
      state: baseState,
      deps: {
        getMode: () => "shadow",
        resolveApiKey: () => "test-key",
        writeReceipt: createInMemoryReceiptWriter(store),
        fetchImpl,
      },
    });
    expect(result.ok).toBe(false);
    expect(store[0]?.gate.http_status).toBe(503);
  });

  it("shadow writes receipt and allows on high noul", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const fetchImpl = vi.fn(async () =>
      Response.json({
        nouls: {
          send_safe: { noul: 0.91, confidence: 0.88 },
        },
      }),
    );
    const result = await runSendSafetyGate({
      hook: "canary_to_sending",
      state: baseState,
      deps: {
        getMode: () => "shadow",
        resolveApiKey: () => "test-key",
        writeReceipt: createInMemoryReceiptWriter(store),
        fetchImpl,
      },
    });
    expect(result.ok).toBe(true);
    expect(store[0]?.touch.body_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(store[0]?.channel).toBe("mailgun");
  });

  it("steer mode allows even when gate denies", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const fetchImpl = vi.fn(async () =>
      Response.json({
        nouls: {
          send_safe: { noul: 0.12, confidence: 0.9 },
        },
      }),
    );
    const result = await runSendSafetyGate({
      hook: "canary_to_sending",
      state: baseState,
      deps: {
        getMode: () => "steer",
        resolveApiKey: () => "test-key",
        writeReceipt: createInMemoryReceiptWriter(store),
        fetchImpl,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok && "allow" in result) expect(result.allow).toBe(true);
  });
});

describe("mock canary receipt prove path (20 receipts)", () => {
  it("writes twenty shadow receipts without live Mailgun", async () => {
    const store: import("@/lib/jev/receipts").SendSafetyReceiptV1[] = [];
    const fetchImpl = vi.fn(async () =>
      Response.json({
        nouls: { send_safe: { noul: 0.93, confidence: 0.9 } },
      }),
    );

    for (let i = 0; i < 20; i += 1) {
      await runSendSafetyGate({
        hook: i % 2 === 0 ? "canary_batch_create" : "canary_to_sending",
        state: {
          audience: `segment-a-canary-${i}`,
          suppression_checked: true,
          run_id: `prove-run-${i}`,
          batch_status: i % 2 === 0 ? "planned" : "canary",
          subject: `Touch ${i}`,
          html: `<p>Canary body ${i}</p>`,
        },
        deps: {
          getMode: () => "shadow",
          resolveApiKey: () => "test-key",
          writeReceipt: createInMemoryReceiptWriter(store),
          fetchImpl,
        },
      });
    }

    expect(store).toHaveLength(20);
    expect(store.every((r) => r.schema === "konative.jev-send-safety-receipt.v1")).toBe(true);
    expect(store.every((r) => r.channel === "mailgun")).toBe(true);
  });
});
