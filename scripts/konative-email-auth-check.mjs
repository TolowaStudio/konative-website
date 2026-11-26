#!/usr/bin/env node
// Read-only SPF / DKIM / DMARC check for every sender that may use konative.com.
// DNS lookups only: it sends nothing and changes nothing.
//
//   node scripts/konative-email-auth-check.mjs
//
// Exit 0: every sender is ready. 1: a DNS fault. 2: a lookup failed.
// 3: DNS is fine, but a sender has a known blocker DNS cannot fix.
// Exit 0 does NOT mean mail is aligned: DNS cannot show which domain a provider
// signs with. Only a delivered message's Authentication-Results header does.

import { Resolver } from 'node:dns/promises';
import { pathToFileURL } from 'node:url';

export const DOMAIN = 'konative.com';

// `dkim`: selectors that must resolve to a public key (all signing as DOMAIN, or
// a subdomain of it, which relaxed alignment accepts).
// `spf`: the host used as the envelope sender, and the include it must carry.
// Brevo is DKIM-only here: its shared return path is on Brevo's own domain.
// `proof`: date of a delivered message seen passing DMARC. Absent means unproven.
// `blocker`: why a sender cannot pass whatever DNS says. Remove it only once fixed.
export const SENDERS = [
  { name: 'Microsoft 365 mailbox', dkim: ['selector1', 'selector2'], spf: { host: DOMAIN, include: 'spf.protection.outlook.com' } },
  { name: 'Resend', proof: '2026-11-24', dkim: ['resend'], spf: { host: `send.${DOMAIN}`, include: 'amazonses.com' } },
  { name: 'Brevo', dkim: ['brevo1', 'brevo2'] },
  { name: 'Kit', dkim: ['cka', 'cka2'], spf: { host: `ckespa.${DOMAIN}`, include: 'spf.kit.com' } },
  { name: 'Ghost (Konative Dispatch)', dkim: [], blocker: `no sender with an @${DOMAIN} From has been chosen and proven` },
];

// Records that only served a sender which is gone.
export const LEFTOVERS = [
  { host: `mg.${DOMAIN}`, types: ['TXT', 'MX'], why: 'Mailgun' },
  { host: `mailo._domainkey.mg.${DOMAIN}`, types: ['TXT'], why: 'Mailgun' },
  { host: `email.mg.${DOMAIN}`, types: ['CNAME'], why: 'Mailgun' },
  { host: `_dmarc.mg.${DOMAIN}`, types: ['TXT'], why: 'Mailgun' },
  { host: `cf2024-1._domainkey.${DOMAIN}`, types: ['TXT'], why: 'Cloudflare mail' },
  { host: `cf-bounce._domainkey.${DOMAIN}`, types: ['TXT'], why: 'Cloudflare mail' },
  { host: `cf-bounce.${DOMAIN}`, types: ['TXT', 'MX'], why: 'Cloudflare mail' },
];

const ABSENT = new Set(['ENOTFOUND', 'ENODATA']);

/** DNS answer as strings. "No such record" is []; any other failure throws. */
export function systemLookup(resolver = new Resolver({ timeout: 5000, tries: 3 })) {
  return async (host, type) => {
    try {
      const answer = await resolver.resolve(host, type);
      if (type === 'TXT') return answer.map((chunks) => chunks.join(''));
      if (type === 'MX') return answer.map((mx) => `${mx.priority} ${mx.exchange}`);
      return answer;
    } catch (err) {
      if (ABSENT.has(err.code)) return [];
      throw new Error(`${type} ${host}: ${err.code ?? err.message}`);
    }
  };
}

// A revoked DKIM key is published as "p=" with nothing after it.
const hasDkimKey = (records) => records.some((r) => /(^|;)\s*p=[A-Za-z0-9+/]/.test(r));

async function checkSender(sender, lookup) {
  const problems = sender.blocker ? [sender.blocker] : [];
  for (const selector of sender.dkim) {
    const host = `${selector}._domainkey.${DOMAIN}`;
    if (!hasDkimKey(await lookup(host, 'TXT'))) problems.push(`no DKIM public key at ${host}`);
  }
  if (sender.spf) {
    const { host, include } = sender.spf;
    const spf = (await lookup(host, 'TXT')).filter((r) => /^v=spf1(\s|$)/i.test(r));
    if (spf.length !== 1) problems.push(`${host} has ${spf.length} SPF records, needs exactly 1`);
    else if (!spf[0].split(/\s+/).includes(`include:${include}`)) problems.push(`SPF at ${host} lacks include:${include}`);
  }
  return { name: sender.name, ready: problems.length === 0, blocked: Boolean(sender.blocker), proof: sender.proof ?? null, problems };
}

export async function checkEmailAuth(lookup, expected = SENDERS) {
  const senders = [];
  for (const sender of expected) senders.push(await checkSender(sender, lookup));

  const dmarcRecords = (await lookup(`_dmarc.${DOMAIN}`, 'TXT')).filter((r) => r.startsWith('v=DMARC1'));
  const record = dmarcRecords.length === 1 ? dmarcRecords[0] : null;
  const dmarc = {
    record,
    policy: record?.match(/;\s*p=\s*(none|quarantine|reject)/)?.[1] ?? null,
  };

  const leftovers = [];
  for (const { host, types, why } of LEFTOVERS) {
    for (const type of types) {
      if ((await lookup(host, type)).length) leftovers.push({ host, type, why });
    }
  }

  const dnsReady = dmarc.policy !== null && senders.every((s) => s.ready || s.blocked);
  return { senders, dmarc, leftovers, dnsReady, ready: dnsReady && senders.every((s) => s.ready) };
}

export const exitCode = ({ ready, dnsReady }) => (ready ? 0 : dnsReady ? 3 : 1);

export function render({ senders, dmarc, leftovers }) {
  const lines = senders.map((s) => {
    const delivery = s.proof ? `delivery proven ${s.proof}` : 'delivery unproven';
    const status = s.ready ? `DNS READY  ${s.name} (${delivery})` : `NOT READY  ${s.name}`;
    return `${status}${s.problems.map((p) => `\n           - ${p}`).join('')}`;
  });
  lines.push(`DMARC      ${dmarc.record ?? 'MISSING or duplicated'}`);
  for (const l of leftovers) lines.push(`LEFTOVER   ${l.type} ${l.host} (${l.why})`);
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await checkEmailAuth(systemLookup());
    console.log(render(result));
    process.exitCode = exitCode(result);
  } catch (err) {
    console.error(`lookup failed, no verdict: ${err.message}`);
    process.exitCode = 2;
  }
}
