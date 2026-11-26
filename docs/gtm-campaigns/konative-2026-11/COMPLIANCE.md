# Compliance checklist — Konative 2026-11 outreach set

Updated 2026-11-15 after Jeramey's warm-only decision. Every item is **PASS**
(the drafts meet it) or **needs:jeramey** (only Jeramey can decide; nothing
is sent until he does). Not legal advice; sources are cited so a reviewer can
check them.

Scope: `warm-intros.md`, `follow-ups.md`, `referral-asks.md`,
`newsletter-tribal-infrastructure-brief-001.md`.

## 0. The warm-only rule (Jeramey, 2026-11-15 11:38 AM PT, TOL-3559)

- Konative outreach is **warm intros only, at $0.**
- **No cold sending path exists.** There is no cold-email domain, no
  sequencer, no bulk or automated sending tool, and no paid lead data. None
  may be set up without a new decision from Jeramey.
- Every outreach message is a plain 1:1 message Jeramey writes and sends
  himself, to: a partner asking about one account (warm intro), someone with
  a two-way history in Twenty (follow-up), or someone he already knows
  (referral ask).
- **Mailgun (`mg.konative.com`, `mg.tolowapacific.com`) and Resend are never
  used for outreach.** Both prohibit unsolicited mail, and a suspension would
  take Konative's transactional mail (site forms, notifications) down with it
  (TOL-659).
- LinkedIn: only existing first-degree connections, or people reached through
  an intro. **Never cold InMail**, never a connection request sent just to
  pitch, no automation tools.
- The newsletter goes only to people who already subscribed (§5).

## Summary

| § | Item | Status |
|---|---|---|
| 0 | Warm-only rule; no cold sending path exists | PASS (no cold drafts remain; scan below) |
| 1.1 | Accurate From / header | PASS |
| 1.2 | Subject lines not deceptive (CAN-SPAM) | PASS |
| 1.3 | Postal address in every signature / footer | PASS (value on file; placeholder in templates) |
| 1.4 | Opt-out honored | PASS |
| 2 | WA CEMA: subject lines truthful; no third-party domain or hidden origin | PASS |
| 3 | Do-not-contact check before any message | PASS (rule) / sources need:jeramey |
| 4 | Eligibility: two-way history only | PASS |
| 5 | Newsletter to existing subscribers only | PASS (rule) / which newsletter needs:jeramey |
| 6 | Sender identity | PASS / mailbox needs:jeramey |
| 7 | Every factual claim sourced; no TBCP3/NEGP deadline claims | PASS |
| 8 | CTA wording matches the site | needs:jeramey |

Scan run 2026-11-15 on this folder: no file contains a cold sequence, an
`{{UNSUBSCRIBE}}` sequencer link, or setup for Mailgun, Resend or any
sending tool. The tier sequence files were deleted.

---

## 1. CAN-SPAM (15 U.S.C. §7701 et seq.; 16 CFR Part 316)

A 1:1 message offering a free service can still count as commercial email,
and B2B is not exempt. Both the sender and the business advertised are
responsible (FTC, *CAN-SPAM Act: A Compliance Guide for Business*). Here both
are Tolowa Pacific LLC; Konative is its trade name. The warm-only rule keeps
volume tiny, but these basics still apply to every message.

**1.1 Header / From — PASS.** Display name "Jeramey James, Konative"
(approved by Jeramey 2026-07-08), sent from a real mailbox he controls. No
spoofed reply-to.

**1.2 Subject lines — PASS.** See §2.

**1.3 Postal address — PASS.** Every email signature carries
`{{POSTAL_ADDRESS}}`. The Tolowa Pacific LLC mailing address is on file,
confirmed by Jeramey 2026-09-22 for CAN-SPAM / WA CEMA use (Stash). It is
kept out of this public repo and filled in at send time.

**1.4 Opt-out — PASS.** Follow-ups say "If you'd rather I not follow up, just
say so and I won't." Any "no", "not now" or "stop" goes onto the
do-not-contact list in Twenty the same day (the legal limit is 10 business
days). No unsubscribe link is needed for 1:1 replies-based mail. The
newsletter uses Ghost's own unsubscribe link.

## 2. Washington CEMA (RCW 19.190)

RCW 19.190.020 bars commercial email to a Washington resident (or sent from
Washington) that uses a third party's domain without permission, hides its
origin or transmission path, or has false or misleading information in the
subject line. Recipients have a private right of action (RCW 19.190.040).
*Brown v. Old Navy* (Wash. 2025) read the subject-line rule broadly (as
summarized in TOL-659; confirm with counsel before relying on it). Konative
sends from Washington, so treat every message as covered.

**Subject lines — PASS.**

| File | Subject | Truthful? |
|---|---|---|
| warm (Avant) | Intro ask — [Organization] ([City, State]) | Yes |
| warm (T4/WestPorch) | One site, one question — [Site / Project] | Yes |
| warm (tribal) | Who handles connectivity at [Organization]? | Yes |
| follow-up (DC) | Carrier reach at [Site / Project] | Yes, the body is about carrier reach at that site |
| follow-up (tribal) | Uptime at [Property / Organization] | Yes |
| follow-up (TBCP ops) | Connectivity after the build at [Organization] | Yes |
| referral | A small favor | Yes, the body is a favor ask |
| referral (tribal) | Who handles carrier contracts at […]? | Yes |
| referral (build) | Anyone wrestling with fiber on a new build? | Yes |
| newsletter | Is your backup circuit really a backup? | Yes, the lead section is that check |

Follow-ups are replies in the same thread, so "Re:" is real. Never put "Re:"
or "Fwd:" on a first message. No fake urgency, deadlines, dollar amounts, or
names the body doesn't discuss.

**Origin — PASS.** Sent from Jeramey's own mailbox on a domain he controls.
Never from a partner's domain or through a relay that hides origin.

## 3. Do-not-contact — PASS (rule) / sources needs:jeramey

Before any message, Jeramey (or the agent preparing his list) checks the
person against:

1. Twenty: any do-not-contact / opted-out marker.
2. Mailgun suppressions from the July 2026 send (1 unsubscribe, 1 bounce;
   Stash). Read-only export.
3. Ghost: members who unsubscribed.
4. Any earlier reply asking not to be contacted.

**needs:jeramey:** confirm sources 1–4. `web/src/lib/outreach/suppression.ts` (TS-4376) reads Twenty `doNotContact` and
`outreachStatus` DNC/OPTED_OUT/BOUNCED and is called by `sendOutreachEmail`, so
every send path is checked; it fails closed. Mailgun and Ghost exports must be
marked in Twenty first.

## 4. Eligibility — PASS

Follow-ups go only to people with a **two-way** history in Twenty (a
relationship, a warm intro, a reply, a form fill, a booked call, or a
newsletter opt-in). A one-way cold message is not history: the ~101 July 2026
bulk-send recipients who never replied are **not** eligible. Referral asks go
only to people Jeramey actually knows.

## 5. Newsletter — PASS (rule) / needs:jeramey (which newsletter)

- Goes only to **existing** Ghost subscribers who opted in through
  konative.com (`web/src/app/(frontend)/api/newsletter/subscribe/route.ts`
  adds them to the Konative newsletter, `KONATIVE_NEWSLETTER_ID`).
- **Never import Twenty contacts or any other list into Ghost.** That would
  turn the newsletter into cold email.
- Ghost adds its own unsubscribe link; the footer carries the postal address.
- **needs:jeramey:** publish "Tribal Infrastructure Brief" as an issue of the
  existing Konative newsletter, or as a separate Ghost newsletter that
  current subscribers can choose? The draft was not created in Ghost.

## 6. Sender identity — PASS / mailbox needs:jeramey

- "Jeramey James, Konative"; every signature says "Konative is a trade name
  of Tolowa Pacific LLC" plus the postal address. Signed by a person, never
  "The Konative Team".
- **needs:jeramey:** which mailbox he sends from (his Tolowa mailbox was used
  for the July 2026 warm asks; a Konative-domain mailbox matches the brand).
  Either is lawful; pick one so replies land in one place.

## 7. Factual claims — PASS

Every claim maps to the claims register in `README.md` (C1–C7). A scan of the
message copy for dates, "deadline", "due", "%", "$", "TBCP3", "NEGP" finds
them only in internal rule text. Konative is never offered as a grant writer
or TBCP3/NEGP applicant; the TBCP-awardee follow-up and the newsletter both
say "We don't do grant work."

## 8. CTA wording matches the site — needs:jeramey

The drafts say "One-Site Snapshot". The site says "One-Page Site Brief"
(`/data-center-connectivity`) and "Continuity Snapshot" (`/tribal`). Confirm
the name (then W2 updates the site), or switch the drafts to the site's
wording. Also for W2: `/contact` ignores the `?projectType=` query string.
