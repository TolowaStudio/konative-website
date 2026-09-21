# Konative CRM campaign audit

This is the read-only Phase 0 gate for the Konative tribal outreach program. It
does not mutate Twenty, create an audience snapshot, or call a sender.

## What it produces

- a sanitized baseline summary and policy receipt;
- the exact 605-record technically eligible manifest;
- a deterministic, scored 164-person proposed working cohort;
- the 21 unsafe legacy `QUEUED` records with exclusion reasons;
- a stratified 10-record BrowserOS research queue;
- minimized BrowserOS job packets that deliberately omit email;
- SHA-256 checksums for every output.

The 164-person file is a proposal. It is not an approved campaign audience. All
records remain blocked until current public-role evidence, suppression,
jurisdiction policy, evidence freshness, personalization review, and human
approval pass.

## Run

Write outputs outside the Git repository. The tool refuses to place private CRM
artifacts under the repo root.

```bash
export TWENTY_API_TOKEN="$(gcloud secrets versions access latest \
  --secret=motion-twenty-crm-api-token \
  --project=tolowa-studio)"

node scripts/konative-crm-campaign-audit.mjs \
  --output-dir /absolute/private/output/path \
  --expected-eligible 605 \
  --expected-queued 21 \
  --expected-candidate-membership-sha256 <approved-605-member-hash> \
  --expected-working-cohort-membership-sha256 <approved-164-member-hash> \
  --expected-queued-membership-sha256 <approved-21-member-hash> \
  --cohort-size 164 \
  --pilot-size 10 \
  --fail-on-baseline-drift

unset TWENTY_API_TOKEN
```

The three membership hashes contain only sorted Twenty person IDs: the 605
currently eligible candidates, the score-selected 164-person working cohort,
and the 21 unsafe queued records. Mutable CRM fields can still change who is
eligible or selected, so a resulting membership change intentionally produces
drift. The full-content hashes separately prove snapshot integrity. If an
expected membership hash is omitted, its check is `NOT_ASSERTED`; the overall
baseline is never presented as reproduced. With `--fail-on-baseline-drift`, all
three expected hashes are required and a mismatch exits 3. A first baseline-
establishment run must omit that flag, record the emitted hashes, and then
immediately rerun with all three expectations plus the flag.

The GraphQL reader requests 100 people per page and pauses 700 milliseconds
between pages to stay below the current Twenty API request ceiling. It retries
only rate-limit and server failures. GraphQL errors fail the run.

## Test

```bash
node --test scripts/test-konative-crm-campaign-audit.mjs
node --test scripts/test-konative-enrichment-cost-report.mjs
node --test scripts/test-konative-twenty-evidence-writer.mjs
```

## Reviewed BrowserOS evidence writer

`scripts/konative-twenty-evidence-writer.mjs` is deliberately limited to the
existing Person enrichment fields `evidenceUrl`, `enrichmentSource`, and
`enrichmentRun`. It has no sender, audience, or campaign operations. It reads
an approved BrowserOS evidence JSON packet, introspects the live Twenty schema,
including the exact `enrichmentSource` enum before it plans a change, and writes
a mode-0600 receipt outside the repository. BrowserOS is explicitly mapped to
Twenty's existing `MANUAL` enum value: the original BrowserOS identifier remains
in `enrichmentRun` and the official evidence page remains in `evidenceUrl`.
If the live enum does not include `MANUAL`, the writer fails during dry-run and
cannot reach a mutation.

It is dry-run by default. `--apply` is required for a CRM mutation and must be
used only after a reviewer has approved the evidence packet and the dry-run
receipt. The first live invocation must be one reviewed record only.

## Cost gate

`config/konative-enrichment-cost-policy.json` is the source of truth for model
routing, verified unit prices, and hard run budgets. Generate a report from the
measured BATON event spool rather than estimating actual spend:

```bash
node scripts/konative-enrichment-cost-report.mjs \
  --policy config/konative-enrichment-cost-policy.json \
  --events "$HOME/.local/state/motion/baton/events.jsonl" \
  --run-id konative-example-run \
  --output-json /absolute/private/output/path/cost-report.json \
  --output-md /absolute/private/output/path/cost-report.md
```

The default enrichment model is `deepseek-ai/DeepSeek-V4-Flash`. Higher-cost
models are exception lanes. Unknown cost, missing usage, truncation, malformed
output, and paid fallback all block the run.

## Safety properties

- dry-run mode makes only GraphQL introspection and person-read queries;
- apply mode can issue only the audited `updatePerson` mutation after the
  live enum preflight accepts the BrowserOS-to-`MANUAL` mapping;
- there are no REST writes, webhook calls, audience operations, or sender calls;
- the API token comes from the environment and is never written;
- output directory mode is `0700`, and artifact mode is `0600`;
- the manifest is deterministic for the same CRM state and policy version;
- baseline drift can fail the run before downstream work begins.

## Historical 164-person cohort

The June campaign is known from durable memory as 17 TBCP award matches, 87
tribal-domain contacts, and 60 casino/gaming contacts. The current repository
does not contain the old matching or send scripts, current Git refs have no path
history for them, and Twenty has no campaign segment assigned to any person.
`outreachSegment=SEGMENT_A` appears on 96 records, which does not reproduce the
164-person cohort. Therefore the audit labels the scored 164 as a proposed
replacement and does not claim record-level reconciliation.
