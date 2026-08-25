import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  assertOutputOutsideRepo,
  baselineExclusionReasons,
  buildBrowserOsJobPackets,
  fetchGraphql,
  buildAuditArtifacts,
  campaignReadinessBlockers,
  proposeSegment,
  scoreCandidate,
  selectPilot,
  selectWorkingCohort,
} from './konative-crm-campaign-audit.mjs';

function person(overrides = {}) {
  return {
    id: overrides.id || 'person-1',
    name: { firstName: 'Ada', lastName: 'Lovelace' },
    emails: { primaryEmail: 'ada@example.test' },
    jobTitle: 'Economic Development Director',
    roleCategory: 'LEADERSHIP',
    mailable: true,
    campaignSegment: null,
    tier1Target: true,
    vertical: 'TRIBAL',
    tribalCategory: 'ECONOMIC_DEVELOPMENT',
    outreachSegment: null,
    emailVerified: true,
    doNotContact: null,
    outreachStatus: 'NOT_CONTACTED',
    evidenceUrl: 'https://example.test/leadership',
    company: {
      id: 'company-1',
      name: 'Example Nation',
      domainName: { primaryLinkUrl: 'https://example.test' },
      orgType: 'TRIBAL_NATION',
      vertical: 'TRIBAL',
      idealCustomerProfile: true,
    },
    ...overrides,
  };
}

test('baseline gate excludes every unsafe queued condition', () => {
  const excluded = person({
    emails: { primaryEmail: '' },
    emailVerified: false,
    mailable: null,
    doNotContact: true,
    outreachStatus: 'QUEUED',
  });
  assert.deepEqual(baselineExclusionReasons(excluded), [
    'email_missing',
    'email_not_verified',
    'not_mailable',
    'do_not_contact',
    'unsafe_legacy_queue',
  ]);
});

test('segment proposal prioritizes energy, connectivity, builder, executive, then nurture', () => {
  assert.equal(proposeSegment(person({ jobTitle: 'Utility Director' })), 'KON_03_ENERGY');
  assert.equal(proposeSegment(person({ tribalCategory: 'BROADBAND' })), 'KON_02_CONNECTIVITY');
  assert.equal(proposeSegment(person()), 'KON_01_BUILDER');
  assert.equal(proposeSegment(person({ tribalCategory: 'GOVERNMENT', jobTitle: 'Chairperson' })), 'KON_04_EXECUTIVE');
  assert.equal(proposeSegment(person({ tribalCategory: 'OTHER', roleCategory: 'OTHER_ROLE', jobTitle: 'Program Manager' })), 'KON_05_NURTURE');
});

test('score is deterministic and evidence-based', () => {
  const result = scoreCandidate(person());
  assert.equal(result.score, 115);
  assert.deepEqual(result.reasons, [
    'tier1_target:20',
    'company_icp:20',
    'evidence_url:10',
    'role_leadership:25',
    'category_economic_development:25',
    'org_tribal_nation:15',
  ]);
});

test('formal readiness remains blocked before BrowserOS, suppression, policy, and human review', () => {
  const blockers = campaignReadinessBlockers(person(), 115);
  assert.ok(blockers.includes('campaign_segment_not_approved'));
  assert.ok(blockers.includes('public_role_current_requires_browseros'));
  assert.ok(blockers.includes('suppression_check_not_run'));
  assert.ok(blockers.includes('human_approval_missing'));
});

test('working cohort has stable tie-breaking and exact size', () => {
  const people = Array.from({ length: 5 }, (_, index) => person({
    id: `person-${index}`,
    name: { firstName: 'Person', lastName: String(index) },
    company: { ...person().company, id: `company-${index}`, name: `Company ${index}` },
  }));
  const selected = selectWorkingCohort(people, 3).filter((row) => row.working_cohort_selected);
  assert.deepEqual(selected.map((row) => row.person_id), ['person-0', 'person-1', 'person-2']);
});

test('pilot selection returns unique records and labels each stratum', () => {
  const variants = [
    ['ECONOMIC_DEVELOPMENT', 'OTHER_ROLE', 'TRIBAL_NATION', 'Economic Development Director'],
    ['BROADBAND', 'BROADBAND', 'TRIBAL_NATION', 'Broadband Director'],
    ['UTILITIES', 'OTHER_ROLE', 'TRIBAL_NATION', 'Utility Director'],
    ['GOVERNMENT', 'LEADERSHIP', 'TRIBAL_NATION', 'Chairperson'],
    ['OTHER', 'OTHER_ROLE', 'TRIBAL_NATION', 'Program Manager'],
    ['GOVERNMENT', 'LEADERSHIP', 'TRIBAL_NATION', 'President'],
    ['BROADBAND', 'BROADBAND', 'NONPROFIT', 'Broadband Program Lead'],
    ['BROADBAND', 'IT_TECHNOLOGY', 'TRIBAL_NATION', 'IT Director'],
    ['OTHER', 'OTHER_ROLE', 'TRIBAL_ENTERPRISE', 'Operations Manager'],
    ['OTHER', 'OTHER_ROLE', 'NONPROFIT', 'Program Manager'],
  ];
  const people = variants.map(([tribalCategory, roleCategory, orgType, jobTitle], index) => person({
    id: `person-${index}`,
    tribalCategory,
    roleCategory,
    jobTitle,
    company: { ...person().company, id: `company-${index}`, name: `Company ${index}`, orgType },
  }));
  const candidates = selectWorkingCohort(people, 10);
  const pilot = selectPilot(candidates, 10);
  assert.equal(pilot.length, 10);
  assert.equal(new Set(pilot.map((row) => row.person_id)).size, 10);
  assert.equal(new Set(pilot.map((row) => row.company_id)).size, 10);
  assert.equal(new Set(pilot.map((row) => row.pilot_stratum)).size, 10);
});

test('audit summary distinguishes technical eligibility from campaign readiness', () => {
  const artifacts = buildAuditArtifacts([person()], {
    expectedEligible: 1,
    expectedQueued: 0,
    cohortSize: 1,
    pilotSize: 1,
    generatedAt: '2026-08-21T00:00:00.000Z',
  });
  assert.equal(artifacts.summary.baseline_reproduced, true);
  assert.equal(artifacts.summary.counts.baseline_eligible, 1);
  assert.equal(artifacts.summary.counts.campaign_ready, 0);
});

test('BrowserOS job packets omit email and declare forbidden attributes', () => {
  const artifacts = buildAuditArtifacts([person()], {
    expectedEligible: 1,
    expectedQueued: 0,
    cohortSize: 1,
    pilotSize: 1,
    generatedAt: '2026-08-21T00:00:00.000Z',
  });
  const [packet] = buildBrowserOsJobPackets(artifacts.pilot, artifacts.summary);
  assert.equal(Object.hasOwn(packet, 'email'), false);
  assert.equal(packet.tenant_id, 'konative');
  assert.ok(packet.forbidden_attributes.includes('tribal_membership_or_enrollment'));
});

test('private outputs are rejected inside the Git repository', () => {
  assert.throws(
    () => assertOutputOutsideRepo('/repo/private-output', '/repo'),
    /Refusing to write private CRM artifacts inside Git repository/,
  );
  const safe = mkdtempSync(join(tmpdir(), 'konative-audit-'));
  assert.equal(assertOutputOutsideRepo(safe, '/repo'), safe);
});

test('Twenty GraphQL 200 response with errors fails closed', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    errors: [{ message: 'field contract drifted' }],
  }), { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    await assert.rejects(
      fetchGraphql('https://crm.example.test', 'token', 'query Test { people { totalCount } }', {}),
      /field contract drifted/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Twenty non-JSON unauthorized response fails closed', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('unauthorized', { status: 401 });
  try {
    await assert.rejects(
      fetchGraphql('https://crm.example.test', 'expired-token', 'query Test { people { totalCount } }', {}),
      /Twenty GraphQL HTTP 401/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
