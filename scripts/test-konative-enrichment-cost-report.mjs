import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildReport,
  buildProjection,
  markdownReport,
  projectedCost,
  summarizeEvents,
} from './konative-enrichment-cost-report.mjs';

const policy = {
  models: {
    flash: {
      input_usd_per_million_tokens: 0.09,
      output_usd_per_million_tokens: 0.18,
      enabled: true,
      max_workload_share: 1,
    },
  },
  run_budgets: {
    pilot_10: { records: 10, max_provider_cost_usd: 0.01 },
  },
  planning_envelope_per_record: { input_tokens: 1500, output_tokens: 300 },
};

test('projects Flash cost from separate input and output rates', () => {
  assert.ok(Math.abs(projectedCost(policy.models.flash, 10, 1500, 300) - 0.00189) < 1e-12);
  assert.equal(buildProjection(policy)[0].within_budget, true);
});

test('sums provider-reported cost and observed tokens', () => {
  const summary = summarizeEvents([{
    model: 'flash',
    status: 'done',
    tokens: { prompt: 1500, completion: 300 },
    billing: { provider_metering: 'metered_provider_reported', provider_cost_usd: 0.000189 },
  }]);
  assert.equal(summary.actual_provider_cost_usd, 0.000189);
  assert.equal(summary.by_model[0].prompt_tokens, 1500);
  assert.equal(summary.cost_gate_passed, true);
});

test('unknown metered cost fails closed instead of becoming zero', () => {
  const summary = summarizeEvents([{
    model: 'flash',
    status: 'truncated',
    tokens: { prompt: 1000, completion: 300 },
    billing: { provider_metering: 'metered_provider_reported', provider_cost_usd: null },
  }]);
  assert.equal(summary.actual_provider_cost_usd, 0);
  assert.equal(summary.unpriced_metered_events, 1);
  assert.equal(summary.cost_gate_passed, false);
});

test('markdown exposes current run usage instead of only dollar totals', () => {
  const report = buildReport({
    ...policy,
    policy_version: 'test',
    pricing_verified_at: '2026-08-21',
    pricing_source: 'https://example.test',
    non_model_services: {},
    hard_rules: [],
  }, [], {
    run_id: 'konative-test',
    twenty_crm: { records_scanned_in_final_artifact_run: 7650, graphql_pages_in_final_artifact_run: 77, writes: 0 },
    browseros_neo: { records: 10, direct_record_pages: 10, search_queries_attempted: 5, official_followup_pages: 5 },
    deepinfra: { calls: 0, input_tokens: 0, output_tokens: 0 },
    commercial_enrichment_providers: { calls: 0 },
    crm_writes: 0,
    sender_calls: 0,
  });
  const markdown = markdownReport(report);
  assert.match(markdown, /Twenty CRM: 7650 records read across 77 pages; 0 writes/);
  assert.match(markdown, /BrowserOS Neo: 10 records, 10 direct pages, 5 searches, and 5 official follow-up pages/);
  assert.match(markdown, /DeepInfra: 0 calls, 0 input tokens, 0 output tokens/);
});

test('declared model calls without matching receipts block the cost gate', () => {
  const report = buildReport({
    ...policy,
    policy_version: 'test',
    pricing_verified_at: '2026-08-21',
    pricing_source: 'https://example.test',
    non_model_services: {},
    hard_rules: [],
  }, [], { deepinfra: { calls: 1 } });
  assert.equal(report.actual.activity_event_count_mismatch, true);
  assert.equal(report.actual.cost_gate_passed, false);
});
