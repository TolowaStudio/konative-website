import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALLOWED_PERSON_FIELDS,
  BROWSEROS_TWENTY_SOURCE,
  applyWrites,
  fetchGraphql,
  formatGraphqlErrors,
  planWrites,
  validateEvidenceRecords,
  validateEnrichmentSourceEnum,
  validateSchema,
} from './konative-twenty-evidence-writer.mjs';

const named = (name) => ({ kind: 'INPUT_OBJECT', name });
const nonNull = (name) => ({ kind: 'NON_NULL', ofType: named(name) });
const field = (name, type = undefined) => ({ name, ...(type ? { type } : {}) });
const schema = {
  person: { fields: [...ALLOWED_PERSON_FIELDS, 'id'].map(field) },
  personInput: { inputFields: ALLOWED_PERSON_FIELDS.map((name) => field(
    name,
    name === 'enrichmentSource' ? named('PersonEnrichmentSource') : named('String'),
  )) },
  mutation: { fields: [{ name: 'updatePerson', args: [
    { name: 'id', type: nonNull('ID') },
    { name: 'data', type: nonNull('PersonUpdateInput') },
  ] }] },
  query: { fields: [{ name: 'person', args: [{ name: 'id', type: nonNull('ID') }] }] },
};

test('GraphQL error diagnostics preserve object-shaped messages', async () => {
  assert.equal(
    formatGraphqlErrors([{ message: { code: 'BAD_USER_INPUT', detail: 'invalid enum value' } }]),
    'Twenty GraphQL error: {"code":"BAD_USER_INPUT","detail":"invalid enum value"}',
  );
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 400,
    json: async () => ({ errors: [{ message: { code: 'BAD_USER_INPUT', detail: 'invalid enum value' } }] }),
  });
  try {
    await assert.rejects(
      fetchGraphql('https://crm.example.test', 'token', 'query Test { ping }'),
      /Twenty GraphQL error: \{"code":"BAD_USER_INPUT","detail":"invalid enum value"\}/,
    );
  } finally { globalThis.fetch = originalFetch; }
});

test('schema contract permits only the audited person enrichment fields', () => {
  assert.deepEqual(validateSchema(schema), {
    updateDataType: 'PersonUpdateInput!',
    updateSelectorName: 'id',
    updateSelectorType: 'ID!',
    personSelectorName: 'id',
    personSelectorType: 'ID!',
    enrichmentSourceEnumName: 'PersonEnrichmentSource',
  });
});

test('enrichmentSource enum must permit the explicit BrowserOS mapping', () => {
  assert.deepEqual(validateEnrichmentSourceEnum({
    kind: 'ENUM',
    name: 'PersonEnrichmentSource',
    enumValues: ['IMPORT', 'GOOGLE_PLACES', 'HUNTER_IO', 'MANUAL', 'INFERRED'].map(name => ({ name })),
  }), {
    enrichmentSourceEnumName: 'PersonEnrichmentSource',
    enrichmentSourceEnumValues: ['GOOGLE_PLACES', 'HUNTER_IO', 'IMPORT', 'INFERRED', 'MANUAL'],
  });
  assert.throws(() => validateEnrichmentSourceEnum({
    kind: 'ENUM', name: 'PersonEnrichmentSource', enumValues: [{ name: 'IMPORT' }],
  }), /does not allow MANUAL/);
});

test('schema drift fails closed before any write', () => {
  const drifted = structuredClone(schema);
  drifted.personInput.inputFields = drifted.personInput.inputFields.filter((entry) => entry.name !== 'enrichmentRun');
  assert.throws(() => validateSchema(drifted), /lacks allowed field enrichmentRun/);
});

test('evidence packet validation rejects non-BrowserOS, duplicates, and non-https sources', () => {
  assert.throws(() => validateEvidenceRecords({ records: [] }), /non-empty/);
  assert.throws(() => validateEvidenceRecords({ records: [{ person_id: 'p1', evidence_url: 'http://x.test', enrichment_source: 'browseros', enrichment_run: 'run' }] }), /https/);
  assert.throws(() => validateEvidenceRecords({ records: [{ person_id: 'p1', evidence_url: 'https://x.test', enrichment_source: 'manual', enrichment_run: 'run' }] }), /BrowserOS/);
  assert.throws(() => validateEvidenceRecords({ records: [
    { person_id: 'p1', evidence_url: 'https://x.test', enrichment_source: 'browseros', enrichment_run: 'run' },
    { person_id: 'p1', evidence_url: 'https://y.test', enrichment_source: 'browseros', enrichment_run: 'run' },
  ] }), /duplicate/);
});

test('BrowserOS evidence maps to MANUAL and preserves BrowserOS provenance in enrichmentRun', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => ({
    ok: true,
    json: async () => ({ data: { person: {
      id: 'p1', evidenceUrl: '', enrichmentSource: '', enrichmentRun: '',
    } } }),
  });
  try {
    const records = validateEvidenceRecords({ records: [{
      person_id: 'p1', evidence_url: 'https://example.test/team', enrichment_source: 'browseros-neo', enrichment_run: 'pilot-1',
    }] });
    const { planned } = await planWrites({ baseUrl: 'https://crm.example.test', token: 'token', records, schema });
    assert.deepEqual(planned[0].data, {
      evidenceUrl: 'https://example.test/team',
      enrichmentSource: BROWSEROS_TWENTY_SOURCE,
      enrichmentRun: 'browseros:browseros-neo:pilot-1',
    });
  } finally { globalThis.fetch = originalFetch; }
});

test('applyWrites never calls a mutation for already-current evidence', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('mutation should not be called'); };
  try {
    const receipts = await applyWrites({ baseUrl: 'https://crm.example.test', token: 'token', types: validateSchema(schema), planned: [{
      person_id: 'p1', action: 'skip_already_current', fields: ALLOWED_PERSON_FIELDS, data: {},
    }] });
    assert.deepEqual(receipts, [{ person_id: 'p1', action: 'skip_already_current' }]);
  } finally { globalThis.fetch = originalFetch; }
});

test('applyWrites verifies enum-like object responses and keeps confirmed receipts on a later failure', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return { ok: true, json: async () => ({ data: { updatePerson: {
        id: 'p1', evidenceUrl: 'https://example.test/team',
        enrichmentSource: { value: 'MANUAL', label: 'Manual' }, enrichmentRun: 'browseros-run',
      } } }) };
    }
    return { ok: false, status: 500, json: async () => ({}) };
  };
  try {
    await assert.rejects(
      applyWrites({ baseUrl: 'https://crm.example.test', token: 'token', types: validateSchema(schema), planned: [
        { person_id: 'p1', action: 'update_evidence_only', fields: ALLOWED_PERSON_FIELDS, data: {
          evidenceUrl: 'https://example.test/team', enrichmentSource: 'MANUAL', enrichmentRun: 'browseros-run',
        } },
        { person_id: 'p2', action: 'update_evidence_only', fields: ALLOWED_PERSON_FIELDS, data: {
          evidenceUrl: 'https://example.test/other', enrichmentSource: 'MANUAL', enrichmentRun: 'browseros-run',
        } },
      ] }),
      (error) => {
        assert.deepEqual(error.partialReceipts, [{ person_id: 'p1', action: 'updated_evidence_only', fields: ALLOWED_PERSON_FIELDS }]);
        assert.equal(error.failedPersonId, 'p2');
        return true;
      },
    );
  } finally { globalThis.fetch = originalFetch; }
});
