# Factory E2E — one prove recipe (Konative)

Plain-English path from a Linear contract to a gated staging deploy. One loop
only: decide → build → verify → activate commercial → measure → weekly
continue / change / stop.

This is **not** a signed reference tape. Jeramey HOLD still applies until a
real cycle is proved twice. No three-OS architecture.

Loop map: [`docs/FACTORY.md`](FACTORY.md). Spec draft (unsigned):
[Handoff 2 Factory packet](https://app.notion.com/p/3dd32e0a547481febcc8f99b5246e6ca).

## The recipe (do this)

1. **Decide — Linear issue with acceptance.**
   Open a Linear issue (example: TOL-639). It must name owner, constraint,
   success metric, no-go, and a checklist of acceptance criteria. If acceptance
   is missing, stop. Do not guess.

2. **Build — branch + PR.**
   Create a feature branch. Change code or docs in this repo. Open a pull
   request to `main`. The PR body must repeat the Linear identifier and the
   acceptance checklist (see `.github/PULL_REQUEST_TEMPLATE.md`). Instruction
   files (`AGENTS.md`, `CLAUDE.md`, `now.md`) live **in this repo**.

3. **Verify — Factory CI green.**
   GitHub Actions workflow **Factory CI** runs on the PR. The required check
   name is `lint · typecheck · smoke`.
   - Lint = instruction-file smoke (`scripts/factory-smoke.mjs`). There is no
     ESLint in `web/`.
   - Typecheck = `npm run typecheck` in `web/`.
   - Smoke = the same factory script plus the Vitest files under
     `web/src/lib/__tests__/`.
   Red CI means the PR is not mergeable under the factory rule. Do not bypass.

4. **Merge / deploy only on green.**
   Merge is a **ship** gate (Jeramey). After merge to `main`,
   `deploy-cloud-run.yml` starts **Factory CI** again (`needs: factory-gates`)
   and only then builds the image and deploys Cloud Run
   `konative-website-staging`. A failed Factory CI stops deploy. Agents do not
   merge or deploy.

5. **Activate commercial / measure / weekly decide — later.**
   Those loop stages are real, and they are **not** part of this prove recipe
   yet. See “What is not done yet.”

## What this repo already has

- In-repo instruction files as source of truth
- Factory CI on pull request and on push to `main`
- Fail-closed smoke if the loop map, prove recipe, or deploy gate is removed
- Staging Cloud Run workflow that cannot skip Factory CI
- GitHub issue/PR templates that require acceptance criteria

## What is not done yet

Do not treat these as complete. Speed is fine; fake complete is not.

| Gap | Why it still matters |
|-----|----------------------|
| **Eval harness** | Spec step 7. No known-good task set, no baseline, no merge block on drift. |
| **M1 runner** | Spec step 6. No self-hosted runner registered or proved on a real job. |
| **GTM send** | Mailgun / Resend campaign / Twenty outreach stay gated. No send from factory work. |
| **GitHub required checks** | Files cannot turn on branch protection. Desk must require `lint · typecheck · smoke` on `main`. Until then a human can merge a red PR. |
| **`dev` → staging → prod branches** | Default is still `main`. Do not rename in this slice. |
| **Separate prod deploy** | The only deploy workflow is **staging** (`konative-website-staging`). `konative.com` already fronts that service. There is no second prod workflow to invent. |
| **Manual `gcloud` bypass** | An operator can still deploy from a laptop. In-repo Actions cannot stop that. |
| **Spec SIGN / reference tape** | Jeramey has not SIGNed the Factory Spec. Full cycle must be proved **twice** before templating other projects. |
| **Linear issue templates** | Linear has no team issue templates via API. GitHub templates carry the acceptance gate in-repo. |
| **Production `next build` on PRs** | Image build needs `NEXT_PUBLIC_*` and runs only in the gated deploy job. |

## Honest status of this slice

PR #77 was the starter (instruction files + first Factory CI). This E2E slice
extends that work: prove recipe, stronger smoke, and a deploy job that cannot
start until Factory CI passes.

It is **not** Spec SIGN. It is **not** a reference tape. It is one concrete
path you can click: Linear → branch → Factory CI → merge/deploy only on green.
