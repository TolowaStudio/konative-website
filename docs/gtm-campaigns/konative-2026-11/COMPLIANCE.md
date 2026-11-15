# Compliance checklist — Konative 2026-11 campaign set

Filled 2026-11-15 against the drafts in this folder. Every item is **PASS**
(the drafts meet it) or **needs:jeramey** (a decision only Jeramey can make;
nothing is sent until it is answered). Not legal advice; sources are cited so a
reviewer can check them.

Scope: `warm-intros.md`, `tier-*.md`, `newsletter-tribal-infrastructure-brief-001.md`.

## Summary

| § | Item | Status |
|---|---|---|
| 1.1 | Accurate From / header information | PASS |
| 1.2 | Subject lines not deceptive (CAN-SPAM) | PASS |
| 1.3 | Message identified as commercial | PASS |
| 1.4 | Tolowa Pacific LLC postal address in footer | PASS (value on file; placeholder in templates) |
| 1.5 | Working opt-out, honored within 10 business days | PASS for reply-"stop"; link depends on §4 → needs:jeramey |
| 2.1 | WA CEMA — subject lines truthful, not misleading | PASS |
| 2.2 | WA CEMA — no third-party domain, no obscured transmission path | PASS (policy) |
| 3 | Suppression / do-not-contact check | needs:jeramey |
| 4 | No cold sending through Mailgun / Resend transactional domains | PASS (policy); sending-path choice needs:jeramey |
| 5 | Newsletter goes only to opted-in subscribers | PASS (policy); which Ghost newsletter needs:jeramey |
| 6 | Sender identity | PASS; sending mailbox needs:jeramey |
| 7 | Every factual claim sourced; no TBCP3/NEGP deadline claims | PASS |
| 8 | LinkedIn manual only | PASS |
| 9 | CTA wording matches the site ("One-Site Snapshot") | needs:jeramey |
| 10 | First-send batch approval | needs:jeramey |

---

## 1. CAN-SPAM (15 U.S.C. §7701 et seq.; 16 CFR Part 316)

Applies to commercial email, B2B included. Both the sender and the business
being advertised are responsible (FTC, *CAN-SPAM Act: A Compliance Guide for
Business*, ftc.gov). Here both are Tolowa Pacific LLC (Konative is its trade
name).

**1.1 Accurate header / From — PASS.** Display name "Jeramey James, Konative"
(approved by Jeramey 2026-07-08, Stash). Sent from a real mailbox Jeramey
controls (see §6). No spoofed reply-to.

**1.2 Subject not deceptive — PASS.** See the subject table in §2.1; every
subject describes the body.

**1.3 Identified as commercial — PASS.** Each tier footer says "This is a
commercial message from Konative." The newsletter goes only to people who
opted in (affirmative consent), so it doesn't need the line. Warm-intro asks
to partners (Avant, T4DevCo / WestPorch, personal contacts) are personal
relationship messages, but they still carry the signature with the postal
address.

**1.4 Postal address — PASS.** Every email footer and the newsletter footer
contain `{{POSTAL_ADDRESS}}`. Value on file: Tolowa Pacific LLC mailing
address, confirmed by Jeramey 2026-09-22 for CAN-SPAM / WA CEMA use (Stash,
episode 28102). The address is filled in at send time from that one place, so
templates don't drift. A merge with the placeholder still showing fails §10.

**1.5 Opt-out — PASS for reply; link needs:jeramey.** Every tier email says
'Reply "stop" … and I won't contact you again.' Rules:
- Honor any opt-out within 10 business days (FTC guide); target: same day.
- The opt-out must keep working for at least 30 days after the send.
- No fee, no login, nothing beyond a reply or a single page to opt out.
- `{{UNSUBSCRIBE}}` is a one-click link only if a cold sequencer is approved
  (§4). On the $0 warm/reply-only path, delete the "or use {{UNSUBSCRIBE}}"
  phrase; reply-"stop" alone is the mechanism.

## 2. Washington CEMA (RCW 19.190)

RCW 19.190.020 bars commercial email to a Washington resident (or from a
Washington computer) that uses a third party's domain without permission,
misrepresents or obscures its point of origin or transmission path, or
contains false or misleading information in the subject line. Recipients have
a private right of action (RCW 19.190.040). The Washington Supreme Court in
*Brown v. Old Navy* (2025) read the subject-line rule to cover any false or
misleading subject-line information, not only header or origin tricks (as
summarized in TOL-659; confirm with counsel before relying on it). Konative
sends from Washington, so treat every send as covered.

**2.1 Subject-line truthfulness — PASS.**

| File | Subject | Truthful? |
|---|---|---|
| tier-dc | Carrier reach at [Site / Project] | Yes, the body is about which carriers reach the site |
| tier-dc T2/T3 | Re: Carrier reach at [Site / Project] | Yes, **only** when sent as a reply in the T1 thread |
| tier-tribal | Uptime at [Property / Organization] | Yes, the body is about network uptime at that property |
| tier-tribal T2/T3 | Re: Uptime at [Property / Organization] | Yes, in-thread only |
| tier-tbcp | Connectivity after the build at [Organization] | Yes, the body is about post-build enterprise connectivity |
| tier-tbcp T2/T3 | Re: Connectivity after the build at [Organization] | Yes, in-thread only |
| warm (Avant) | Intro ask — [Organization] ([City, State]) | Yes |
| warm (T4/WestPorch) | One site, one question — [Site / Project] | Yes |
| warm (tribal) | Who handles connectivity at [Organization]? | Yes |
| newsletter | Is your backup circuit really a backup? | Yes, the lead section is exactly that check |

Banned in subjects: "Re:" / "Fwd:" on a first touch, fake urgency
("Last chance", "Expires"), deadlines, dollar amounts, "free" as bait, any
name or program the body doesn't discuss.

**2.2 Origin / path — PASS (policy).** Send only from a Konative / Tolowa
Pacific domain Jeramey controls, with SPF/DKIM/DMARC aligned. Never send from
a partner's domain (Avant, T4DevCo) or through a relay that hides the origin.

## 3. Suppression / do-not-contact — needs:jeramey

There is no suppression list in this repo. The send gate
(`web/src/lib/jev/sendSafetyGate.ts`) only takes a `suppression_checked: true`
flag. The flag may be set only after every recipient is checked against
**all** of:

1. Twenty: any do-not-contact / opted-out marker on the person or company.
2. Mailgun suppressions for `mg.konative.com` (bounces, unsubscribes,
   complaints), including the 1 unsubscribe and 1 bounce from the July 2026
   send (Stash /projects/konative). Read-only export; nothing is sent.
3. Ghost: members who unsubscribed from the Konative newsletter.
4. Any prior reply asking not to be contacted (mailbox search).
5. **Exclusion rule (proposed):** the ~101 recipients of the July 2026 bulk
   send get no cold tier sequence in this campaign. They can only be reached
   through a new warm path.

**Ask for Jeramey:** approve sources 1–4 and exclusion rule 5. The check
itself runs at the first-send gate (W5) and the result is attached to the
batch approval.

## 4. Sending path (TOL-659) — PASS (policy) / needs:jeramey (choice)

Resend prohibits "unsolicited messages of any kind, including cold outreach,
purchased lists, or scraped contact data". Mailgun prohibits "contact lists
that are bought, rented or scraped from third-parties" (both quoted in
TOL-659). If an account is suspended for cold sending, the transactional mail
on that account (site forms, receipts, notifications) goes down with it.

- **PASS:** no draft here is set up for Mailgun (`mg.konative.com`,
  `mg.tolowapacific.com`) or Resend. Warm asks and replies are written for
  Jeramey's own mailbox, 1:1.
- **needs:jeramey (TOL-3559 item 3):** pick (a) warm intros + replies only,
  $0, or (b) a separate cold domain + sequencer (engine quotes the cost
  first). Until then, the tier sequences are used only on accounts that
  respond to a warm intro, sent 1:1 by hand.

## 5. Newsletter — PASS (policy) / needs:jeramey (which newsletter)

- Goes only to Ghost members who opted in through konative.com's newsletter
  signup (`web/src/app/(frontend)/api/newsletter/subscribe/route.ts` adds them
  to the Konative newsletter, `KONATIVE_NEWSLETTER_ID`). **Never import cold
  or CRM contacts into Ghost**: that would turn the newsletter into cold email.
- Ghost adds its own unsubscribe link (`{{GHOST_UNSUBSCRIBE_LINK}}` in the
  draft) and the footer carries the postal address.
- **needs:jeramey:** publish "Tribal Infrastructure Brief" as an issue of the
  existing Konative newsletter (Dispatch), or as a separate Ghost newsletter
  that subscribers choose? Separate needs a Ghost config change and is not
  done here. The draft was not created in Ghost.

## 6. Sender identity — PASS / mailbox needs:jeramey

- Display name "Jeramey James, Konative" (approved 2026-07-08).
- Every footer: "Konative is a trade name of Tolowa Pacific LLC" + postal
  address. This matches the site footer once W2 (TOL-3549) fixes "Total
  Pacific".
- Signed by a person, never "The Konative Team".
- **needs:jeramey:** which mailbox sends. The July 2026 warm asks went from
  his Tolowa mailbox. A Konative-domain mailbox matches the brand in the
  footer better. Either is lawful; pick one so replies land in one place.

## 7. Factual claims — PASS

- Every claim in the drafts maps to the claims register in `README.md`
  (C1–C8). Per-recipient facts (C7 award, C8 construction signal) must have a
  source URL in the Twenty record before the touch is approved.
- Scan run on this folder 2026-11-15 for deadline and number claims (dates,
  "deadline", "due", "%", "$", "TBCP3", "NEGP", "Nov"): matches appear only in
  rule text that *forbids* them, never in copy meant for prospects.
- Konative is not offered as a grant writer or TBCP3/NEGP applicant anywhere;
  the P1b tier and newsletter say "We don't do grant work."

## 8. LinkedIn — PASS (policy)

Manual, 1:1, from Jeramey's own profile. No automation or scraping tools
(LinkedIn's User Agreement prohibits them). No message to anyone who hasn't
accepted the connection. At most one connection note and two messages per
person. CAN-SPAM doesn't cover LinkedIn messages, but the same truthfulness
and stop-on-request rules apply.

## 9. CTA wording matches the site — needs:jeramey

The drafts use "One-Site Snapshot" (W1 offer, TOL-3546 / TOL-3559 item 1). The
live site says "One-Page Site Brief" (`/data-center-connectivity`) and
"Continuity Snapshot" (`/tribal`). A prospect must land on wording that
matches the email. **Ask:** confirm "One-Site Snapshot" as the offer name
(then W2 updates the site), or tell us to switch the drafts to the site's
wording. Also for W2: `/contact` ignores the `?projectType=` query the CTAs
send, so the form never preselects a request type.

## 10. First-send approval — needs:jeramey

Nothing is sent until Jeramey approves, in TOL-3559 item 2, the exact batch:
≤10 recipients, warm-path-first, copy version (file + git SHA), sender
mailbox, §3 suppression result attached, stop condition. Before approval,
each recipient's Twenty record must be set to **Approved for outreach**, and
every send is logged to Twenty with its next action
(`docs/tribal-campaign-readiness-plan.md`). Pre-send merge check: no `[...]`
or `{{...}}` left except the sequencer-filled unsubscribe link.
