#!/usr/bin/env node

/**
 * Fail-closed writer for reviewed BrowserOS evidence.
 *
 * This tool has no sender, audience, or campaign operations. It can only
 * update the three existing Person enrichment fields queried by the campaign
 * audit: evidenceUrl, enrichmentSource, and enrichmentRun.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const WRITER_VERSION = 'konative-twenty-evidence-writer-v0.1.0';
export const ALLOWED_PERSON_FIELDS = Object.freeze([
  'evidenceUrl',
  'enrichmentSource',
  'enrichmentRun',
]);

// Twenty's PersonUpdateInput uses an enum for this field. BrowserOS is a
// research method, not one of Twenty's source taxonomy values; represent it
// as a reviewed manual enrichment and keep the BrowserOS provenance in the
// evidence URL and enrichment run.
export const BROWSEROS_TWENTY_SOURCE = 'MANUAL';

const INTROSPECTION_QUERY = `
query KonativeEvidenceWriterSchema {
  person: __type(name: "Person") { fields { name } }
  personInput: __type(name: "PersonUpdateInput") {
    inputFields { name type { kind name ofType { kind name ofType { kind name } } } }
  }
  mutation: __type(name: "Mutation") {
    fields { name args { name type { kind name ofType { kind name ofType { kind name } } } } }
  }
  query: __type(name: "Query") {
    fields { name args { name type { kind name ofType { kind name ofType { kind name } } } } }
  }
}`;

const ENUM_VALUES_QUERY = `
query KonativeEvidenceWriterEnum($name: String!) {
  type: __type(name: $name) { kind name enumValues { name } }
}`;

function normalize(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  // Twenty may serialize enum-like fields as an object (for example,
  // `{ value: "MANUAL", label: "Manual" }`) on mutation responses.  Compare
  // the semantic enum value rather than assuming every returned field is a
  // string.  This is intentionally narrow: unknown objects do not silently
  // match a requested update.
  if (typeof value === 'object') {
    for (const key of ['value', 'name', 'id']) {
      if (Object.hasOwn(value, key)) return normalize(value[key]);
    }
  }
  return '';
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
    throw new Error(`Refusing to write private evidence receipts inside Git repository: ${output}`);
  }
  return output;
}

function writePrivate(path, content) {
  writeFileSync(path, content, { encoding: 'utf8', mode: 0o600 });
  chmodSync(path, 0o600);
}

// GraphQL permits `message` to be any JSON value in practice, even though the
// specification describes it as a string. Twenty has returned object-shaped
// messages for validation failures. Keep the original diagnostic visible and
// never let error formatting itself hide a failed mutation or preflight.
function safeDiagnostic(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : String(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

export function formatGraphqlErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return '';
  const messages = errors
    .map((error) => safeDiagnostic(error?.message ?? error))
    .filter(Boolean);
  return messages.length ? `Twenty GraphQL error${messages.length === 1 ? '' : 's'}: ${messages.join('; ')}` : '';
}

export async function fetchGraphql(baseUrl, token, query, variables = {}) {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/graphql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.errors?.length || !body.data) {
    const message = formatGraphqlErrors(body.errors)
      || `Twenty GraphQL HTTP ${response.status}`;
    throw new Error(message);
  }
  return body.data;
}

function unwrapType(type) {
  let current = type;
  while (current?.ofType) current = current.ofType;
  return current?.name || '';
}

function typeExpression(type) {
  if (!type) throw new Error('Schema type is missing');
  if (type.kind === 'NON_NULL') return `${typeExpression(type.ofType)}!`;
  if (type.kind === 'LIST') return `[${typeExpression(type.ofType)}]`;
  if (!type.name) throw new Error('Schema named type is missing');
  return type.name;
}

function requireField(fields, name, label) {
  const field = fields?.find((entry) => entry.name === name);
  if (!field) throw new Error(`Schema validation failed: ${label} is missing ${name}`);
  return field;
}

export function validateSchema(schema) {
  const personFields = new Set(schema.person?.fields?.map((field) => field.name) || []);
  const inputFields = new Set(schema.personInput?.inputFields?.map((field) => field.name) || []);
  for (const field of ALLOWED_PERSON_FIELDS) {
    if (!personFields.has(field) || !inputFields.has(field)) {
      throw new Error(`Schema validation failed: Person/PersonUpdateInput lacks allowed field ${field}`);
    }
  }
  const update = requireField(schema.mutation?.fields, 'updatePerson', 'Mutation');
  const dataArgument = requireField(update.args, 'data', 'updatePerson');
  const updateSelector = update.args.find((argument) => argument.name === 'id')
    || update.args.find((argument) => argument.name === 'where');
  if (!updateSelector) throw new Error('Schema validation failed: updatePerson has no id/where selector');
  if (unwrapType(dataArgument.type) !== 'PersonUpdateInput') {
    throw new Error('Schema validation failed: updatePerson data is not PersonUpdateInput');
  }
  const personQuery = requireField(schema.query?.fields, 'person', 'Query');
  const personSelector = personQuery.args.find((argument) => argument.name === 'id')
    || personQuery.args.find((argument) => argument.name === 'filter');
  if (!personSelector) throw new Error('Schema validation failed: person query has no id/filter selector');
  const enrichmentSource = requireField(schema.personInput?.inputFields, 'enrichmentSource', 'PersonUpdateInput');
  const enrichmentSourceEnumName = unwrapType(enrichmentSource.type);
  if (!enrichmentSourceEnumName) {
    throw new Error('Schema validation failed: enrichmentSource has no named enum type');
  }
  return {
    updateDataType: typeExpression(dataArgument.type),
    updateSelectorName: updateSelector.name,
    updateSelectorType: typeExpression(updateSelector.type),
    personSelectorName: personSelector.name,
    personSelectorType: typeExpression(personSelector.type),
    enrichmentSourceEnumName,
  };
}

export function validateEnrichmentSourceEnum(enumType, expectedValue = BROWSEROS_TWENTY_SOURCE) {
  if (enumType?.kind !== 'ENUM' || !enumType?.name) {
    throw new Error('Schema validation failed: enrichmentSource is not an enum');
  }
  const values = new Set(enumType.enumValues?.map((value) => value.name) || []);
  if (!values.has(expectedValue)) {
    throw new Error(`Schema validation failed: enrichmentSource enum ${enumType.name} does not allow ${expectedValue}`);
  }
  return { enrichmentSourceEnumName: enumType.name, enrichmentSourceEnumValues: [...values].sort() };
}

export function validateEvidenceRecords(value) {
  if (!Array.isArray(value?.records) || value.records.length === 0) {
    throw new Error('Evidence input must contain a non-empty records array');
  }
  const seen = new Set();
  return value.records.map((record, index) => {
    const personId = normalize(record.person_id);
    const evidenceUrl = normalize(record.evidence_url);
    const source = normalize(record.enrichment_source);
    const run = normalize(record.enrichment_run);
    if (!personId || !evidenceUrl || !source || !run) {
      throw new Error(`Evidence record ${index} is missing person_id, evidence_url, enrichment_source, or enrichment_run`);
    }
    if (seen.has(personId)) throw new Error(`Evidence input has duplicate person_id: ${personId}`);
    seen.add(personId);
    let parsed;
    try { parsed = new URL(evidenceUrl); } catch { throw new Error(`Evidence record ${index} has invalid evidence_url`); }
    if (parsed.protocol !== 'https:') throw new Error(`Evidence record ${index} evidence_url must use https`);
    if (!/^browseros(?:[-_:].+)?$/i.test(source)) {
      throw new Error(`Evidence record ${index} enrichment_source must identify BrowserOS`);
    }
    const provenanceRun = /browseros/i.test(run) ? run : `browseros:${source}:${run}`;
    return {
      person_id: personId,
      evidence_url: parsed.toString(),
      enrichment_source: source,
      enrichment_run: provenanceRun,
    };
  });
}

function desiredData(record) {
  return {
    evidenceUrl: record.evidence_url,
    enrichmentSource: BROWSEROS_TWENTY_SOURCE,
    enrichmentRun: record.enrichment_run,
  };
}

function isEqualCurrent(current, desired) {
  return ALLOWED_PERSON_FIELDS.every((field) => normalize(current?.[field]) === normalize(desired[field]));
}

export async function planWrites({ baseUrl, token, records, schema }) {
  const types = validateSchema(schema);
  const query = `query KonativeEvidenceCurrent($selector: ${types.personSelectorType}) {
    person(${types.personSelectorName}: $selector) { id evidenceUrl enrichmentSource enrichmentRun }
  }`;
  const planned = [];
  for (const record of records) {
    const selector = types.personSelectorName === 'id'
      ? record.person_id
      : { id: { eq: record.person_id } };
    const data = await fetchGraphql(baseUrl, token, query, { selector });
    if (!data.person?.id) throw new Error(`Person not found: ${record.person_id}`);
    const desired = desiredData(record);
    planned.push({
      person_id: record.person_id,
      action: isEqualCurrent(data.person, desired) ? 'skip_already_current' : 'update_evidence_only',
      fields: Object.keys(desired),
      data: desired,
    });
  }
  return { planned, types };
}

export async function applyWrites({ baseUrl, token, planned, types }) {
  const mutation = `mutation KonativeEvidenceWrite($selector: ${types.updateSelectorType}, $data: ${types.updateDataType}) {
    updatePerson(${types.updateSelectorName}: $selector, data: $data) { id evidenceUrl enrichmentSource enrichmentRun }
  }`;
  const receipts = [];
  for (const item of planned) {
    if (item.action === 'skip_already_current') {
      receipts.push({ person_id: item.person_id, action: item.action });
      continue;
    }
    const selector = types.updateSelectorName === 'id'
      ? item.person_id
      : { id: item.person_id };
    try {
      const result = await fetchGraphql(baseUrl, token, mutation, { selector, data: item.data });
      if (!result.updatePerson?.id || !isEqualCurrent(result.updatePerson, item.data)) {
        throw new Error(`Write verification failed for ${item.person_id}`);
      }
    } catch (error) {
      // A mutation may already have succeeded when its response is malformed
      // or verification fails. Preserve every confirmed prior result in a
      // receipt so a retry can reconcile instead of blindly repeating writes.
      error.partialReceipts = receipts;
      error.failedPersonId = item.person_id;
      throw error;
    }
    receipts.push({ person_id: item.person_id, action: 'updated_evidence_only', fields: item.fields });
  }
  return receipts;
}

function parseArgs(argv) {
  const args = { baseUrl: 'https://crm.tolowastudio.com', apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => { index += 1; if (index >= argv.length) throw new Error(`Missing value for ${arg}`); return argv[index]; };
    if (arg === '--input') args.input = next();
    else if (arg === '--output-dir') args.outputDir = next();
    else if (arg === '--base-url') args.baseUrl = next();
    else if (arg === '--apply') args.apply = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.input || !args.outputDir) throw new Error('--input and --output-dir are required');
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
  const records = validateEvidenceRecords(JSON.parse(readFileSync(resolve(args.input), 'utf8')));
  const schema = await fetchGraphql(args.baseUrl, token, INTROSPECTION_QUERY);
  const schemaTypes = validateSchema(schema);
  const enumData = await fetchGraphql(args.baseUrl, token, ENUM_VALUES_QUERY, {
    name: schemaTypes.enrichmentSourceEnumName,
  });
  const enumContract = validateEnrichmentSourceEnum(enumData.type);
  const { planned, types } = await planWrites({ baseUrl: args.baseUrl, token, records, schema });
  const receipt = {
    writer_version: WRITER_VERSION,
    generated_at: new Date().toISOString(),
    mode: args.apply ? 'apply' : 'dry_run',
    allowed_person_fields: ALLOWED_PERSON_FIELDS,
    enrichment_source_mapping: { browseros: BROWSEROS_TWENTY_SOURCE },
    schema_contract: enumContract,
    records: args.apply ? [] : planned,
  };
  if (args.apply) {
    try {
      receipt.records = await applyWrites({ baseUrl: args.baseUrl, token, planned, types });
    } catch (error) {
      receipt.records = error.partialReceipts || [];
      receipt.failure = {
        failed_person_id: error.failedPersonId || null,
        message: error.message || String(error),
      };
      writePrivate(resolve(outputDir, 'twenty-evidence-write-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
      throw error;
    }
  }
  writePrivate(resolve(outputDir, 'twenty-evidence-write-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ mode: receipt.mode, records: receipt.records.length, output_dir: outputDir })}\n`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) main().catch((error) => {
  process.stderr.write(`${error.stack || error.message || String(error)}\n`);
  process.exitCode = 1;
});
