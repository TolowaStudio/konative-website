#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function projectedCost(model, records, inputTokensPerRecord, outputTokensPerRecord) {
  return records * (
    (inputTokensPerRecord * model.input_usd_per_million_tokens / 1_000_000)
    + (outputTokensPerRecord * model.output_usd_per_million_tokens / 1_000_000)
  );
}

export function buildProjection(policy) {
  const inputTokens = policy.planning_envelope_per_record.input_tokens;
  const outputTokens = policy.planning_envelope_per_record.output_tokens;
  const projections = [];
  for (const [modelName, model] of Object.entries(policy.models)) {
    for (const [budgetName, budget] of Object.entries(policy.run_budgets)) {
      projections.push({
        model: modelName,
        workload: budgetName,
        records: budget.records,
        input_tokens_per_record: inputTokens,
        output_tokens_per_record: outputTokens,
        projected_provider_cost_usd: projectedCost(model, budget.records, inputTokens, outputTokens),
        budget_usd: budget.max_provider_cost_usd,
        within_budget: projectedCost(model, budget.records, inputTokens, outputTokens) <= budget.max_provider_cost_usd,
        enabled_for_enrichment: model.enabled && model.max_workload_share > 0,
      });
    }
  }
  return projections;
}

export function readEvents(path, runId = null) {
  if (!path) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((event) => !runId || event.run_id === runId);
}

export function summarizeEvents(events) {
  const byModel = new Map();
  let actualProviderCostUsd = 0;
  let unpricedMeteredEvents = 0;
  for (const event of events) {
    const metered = event.billing?.provider_metering === 'metered_provider_reported';
    const cost = event.billing?.provider_cost_usd;
    if (metered && !Number.isFinite(cost)) unpricedMeteredEvents += 1;
    if (Number.isFinite(cost)) actualProviderCostUsd += cost;
    const model = event.model || '(unknown)';
    const current = byModel.get(model) || {
      model,
      calls: 0,
      prompt_tokens: 0,
      completion_tokens: 0,
      provider_cost_usd: 0,
      statuses: {},
    };
    current.calls += 1;
    current.prompt_tokens += Number(event.tokens?.prompt || 0);
    current.completion_tokens += Number(event.tokens?.completion || 0);
    if (Number.isFinite(cost)) current.provider_cost_usd += cost;
    current.statuses[event.status || '(unknown)'] = (current.statuses[event.status || '(unknown)'] || 0) + 1;
    byModel.set(model, current);
  }
  return {
    calls: events.length,
    actual_provider_cost_usd: actualProviderCostUsd,
    unpriced_metered_events: unpricedMeteredEvents,
    cost_gate_passed: unpricedMeteredEvents === 0,
    by_model: [...byModel.values()].sort((a, b) => a.model.localeCompare(b.model)),
  };
}

export function buildReport(policy, events = [], activity = {}) {
  const eventSummary = summarizeEvents(events);
  const declaredDeepinfraCalls = Number(activity.deepinfra?.calls ?? events.length);
  const activityEventCountMismatch = Number.isFinite(declaredDeepinfraCalls)
    ? declaredDeepinfraCalls !== eventSummary.calls
    : true;
  eventSummary.activity_event_count_mismatch = activityEventCountMismatch;
  eventSummary.cost_gate_passed = eventSummary.cost_gate_passed && !activityEventCountMismatch;
  return {
    generated_at: new Date().toISOString(),
    policy_version: policy.policy_version,
    pricing_verified_at: policy.pricing_verified_at,
    pricing_source: policy.pricing_source,
    actual: eventSummary,
    activity,
    projections: buildProjection(policy),
    non_model_services: policy.non_model_services,
    hard_rules: policy.hard_rules,
  };
}

export function markdownReport(report) {
  const flash = report.projections.filter((row) => row.model === 'deepseek-ai/DeepSeek-V4-Flash');
  const activity = report.activity || {};
  const browser = activity.browseros_neo || {};
  const crm = activity.twenty_crm || {};
  const deepinfra = activity.deepinfra || {};
  const commercial = activity.commercial_enrichment_providers || {};
  const lines = [
    '# Konative enrichment cost and usage report',
    '',
    `Generated: ${report.generated_at}`,
    '',
    `Policy: \`${report.policy_version}\``,
    '',
    '## Actual metered model usage',
    '',
    `- Calls: **${report.actual.calls}**`,
    `- Provider cost: **$${report.actual.actual_provider_cost_usd.toFixed(6)}**`,
    `- Unpriced metered events: **${report.actual.unpriced_metered_events}**`,
    `- Activity/event count mismatch: **${report.actual.activity_event_count_mismatch ? 'YES' : 'NO'}**`,
    `- Cost gate: **${report.actual.cost_gate_passed ? 'PASS' : 'BLOCKED'}**`,
    '',
    '## Current run activity',
    '',
    `- Run ID: \`${activity.run_id || '(not supplied)'}\``,
    `- Twenty CRM: ${crm.records_scanned_in_final_artifact_run ?? 0} records read across ${crm.graphql_pages_in_final_artifact_run ?? 0} pages; ${crm.writes ?? 0} writes.`,
    `- BrowserOS Neo: ${browser.records ?? 0} records, ${browser.direct_record_pages ?? 0} direct pages, ${browser.search_queries_attempted ?? 0} searches, and ${browser.official_followup_pages ?? 0} official follow-up pages.`,
    `- DeepInfra: ${deepinfra.calls ?? 0} calls, ${deepinfra.input_tokens ?? 0} input tokens, ${deepinfra.output_tokens ?? 0} output tokens.`,
    `- Commercial enrichment APIs: ${commercial.calls ?? 0} calls.`,
    `- CRM writes: ${activity.crm_writes ?? 0}; sender calls: ${activity.sender_calls ?? 0}.`,
    '',
    '## Cheapest-lane projection',
    '',
    '| Workload | Records | Input/record | Output/record | Projected Flash cost | Budget |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...flash.map((row) => `| ${row.workload} | ${row.records} | ${row.input_tokens_per_record} | ${row.output_tokens_per_record} | $${row.projected_provider_cost_usd.toFixed(6)} | $${row.budget_usd.toFixed(2)} |`),
    '',
    '## What is being used',
    '',
    `- Twenty CRM: existing self-hosted service, marginal API cost recorded as $0.`,
    `- BrowserOS Neo: pages/minutes are tracked; the tool does not expose a per-task provider dollar cost, so cost remains unknown rather than being reported as $0.`,
    `- Codex: flat-rate subscription; per-task marginal cost is not exposed.`,
    `- Commercial enrichment providers: disabled for this phase.`,
    '',
    '## Rules',
    '',
    ...report.hard_rules.map((rule) => `- ${rule}`),
    '',
  ];
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[index];
    };
    if (arg === '--policy') args.policy = next();
    else if (arg === '--events') args.events = next();
    else if (arg === '--run-id') args.runId = next();
    else if (arg === '--activity') args.activity = next();
    else if (arg === '--output-json') args.outputJson = next();
    else if (arg === '--output-md') args.outputMd = next();
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.policy || !args.outputJson || !args.outputMd) {
    throw new Error('--policy, --output-json, and --output-md are required');
  }
  return args;
}

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const policy = JSON.parse(readFileSync(resolve(args.policy), 'utf8'));
  const events = readEvents(args.events ? resolve(args.events) : null, args.runId);
  const activity = args.activity ? JSON.parse(readFileSync(resolve(args.activity), 'utf8')) : {};
  const report = buildReport(policy, events, activity);
  writeFileSync(resolve(args.outputJson), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  writeFileSync(resolve(args.outputMd), `${markdownReport(report)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({
    actual_provider_cost_usd: report.actual.actual_provider_cost_usd,
    unpriced_metered_events: report.actual.unpriced_metered_events,
    cost_gate_passed: report.actual.cost_gate_passed,
  }, null, 2)}\n`);
  if (!report.actual.cost_gate_passed) process.exitCode = 3;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message || String(error)}\n`);
    process.exitCode = 1;
  }
}
