import assert from 'node:assert/strict';
import test from 'node:test';

import {
  K2_FLOOR,
  TARGET,
  MAX_APPLY,
  NOTE_MARKER,
  assertOutputOutsideRepo,
  availableSignalRelations,
  buildInventory,
  buildPeopleQuery,
  classifyPerson,
  GSM_PROJECT,
  noteBody,
  nodeToPerson,
  parseArgs,
  planNotes,
  resolveToken,
  sha256,
  validateExternalCandidate,
  verifyApproval,
} from './konative-warm-path-inventory.mjs';

// Synthetic people only: this repo is public, so no real contact data here.
const person = (id, over = {}) => ({
  id,
  createdAt: '2026-01-01T00:00:00Z',
  name: { firstName: 'Test', lastName: `Person${id}` },
  emails: { primaryEmail: `p${id}@example.test` },
  company: { id: 'c1', name: 'Example Tribe IT' },
  doNotContact: false,
  outreachStatus: null,
  sourceProject: null,
  signals: [],
  ...over,
});
const meeting = { type: 'meeting', ref: 'calendarEventParticipants:e1', at: '2026-09-01' };

test('imported-list attributes alone are never relationship evidence', () => {
  const p = person('1', { tribalCategory: 'GAMING', vertical: 'TRIBAL', campaignSegment: 'SEGMENT_A', jobTitle: 'CIO' });
  assert.deepEqual(classifyPerson(p), { warm: false, reason: 'no_relationship_evidence' });
});

test('a meeting, reply, opportunity or inbound source makes a person warm', () => {
  assert.equal(classifyPerson(person('1', { signals: [meeting] })).warm, true);
  assert.equal(classifyPerson(person('2', { sourceProject: 'Konative-Form' })).warm, true);
  assert.deepEqual(classifyPerson(person('3', { sourceProject: 'konative-form' })).classes, ['inbound']);
});

test('suppression beats evidence: DNC, opted out and legacy QUEUED are excluded', () => {
  assert.equal(classifyPerson(person('1', { signals: [meeting], doNotContact: true })).reason, 'do_not_contact');
  assert.equal(classifyPerson(person('2', { signals: [meeting], outreachStatus: 'opted_out' })).reason, 'suppressed_status:OPTED_OUT');
  assert.equal(classifyPerson(person('3', { signals: [meeting], outreachStatus: 'QUEUED' })).reason, 'suppressed_status:QUEUED');
});

test('only messages FROM the contact count as a reply', () => {
  const node = (role) => ({ id: 'x', messageParticipants: { edges: [{ node: { id: 'm', role, messageId: 'msg1', createdAt: '2026-02-02' } }] } });
  assert.equal(nodeToPerson(node('to')).signals.length, 0);
  assert.equal(nodeToPerson(node('cc')).signals.length, 0);
  assert.deepEqual(nodeToPerson(node('from')).signals.map((s) => s.type), ['reply']);
});

test('dedupe collapses same email and same name+company; keeps the best-evidenced record', () => {
  const a = person('1', { signals: [meeting] });
  const b = person('2', { emails: { primaryEmail: 'P1@EXAMPLE.TEST' }, signals: [meeting, { type: 'reply', ref: 'r', at: '' }] });
  const c = person('3', { emails: { primaryEmail: 'other@example.test' }, name: a.name, signals: [meeting] });
  const d = person('4', { emails: { primaryEmail: 'solo@example.test' }, name: { firstName: 'Solo', lastName: 'One' }, signals: [meeting] });
  const inv = buildInventory([a, b, c, d]);
  assert.equal(inv.counts.warm_unique, 2);
  assert.equal(inv.counts.duplicates_collapsed, 2);
  assert.equal(inv.records.find((r) => r.person_id === '2').evidence_count, 4, 'merged evidence from the group');
  assert.deepEqual(inv.duplicates.map((x) => x.duplicate_of).sort(), ['2', '2']);
});

test('K2 status: below floor is a breach, never silently padded', () => {
  const people = Array.from({ length: K2_FLOOR - 1 }, (_, i) => person(String(i), { emails: { primaryEmail: `u${i}@example.test` }, name: { firstName: 'N', lastName: String(i) }, signals: [meeting] }));
  assert.equal(buildInventory(people).k2_status, 'BREACH');
  assert.equal(buildInventory(people).counts.warm_unique, K2_FLOOR - 1);
});

test('public-source candidates need https, a warm channel and a named introducer; no contact details', () => {
  const ok = { org: 'Example Casino IT', source_url: 'https://example.test/speakers', channel: 'tribal', introducer: 'Named Contact', evidence: 'Spoke at event X' };
  assert.deepEqual(validateExternalCandidate(ok), []);
  assert.ok(validateExternalCandidate({ ...ok, introducer: '' }).length);
  assert.ok(validateExternalCandidate({ ...ok, channel: 'cold' }).length);
  assert.ok(validateExternalCandidate({ ...ok, source_url: 'http://example.test' }).length);
  assert.ok(validateExternalCandidate({ ...ok, email: 'x@example.test' }).length);
  const inv = buildInventory([], { externalCandidates: [ok, { ...ok, introducer: '' }] });
  assert.equal(inv.candidates.length, 1);
  assert.equal(inv.candidates[0].status, 'needs_human_before_twenty_write');
  assert.equal(inv.rejected_candidates.length, 1);
});

test('schema preflight: only relations present on the live Person type are queried', () => {
  const r = availableSignalRelations(['id', 'calendarEventParticipants']);
  assert.deepEqual(r.used, ['calendarEventParticipants']);
  assert.ok(r.unavailable.includes('messageParticipants'));
  const q = buildPeopleQuery(r.used);
  assert.match(q, /calendarEventParticipants/);
  assert.doesNotMatch(q, /messageParticipants/);
});

test('apply needs the exact reviewed inventory hash', () => {
  const text = '{"records":[]}\n';
  assert.throws(() => verifyApproval(text, ''), /requires --approval-sha256/);
  assert.throws(() => verifyApproval(text, sha256(`${text} `)), /does not match/);
  verifyApproval(text, sha256(text).toUpperCase());
});

test('planNotes is idempotent and bounded per run', () => {
  const inv = { records: Array.from({ length: 30 }, (_, i) => ({ person_id: `p${i}`, konative_scope: true })) };
  const first = planNotes(inv, [], { limit: 1 });
  assert.deepEqual(first.create, ['p0']);
  assert.equal(first.remaining_after_run, 29);
  const again = planNotes(inv, ['p0'], { limit: 2 });
  assert.deepEqual(again.create, ['p1', 'p2']);
  assert.deepEqual(again.skip_already_logged, ['p0']);
  assert.throws(() => planNotes(inv, [], { limit: MAX_APPLY + 1 }), /limit must be/);
  assert.throws(() => planNotes(inv, [], { limit: 0 }), /limit must be/);
});

test('note body carries the marker, the evidence, and the not-an-approval line, and no email', () => {
  const body = noteBody({ evidence_classes: ['meeting'], evidence: [{ type: 'meeting', ref: 'e1', at: '2026-09-01' }] }, 'run-1');
  assert.ok(body.startsWith(NOTE_MARKER));
  assert.match(body, /meeting: e1 \(2026-09-01\)/);
  assert.match(body, /Not an approval to contact/);
  assert.doesNotMatch(body, /@/);
});

test('private artifacts may not be written inside the repo', () => {
  assert.throws(() => assertOutputOutsideRepo('/repo/out', '/repo'), /inside Git repository/);
  assert.equal(assertOutputOutsideRepo('/elsewhere/out', '/repo'), '/elsewhere/out');
});

test('--token-secret reads the token in-process from Secret Manager, never via env or stdout', () => {
  const calls = [];
  const spawn = (cmd, argv, opts) => { calls.push({ cmd, argv, opts }); return { status: 0, stdout: 'fake-token-value\n' }; };
  const args = parseArgs(['--output-dir', '/out', '--token-secret', 'motion-twenty-crm-api-token']);
  assert.equal(resolveToken(args, {}, spawn), 'fake-token-value');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].cmd, 'gcloud');
  assert.ok(calls[0].argv.includes('--secret=motion-twenty-crm-api-token'));
  assert.ok(calls[0].argv.includes(`--project=${GSM_PROJECT}`));
  assert.deepEqual(calls[0].opts.stdio, ['ignore', 'pipe', 'ignore'], 'child stderr is dropped, stdout is captured, nothing inherits the terminal');
});

test('token resolution: env wins, no source is an error, a failed read never leaks a value', () => {
  const never = () => { throw new Error('gcloud must not be called'); };
  assert.equal(resolveToken({ tokenSecret: 'x' }, { TWENTY_API_TOKEN: ' from-env ' }, never), 'from-env');
  assert.throws(() => resolveToken({}, {}, never), /TWENTY_API_TOKEN is required/);
  assert.throws(() => resolveToken({ tokenSecret: 'a b; rm -rf' }, {}, never), /plain Secret Manager secret name/);
  const failing = () => ({ status: 1, stdout: 'partial-secret-leak' });
  assert.throws(() => resolveToken({ tokenSecret: 'motion-twenty-crm-api-token' }, {}, failing),
    (e) => /Could not read secret/.test(e.message) && !e.message.includes('partial-secret-leak'));
  assert.throws(() => resolveToken({ tokenSecret: 'motion-twenty-crm-api-token' }, {}, () => ({ status: 0, stdout: '  \n' })), /Could not read secret/);
});

const tribalPerson = (i, over = {}) => person(String(i), {
  emails: { primaryEmail: `t${i}@example.test` }, name: { firstName: 'T', lastName: String(i) },
  vertical: 'TRIBAL', signals: [meeting], ...over,
});

test('the shared Twenty holds other ventures: K2 counts only Konative-scope warm people', () => {
  const others = Array.from({ length: TARGET + 5 }, (_, i) => person(`o${i}`, {
    emails: { primaryEmail: `o${i}@example.test` }, name: { firstName: 'O', lastName: String(i) }, signals: [meeting] }));
  const inv = buildInventory(others);
  assert.equal(inv.counts.warm_unique, TARGET + 5);
  assert.equal(inv.counts.warm_unique_konative_scope, 0);
  assert.equal(inv.k2_status, 'BREACH', 'many warm rows from other ventures must not satisfy K2');
  const mixed = buildInventory([...others, ...Array.from({ length: TARGET }, (_, i) => tribalPerson(i))]);
  assert.equal(mixed.counts.warm_unique_konative_scope, TARGET);
  assert.equal(mixed.k2_status, 'MET');
  assert.equal(mixed.records.filter((r) => r.konative_scope).length, TARGET);
});

test('scope follows the campaign-audit predicate: person vertical, tribalCategory, company vertical or orgType', () => {
  const scoped = (over) => buildInventory([tribalPerson(1, { vertical: null, ...over })]).records[0].konative_scope;
  assert.equal(scoped({ vertical: 'TRIBAL' }), true);
  assert.equal(scoped({ tribalCategory: 'GAMING' }), true);
  assert.equal(scoped({ company: { id: 'c', name: 'X', vertical: 'tribal' } }), true);
  assert.equal(scoped({ company: { id: 'c', name: 'X', orgType: 'TRIBAL_GOVERNMENT' } }), true);
  assert.equal(scoped({ company: { id: 'c', name: 'X', vertical: 'MEDIA' } }), false);
});

test('our own addresses and automated senders are never warm, even with evidence', () => {
  const reply = { type: 'reply', ref: 'messageParticipants:m1', at: '' };
  for (const email of ['noreply@vendor.test', 'No-Reply@vendor.test', 'notifications@vendor.test', 'mailer-daemon@vendor.test', 'billing+x@vendor.test', 'me@konative.com', 'ME@Tolowa.net']) {
    const r = classifyPerson(person('1', { emails: { primaryEmail: email }, signals: [reply] }));
    assert.equal(r.warm, false, email);
  }
  assert.equal(classifyPerson(person('2', { emails: { primaryEmail: 'norman@vendor.test' }, signals: [reply] })).warm, true, 'a real name starting with "no" is fine');
  assert.equal(classifyPerson(person('3', { emails: { primaryEmail: 'a@mail.konative.com.example.test' }, signals: [reply] })).warm, true);
});

test('apply plans notes only for Konative-scope records', () => {
  const inv = { records: [
    { person_id: 'in1', konative_scope: true }, { person_id: 'out1', konative_scope: false },
    { person_id: 'old-record-without-flag' }, { person_id: 'in2', konative_scope: true },
  ] };
  const plan = planNotes(inv, ['in2'], { limit: 5 });
  assert.deepEqual(plan.create, ['in1']);
  assert.deepEqual(plan.skip_already_logged, ['in2']);
});

test('people query asks for the scope fields', () => {
  const q = buildPeopleQuery([]);
  for (const f of ['vertical', 'tribalCategory', 'orgType']) assert.match(q, new RegExp(f));
});
