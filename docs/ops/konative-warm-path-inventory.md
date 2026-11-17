# Konative warm-path inventory (TOL-3555, W3b of TOL-3545)

Tool: `scripts/konative-warm-path-inventory.mjs`. Tests: `scripts/test-konative-warm-path-inventory.mjs`.

## Rule it enforces

Decision of record (TOL-3559, 2026-11-15): warm intros only, $0. A Twenty person is
warm only with evidence of a real two-way prior relationship. These count:

| Class | Evidence in Twenty |
|---|---|
| `opportunity` | the person is point of contact on an opportunity |
| `meeting` | the person is a calendar event participant |
| `reply` | a message participant row with role `from` (they wrote to us; `to`/`cc` do not count) |
| `inbound` | `sourceProject` says they came to Konative first (form, Cal.com, LinkedIn inbound) |

Imported-list attributes (tribal vertical, gaming category, campaign segment, job
title, domain match) are never evidence. `doNotContact`, `DNC`, `OPTED_OUT`,
`BOUNCED` and legacy `QUEUED` always exclude, even with evidence.

Duplicates collapse on primary email and on name + company; the best-evidenced record is
kept and the rest are listed under `duplicates`.

Free public sources (`--public-candidates file.json`) only produce candidate
*accounts reached through a warm channel*. Each needs an https `source_url`, a
`channel` of `avant|t4devco|tribal|referral`, a named `introducer` and an
`evidence` sentence. No introducer means cold, which is out of scope. Contact
details are rejected. These are never written to Twenty by the tool; they sit in
the inventory as `needs_human_before_twenty_write`.

## Run (two steps, the second only after a human reviews the first)

The API token must come from Secret Manager into the runner's environment by a
human or an approved credential lane. Write output outside the repo (the tool
refuses otherwise).

1. Read-only inventory. No Twenty write.
   ```bash
   TWENTY_API_TOKEN=... node scripts/konative-warm-path-inventory.mjs \
     --output-dir /absolute/private/path [--public-candidates /absolute/path.json]
   ```
   It prints counts, the K2 status and the SHA-256 of `inventory.json`.
   `k2_status`: `BREACH` (< 20 real warm contacts, the 2026-12-05 kill criterion),
   `BELOW_TARGET` (< 40), `MET`.

2. Log to Twenty, additive only. One Note per warm person, titled
   `[konative-warm-path] <run>`, attached to that person, plus `undo.json`.
   ```bash
   TWENTY_API_TOKEN=... node scripts/konative-warm-path-inventory.mjs \
     --output-dir /absolute/private/path --apply \
     --inventory /absolute/private/path/inventory.json \
     --approval-sha256 <sha256 printed by step 1 after review> --limit 1
   ```
   `--limit` defaults to 1 and is capped at 25. Do the first run on one record,
   check the note in Twenty, then raise it. People who already carry a marker
   note are skipped, so re-running is safe.

**Undo:** `undo.json` lists every created `note_id`; `deleteNote` on each reverses
the run. The tool never edits an existing Person or Company field and never
creates a Person or Company.

## Known limits

- **Not yet run against live Twenty.** The lane that built this could not read
  the Twenty token (secret-export guard, TOL-2027). Tests cover the logic with
  synthetic data only.
- The reader asks the live `Person` type which signal relations exist and queries
  only those (`pointOfContactForOpportunities`, `calendarEventParticipants`,
  `messageParticipants`). The inventory reports which were unavailable. If the
  live relation or field names differ, step 1 fails or returns fewer signals; it
  does not guess.
- The note create/target mutations and the marker lookup
  (`notes(filter: { title: { like } })`) are unverified against the live schema.
  That is why the first `--apply` is one record.
- Each person's evidence is capped at 10 items in the inventory.
- Whether the count reaches the 2026-12-05 target of 40 is unknown until step 1 runs.
