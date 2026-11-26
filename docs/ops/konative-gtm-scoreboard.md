# Konative weekly GTM scoreboard (W8)

TOL-3557, parent TOL-3545. Implements the "Weekly scoreboard (W8)" line in
`docs/strategy/2026-11-konative-venture-analysis.md` section 6 and the day-45 /
day-90 kill checks in section 7 (K2, K3, K4).

Read-only. It makes GraphQL `query` calls to Twenty and one HogQL `SELECT` to
PostHog. It sends nothing, writes nothing to Twenty, posts nothing to Linear and
spends nothing. The runner (below) posts the markdown it prints.

## Honest-number rules

- A number it could not measure is printed as `?` with a status
  (`NO_SOURCE`, `SCOPE_UNSET`, `ERROR`), never as `0`.
- A kill check only evaluates on a measured value. Unmeasured gives `UNKNOWN`,
  which the runner must surface, not skip.
- Opportunity metrics refuse to count until `twenty.opportunity_scope` is set,
  because the live Twenty holds other ventures' opportunities too (183 total on
  2026-11-15, only 9 with a Konative-style lane).
- Twenty stages seen but absent from the config mapping are listed as
  `Unmapped Twenty stages`.

## Run

```bash
# offline: shows the shape and every metric as unmeasured
node scripts/konative-gtm-scoreboard.mjs --skip-live

# live (fleet runner only): the Twenty token and the PostHog personal API key
# reach the process through the sanctioned secret wrapper (motion-secret run),
# never a file or a shell variable
node scripts/konative-gtm-scoreboard.mjs --output-dir /absolute/private/dir \
  --manual /absolute/private/dir/manual.json
```

The live run reads two environment variables, `TWENTY_API_TOKEN` and
`POSTHOG_PERSONAL_API_KEY`. `manual.json` carries the numbers with no system of
record yet, for example `{"warm_contacts": 31, "warm_asks": 6, "intros": 2}`. A
manual value wins over a derived one for the same key.

## Metric sources today

| Metric | Source | State |
|---|---|---|
| meetings, proposals, orders | Twenty opportunity stage, scoped to Konative | needs `opportunity_scope` (step 1) |
| warm contacts, asks, intros, snapshots, inbound requests, registrations, MRC | manual file | no system of record until W3b/W3c (TOL-3555, TOL-3556) land fields in Twenty |
| visitors (unique, 7 days) | PostHog | wired |
| signups | manual file (`signups`) | no system of record yet |
| site traffic (pageviews, `/contact` pageviews, 7 days) | PostHog project 620985, `site=konative.com`, `env=prod` | wired; shows `error` until the key is supplied |

## Left to make it live (not done by this PR)

1. **Introspect Twenty and set the scope.** On a fleet host that is allowed to
   read the Twenty token, read the `Opportunity` fields and the stage enum. Set
   `twenty.opportunity_scope` in `config/konative-gtm-scoreboard.json` to the
   field and values that mean Konative, and correct `CUSTOMER` and the other
   stage names to match the live enum. An agent lane may not export or write
   that token (lane-auth-guard, TOL-2027), which is why this PR was built
   against fixtures and has no live run.
2. **Run it once by hand and compare to Twenty's own UI counts.**
3. **Schedule weekly** (Mondays) as a non-lane job on an existing fleet machine
   at $0, using `motion-secret run` for both secrets. Output goes to a private
   directory; the runner appends the markdown as a TOL-3545 comment (through the
   Linear relay, not a new credential) and writes a Stash note.
4. **PostHog key:** `motion-posthog-personal-api-key` and
   `posthog-usage-readonly-key` already exist in Secret Manager; use the
   read-only one if it can run HogQL queries.

## Test

```bash
node --test scripts/test-konative-gtm-scoreboard.mjs
```

CI (`.github/workflows/ci.yml`) does not run `scripts/` tests today; run this
file by hand before changing the script.
