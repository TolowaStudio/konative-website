# K-0 — `gate.send_safety` shadow wiring (Konative outreach)

Shadow-wires Baton work type **`gate.send_safety`** at:

1. **Canary batch create** — `createCanaryBatch()` in `@/lib/outreach/campaign/batchLifecycle`
2. **Canary → sending** — `transitionCanaryToSending()` (and `dispatchCanaryBatchMailgun()`), immediately **before** any Mailgun HTTP call

## Env flag

| Value | Behavior |
|-------|----------|
| `shadow` (default when set explicitly) | Invoke gate, append receipt, fail-closed on transport/auth/invalid response; fail-closed on deny for canary→sending (and on deny at canary create) |
| `steer` | Invoke + receipt; do not block on deny (plumbing prove) |
| `off` | Kill-switch — no HTTP invoke; receipt notes `skipped_off` |

Variable: **`KONATIVE_JEV_SEND_GATE`**

NTIA CLI (`scripts/ntia-outreach-send.ts`): if `KONATIVE_JEV_SEND_GATE` is **unset**, dry-run defaults to `off` and live send defaults to `shadow` (so local previews do not require TypeSafe keys).

## Auth (never log values)

- `TYPESAFE_API_KEY` — Cloud Run / GSM `typesafe-jev-api-key` (Tolowa pattern)
- Optional aliases: `KONATIVE_TYPESAFE_API_KEY`, `TYPESAFE_JEV_API_KEY`

## Transport

1. **`KONATIVE_BATON_JEV_INVOKE_URL`** or **`BATON_JEV_INVOKE_URL`** — motion-control Baton invoke (`workType: gate.send_safety`) when set
2. Else direct TypeSafe **`POST https://api.typesafe.ai/v1/systemone`** with Noul question `send_safe`

Optional Baton principal header: `KONATIVE_BATON_JEV_INVOKE_TOKEN` / `BATON_JEV_INVOKE_TOKEN`

## Receipts

Schema: **`konative.jev-send-safety-receipt.v1`** (JSONL via `KONATIVE_JEV_RECEIPT_DIR` when set from server code paths)

Fields include: truncated touch body + `body_sha256`, `channel: mailgun`, `audience`, `suppression_checked`, `run_id`, batch status, `approved_by`, gate transport/decision metadata.

## Tests

```bash
cd web && npm run test -- src/lib/jev/__tests__/sendSafetyGate.test.ts src/lib/outreach/campaign/__tests__/batchLifecycle.test.ts
```

The send-gate unit test includes a **20-receipt mock canary prove path** (no production Mailgun).
