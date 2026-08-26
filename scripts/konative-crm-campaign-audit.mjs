#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const POLICY_VERSION = 'konative-campaign-readiness-v0.1.0';
export const SELECTION_VERSION = 'konative-working-cohort-v0.1.0';

export const SCORE_WEIGHTS = Object.freeze({
  tier1_target: 20,
  company_icp: 20,
  evidence_url: 10,
  role_category: Object.freeze({
    LEADERSHIP: 25,
    BROADBAND: 22,
    IT_TECHNOLOGY: 18,
    FINANCE: 12,
    OTHER_ROLE: 5,
  }),
  tribal_category: Object.freeze({
    ECONOMIC_DEVELOPMENT: 25,
    UTILITIES: 25,
    BROADBAND: 22,
    GOVERNMENT: 15,
    GAMING: 8,
    OTHER: 5,
  }),
  company_org_type: Object.freeze({
    TRIBAL_ENTERPRISE: 20,
    TRIBAL_NATION: 15,
    NONPROFIT: 3,
  }),
});

const PEOPLE_QUERY = `
query KonativeCampaignAudit($after: String) {
  people(first: 100, after: $after) {
    edges {
      node {
        id
        createdAt
        updatedAt
        name { firstName lastName }
        emails { primaryEmail }
        jobTitle
        position
        roleCategory
        mailable
        campaignSegment
        tier1Target
        vertical
        tribalCategory
        outreachSegment
        emailVerified
        doNotContact
        enrichmentSource
        outreachStatus
        evidenceUrl
        enrichmentRun
        linkedinLink { primaryLinkUrl primaryLinkLabel }
        company {
          id
          name
          domainName { primaryLinkUrl primaryLinkLabel }
          orgType
          marketScope
          enrichmentStatus
          biaRegion
          vertical
          tribalCategory
          idealCustomerProfile
          enrichmentSourceUrl
          enrichmentEvidence
          enrichmentLastSuccessAt
        }
      }
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}`;

const PILOT_STRATA = Object.freeze([
  ['segment_builder', (p) => p.proposed_campaign_segment === 'KON_01_BUILDER'],
  ['segment_connectivity', (p) => p.proposed_campaign_segment === 'KON_02_CONNECTIVITY'],
  ['segment_energy', (p) => p.proposed_campaign_segment === 'KON_03_ENERGY'],
  ['segment_executive', (p) => p.proposed_campaign_segment === 'KON_04_EXECUTIVE'],
  ['segment_nurture', (p) => p.proposed_campaign_segment === 'KON_05_NURTURE'],
  ['role_leadership', (p) => p.role_category === 'LEADERSHIP'],
  ['role_broadband', (p) => p.role_category === 'BROADBAND'],
  ['role_it_technology', (p) => p.role_category === 'IT_TECHNOLOGY'],
  ['org_tribal_enterprise', (p) => p.company_org_type === 'TRIBAL_ENTERPRISE'],
  ['org_nonprofit', (p) => p.company_org_type === 'NONPROFIT'],
]);

function normalize(value) {
  return String(value ?? '').trim();
}

function upper(value) {
  return normalize(value).toUpperCase();
}

function primaryEmail(person) {
  return normalize(person.emails?.primaryEmail);
}

function personName(person) {
  return [normalize(person.name?.firstName), normalize(person.name?.lastName)]
    .filter(Boolean)
    .join(' ');
}

function companyDomain(person) {
  return normalize(
    person.company?.domainName?.primaryLinkUrl
      || person.company?.domainName?.primaryLinkLabel,
  );
}

function canonicalUrl(value) {
  const raw = normalize(value);
  if (!raw) return '';
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString();
  } catch {
    return '';
  }
}

export function isTribalScope(person) {
  return upper(person.vertical) === 'TRIBAL'
    || Boolean(normalize(person.tribalCategory))
    || upper(person.company?.vertical) === 'TRIBAL'
    || upper(person.company?.orgType).startsWith('TRIBAL_');
}

export function baselineExclusionReasons(person) {
  const reasons = [];
  if (!isTribalScope(person)) reasons.push('not_tribal_scope');
  if (!primaryEmail(person)) reasons.push('email_missing');
  if (person.emailVerified !== true) reasons.push('email_not_verified');
  if (person.mailable !== true) reasons.push('not_mailable');
  if (person.doNotContact === true) reasons.push('do_not_contact');
  if (upper(person.outreachStatus) === 'QUEUED') reasons.push('unsafe_legacy_queue');
  return reasons;
}

export function proposeSegment(person) {
  const personCategory = upper(person.tribalCategory);
  const companyCategory = upper(person.company?.tribalCategory);
  const role = upper(person.roleCategory);
  const title = upper(`${person.jobTitle ?? ''} ${person.position ?? ''}`);
  const companyType = upper(person.company?.orgType);

  if (
    personCategory === 'UTILITIES'
    || companyCategory === 'UTILITIES'
    || /\b(ENERGY|UTILITY|POWER|ELECTRIC|INTERCONNECT)\b/.test(title)
  ) return 'KON_03_ENERGY';

  if (
    personCategory === 'BROADBAND'
    || companyCategory === 'BROADBAND'
    || role === 'BROADBAND'
    || role === 'IT_TECHNOLOGY'
    || /\b(BROADBAND|FIBER|CONNECTIVITY|TECHNOLOGY|INFORMATION SYSTEMS)\b/.test(title)
  ) return 'KON_02_CONNECTIVITY';

  if (
    personCategory === 'ECONOMIC_DEVELOPMENT'
    || companyType === 'TRIBAL_ENTERPRISE'
    || /\b(ECONOMIC DEVELOPMENT|DEVELOPMENT DIRECTOR|ENTERPRISE)\b/.test(title)
  ) return 'KON_01_BUILDER';

  if (role === 'LEADERSHIP') return 'KON_04_EXECUTIVE';
  return 'KON_05_NURTURE';
}

function weighted(map, key) {
  return Number(map[upper(key)] ?? 0);
}

export function scoreCandidate(person) {
  const reasons = [];
  let score = 0;

  const add = (points, reason) => {
    if (!points) return;
    score += points;
    reasons.push(`${reason}:${points}`);
  };

  add(person.tier1Target === true ? SCORE_WEIGHTS.tier1_target : 0, 'tier1_target');
  add(person.company?.idealCustomerProfile === true ? SCORE_WEIGHTS.company_icp : 0, 'company_icp');
  add(normalize(person.evidenceUrl) ? SCORE_WEIGHTS.evidence_url : 0, 'evidence_url');
  add(weighted(SCORE_WEIGHTS.role_category, person.roleCategory), `role_${upper(person.roleCategory).toLowerCase()}`);
  add(weighted(SCORE_WEIGHTS.tribal_category, person.tribalCategory), `category_${upper(person.tribalCategory).toLowerCase()}`);
  add(weighted(SCORE_WEIGHTS.company_org_type, person.company?.orgType), `org_${upper(person.company?.orgType).toLowerCase()}`);

  return { score, reasons };
}

export function campaignReadinessBlockers(person, score) {
  const blockers = [];
  if (!person.id || !person.company?.id) blockers.push('identity_unresolved');
  blockers.push(...baselineExclusionReasons(person));
  if (!normalize(person.campaignSegment)) blockers.push('campaign_segment_not_approved');
  if (score < 50) blockers.push('offer_fit_below_policy');
  blockers.push('public_role_current_requires_browseros');
  blockers.push('suppression_check_not_run');
  blockers.push('jurisdiction_policy_not_run');
  blockers.push('evidence_freshness_not_verified');
  blockers.push('personalization_claims_not_reviewed');
  blockers.push('human_approval_missing');
  return [...new Set(blockers)];
}

function compareCandidates(a, b) {
  return b.score - a.score
    || a.company_name.localeCompare(b.company_name)
    || a.person_name.localeCompare(b.person_name)
    || a.person_id.localeCompare(b.person_id);
}

function enrichedCandidate(person) {
  const { score, reasons } = scoreCandidate(person);
  const proposedSegment = proposeSegment(person);
  const blockers = campaignReadinessBlockers(person, score);
  return {
    person_id: normalize(person.id),
    person_name: personName(person),
    email: primaryEmail(person),
    job_title: normalize(person.jobTitle || person.position),
    role_category: normalize(person.roleCategory),
    tribal_category: normalize(person.tribalCategory),
    company_id: normalize(person.company?.id),
    company_name: normalize(person.company?.name),
    company_org_type: normalize(person.company?.orgType),
    company_domain: canonicalUrl(companyDomain(person)),
    evidence_url: canonicalUrl(person.evidenceUrl),
    linkedin_url: canonicalUrl(
      person.linkedinLink?.primaryLinkUrl || person.linkedinLink?.primaryLinkLabel,
    ),
    tier1_target: person.tier1Target === true,
    company_icp: person.company?.idealCustomerProfile === true,
    outreach_status: normalize(person.outreachStatus),
    legacy_outreach_segment: normalize(person.outreachSegment),
    proposed_campaign_segment: proposedSegment,
    fit_score: score,
    score_reasons: reasons,
    campaign_ready: blockers.length === 0,
    campaign_readiness_blockers: blockers,
  };
}

export function selectWorkingCohort(people, limit = 164) {
  const eligible = people
    .filter((person) => baselineExclusionReasons(person).length === 0)
    .map(enrichedCandidate)
    .sort(compareCandidates);

  const selectedIds = new Set(eligible.slice(0, limit).map((row) => row.person_id));
  return eligible.map((row) => ({
    ...row,
    working_cohort_selected: selectedIds.has(row.person_id),
  }));
}

export function selectPilot(candidates, size = 10) {
  const working = candidates
    .filter((row) => row.working_cohort_selected)
    .sort(compareCandidates);
  const used = new Set();
  const usedCompanies = new Set();
  const pilot = [];

  for (const [label, predicate] of PILOT_STRATA) {
    const match = working.find((row) => !used.has(row.person_id)
      && !usedCompanies.has(row.company_id)
      && predicate(row));
    if (!match) continue;
    used.add(match.person_id);
    if (match.company_id) usedCompanies.add(match.company_id);
    pilot.push({ ...match, pilot_stratum: label });
    if (pilot.length === size) return pilot;
  }

  for (const row of working) {
    if (used.has(row.person_id) || usedCompanies.has(row.company_id)) continue;
    used.add(row.person_id);
    if (row.company_id) usedCompanies.add(row.company_id);
    pilot.push({ ...row, pilot_stratum: 'top_score_fallback_distinct_org' });
    if (pilot.length === size) break;
  }
  for (const row of working) {
    if (pilot.length === size) break;
    if (used.has(row.person_id)) continue;
    used.add(row.person_id);
    pilot.push({ ...row, pilot_stratum: 'top_score_fallback' });
  }
  return pilot;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function csvCell(value) {
  const scalar = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return `"${scalar.replaceAll('"', '""')}"`;
}

function toCsv(rows, columns) {
  const lines = [columns.map(csvCell).join(',')];
  for (const row of rows) lines.push(columns.map((column) => csvCell(row[column])).join(','));
  return `${lines.join('\n')}\n`;
}

function findRepoRoot(start) {
  let current = resolve(start);
  while (true) {
    if (existsSync(resolve(current, '.git'))) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export function assertOutputOutsideRepo(outputDir, repoRoot) {
  const output = resolve(outputDir);
  const repo = resolve(repoRoot);
  const rel = relative(repo, output);
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) {
    throw new Error(`Refusing to write private CRM artifacts inside Git repository: ${output}`);
  }
  return output;
}

function writePrivate(path, content) {
  writeFileSync(path, content, { encoding: 'utf8', mode: 0o600 });
  chmodSync(path, 0o600);
}

async function sleep(ms) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export async function fetchGraphql(baseUrl, token, query, variables, attempt = 0) {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => ({}));
  if ((response.status === 429 || response.status >= 500) && attempt < 4) {
    await sleep(1_000 * (2 ** attempt));
    return fetchGraphql(baseUrl, token, query, variables, attempt + 1);
  }
  if (!response.ok || body.errors?.length) {
    const message = body.errors?.map((error) => error.message).join('; ')
      || `Twenty GraphQL HTTP ${response.status}`;
    throw new Error(message);
  }
  return body.data;
}

export async function fetchAllPeople({ baseUrl, token, pageDelayMs = 700, onProgress = () => {} }) {
  const people = [];
  let after = null;
  let totalCount = null;
  do {
    const data = await fetchGraphql(baseUrl, token, PEOPLE_QUERY, { after });
    const page = data.people;
    totalCount = page.totalCount;
    people.push(...page.edges.map((edge) => edge.node));
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    onProgress({ fetched: people.length, total: totalCount });
    if (after) await sleep(pageDelayMs);
  } while (after);
  return people;
}

function safeCount(rows, field) {
  const counts = {};
  for (const row of rows) {
    const key = normalize(row[field]) || '(null)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function reportMarkdown(summary, files) {
  return `# Konative CRM campaign audit\n\n`
    + `Generated: ${summary.generated_at}\n\n`
    + `Policy: \`${summary.policy_version}\`  \nSelection: \`${summary.selection_version}\`\n\n`
    + `## Gate status\n\n`
    + `- Read-only baseline reproduced: **${summary.baseline_reproduced ? 'PASS' : 'DRIFT'}**\n`
    + `- Verified, mailable, tribal, not suppressed: **${summary.counts.baseline_eligible}**\n`
    + `- Unsafe legacy \`QUEUED\` records: **${summary.counts.queued}**\n`
    + `- Proposed working cohort: **${summary.counts.working_cohort}**\n`
    + `- Formally campaign-ready: **${summary.counts.campaign_ready}**\n`
    + `- BrowserOS pilot queue: **${summary.counts.pilot}**\n\n`
    + `## Decision\n\n`
    + `The 164-person file is a **proposed working cohort**, not an approved audience snapshot. `
    + `No CRM write or send was performed. The prior June cohort cannot be directly reconciled because its exact IDs are absent from current Git and current CRM campaign fields are unset. The 21 queued records remain excluded.\n\n`
    + `All 605 candidates still fail the formal readiness policy because current-role evidence, full suppression, jurisdiction policy, evidence freshness, personalization review, and human approval have not completed.\n\n`
    + `## Pilot design\n\n`
    + `The 10-record queue is deterministic and stratified across role, tribal category, and organization type. Existing CRM lineage does not expose multiple reliable source types, so BrowserOS must create the field-level source evidence during the pilot.\n\n`
    + `## Private artifacts\n\n`
    + files.map((file) => `- \`${file}\``).join('\n')
    + `\n\nAll files in this directory are mode 0600; the directory is mode 0700. Do not commit them.\n`;
}

export function buildBrowserOsJobPackets(pilot, summary) {
  const runId = `konative-${summary.generated_at.slice(0, 10).replaceAll('-', '')}-${summary.working_cohort_sha256.slice(0, 8)}`;
  return pilot.map((row) => ({
    tenant_id: 'konative',
    run_id: runId,
    subject_id: row.company_id || row.person_id,
    person_id: row.person_id,
    public_name: row.person_name,
    public_role_in_crm: row.job_title,
    organization_id: row.company_id,
    organization_name: row.company_name,
    canonical_domain_candidate: row.company_domain,
    crm_evidence_url: row.evidence_url,
    proposed_campaign_segment: row.proposed_campaign_segment,
    pilot_stratum: row.pilot_stratum,
    research_question: 'Confirm the current public professional role on an official organization source and collect evidence relevant to Konative offer fit.',
    requested_claims: [
      'current_public_role',
      'official_organization_domain',
      'economic_development_signal',
      'broadband_connectivity_signal',
      'energy_utility_signal',
      'active_project_or_procurement_signal',
    ],
    forbidden_attributes: [
      'tribal_membership_or_enrollment',
      'ethnicity',
      'family_relationships',
      'personal_address',
      'personal_phone',
      'private_social_data',
    ],
  }));
}

const CANDIDATE_COLUMNS = [
  'person_id', 'person_name', 'email', 'job_title', 'role_category', 'tribal_category',
  'company_id', 'company_name', 'company_org_type', 'company_domain', 'evidence_url',
  'linkedin_url', 'tier1_target', 'company_icp', 'outreach_status',
  'legacy_outreach_segment', 'proposed_campaign_segment', 'fit_score', 'score_reasons',
  'working_cohort_selected', 'campaign_ready', 'campaign_readiness_blockers',
];

export function buildAuditArtifacts(people, options = {}) {
  const expectedEligible = Number(options.expectedEligible ?? 605);
  const expectedQueued = Number(options.expectedQueued ?? 21);
  const cohortSize = Number(options.cohortSize ?? 164);
  const pilotSize = Number(options.pilotSize ?? 10);
  const generatedAt = options.generatedAt ?? new Date().toISOString();

  const candidates = selectWorkingCohort(people, cohortSize);
  const workingCohort = candidates.filter((row) => row.working_cohort_selected);
  const queuedPeople = people.filter((person) => upper(person.outreachStatus) === 'QUEUED');
  const queued = queuedPeople.map((person) => ({
    ...enrichedCandidate(person),
    exclusion_reasons: baselineExclusionReasons(person),
  }));
  const pilot = selectPilot(candidates, pilotSize);
  const campaignReady = candidates.filter((row) => row.campaign_ready);
  const baselineReproduced = candidates.length === expectedEligible && queued.length === expectedQueued;
  const summary = {
    generated_at: generatedAt,
    source: 'Twenty CRM GraphQL read-only',
    policy_version: POLICY_VERSION,
    selection_version: SELECTION_VERSION,
    expected: { baseline_eligible: expectedEligible, queued: expectedQueued },
    baseline_reproduced: baselineReproduced,
    counts: {
      people: people.length,
      baseline_eligible: candidates.length,
      working_cohort: workingCohort.length,
      queued: queued.length,
      campaign_ready: campaignReady.length,
      pilot: pilot.length,
      pilot_unique_companies: new Set(pilot.map((row) => row.company_id).filter(Boolean)).size,
    },
    distributions: {
      proposed_campaign_segment: safeCount(workingCohort, 'proposed_campaign_segment'),
      role_category: safeCount(workingCohort, 'role_category'),
      tribal_category: safeCount(workingCohort, 'tribal_category'),
      company_org_type: safeCount(workingCohort, 'company_org_type'),
      pilot_stratum: safeCount(pilot, 'pilot_stratum'),
    },
    record_set_sha256: sha256(canonicalJson(people)),
    working_cohort_sha256: sha256(canonicalJson(workingCohort)),
    score_weights: SCORE_WEIGHTS,
  };
  return { summary, candidates, workingCohort, queued, pilot };
}

function parseArgs(argv) {
  const args = {
    baseUrl: 'https://crm.tolowastudio.com',
    expectedEligible: 605,
    expectedQueued: 21,
    cohortSize: 164,
    pilotSize: 10,
    failOnBaselineDrift: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[index];
    };
    if (arg === '--output-dir') args.outputDir = next();
    else if (arg === '--base-url') args.baseUrl = next();
    else if (arg === '--expected-eligible') args.expectedEligible = Number(next());
    else if (arg === '--expected-queued') args.expectedQueued = Number(next());
    else if (arg === '--cohort-size') args.cohortSize = Number(next());
    else if (arg === '--pilot-size') args.pilotSize = Number(next());
    else if (arg === '--page-delay-ms') args.pageDelayMs = Number(next());
    else if (arg === '--fail-on-baseline-drift') args.failOnBaselineDrift = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.outputDir) throw new Error('--output-dir is required');
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const token = normalize(process.env.TWENTY_API_TOKEN);
  if (!token) throw new Error('TWENTY_API_TOKEN is required');
  const repoRoot = findRepoRoot(dirname(fileURLToPath(import.meta.url))) || process.cwd();
  const outputDir = assertOutputOutsideRepo(args.outputDir, repoRoot);
  mkdirSync(outputDir, { recursive: true, mode: 0o700 });
  chmodSync(outputDir, 0o700);

  let lastProgress = 0;
  const people = await fetchAllPeople({
    baseUrl: args.baseUrl,
    token,
    pageDelayMs: Number.isFinite(args.pageDelayMs) ? args.pageDelayMs : 700,
    onProgress: ({ fetched, total }) => {
      if (fetched - lastProgress >= 1_000 || fetched === total) {
        process.stderr.write(`Fetched ${fetched}/${total} people\n`);
        lastProgress = fetched;
      }
    },
  });

  const artifacts = buildAuditArtifacts(people, args);
  const browserOsJobs = buildBrowserOsJobPackets(artifacts.pilot, artifacts.summary);
  const files = {
    'baseline-summary.json': `${JSON.stringify(artifacts.summary, null, 2)}\n`,
    'candidate-manifest-605.csv': toCsv(artifacts.candidates, CANDIDATE_COLUMNS),
    'working-cohort-proposed-164.csv': toCsv(artifacts.workingCohort, CANDIDATE_COLUMNS),
    'working-cohort-proposed-164.json': `${JSON.stringify(artifacts.workingCohort, null, 2)}\n`,
    'queued-exclusions-21.csv': toCsv(
      artifacts.queued,
      [...CANDIDATE_COLUMNS.filter((column) => column !== 'working_cohort_selected'), 'exclusion_reasons'],
    ),
    'browseros-pilot-10.csv': toCsv(artifacts.pilot, [...CANDIDATE_COLUMNS, 'pilot_stratum']),
    'browseros-job-packets-10.json': `${JSON.stringify(browserOsJobs, null, 2)}\n`,
  };
  files['audit-report.md'] = reportMarkdown(artifacts.summary, Object.keys(files));

  for (const [name, content] of Object.entries(files)) writePrivate(resolve(outputDir, name), content);
  const checksums = Object.keys(files)
    .sort()
    .map((name) => `${sha256(readFileSync(resolve(outputDir, name)))}  ${name}`)
    .join('\n');
  writePrivate(resolve(outputDir, 'SHA256SUMS'), `${checksums}\n`);

  process.stdout.write(`${JSON.stringify({
    output_dir: outputDir,
    baseline_reproduced: artifacts.summary.baseline_reproduced,
    counts: artifacts.summary.counts,
    working_cohort_sha256: artifacts.summary.working_cohort_sha256,
  }, null, 2)}\n`);

  if (args.failOnBaselineDrift && !artifacts.summary.baseline_reproduced) process.exitCode = 3;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message || String(error)}\n`);
    process.exitCode = 1;
  });
}
