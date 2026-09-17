# Konative — Agent Authority

Instruction files in this repo (`AGENTS.md`, `CLAUDE.md`, `now.md`) are the source of
truth. Do not treat hand-edited local copies as authority.

**Signed frame (TOL-638, 2026-09-17):** one loop only —
decide → build → verify → activate commercial → measure → weekly continue / change / stop.
No three-OS top architecture. Factory map: [`docs/FACTORY.md`](docs/FACTORY.md). Current
focus: [`now.md`](now.md). Site rules: [`web/AGENTS.md`](web/AGENTS.md).

## Who may act

| Actor | May | May not |
|-------|-----|---------|
| **Desk (Tolowa CTO)** | Order, no-go, dispatch, gates | Bypass Jeramey on pay / send / sign / delete / ship |
| **Cursor / coding agents** | Feature branches, PRs, local + CI verify, staging evidence | Commit to `main` / prod; merge; deploy; send; pay; sign |
| **Hermes@Mini + DeepInfra** | Long jobs, cheap inference | Phone interrupt; send / pay / sign |
| **Claude (Fable)** | Design and strategy | Execute, deploy, DNS, send, pay, spawn, or campaign send |
| **Jeramey** | Pay, send, sign, delete, ship (merge / prod deploy) | — |

Astra = Codex. Fable = Claude. Never reverse.

## Authority

- Agents work on branches and open PRs to the default branch (`main` today).
- Automated gates (Factory CI) must pass before review. Speed is granted; bypass is not.
- No work starts without a Linear issue that names owner, constraint, success metric, and
  **acceptance criteria**. Reject issues that omit acceptance criteria rather than guessing.
- Staging / Cloud Run deploy remains the existing `deploy-cloud-run.yml` path. Treat that
  as verify evidence, not a ship.

## Forbidden

- **No commits to `main` or prod.** No force-push to default. Open a PR.
- **No send / pay / sign / delete / ship.** Campaign and Mailgun sends wait for Jeramey.
- **No GTM send or campaign wiring** in factory-harness work.
- **No three-OS architecture** (Business / Web / GTM as peer OSes).
- **No secrets in git.** Probe GCP Secret Manager before asking Jeramey for credentials.
- **No AdvOS / defending-katrina** edits from this repo’s factory lane.

## Session start

1. Initialize Stash memory before substantive work.
2. Recall `/projects/konative` for this repo.
3. Recall `/tools` before stack, auth, credential, MCP, CLI, or architecture advice.
4. Read `now.md` and `.context/` for current focus and Conductor notes.
5. Use existing `web/` npm scripts for verification. Do not invent a second stack.

## Repo

- Origin: `https://github.com/tolowa-studio/konative-website.git`
- Stash namespace: `/projects/konative`
- Notion hub: [Konative.com — Project Hub](https://www.notion.so/34232e0a547481b39bc1e081765d6df6)
- Linear: issues are the contract. Notion is the library. Stash is the agent lock.

## Completion contract

Before marking work ready for review:

1. Run Factory CI locally (`node scripts/factory-smoke.mjs`, `npm run typecheck`, targeted
   `npm test` in `web/`) or explain why they could not run.
2. Summarize changed files and behavioral impact.
3. Leave acceptance results and a durable handoff in the PR (and Linear when possible).
4. Remember durable decisions in Stash when the tool is available.
5. Leave merge / deploy for the ship gate.
