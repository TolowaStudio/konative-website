#!/usr/bin/env node

/**
 * Warm-path inventory for Konative (TOL-3555, W3b of TOL-3545).
 *
 * Decision of record (TOL-3559, 2026-11-15): outreach is warm intros only, at
 * $0. A Twenty person is "warm" only with evidence of a real two-way prior
 * relationship. Imported-list attributes (tribal vertical, domain match,
 * campaign segment, job title) are never evidence.
 *
 * Modes:
 *   inventory (default) read-only. Reads people, classifies, dedupes, writes
 *                       inventory.json + summary.json (mode 0600, outside the repo).
 *   --apply             additive only: one Note per warm person, marker-tagged,
 *                       plus undo.json (note ids). Needs --inventory and the
 *                       matching --approval-sha256 of that exact file.
 *
 * It has no sender, audience, or campaign operation, never creates a Person
 * or Company, and never edits an existing field.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { isTribalScope } from './konative-crm-campaign-audit.mjs';

export const TOOL_VERSION = 'konative-warm-path-inventory-v0.1.0';
export const NOTE_MARKER = '[konative-warm-path]';
export const MAX_APPLY = 25;
export const K2_FLOOR = 20; // venture analysis K2: <20 real warm contacts by 2026-12-05
export const TARGET = 40;

// Twenty person relations that can prove a two-way relationship, and the
// evidence class each one maps to. A relation absent from the live schema is
// reported as unavailable, never guessed.
export const SIGNAL_RELATIONS = Object.freeze({
  pointOfContactForOpportunities: 'opportunity',
  calendarEventParticipants: 'meeting',
  messageParticipants: 'reply',
});
export const EVIDENCE_CLASSES = Object.freeze(['opportunity', 'meeting', 'reply', 'inbound']);

// sourceProject values meaning the person came to Konative first.
export const INBOUND_SOURCES = Object.freeze(['konative-form', 'konative-website', 'cal.com', 'linkedin-inbound']);

// outreachStatus values that must never be logged as warm.
export const SUPPRESSED_STATUSES = Object.freeze(['DNC', 'OPTED_OUT', 'BOUNCED', 'QUEUED']);

// Our own mailboxes and automated senders are not a two-way relationship. The
// Twenty mail/calendar sync pulls in every thread on the shared CRM, so a
// "from" row can be a robot or a teammate (first live run, TOL-3555: 14 + 13).
export const AUTOMATED_LOCAL_PART = /^(no-?reply|do-?not-?reply|notifications?|mailer-daemon|postmaster|newsletter|bounces?|alerts?|billing|invoices?|receipts?)([._+-]|$)/i;
export const INTERNAL_DOMAINS = Object.freeze(['tolowa.net', 'tolowa.studio', 'tolowastudio.com', 'konative.com']);

export const WARM_CHANNELS = Object.freeze(['avant', 't4devco', 'tribal', 'referral']);

const norm = (v) => (v === null || v === undefined ? '' : String(v).trim());
const lower = (v) => norm(v).toLowerCase();

export function personDisplayName(person) {
  const n = person?.name || {};
  return [norm(n.firstName), norm(n.lastName)].filter(Boolean).join(' ');
}

/** Pure: does this person carry real two-way relationship evidence? */
export function classifyPerson(person) {
  if (person?.doNotContact === true) return { warm: false, reason: 'do_not_contact' };
  const status = norm(person?.outreachStatus).toUpperCase();
  if (SUPPRESSED_STATUSES.includes(status)) return { warm: false, reason: `suppressed_status:${status}` };

  const email = lower(person?.emails?.primaryEmail);
  if (email) {
    const [local, domain = ''] = email.split('@');
    if (INTERNAL_DOMAINS.includes(domain)) return { warm: false, reason: 'internal_address' };
    if (AUTOMATED_LOCAL_PART.test(local)) return { warm: false, reason: 'automated_sender' };
  }

  const evidence = [];
  for (const signal of person?.signals || []) {
    if (!EVIDENCE_CLASSES.includes(signal?.type)) continue;
    evidence.push({ type: signal.type, ref: norm(signal.ref), at: norm(signal.at) });
  }
  if (INBOUND_SOURCES.includes(lower(person?.sourceProject))) {
    evidence.push({ type: 'inbound', ref: `sourceProject:${lower(person.sourceProject)}`, at: norm(person.createdAt) });
  }
  if (evidence.length === 0) return { warm: false, reason: 'no_relationship_evidence' };
  const classes = [...new Set(evidence.map((e) => e.type))].sort();
  return { warm: true, evidence, classes };
}

function dedupeKeys(person) {
  const keys = [];
  const email = lower(person?.emails?.primaryEmail);
  if (email) keys.push(`email:${email}`);
  const name = lower(personDisplayName(person));
  if (name) keys.push(`name:${name}|co:${norm(person?.company?.id) || lower(person?.company?.name)}`);
  return keys;
}

/** Pure: classify + dedupe. Union-find over email and name+company keys. */
export function k2Status(n) {
  return n < K2_FLOOR ? 'BREACH' : n < TARGET ? 'BELOW_TARGET' : 'MET';
}

export function buildInventory(people, { externalCandidates = [] } = {}) {
  const excluded = [];
  const warm = [];
  for (const person of people) {
    if (!norm(person?.id)) throw new Error('Person record without id');
    const result = classifyPerson(person);
    if (!result.warm) { excluded.push({ person_id: person.id, reason: result.reason }); continue; }
    warm.push({ person, evidence: result.evidence, classes: result.classes });
  }

  const parent = new Map(warm.map((w, i) => [i, i]));
  const find = (i) => { while (parent.get(i) !== i) { parent.set(i, parent.get(parent.get(i))); i = parent.get(i); } return i; };
  const seenKey = new Map();
  warm.forEach((w, i) => {
    for (const key of dedupeKeys(w.person)) {
      if (seenKey.has(key)) parent.set(find(i), find(seenKey.get(key)));
      else seenKey.set(key, i);
    }
  });
  const groups = new Map();
  warm.forEach((w, i) => { const r = find(i); groups.set(r, [...(groups.get(r) || []), w]); });

  const records = [];
  const duplicates = [];
  for (const members of groups.values()) {
    members.sort((a, b) => (b.evidence.length - a.evidence.length)
      || norm(a.person.createdAt).localeCompare(norm(b.person.createdAt))
      || norm(a.person.id).localeCompare(norm(b.person.id)));
    const [keep, ...rest] = members;
    for (const dup of rest) duplicates.push({ person_id: dup.person.id, duplicate_of: keep.person.id });
    const evidence = members.flatMap((m) => m.evidence);
    records.push({
      person_id: keep.person.id,
      name: personDisplayName(keep.person),
      company: norm(keep.person.company?.name),
      has_email: Boolean(lower(keep.person.emails?.primaryEmail)),
      konative_scope: isTribalScope(keep.person),
      evidence_classes: [...new Set(evidence.map((e) => e.type))].sort(),
      evidence_count: evidence.length,
      evidence: evidence.slice(0, 10),
    });
  }
  records.sort((a, b) => a.person_id.localeCompare(b.person_id));

  const candidates = [];
  const rejected_candidates = [];
  externalCandidates.forEach((c, index) => {
    const problems = validateExternalCandidate(c);
    if (problems.length) rejected_candidates.push({ index, problems });
    else candidates.push({ ...normalizeCandidate(c), status: 'needs_human_before_twenty_write' });
  });

  const count = records.length;
  return {
    tool_version: TOOL_VERSION,
    counts: {
      people_read: people.length,
      warm_unique: count,
      excluded: excluded.length,
      warm_unique_konative_scope: records.filter((r) => r.konative_scope).length,
      duplicates_collapsed: duplicates.length,
      public_candidates: candidates.length,
      public_candidates_rejected: rejected_candidates.length,
    },
    target: TARGET,
    k2_floor: K2_FLOOR,
    // K2 is judged on records Konative can actually use: the shared Twenty also holds
    // other ventures' contacts, which are not Konative warm paths (TOL-3555 first live run:
    // 1,792 relationship rows, only a fraction in tribal scope).
    k2_status: k2Status(records.filter((r) => r.konative_scope).length),
    by_evidence_class: Object.fromEntries(EVIDENCE_CLASSES.map((c) => [c, records.filter((r) => r.evidence_classes.includes(c)).length])),
    records,
    duplicates,
    excluded_reasons: excluded.reduce((acc, e) => ({ ...acc, [e.reason]: (acc[e.reason] || 0) + 1 }), {}),
    candidates,
    rejected_candidates,
  };
}

/**
 * Free public source candidates are accounts reached THROUGH a warm channel,
 * not cold leads: they need an https source and a named introducer.
 */
export function validateExternalCandidate(c) {
  const problems = [];
  if (!norm(c?.org)) problems.push('missing org');
  let url = null;
  try { url = new URL(norm(c?.source_url)); } catch { /* handled below */ }
  if (!url || url.protocol !== 'https:') problems.push('source_url must be https');
  if (!WARM_CHANNELS.includes(lower(c?.channel))) problems.push(`channel must be one of ${WARM_CHANNELS.join(',')}`);
  if (!norm(c?.introducer)) problems.push('missing named introducer (no introducer = cold, out of scope)');
  if (!norm(c?.evidence)) problems.push('missing evidence sentence');
  if (c && ('email' in c || 'phone' in c)) problems.push('contact details are not collected from public sources');
  return problems;
}

function normalizeCandidate(c) {
  return {
    org: norm(c.org),
    source_url: new URL(norm(c.source_url)).toString(),
    channel: lower(c.channel),
    introducer: norm(c.introducer),
    evidence: norm(c.evidence),
  };
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

export function noteTitle(runId) {
  return `${NOTE_MARKER} ${runId}`;
}

export function noteBody(record, runId) {
  return [
    `${NOTE_MARKER} Warm relationship evidence (run ${runId}).`,
    `Classes: ${record.evidence_classes.join(', ')}.`,
    ...record.evidence.map((e) => `- ${e.type}: ${e.ref || 'n/a'}${e.at ? ` (${e.at})` : ''}`),
    'Logged by Konative warm-path inventory. Not an approval to contact. A send needs Jeramey to approve the exact batch.',
  ].join('\n');
}

/** Pure: which inventory records still need a note (idempotent by marker). */
export function planNotes(inventory, existingMarkerPersonIds, { limit = MAX_APPLY } = {}) {
  const have = new Set(existingMarkerPersonIds);
  // Konative notes go only on Konative-scope people; other ventures' contacts are never touched.
  const inScope = inventory.records.filter((r) => r.konative_scope === true);
  const todo = inScope.filter((r) => !have.has(r.person_id));
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_APPLY) throw new Error(`limit must be 1..${MAX_APPLY}`);
  return {
    create: todo.slice(0, limit).map((r) => r.person_id),
    remaining_after_run: Math.max(0, todo.length - limit),
    skip_already_logged: inScope.filter((r) => have.has(r.person_id)).map((r) => r.person_id),
  };
}

export function verifyApproval(inventoryText, approvalSha) {
  if (!approvalSha) throw new Error('--apply requires --approval-sha256 of the reviewed inventory file');
  if (sha256(inventoryText) !== lower(approvalSha)) {
    throw new Error('Approval hash does not match the inventory file; refusing to write');
  }
}

export function assertOutputOutsideRepo(outputDir, repoRoot) {
  const rel = relative(resolve(repoRoot), resolve(outputDir));
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) {
    throw new Error(`Refusing to write private CRM artifacts inside Git repository: ${resolve(outputDir)}`);
  }
  return resolve(outputDir);
}

function writePrivate(path, content) {
  writeFileSync(path, content, { encoding: 'utf8', mode: 0o600 });
  chmodSync(path, 0o600);
}

export async function fetchGraphql(baseUrl, token, query, variables = {}) {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/graphql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.errors?.length || !body.data) {
    const messages = (body.errors || []).map((e) => (typeof e?.message === 'string' ? e.message : JSON.stringify(e?.message ?? e)));
    throw new Error(`Twenty GraphQL ${messages.length ? messages.join('; ') : `HTTP ${response.status}`}`);
  }
  return body.data;
}

/** Which of the relations we know how to read exist on the live Person type. */
export function availableSignalRelations(personFieldNames) {
  const present = new Set(personFieldNames);
  return {
    used: Object.keys(SIGNAL_RELATIONS).filter((r) => present.has(r)),
    unavailable: Object.keys(SIGNAL_RELATIONS).filter((r) => !present.has(r)),
  };
}

export function buildPeopleQuery(relations) {
  const rel = relations.map((r) => {
    const extra = r === 'messageParticipants' ? 'role messageId' : r === 'calendarEventParticipants' ? 'calendarEventId' : 'id';
    return `${r}(first: 20) { edges { node { id ${extra} createdAt } } }`;
  }).join('\n');
  return `query WarmPathPeople($after: String) {
    people(first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        id createdAt name { firstName lastName } emails { primaryEmail }
        doNotContact outreachStatus sourceProject vertical tribalCategory
        company { id name vertical orgType }
        ${rel}
      } }
    }
  }`;
}

/** Pure: GraphQL node -> normalized person with signals. Replies must be FROM the contact. */
export function nodeToPerson(node) {
  const signals = [];
  for (const [relation, type] of Object.entries(SIGNAL_RELATIONS)) {
    for (const edge of node?.[relation]?.edges || []) {
      const n = edge?.node || {};
      if (relation === 'messageParticipants' && norm(n.role).toLowerCase() !== 'from') continue;
      signals.push({ type, ref: `${relation}:${norm(n.calendarEventId || n.messageId || n.id)}`, at: norm(n.createdAt) });
    }
  }
  return { ...node, signals };
}

async function readPeople({ baseUrl, token }) {
  const schema = await fetchGraphql(baseUrl, token, '{ person: __type(name: "Person") { fields { name } } }');
  const relations = availableSignalRelations(schema.person.fields.map((f) => f.name));
  if (relations.used.length === 0 && !schema.person.fields.some((f) => f.name === 'sourceProject')) {
    throw new Error('Live Person type exposes no relationship signal; refusing to guess');
  }
  const query = buildPeopleQuery(relations.used);
  const people = [];
  let after = null;
  do {
    const data = await fetchGraphql(baseUrl, token, query, { after });
    people.push(...data.people.edges.map((e) => nodeToPerson(e.node)));
    after = data.people.pageInfo.hasNextPage ? data.people.pageInfo.endCursor : null;
    if (after) await new Promise((r) => setTimeout(r, 700)); // stay under Twenty's request ceiling
  } while (after);
  return { people, relations };
}

const SECRET_NAME = /^[A-Za-z0-9_-]{1,255}$/;
export const GSM_PROJECT = 'tolowa-studio';

/**
 * Resolve the Twenty token. TWENTY_API_TOKEN wins when a human supplied it.
 * With --token-secret <name> the token is read from Secret Manager INSIDE this
 * process (same pattern as linear-ro, TOL-2027): it stays in memory, is never
 * printed, exported or written, and no error message includes it. This is what
 * lets an unattended lane run the read-only inventory without exporting a secret.
 */
export function resolveToken(args, env = process.env, spawn = spawnSync) {
  const fromEnv = norm(env.TWENTY_API_TOKEN);
  if (fromEnv) return fromEnv;
  if (!args.tokenSecret) throw new Error('TWENTY_API_TOKEN is required (or pass --token-secret <Secret Manager name>)');
  if (!SECRET_NAME.test(args.tokenSecret)) throw new Error('--token-secret must be a plain Secret Manager secret name');
  const r = spawn('gcloud', ['secrets', 'versions', 'access', 'latest', `--secret=${args.tokenSecret}`, `--project=${GSM_PROJECT}`],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 });
  const token = norm(r?.stdout);
  if (r?.status !== 0 || !token) throw new Error(`Could not read secret ${args.tokenSecret} from Secret Manager (exit ${r?.status ?? 'none'}); no value printed`);
  return token;
}

export function parseArgs(argv) {
  const args = { baseUrl: 'https://crm.tolowastudio.com', apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => { i += 1; if (i >= argv.length) throw new Error(`Missing value for ${arg}`); return argv[i]; };
    if (arg === '--output-dir') args.outputDir = next();
    else if (arg === '--base-url') args.baseUrl = next();
    else if (arg === '--public-candidates') args.publicCandidates = next();
    else if (arg === '--inventory') args.inventory = next();
    else if (arg === '--approval-sha256') args.approvalSha = next();
    else if (arg === '--run-id') args.runId = next();
    else if (arg === '--limit') args.limit = Number(next());
    else if (arg === '--token-secret') args.tokenSecret = next();
    else if (arg === '--apply') args.apply = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.outputDir) throw new Error('--output-dir is required');
  if (args.apply && !args.inventory) throw new Error('--apply requires --inventory');
  return args;
}

function findRepoRoot(start) {
  let current = resolve(start);
  for (;;) {
    if (existsSync(resolve(current, '.git'))) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const token = resolveToken(args);
  const repoRoot = findRepoRoot(dirname(fileURLToPath(import.meta.url))) || process.cwd();
  const outputDir = assertOutputOutsideRepo(args.outputDir, repoRoot);
  mkdirSync(outputDir, { recursive: true, mode: 0o700 });
  chmodSync(outputDir, 0o700);
  const runId = args.runId || `warm-path-${new Date().toISOString().slice(0, 10)}`;

  if (!args.apply) {
    const external = args.publicCandidates ? JSON.parse(readFileSync(resolve(args.publicCandidates), 'utf8')) : [];
    const { people, relations } = await readPeople({ baseUrl: args.baseUrl, token });
    const inventory = { ...buildInventory(people, { externalCandidates: external }), run_id: runId, signal_relations: relations };
    writePrivate(resolve(outputDir, 'inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ mode: 'inventory', ...inventory.counts, k2_status: inventory.k2_status, sha256: sha256(readFileSync(resolve(outputDir, 'inventory.json'), 'utf8')) })}\n`);
    return;
  }

  const text = readFileSync(resolve(args.inventory), 'utf8');
  verifyApproval(text, args.approvalSha);
  const inventory = JSON.parse(text);
  const marker = await fetchGraphql(args.baseUrl, token, `query { notes(first: 200, filter: { title: { like: "${NOTE_MARKER}%" } }) { edges { node { id title noteTargets { edges { node { personId } } } } } } }`);
  const have = marker.notes.edges.flatMap((e) => e.node.noteTargets.edges.map((t) => t.node.personId)).filter(Boolean);
  // First live run is one record unless --limit says otherwise (hard cap MAX_APPLY).
  const plan = planNotes(inventory, have, { limit: Number.isInteger(args.limit) && args.limit > 0 ? Math.min(args.limit, MAX_APPLY) : 1 });
  const created = [];
  try {
    for (const personId of plan.create) {
      const record = inventory.records.find((r) => r.person_id === personId);
      const note = await fetchGraphql(args.baseUrl, token,
        'mutation($data: NoteCreateInput!) { createNote(data: $data) { id title } }',
        { data: { title: noteTitle(inventory.run_id || runId), bodyV2: { markdown: noteBody(record, inventory.run_id || runId) } } });
      const noteId = note.createNote.id;
      created.push({ person_id: personId, note_id: noteId });
      await fetchGraphql(args.baseUrl, token,
        'mutation($data: NoteTargetCreateInput!) { createNoteTarget(data: $data) { id } }',
        { data: { noteId, personId } });
    }
  } finally {
    // Undo file is written even on partial failure: deleteNote on each id reverses the run.
    writePrivate(resolve(outputDir, 'undo.json'), `${JSON.stringify({ tool_version: TOOL_VERSION, run_id: runId, undo: 'deleteNote for each note_id', created, skipped: plan.skip_already_logged }, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify({ mode: 'apply', created: created.length, skipped: plan.skip_already_logged.length })}\n`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) main().catch((error) => {
  process.stderr.write(`${error.stack || error.message || String(error)}\n`);
  process.exitCode = 1;
});
