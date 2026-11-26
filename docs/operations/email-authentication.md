# konative.com email authentication (SPF, DKIM, DMARC)

Checked 2026-11-26 (TS-4370). Read-only: nothing was sent and no DNS was changed.

Re-run the DNS part at any time:

```bash
node scripts/konative-email-auth-check.mjs
```

"DNS ready" means the records are published. Only a delivered message's
`Authentication-Results` header proves a sender passes. Exit codes: 0 all
ready, 1 a DNS fault, 2 a lookup failed, 3 DNS is fine but a sender is blocked.
It exits 3 while Ghost has no proven `@konative.com` sender; remove Ghost's
`blocker` in the script once it does.

## Senders

| Sender | Signs / return path | DNS | Delivered-message proof | Verdict |
|---|---|---|---|---|
| Resend (site forms, `team@konative.com`) | DKIM `resend`; SPF on `send.konative.com` | ready | Message of 2026-11-24 at Gmail: DKIM pass `d=konative.com`, SPF pass `send.konative.com`, DMARC pass | **Passes** |
| Microsoft 365 mailbox | DKIM `selector1`, `selector2`; root SPF | ready | none found | **Not proven** |
| Brevo (transactional) | DKIM `brevo1`, `brevo2`; return path on Brevo's domain, so DMARC relies on DKIM | ready | none found | **Not proven** |
| Kit (broadcast) | DKIM `cka`, `cka2`; return path `ckespa.konative.com` | ready | none found; no known konative.com send | **Not proven** |
| Mailgun (`mg.konative.com`) | n/a | records still published | reported deleted at Mailgun on 2026-11-26 (not re-checked here) | **Retired**, see cleanup |
| Ghost (Konative Dispatch) | depends on Ghost's mail settings, not read here | n/a | none found | **Not passing as configured**, see below |

DMARC: `_dmarc.konative.com` is `v=DMARC1; p=none; rua=mailto:dmarc@konative.com`
(monitor only, relaxed alignment).

### Ghost

The site's signup uses the shared studio Ghost (`web/src/lib/ghost.ts`). Earlier
operating notes, not re-checked against the live server, say:

- bulk newsletters were set to go through Mailgun on a studio `mg.` domain, which
  was also reported deleted on 2026-11-26, so Konative Dispatch has no bulk sender;
- Ghost's own mail (signup links, password resets) goes through Resend SMTP with a
  tolowastudio.com From address. That is not mail "as konative.com".

No DNS record fixes this. Whoever picks the Dispatch sender must set a
`@konative.com` From that is DKIM-signed as konative.com. The Kit and Resend
records for that already exist.

## DNS changes (Jake, in Bunny)

None is needed for Resend, Microsoft 365, Brevo or Kit. The root SPF stays as it
is: Resend, Brevo and Kit do not use it.

**1. Remove the Mailgun leftovers**, after confirming `konative.com` has no domain
left in Mailgun:

| Name | Type | Value to delete |
|---|---|---|
| `mg` | TXT | `v=spf1 include:mailgun.org ~all` |
| `mg` | MX | `10 mxa.mailgun.org` and `10 mxb.mailgun.org` |
| `mailo._domainkey.mg` | TXT | the `k=rsa; p=...` key |
| `email.mg` | CNAME | `mailgun.org` |
| `_dmarc.mg` | TXT | `v=DMARC1; p=none; fo=1` |

The parked outreach code still defaults to `outreach@mg.konative.com`
(`web/src/lib/outreach/mailgun.ts`); it cannot send from that domain any more.

**2. Remove the Cloudflare mail leftovers**, after confirming that Cloudflare
Email Routing and sending are off and nothing still receives at `cf-bounce`:

| Name | Type | Value to delete |
|---|---|---|
| `cf2024-1._domainkey` | TXT | the `v=DKIM1; ...` key |
| `cf-bounce._domainkey` | TXT | the `v=DKIM1; ...` key |
| `cf-bounce` | TXT | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| `cf-bounce` | MX | `route1`, `route2`, `route3.mx.cloudflare.net` |

**3. Tighten DMARC later.** First confirm `dmarc@konative.com` receives mail. After
about two weeks of reports with every real sender aligned, set `_dmarc` to
`v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@konative.com`.

**Keep** the `brevo-code:` TXT record: Brevo is a live sender.

## Still to prove

For each of Microsoft 365, Brevo, Kit and the Ghost replacement: take one message
that was delivered to a Gmail inbox, open "Show original", and confirm DMARC
`PASS` with From `@konative.com`. For the Microsoft mailbox, one note Jake sends to
himself is enough. This needs a send, so it was not done here.
