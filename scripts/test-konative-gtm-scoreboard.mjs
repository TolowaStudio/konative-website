import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  assertReadOnlyQuery,
  buildScoreboard,
  fetchGraphql,
  fetchOpportunities,
  fetchPosthog,
  opportunityQuery,
  posthogQuery,
  renderMarkdown,
} from './konative-gtm-scoreboard.mjs';

const realConfig = JSON.parse(readFileSync(new URL('../config/konative-gtm-scoreboard.json', import.meta.url), 'utf8'));
const scoped = (scope) => ({ ...realConfig, twenty: { ...realConfig.twenty, opportunity_scope: scope } });
const SCOPE = { field: 'lane', values: ['KONATIVE'] };
const opp = (stage, lane = 'KONATIVE') => ({ id: `${stage}-${lane}-${Math.random()}`, stage, lane });
const metric = (board, key) => board.metrics.find((m) => m.key === key);
const kill = (board, id) => board.kill_checks.find((k) => k.id === id);

test('the shipped config parses and every kill check names a configured metric', () => {
  const keys = new Set(realConfig.metrics.map((m) => m.key));
  for (const check of realConfig.kill_checks) {
    assert.ok(keys.has(check.metric), check.id);
    if (check.and_metric) assert.ok(keys.has(check.and_metric), check.id);
  }
});

test('with no opportunity scope configured, stage metrics are SCOPE_UNSET, not a count of every venture', () => {
  const board = buildScoreboard({ config: realConfig, opportunities: [opp('MEETING', 'SPOKANEWIRE'), opp('MEETING')], now: '2026-12-01T00:00:00Z' });
  assert.equal(metric(board, 'meetings').status, 'SCOPE_UNSET');
  assert.equal(metric(board, 'meetings').value, null);
});

test('scope filter counts only the configured venture, cumulative across later stages', () => {
  const board = buildScoreboard({
    config: scoped(SCOPE),
    opportunities: [opp('NEW'), opp('MEETING'), opp('PROPOSAL'), opp('MEETING', 'SPOKANEWIRE'), opp('PROPOSAL', 'SPOKANEWIRE')],
    now: '2026-12-01T00:00:00Z',
  });
  assert.equal(metric(board, 'meetings').value, 2);
  assert.equal(metric(board, 'proposals').value, 1);
  assert.equal(board.twenty.konative_opportunities_by_stage.MEETING, 1);
});

test('a metric with no source is unmeasured and never reported as zero', () => {
  const board = buildScoreboard({ config: scoped(SCOPE), opportunities: [], now: '2026-12-01T00:00:00Z' });
  assert.equal(metric(board, 'warm_contacts').status, 'NO_SOURCE');
  assert.equal(metric(board, 'warm_contacts').value, null);
  assert.match(renderMarkdown(board), /\| Warm contacts with relationship evidence \| \? \|/);
  assert.match(renderMarkdown(board), /Unmeasured, not zero: .*warm_contacts/);
});

test('K2 does not fire on an unmeasured warm_contacts; it reports UNKNOWN', () => {
  const board = buildScoreboard({ config: scoped(SCOPE), opportunities: [], now: '2026-12-06T00:00:00Z' });
  assert.equal(kill(board, 'K2').state, 'UNKNOWN');
});

test('K2 fires from a manual warm_contacts of 12 once 2026-12-05 has passed, and not before', () => {
  const after = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { warm_contacts: 12 }, now: '2026-12-06T00:00:00Z' });
  assert.equal(kill(after, 'K2').state, 'TRIGGERED');
  const before = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { warm_contacts: 12 }, now: '2026-12-04T00:00:00Z' });
  assert.equal(kill(before, 'K2').state, 'NOT_DUE');
  const enough = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { warm_contacts: 25 }, now: '2026-12-06T00:00:00Z' });
  assert.equal(kill(enough, 'K2').state, 'CLEAR');
});

test('K3 triggers at day 45 with fewer than 3 meetings and clears at 3', () => {
  const two = buildScoreboard({ config: scoped(SCOPE), opportunities: [opp('MEETING'), opp('MEETING')], now: '2026-12-31T12:00:00Z' });
  assert.equal(kill(two, 'K3').state, 'TRIGGERED');
  const three = buildScoreboard({ config: scoped(SCOPE), opportunities: [opp('MEETING'), opp('MEETING'), opp('MEETING')], now: '2026-12-31T12:00:00Z' });
  assert.equal(kill(three, 'K3').state, 'CLEAR');
  assert.equal(kill(buildScoreboard({ config: scoped(SCOPE), opportunities: [], now: '2026-12-30T12:00:00Z' }), 'K3').state, 'NOT_DUE');
});

test('K4 needs both registrations and proposals at zero', () => {
  const day90 = '2027-02-13T12:00:00Z';
  const both = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { registrations: 0 }, now: day90 });
  assert.equal(kill(both, 'K4').state, 'TRIGGERED');
  const oneProposal = buildScoreboard({ config: scoped(SCOPE), opportunities: [opp('PROPOSAL')], manual: { registrations: 0 }, now: day90 });
  assert.equal(kill(oneProposal, 'K4').state, 'CLEAR');
});

test('a Twenty read failure marks stage metrics ERROR and keeps the other metrics', () => {
  const board = buildScoreboard({ config: scoped(SCOPE), opportunitiesError: 'Twenty HTTP 502', manual: { warm_contacts: 30 }, now: '2026-12-01T00:00:00Z' });
  assert.equal(metric(board, 'meetings').status, 'ERROR');
  assert.equal(metric(board, 'warm_contacts').value, 30);
  assert.equal(kill(buildScoreboard({ config: scoped(SCOPE), opportunitiesError: 'x', now: '2027-01-01T00:00:00Z' }), 'K3').state, 'UNKNOWN');
});

test('pace flags a metric behind its straight-line target', () => {
  const behind = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { warm_contacts: 1 }, now: '2026-12-01T00:00:00Z' });
  assert.equal(metric(behind, 'warm_contacts').pace.behind, true);
  const ahead = buildScoreboard({ config: scoped(SCOPE), opportunities: [], manual: { warm_contacts: 40 }, now: '2026-12-01T00:00:00Z' });
  assert.equal(metric(ahead, 'warm_contacts').pace.behind, false);
});

test('stages missing from the config mapping are surfaced, not silently dropped', () => {
  const board = buildScoreboard({ config: scoped(SCOPE), opportunities: [opp('WON')], now: '2026-12-01T00:00:00Z' });
  assert.deepEqual(board.twenty.unmapped_stages, ['WON']);
  assert.match(renderMarkdown(board), /Unmapped Twenty stages.*WON/);
});

test('only GraphQL query operations can be sent', async () => {
  assert.throws(() => assertReadOnlyQuery('mutation { deleteOpportunity(id: "x") { id } }'), /only send GraphQL query/);
  assert.throws(() => assertReadOnlyQuery('query A { people { id } } mutation B { x }'), /only send GraphQL query/);
  let called = false;
  await assert.rejects(
    fetchGraphql('https://twenty.invalid', 't', 'mutation { x }', {}, async () => { called = true; }),
    /only send GraphQL query/,
  );
  assert.equal(called, false);
});

test('opportunity scope field is validated before it is spliced into the query', () => {
  assert.throws(() => opportunityQuery({ field: 'lane } mutation { x', values: ['A'] }), /invalid opportunity scope field/);
  assert.match(opportunityQuery({ field: 'lane', values: ['A'] }), /stage createdAt lane/);
});

test('fetchOpportunities follows pagination cursors and sends the bearer token', async () => {
  const pages = [
    { opportunities: { edges: [{ node: opp('NEW') }], pageInfo: { hasNextPage: true, endCursor: 'c1' } } },
    { opportunities: { edges: [{ node: opp('MEETING') }], pageInfo: { hasNextPage: false, endCursor: null } } },
  ];
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, auth: init.headers.authorization, vars: JSON.parse(init.body).variables });
    return { ok: true, json: async () => ({ data: pages[seen.length - 1] }) };
  };
  const all = await fetchOpportunities({ baseUrl: 'https://twenty.invalid/', token: 'tok', scope: SCOPE, fetchImpl, pageDelayMs: 0 });
  assert.equal(all.length, 2);
  assert.deepEqual(seen.map((s) => s.vars.after), [null, 'c1']);
  assert.equal(seen[0].url, 'https://twenty.invalid/graphql');
  assert.equal(seen[0].auth, 'Bearer tok');
});

test('GraphQL errors fail the read instead of returning partial data', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ data: null, errors: [{ message: 'nope' }] }) });
  await assert.rejects(fetchGraphql('https://t.invalid', 'k', 'query { x }', {}, fetchImpl), /nope/);
});

test('PostHog query is scoped to konative.com prod and cannot be broken out of', async () => {
  const q = posthogQuery("konative.com'; DROP", 'prod');
  assert.match(q, /properties\.site = 'konative\.com; DROP'/);
  assert.match(q, /properties\.env = 'prod'/);
  assert.match(q, /INTERVAL 7 DAY/);
  const fetchImpl = async (url, init) => {
    assert.equal(url, 'https://us.posthog.com/api/projects/620985/query/');
    assert.equal(init.headers.authorization, 'Bearer k');
    return { ok: true, json: async () => ({ results: [[120, 7]] }) };
  };
  assert.deepEqual(await fetchPosthog({ cfg: realConfig.posthog, key: 'k', fetchImpl }), { pageviews_7d: 120, contact_pageviews_7d: 7 });
  await assert.rejects(fetchPosthog({ cfg: realConfig.posthog, key: 'k', fetchImpl: async () => ({ ok: true, json: async () => ({ results: [] }) }) }), /no result row/);
});

test('main with --skip-live writes private aggregate files and prints the markdown', async () => {
  const { mkdtempSync, statSync, readFileSync: read } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { main } = await import('./konative-gtm-scoreboard.mjs');
  const dir = join(mkdtempSync(join(tmpdir(), 'scoreboard-test-')), 'out');
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  try {
    await main(['--skip-live', '--output-dir', dir], {});
  } finally {
    process.stdout.write = original;
  }
  assert.equal(statSync(join(dir, 'scoreboard.md')).mode & 0o777, 0o600);
  assert.equal(statSync(dir).mode & 0o777, 0o700);
  const json = JSON.parse(read(join(dir, 'scoreboard.json'), 'utf8'));
  assert.equal(json.metrics.find((m) => m.key === 'meetings').status, 'SCOPE_UNSET');
});

test('live mode without a Twenty token fails closed', async () => {
  const { main } = await import('./konative-gtm-scoreboard.mjs');
  await assert.rejects(main([], {}), /TWENTY_API_TOKEN is required/);
});
