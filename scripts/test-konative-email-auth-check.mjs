import assert from 'node:assert/strict';
import test from 'node:test';

import { checkEmailAuth, render, systemLookup } from './konative-email-auth-check.mjs';

const KEY = 'k=rsa; p=MIGfMA0GCSq';
const healthy = () => ({
  'TXT konative.com': ['MS=ms1', 'v=spf1 include:spf.protection.outlook.com ~all'],
  'TXT send.konative.com': ['v=spf1 include:amazonses.com ~all'],
  'TXT ckespa.konative.com': ['v=spf1 include:spf.kit.com ~all'],
  'TXT selector1._domainkey.konative.com': [KEY],
  'TXT selector2._domainkey.konative.com': [KEY],
  'TXT resend._domainkey.konative.com': ['p=MIGfMA0GCSq'],
  'TXT brevo1._domainkey.konative.com': [KEY],
  'TXT brevo2._domainkey.konative.com': [KEY],
  'TXT cka._domainkey.konative.com': [KEY],
  'TXT cka2._domainkey.konative.com': [KEY],
  'TXT _dmarc.konative.com': ['v=DMARC1; p=none; rua=mailto:reports@konative.com'],
});
const run = (zone) => checkEmailAuth(async (host, type) => zone[`${type} ${host}`] ?? []);
const sender = (result, name) => result.senders.find((s) => s.name === name);

const dnsSenders = (result) => result.senders.filter((s) => s.name !== 'Ghost (Konative Dispatch)');
const dnsReady = (result) => dnsSenders(result).every((s) => s.ready);

test('a complete zone is DNS ready with no leftovers', async () => {
  const result = await run(healthy());
  assert.equal(dnsReady(result), true);
  assert.equal(result.dmarc.policy, 'none');
  assert.deepEqual(result.leftovers, []);
});

test('a missing or revoked DKIM key fails only that sender', async () => {
  for (const value of [[], ['v=DKIM1; k=rsa; p=']]) {
    const result = await run({ ...healthy(), 'TXT resend._domainkey.konative.com': value });
    assert.equal(result.ready, false);
    assert.equal(sender(result, 'Resend').ready, false);
    assert.equal(sender(result, 'Brevo').ready, true);
  }
});

test('SPF must exist once and carry the provider include', async () => {
  for (const value of [
    ['v=spf1 include:_spf.mx.cloudflare.net ~all'],
    ['v=spf1 include:spf.protection.outlook.com ~all', 'v=spf1 -all'],
  ]) {
    const result = await run({ ...healthy(), 'TXT konative.com': value });
    assert.equal(sender(result, 'Microsoft 365 mailbox').ready, false);
  }
});

test('no DMARC record is not ready', async () => {
  const zone = healthy();
  delete zone['TXT _dmarc.konative.com'];
  const result = await run(zone);
  assert.equal(result.ready, false);
  assert.match(render(result), /DMARC {6}MISSING/);
});

test('records left from a departed sender are listed without failing the senders', async () => {
  const result = await run({ ...healthy(), 'MX mg.konative.com': ['10 mxa.mailgun.org'] });
  assert.equal(dnsReady(result), true);
  assert.deepEqual(result.leftovers, [{ host: 'mg.konative.com', type: 'MX', why: 'Mailgun' }]);
});

test('Ghost is reported and keeps the run not ready even when all DNS is present', async () => {
  const result = await run(healthy());
  assert.equal(sender(result, 'Ghost (Konative Dispatch)').ready, false);
  assert.equal(result.ready, false);
  assert.match(render(result), /NOT READY {2}Ghost \(Konative Dispatch\)\n +- no sender with an @konative\.com From/);
});

test('published DNS is never reported as proven delivery', async () => {
  const out = render(await run(healthy()));
  for (const name of ['Microsoft 365 mailbox', 'Brevo', 'Kit']) {
    assert.ok(out.includes(`DNS READY  ${name} (delivery unproven)`), name);
  }
  assert.ok(out.includes('DNS READY  Resend (delivery proven 2026-11-24)'));
});

test('a failed lookup throws instead of reading as "no record"', async () => {
  const failing = (code) => ({ resolve: async () => { throw Object.assign(new Error(code), { code }); } });
  assert.deepEqual(await systemLookup(failing('ENODATA'))('x.test', 'TXT'), []);
  await assert.rejects(systemLookup(failing('ESERVFAIL'))('x.test', 'TXT'), /ESERVFAIL/);
});
