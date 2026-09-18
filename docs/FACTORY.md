# Factory — Konative first slice

Konative is the **reference candidate**, not a signed reference tape. Prove every
gate here, then template. This page maps GitHub / Linear / instruction files onto
the **SIGNED** Motion OS loop
([TOL-638](https://linear.app/tolowastudio/issue/TOL-638/motion-os-first-principles-review-handoff-1),
2026-09-17). Spec: [Handoff 2 Factory packet](https://app.notion.com/p/3dd32e0a547481febcc8f99b5246e6ca)
(draft — **not** Jeramey SIGN).

One loop only. No three-OS top architecture. No stage advance without the gate.

Clickable prove recipe: [`docs/FACTORY-E2E.md`](FACTORY-E2E.md).

## Loop → factory gates

| Loop stage | Exit gate (SIGNED) | Factory responsibility on this repo |
|------------|--------------------|-------------------------------------|
| 1. Decision / contract | Named owner, constraint, success metric, no-go | Linear issue **with acceptance criteria**. Agents reject work that lacks them. |
| 2. Build / deliver | Scope match; artifacts in hub/repo | Feature branch + PR. Instruction files live **in this repo**. |
| 3. Release verify | Verified flow + acceptance evidence URL | Factory CI (`lint · typecheck · smoke`) on every push/PR. Cloud Run deploy **needs** that workflow. |
| 4. Activate commercial | One live offer path + demand owner | **After** harness exists. Konative GTM / send stays gated. |
| 5. Measure + service health | Revenue/service metric + next decision date | Factory metrics feed the project contract. They do not replace it. |
| 6. Weekly decide | Continue / change / stop — written | Desk writes the decision. CI does not auto-continue. |

Human gates remain: **pay · send · sign · delete · ship**.

## Instruction files (source of truth)

| File | Role |
|------|------|
| [`AGENTS.md`](../AGENTS.md) | Who may act, authority, forbidden |
| [`CLAUDE.md`](../CLAUDE.md) | Project context and conventions |
| [`now.md`](../now.md) | Current focus |

An instruction-file change is a behavior change — same branch discipline as code.
Do not treat hand-edited local copies as authority.

## Required checks (Factory CI)

Workflow: [`.github/workflows/factory-ci.yml`](../.github/workflows/factory-ci.yml)

**Required check name on pull requests:** `lint · typecheck · smoke`

| Gate | How | Fail closed |
|------|-----|-------------|
| Lint | `node scripts/factory-smoke.mjs` (required files + phrases + deploy `needs`). No ESLint in `web/` — do not invent one. | Missing/empty instruction files, loop map, prove recipe, or un-gated deploy |
| Typecheck | `npm run typecheck` in `web/` (`tsc --noEmit`) | Type errors block the PR |
| Smoke | Same factory script + Vitest unit files under `web/src/lib/__tests__/` | Broken test or missing factory docs |

GitHub-hosted runners only.

Production `next build` is **not** a PR step. It needs `NEXT_PUBLIC_*` baked at
image build time and runs in [`.github/workflows/deploy-cloud-run.yml`](../.github/workflows/deploy-cloud-run.yml)
**after** `needs: factory-gates`. That is the ship path, not an agent action.

Desk still needs to mark `lint · typecheck · smoke` required in GitHub branch
protection. Files cannot set that. Until then, a human merge without the check
is still possible — treat that as a remaining gap, not a pass.

## Deploy gate (existing Cloud Run workflow)

There is already a staging deploy: `konative-website-staging` via
`deploy-cloud-run.yml`. There is **no** separate prod deploy workflow in this
repo. Do not invent one.

That workflow now calls Factory CI first:

```yaml
jobs:
  factory-gates:
    uses: ./.github/workflows/factory-ci.yml
  deploy:
    needs: factory-gates
```

`workflow_dispatch` on deploy also runs Factory CI first. A red Factory CI
blocks the image build and `gcloud run deploy`.

## Branch discipline

- **Today:** default branch is `main`. Agents open PRs to `main`. **No agent
  commits to `main` or prod.**
- **Target (later, not this PR):** `dev` → `test/staging` → `prod`. Do not
  rename default in this slice.

## Linear-gated planning

No work starts without a Linear issue that defines plan + acceptance criteria.
GitHub issue/PR templates in `.github/` require the same checklist so a PR
without acceptance is incomplete.

## Eval harness (stub — step 7, not this PR)

Small set of representative tasks with known-good outputs. Run on (1) new model,
(2) instruction-file change, (3) nightly. A measurable drop vs baseline **blocks
merge**. No agent override. Jeramey may override manually. **Not wired yet.**

## Next steps (not this PR)

| Step | Work |
|------|------|
| 6 | Register M1 Mini as a **self-hosted** runner; prove it on a real job before any eval depends on it |
| 7 | Build the eval harness; capture baseline; wire into staging |
| 8 | Full Konative cycle with zero gate bypass — prove **twice** |
| 9 | Only then template other projects |

Do not parallelize steps 5–8 to “save time.”

## Hard no

- No three-OS doctrine
- No GTM send / Mailgun / campaign wiring from factory work
- No templating other repos before Konative proves twice
- Sibling lane: AdvOS evidence UI — do not touch defending-katrina from this repo
- No claiming Spec SIGN or reference-tape status from this slice
