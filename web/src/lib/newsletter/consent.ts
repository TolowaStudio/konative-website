// Express-consent record for Konative Dispatch signups (TS-4378, G5/G6).
//
// The server owns the wording: the client only says "the box was ticked"
// (`consent: true`) plus which form it came from. The exact wording and its
// version are stamped onto the stored record here, so the record always holds
// what the visitor was shown, never what a client claimed.
//
// If you change CONSENT_WORDING you MUST bump CONSENT_VERSION and keep the
// checkbox label (NewsletterSignup.tsx) rendering this same constant.

export const CONSENT_VERSION = "2026-11-26.1";

export const CONSENT_WORDING =
  "Yes, email me the Konative Dispatch. I understand I can unsubscribe at any time, and I have read the Privacy Policy.";

/**
 * Sender postal address (CAN-SPAM / CASL / WA CEMA). Real value comes from env
 * at deploy time; the repo only carries the placeholder (no address in code).
 */
export const POSTAL_ADDRESS_PLACEHOLDER = "{{POSTAL_ADDRESS}}";

export function postalAddress(): string {
  const v = (process.env.NEXT_PUBLIC_POSTAL_ADDRESS ?? "").trim();
  return v || POSTAL_ADDRESS_PLACEHOLDER;
}

export interface ConsentRecord {
  consentGiven: true;
  consentWording: string;
  consentVersion: string;
  consentAt: string;
  consentFormId: string;
  optInMethod: "double_opt_in";
  /** pending until the Ghost confirmation link is clicked. */
  optInStatus: "pending_confirmation";
}

export function buildConsentRecord(formId: string, now: Date = new Date()): ConsentRecord {
  return {
    consentGiven: true,
    consentWording: CONSENT_WORDING,
    consentVersion: CONSENT_VERSION,
    consentAt: now.toISOString(),
    consentFormId: formId,
    optInMethod: "double_opt_in",
    optInStatus: "pending_confirmation",
  };
}
