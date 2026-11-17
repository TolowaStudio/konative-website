import assert from 'node:assert/strict';
import test from 'node:test';

import {
  K2_FLOOR,
  MAX_APPLY,
  NOTE_MARKER,
  assertOutputOutsideRepo,
  availableSignalRelations,
  buildInventory,
  buildPeopleQuery,
  classifyPerson,
  noteBody,
  nodeToPerson,
  planNotes,
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
  const inv = { records: Array.from({ length: 30 }, (_, i) => ({ person_id: `p${i}` })) };
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
