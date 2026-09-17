# Now — Konative

**Date:** 2026-09-17
**Linear:** [TOL-639](https://linear.app/tolowastudio/issue/TOL-639/handoff-2-factory-strategy-and-architecture-spec) (Handoff 2, steps 3–5)

## Current focus

**Factory harness first** on this repo (the reference project). Prove gates here before
templating any other project.

1. Instruction files in-repo (`AGENTS.md`, `CLAUDE.md`, this file) are source of truth.
2. Factory CI on every push/PR: instruction lint + typecheck + fail-closed smoke.
3. Loop map in [`docs/FACTORY.md`](docs/FACTORY.md) — SIGNED one-loop frame only.

## Gated (do not do)

- **GTM send** — Mailgun, Resend campaign, Twenty/Ghost outreach. Wait for Jeramey.
- M1 Mini as a GitHub self-hosted runner (factory step 6).
- Eval harness in CI (factory step 7). Stub only in `docs/FACTORY.md`.
- Templating other repos. AdvOS / defending-katrina (sibling lane).

## Loop in force

One loop only: decide → build → verify → activate commercial → measure → weekly
continue / change / stop.

No three-OS architecture. No stage advance without the gate.
