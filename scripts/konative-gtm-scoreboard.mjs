#!/usr/bin/env node
// Konative weekly GTM scoreboard (W8, TOL-3557, parent TOL-3545).
//
// Read-only. Reads Twenty (GraphQL query operations only) and PostHog (one HogQL
// SELECT), merges optional manual inputs, and prints a markdown scoreboard plus a
// JSON twin. It sends nothing, writes nothing to Twenty and never posts to Linear:
// the fleet runner posts the markdown as a TOL-3545 comment and a Stash note.
//
// Core rule: a number we could not measure is never reported as zero. Every metric
// carries a status (OK, NO_SOURCE, SCOPE_UNSET, ERROR) and kill checks only fire on
// OK values.

import { mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY_MS = 86_400_000;

export const TWENTY_OPPORTUNITIES_QUERY = `
query KonativeScoreboardOpportunities($after: String) {
  opportunities(first: 100, after: $after) {
    edges { node { id stage createdAt SCOPE_FIELDS } }
    pageInfo { hasNextPage endCursor }
  }
}`;

export const TWENTY_PEOPLE_COUNT_QUERY = 'query KonativeScoreboardPeople { people { totalCount } }';

export function assertReadOnlyQuery(query) {
  if (!/^\s*query\b/.test(query) || /\b(mutation|subscription)\b/i.test(query)) {
    throw new Error('scoreboard may only send GraphQL query operations');
  }
  return query;
}

export function opportunityQuery(scope) {
  const field = scope?.field;
  if (field !== undefined && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(field)) {
    throw new Error(`invalid opportunity scope field: ${field}`);
  }
  return assertReadOnlyQuery(TWENTY_OPPORTUNITIES_QUERY.replace('SCOPE_FIELDS', field ?? ''));
}

export function scopeOpportunities(opportunities, scope) {
  if (!scope?.field || !Array.isArray(scope.values) || scope.values.length === 0) return null;
  const wanted = new Set(scope.values.map((v) => String(v).toUpperCase()));
  return opportunities.filter((opp) => wanted.has(String(opp[scope.field] ?? '').toUpperCase()));
}

export function countByStage(opportunities) {
  const counts = {};
  for (const opp of opportunities) {
    const stage = String(opp.stage ?? 'UNKNOWN').toUpperCase();
    counts[stage] = (counts[stage] ?? 0) + 1;
  }
  return counts;
}

function dayDiff(a, b) {
  return Math.floor((Date.parse(a) - Date.parse(b)) / DAY_MS);
}

function resolveDate(when, config) {
  return config[when] ?? when;
}

// inputs: { opportunities: Array|null, opportunitiesError?: string, manual: {key:number}, now: ISO }
export function measureMetric(metric, config, inputs) {
  const base = { key: metric.key, label: metric.label, target: metric.target ?? null, due: metric.due };
  const manual = inputs.manual?.[metric.key];
  if (typeof manual === 'number' && Number.isFinite(manual)) {
    return { ...base, status: 'OK', value: manual, via: 'manual' };
  }
  const source = metric.source ?? { kind: 'manual' };
  if (source.kind === 'opportunity_stage') {
    if (inputs.opportunitiesError) return { ...base, status: 'ERROR', value: null, detail: inputs.opportunitiesError };
    const scoped = scopeOpportunities(inputs.opportunities ?? [], config.twenty?.opportunity_scope);
    if (scoped === null) {
      return { ...base, status: 'SCOPE_UNSET', value: null, detail: 'twenty.opportunity_scope is not configured; refusing to count other ventures' };
    }
    const wanted = new Set(source.stages.map((s) => s.toUpperCase()));
    return { ...base, status: 'OK', value: scoped.filter((o) => wanted.has(String(o.stage ?? '').toUpperCase())).length, via: 'twenty' };
  }
  return { ...base, status: 'NO_SOURCE', value: null, detail: 'no measured source yet; supply --manual or wire the source' };
}

function paceFor(metric, today, config) {
  if (metric.status !== 'OK' || metric.target == null) return null;
  const total = dayDiff(metric.due, config.window_start);
  const elapsed = Math.max(0, Math.min(total, dayDiff(today, config.window_start)));
  if (total <= 0) return null;
  const expected = (metric.target * elapsed) / total;
  return { expected_by_today: Number(expected.toFixed(1)), behind: metric.value < expected };
}

export function evaluateKillChecks(config, metricsByKey, today) {
  return (config.kill_checks ?? []).map((check) => {
    const when = resolveDate(check.when, config);
    if (today < when) return { id: check.id, when, state: 'NOT_DUE', action: check.action };
    const metric = metricsByKey[check.metric];
    const other = check.and_metric ? metricsByKey[check.and_metric] : null;
    const unmeasured = [metric, other].filter(Boolean).filter((m) => m.status !== 'OK');
    if (!metric || unmeasured.length) {
      return {
        id: check.id, when, state: 'UNKNOWN', action: check.action,
        detail: `cannot evaluate: ${unmeasured.map((m) => `${m.key}=${m.status}`).join(', ') || `${check.metric} missing`}`,
      };
    }
    let fired;
    if (check.trigger === 'below') fired = metric.value < check.threshold;
    else if (check.trigger === 'equals_zero_and') fired = metric.value === 0 && other.value === 0;
    else throw new Error(`unknown kill trigger: ${check.trigger}`);
    return { id: check.id, when, state: fired ? 'TRIGGERED' : 'CLEAR', action: check.action };
  });
}

export function buildScoreboard({ config, opportunities = null, opportunitiesError = null, peopleTotal = null, posthog = null, manual = {}, now }) {
  const today = now.slice(0, 10);
  const inputs = { opportunities, opportunitiesError, manual };
  const metrics = config.metrics.map((metric) => {
    const measured = measureMetric(metric, config, inputs);
    return { ...measured, pace: paceFor(measured, today, config) };
  });
  const metricsByKey = Object.fromEntries(metrics.map((m) => [m.key, m]));
  const known = new Set(config.metrics.flatMap((m) => (m.source?.stages ?? []).map((s) => s.toUpperCase())));
  const scoped = opportunities ? scopeOpportunities(opportunities, config.twenty?.opportunity_scope) : null;
  const stageCounts = scoped ? countByStage(scoped) : null;
  return {
    generated_at: now,
    version: config.version,
    day_of_window: dayDiff(today, config.window_start),
    days_to_day45: dayDiff(config.day45, today),
    days_to_day90: dayDiff(config.day90, today),
    metrics,
    kill_checks: evaluateKillChecks(config, metricsByKey, today),
    twenty: {
      people_total: peopleTotal,
      konative_opportunities_by_stage: stageCounts,
      unmapped_stages: stageCounts ? Object.keys(stageCounts).filter((s) => !known.has(s)) : null,
    },
    posthog,
  };
}

export function renderMarkdown(board) {
  const lines = [
    `## Konative weekly GTM scoreboard, ${board.generated_at.slice(0, 10)}`,
    '',
    `Day ${board.day_of_window} of 90. ${board.days_to_day45} days to the day-45 check, ${board.days_to_day90} to day 90. Read-only: nothing was sent, written or spent.`,
    '',
    '| Metric | Now | Target | Due | Status |',
    '|---|---|---|---|---|',
  ];
  for (const m of board.metrics) {
    const now = m.status === 'OK' ? String(m.value) : '?';
    const status = m.status === 'OK'
      ? (m.pace ? (m.pace.behind ? `behind pace (${m.pace.expected_by_today} expected)` : 'on pace') : 'OK')
      : m.status;
    lines.push(`| ${m.label} | ${now} | ${m.target ?? '-'} | ${m.due} | ${status} |`);
  }
  lines.push('', '**Kill checks**');
  for (const k of board.kill_checks) {
    const note = k.state === 'TRIGGERED' ? ` ${k.action}` : k.detail ? ` ${k.detail}` : '';
    lines.push(`- ${k.id} (${k.when}): ${k.state}.${note}`);
  }
  if (board.posthog) {
    lines.push('', '**Site (PostHog, last 7 days)**');
    if (board.posthog.error) lines.push(`- unavailable: ${board.posthog.error}`);
    else lines.push(`- pageviews: ${board.posthog.pageviews_7d}, /contact pageviews: ${board.posthog.contact_pageviews_7d}`);
  }
  if (board.twenty.unmapped_stages?.length) {
    lines.push('', `Unmapped Twenty stages (check config): ${board.twenty.unmapped_stages.join(', ')}`);
  }
  const unmeasured = board.metrics.filter((m) => m.status !== 'OK').map((m) => m.key);
  if (unmeasured.length) lines.push('', `Unmeasured, not zero: ${unmeasured.join(', ')}.`);
  return `${lines.join('\n')}\n`;
}

export async function fetchGraphql(baseUrl, token, query, variables = {}, fetchImpl = fetch) {
  assertReadOnlyQuery(query);
  const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Twenty HTTP ${response.status}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(`Twenty GraphQL: ${body.errors.map((e) => e.message).join('; ')}`);
  return body.data;
}

export async function fetchOpportunities({ baseUrl, token, scope, fetchImpl = fetch, pageDelayMs = 700 }) {
  const query = opportunityQuery(scope);
  const out = [];
  let after = null;
  for (let page = 0; page < 200; page += 1) {
    const data = await fetchGraphql(baseUrl, token, query, { after }, fetchImpl);
    const conn = data.opportunities;
    out.push(...conn.edges.map((e) => e.node));
    if (!conn.pageInfo.hasNextPage) return out;
    after = conn.pageInfo.endCursor;
    if (pageDelayMs) await new Promise((r) => setTimeout(r, pageDelayMs));
  }
  throw new Error('opportunity pagination did not terminate');
}

export function posthogQuery(site, env) {
  const s = site.replace(/'/g, '');
  const e = env.replace(/'/g, '');
  return `SELECT count() AS pageviews, countIf(properties.$pathname = '/contact') AS contact_pageviews FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY AND properties.site = '${s}' AND properties.env = '${e}'`;
}

export async function fetchPosthog({ cfg, key, fetchImpl = fetch }) {
  const response = await fetchImpl(`${cfg.host}/api/projects/${cfg.project_id}/query/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query: posthogQuery(cfg.site, cfg.env) } }),
  });
  if (!response.ok) throw new Error(`PostHog HTTP ${response.status}`);
  const row = (await response.json()).results?.[0];
  if (!Array.isArray(row)) throw new Error('PostHog returned no result row');
  return { pageviews_7d: Number(row[0]), contact_pageviews_7d: Number(row[1]) };
}

function parseArgs(argv) {
  const args = { outputDir: null, config: null, manual: null, offline: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--output-dir') args.outputDir = argv[++i];
    else if (a === '--config') args.config = argv[++i];
    else if (a === '--manual') args.manual = argv[++i];
    else if (a === '--skip-live') args.offline = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const here = fileURLToPath(new URL('.', import.meta.url));
  const config = JSON.parse(readFileSync(args.config ?? resolve(here, '../config/konative-gtm-scoreboard.json'), 'utf8'));
  const manual = args.manual ? JSON.parse(readFileSync(args.manual, 'utf8')) : {};
  const input = { config, manual, now: new Date().toISOString() };
  const token = (env.TWENTY_API_TOKEN ?? '').trim();
  if (!args.offline) {
    if (!token) throw new Error('TWENTY_API_TOKEN is required (or pass --skip-live)');
    try {
      input.opportunities = await fetchOpportunities({ baseUrl: config.twenty.base_url, token, scope: config.twenty.opportunity_scope });
      input.peopleTotal = (await fetchGraphql(config.twenty.base_url, token, TWENTY_PEOPLE_COUNT_QUERY)).people.totalCount;
    } catch (err) {
      input.opportunitiesError = err.message;
    }
    const key = (env.POSTHOG_PERSONAL_API_KEY ?? '').trim();
    input.posthog = key
      ? await fetchPosthog({ cfg: config.posthog, key }).catch((err) => ({ error: err.message }))
      : { error: 'POSTHOG_PERSONAL_API_KEY not set' };
  }
  const board = buildScoreboard(input);
  const markdown = renderMarkdown(board);
  if (args.outputDir) {
    mkdirSync(args.outputDir, { recursive: true, mode: 0o700 });
    for (const [name, body] of [['scoreboard.md', markdown], ['scoreboard.json', `${JSON.stringify(board, null, 2)}\n`]]) {
      const path = resolve(args.outputDir, name);
      writeFileSync(path, body, { mode: 0o600 });
      chmodSync(path, 0o600);
    }
  }
  process.stdout.write(markdown);
  return board;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(`konative-gtm-scoreboard: ${err.message}`); process.exit(1); });
}
