import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  assertOutputOutsideRepo,
  baselineExitCode,
  baselineExclusionReasons,
  buildBrowserOsJobPackets,
  fetchGraphql,
  buildAuditArtifacts,
  campaignReadinessBlockers,
  parseArgs,
  proposeSegment,
  scoreCandidate,
  selectPilot,
  selectWorkingCohort,
  writePrivate,
} from './konative-crm-campaign-audit.mjs';

function person(overrides = {}) {
  return {
    id: overrides.id ?? 'person-1',
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

test('working cohort selects the highest fit score before alphabetical tie-breakers', () => {
  const lowScore = person({
    id: 'person-low',
    name: { firstName: 'Low', lastName: 'Score' },
    tier1Target: false,
    evidenceUrl: '',
    roleCategory: 'OTHER_ROLE',
    tribalCategory: 'OTHER',
    company: {
      ...person().company,
      id: 'company-low',
      name: 'Aardvark Nation',
      orgType: 'NONPROFIT',
      idealCustomerProfile: false,
    },
  });
  const highScore = person({
    id: 'person-high',
    name: { firstName: 'High', lastName: 'Score' },
    company: { ...person().company, id: 'company-high', name: 'Zulu Nation' },
  });

  const selected = selectWorkingCohort([lowScore, highScore], 1)
    .filter((row) => row.working_cohort_selected);
  assert.equal(selected[0].person_id, 'person-high');
  assert.ok(selected[0].fit_score > scoreCandidate(lowScore).score);
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
  assert.equal(artifacts.summary.baseline_reproduced, false);
  assert.equal(artifacts.summary.baseline_status, 'NOT_ASSERTED');
  assert.equal(artifacts.summary.counts.baseline_eligible, 1);
  assert.equal(artifacts.summary.counts.campaign_ready, 0);
  assert.equal(artifacts.summary.baseline_checks.counts.status, 'PASS');
  assert.equal(artifacts.summary.baseline_checks.candidate_membership.status, 'NOT_ASSERTED');
  assert.equal(artifacts.summary.baseline_checks.working_cohort_membership.status, 'NOT_ASSERTED');
  assert.equal(artifacts.summary.baseline_checks.queued_membership.status, 'NOT_ASSERTED');
  assert.equal(baselineExitCode(true, artifacts.summary), 3);
  assert.equal(baselineExitCode(false, artifacts.summary), 0);
});

test('membership hashes ignore mutable enrichment fields while content hashes preserve drift', () => {
  const before = buildAuditArtifacts([person({ evidenceUrl: 'https://example.test/old' })], {
    expectedEligible: 1,
    expectedQueued: 0,
    cohortSize: 1,
    pilotSize: 1,
    generatedAt: '2026-08-21T00:00:00.000Z',
  });
  const after = buildAuditArtifacts([person({ evidenceUrl: 'https://example.test/new' })], {
    expectedEligible: 1,
    expectedQueued: 0,
    cohortSize: 1,
    pilotSize: 1,
    generatedAt: '2026-08-21T00:00:00.000Z',
  });

  assert.notEqual(before.summary.record_set_sha256, after.summary.record_set_sha256);
  assert.notEqual(before.summary.working_cohort_sha256, after.summary.working_cohort_sha256);
  assert.equal(before.summary.candidate_membership_sha256, after.summary.candidate_membership_sha256);
  assert.equal(before.summary.working_cohort_membership_sha256, after.summary.working_cohort_membership_sha256);
});

test('expected membership hashes fail closed on identity drift', () => {
  const baseline = buildAuditArtifacts([person({ id: 'person-original' })], {
    expectedEligible: 1,
    expectedQueued: 0,
    cohortSize: 1,
    pilotSize: 1,
  });
  const matching = buildAuditArtifacts([person({ id: 'person-original' })], {
    expectedEligible: 1,
    expectedQueued: 0,
    expectedCandidateMembershipSha256: baseline.summary.candidate_membership_sha256,
    expectedWorkingCohortMembershipSha256: baseline.summary.working_cohort_membership_sha256,
    expectedQueuedMembershipSha256: baseline.summary.queued_membership_sha256,
    cohortSize: 1,
    pilotSize: 1,
  });
  const drifted = buildAuditArtifacts([person({ id: 'person-replacement' })], {
    expectedEligible: 1,
    expectedQueued: 0,
    expectedCandidateMembershipSha256: baseline.summary.candidate_membership_sha256,
    expectedWorkingCohortMembershipSha256: baseline.summary.working_cohort_membership_sha256,
    expectedQueuedMembershipSha256: baseline.summary.queued_membership_sha256,
    cohortSize: 1,
    pilotSize: 1,
  });

  assert.equal(matching.summary.baseline_reproduced, true);
  assert.equal(matching.summary.baseline_checks.candidate_membership.status, 'PASS');
  assert.equal(drifted.summary.baseline_reproduced, false);
  assert.equal(drifted.summary.baseline_checks.candidate_membership.status, 'DRIFT');
  assert.equal(drifted.summary.baseline_checks.working_cohort_membership.status, 'DRIFT');
  assert.equal(baselineExitCode(true, drifted.summary), 3);
  assert.equal(baselineExitCode(false, drifted.summary), 0);
});

test('membership hashes reject missing and duplicate identities', () => {
  assert.throws(
    () => buildAuditArtifacts([person({ id: '' })], {
      expectedEligible: 1,
      expectedQueued: 0,
      cohortSize: 1,
      pilotSize: 1,
    }),
    /person IDs are missing/,
  );
  assert.throws(
    () => buildAuditArtifacts([
      person({ id: 'person-duplicate' }),
      person({ id: 'person-duplicate' }),
    ], {
      expectedEligible: 2,
      expectedQueued: 0,
      cohortSize: 2,
      pilotSize: 2,
    }),
    /duplicate person IDs/,
  );
});

test('global identity validation rejects missing or duplicate IDs outside the eligible cohort', () => {
  assert.throws(
    () => buildAuditArtifacts([
      person({ id: 'person-eligible' }),
      person({ id: '', emails: { primaryEmail: '' } }),
    ], { expectedEligible: 1, expectedQueued: 0, cohortSize: 1, pilotSize: 1 }),
    /person IDs are missing/,
  );
  assert.throws(
    () => buildAuditArtifacts([
      person({ id: 'person-duplicate' }),
      person({ id: 'person-duplicate', outreachStatus: 'QUEUED' }),
    ], { expectedEligible: 1, expectedQueued: 1, cohortSize: 1, pilotSize: 1 }),
    /duplicate person IDs detected across the fetched dataset/,
  );
});

test('unsafe queued identity replacement fails the asserted baseline', () => {
  const baselinePeople = [
    person({ id: 'person-eligible' }),
    person({ id: 'person-queued-original', outreachStatus: 'QUEUED' }),
  ];
  const baseline = buildAuditArtifacts(baselinePeople, {
    expectedEligible: 1,
    expectedQueued: 1,
    cohortSize: 1,
    pilotSize: 1,
  });
  const drifted = buildAuditArtifacts([
    person({ id: 'person-eligible' }),
    person({ id: 'person-queued-replacement', outreachStatus: 'QUEUED' }),
  ], {
    expectedEligible: 1,
    expectedQueued: 1,
    expectedCandidateMembershipSha256: baseline.summary.candidate_membership_sha256,
    expectedWorkingCohortMembershipSha256: baseline.summary.working_cohort_membership_sha256,
    expectedQueuedMembershipSha256: baseline.summary.queued_membership_sha256,
    cohortSize: 1,
    pilotSize: 1,
  });

  assert.equal(drifted.summary.baseline_checks.candidate_membership.status, 'PASS');
  assert.equal(drifted.summary.baseline_checks.working_cohort_membership.status, 'PASS');
  assert.equal(drifted.summary.baseline_checks.queued_membership.status, 'DRIFT');
  assert.equal(drifted.summary.baseline_reproduced, false);
  assert.equal(drifted.summary.baseline_status, 'DRIFT');
  assert.equal(baselineExitCode(true, drifted.summary), 3);
});

test('invalid or incomplete membership expectations fail before a live run', () => {
  assert.throws(
    () => buildAuditArtifacts([person()], {
      expectedEligible: 1,
      expectedQueued: 0,
      expectedCandidateMembershipSha256: 'not-a-sha',
      cohortSize: 1,
      pilotSize: 1,
    }),
    /exactly 64 hexadecimal characters/,
  );
  assert.throws(
    () => parseArgs([
      '--output-dir', '/tmp/konative-audit-test',
      '--fail-on-baseline-drift',
    ]),
    /requires all three expected membership SHA-256 arguments/,
  );
  assert.throws(
    () => parseArgs([
      '--output-dir', '/tmp/konative-audit-test',
      '--expected-candidate-membership-sha256', ' ',
    ]),
    /must be exactly 64 hexadecimal characters/,
  );
  assert.throws(
    () => parseArgs([
      '--output-dir', '/tmp/konative-audit-test',
      '--expected-candidate-membership-sha256', 'not-a-sha',
    ]),
    /must be exactly 64 hexadecimal characters/,
  );
});

test('CLI parses explicit membership baselines', () => {
  const args = parseArgs([
    '--output-dir', '/tmp/konative-audit-test',
    '--expected-candidate-membership-sha256', 'A'.repeat(64),
    '--expected-working-cohort-membership-sha256', 'B'.repeat(64),
    '--expected-queued-membership-sha256', 'C'.repeat(64),
    '--fail-on-baseline-drift',
  ]);
  assert.equal(args.expectedCandidateMembershipSha256, 'a'.repeat(64));
  assert.equal(args.expectedWorkingCohortMembershipSha256, 'b'.repeat(64));
  assert.equal(args.expectedQueuedMembershipSha256, 'c'.repeat(64));
  assert.equal(args.failOnBaselineDrift, true);
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
  assert.throws(
    () => assertOutputOutsideRepo('/repo/..private-output', '/repo'),
    /Refusing to write private CRM artifacts inside Git repository/,
  );
  const safe = mkdtempSync(join(tmpdir(), 'konative-audit-'));
  assert.equal(assertOutputOutsideRepo(safe, '/repo'), realpathSync(safe));
});

test('private output paths and artifact targets reject symlinks', () => {
  const root = mkdtempSync(join(tmpdir(), 'konative-audit-symlink-'));
  const repo = join(root, 'repo');
  const outside = join(root, 'outside');
  mkdirSync(repo);
  mkdirSync(outside);
  const linkedRepo = join(outside, 'linked-repo');
  symlinkSync(repo, linkedRepo);
  assert.throws(
    () => assertOutputOutsideRepo(join(linkedRepo, 'private-output'), repo),
    /Refusing symlinked private CRM output path component/,
  );

  const target = join(outside, 'target.txt');
  const artifact = join(outside, 'artifact.json');
  writeFileSync(target, 'do not overwrite');
  symlinkSync(target, artifact);
  assert.throws(
    () => writePrivate(artifact, '{}\n'),
    /Refusing to overwrite symlinked private CRM artifact/,
  );
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
