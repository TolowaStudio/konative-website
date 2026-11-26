/**
 * One suppression source (Twenty) and one check every send path calls (TS-4376, K-09).
 *
 * Source of truth: Twenty `people` carrying `doNotContact = true` or an
 * `outreachStatus` of DNC / OPTED_OUT / BOUNCED. The July 2026 bulk recipients
 * (TOL-3553) are marked in Twenty with the same fields, so there is no second list.
 *
 * FAIL-CLOSED: if Twenty is not configured or unreachable, nobody is cleared.
 * `sendOutreachEmail` calls `assertNotSuppressed`; K-10/K-11/K-12 send through it.
 * Read-only: this module never writes to Twenty.
 */

export const SUPPRESSED_OUTREACH_STATUSES = ["DNC", "OPTED_OUT", "BOUNCED"] as const;

export type SuppressionChecker = (emails: string[]) => Promise<SuppressionResult>;

export type SuppressionResult =
  | { ok: true; blocked: string[] }
  | { ok: false; reason: string };

export function normalizeEmail(value: string): string {
  const raw = value.trim();
  const m = raw.match(/<([^>]+)>/); // "Name <a@b.com>"
  return (m ? m[1] : raw).trim().toLowerCase();
}

function peopleQuery(emails: string[]): string {
  const list = emails.map((e) => JSON.stringify(e)).join(",");
  const statuses = SUPPRESSED_OUTREACH_STATUSES.map((s) => JSON.stringify(s)).join(",");
  return `{ people(first: 200, filter: { emails: { primaryEmail: { in: [${list}] } } }) {
    edges { node { emails { primaryEmail additionalEmails } doNotContact outreachStatus } }
  } }
  # suppressed statuses: ${statuses}`;
}

export interface TwentySuppressionDeps {
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
}

/** Pure: is this Twenty person node suppressed? */
export function isSuppressedPerson(node: {
  doNotContact?: unknown;
  outreachStatus?: unknown;
}): boolean {
  if (node.doNotContact === true) return true;
  const status = typeof node.outreachStatus === "string" ? node.outreachStatus.toUpperCase() : "";
  return (SUPPRESSED_OUTREACH_STATUSES as readonly string[]).includes(status);
}

export function createTwentySuppressionChecker(deps: TwentySuppressionDeps = {}): SuppressionChecker {
  return async (emails) => {
    const env = deps.env ?? process.env;
    const token = (env.TWENTY_API_TOKEN || env.TWENTY_API_KEY || "").trim();
    const base = (env.TWENTY_API_URL || "").trim().replace(/\/+$/, "");
    if (!token || !base) return { ok: false, reason: "suppression-source-not-configured" };

    const wanted = [...new Set(emails.map(normalizeEmail).filter(Boolean))];
    if (wanted.length === 0) return { ok: true, blocked: [] };

    const blocked = new Set<string>();
    const fetchImpl = deps.fetchImpl ?? fetch;
    // Twenty stores addresses as typed; query lower-case and as-given variants.
    for (let i = 0; i < wanted.length; i += 100) {
      const chunk = wanted.slice(i, i + 100);
      let res: Response;
      try {
        res = await fetchImpl(`${base}/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query: peopleQuery(chunk) }),
        });
      } catch {
        return { ok: false, reason: "suppression-source-unreachable" };
      }
      if (!res.ok) return { ok: false, reason: `suppression-source-http-${res.status}` };
      let body: {
        data?: { people?: { edges?: { node: Record<string, unknown> }[] } };
        errors?: unknown[];
      };
      try {
        body = await res.json();
      } catch {
        return { ok: false, reason: "suppression-source-invalid-json" };
      }
      if (body.errors?.length || !body.data?.people) {
        return { ok: false, reason: "suppression-source-error" };
      }
      for (const edge of body.data.people.edges ?? []) {
        const node = edge.node as {
          emails?: { primaryEmail?: string; additionalEmails?: string[] };
          doNotContact?: unknown;
          outreachStatus?: unknown;
        };
        if (!isSuppressedPerson(node)) continue;
        const addrs = [node.emails?.primaryEmail, ...(node.emails?.additionalEmails ?? [])];
        for (const a of addrs) if (a) blocked.add(normalizeEmail(a));
      }
    }
    return { ok: true, blocked: wanted.filter((e) => blocked.has(e)) };
  };
}

/** The shared check. Returns `{ok:true}` only when every recipient is cleared. */
export async function assertNotSuppressed(
  to: string | string[],
  checker: SuppressionChecker = createTwentySuppressionChecker(),
): Promise<{ ok: true } | { ok: false; reason: string; blocked?: string[] }> {
  const emails = (Array.isArray(to) ? to : [to]).map(normalizeEmail).filter(Boolean);
  if (emails.length === 0) return { ok: false, reason: "no-recipients" };
  const result = await checker(emails);
  if (!result.ok) return { ok: false, reason: result.reason };
  if (result.blocked.length > 0) return { ok: false, reason: "suppressed", blocked: result.blocked };
  return { ok: true };
}
