/** Honeypot field name — must match hidden inputs on contact forms. */
export const CONTACT_HONEYPOT_FIELD = "companyWebsite";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type Bucket = { count: number; windowStart: number };

/**
 * In-memory per-IP rate limit for contact submissions.
 * Cloud Run may run multiple instances; limits apply per instance (best-effort).
 */
const rateBuckets = new Map<string, Bucket>();

export function resetContactRateLimitForTests(): void {
  rateBuckets.clear();
}

export function isContactHoneypotTripped(payload: Record<string, unknown>): boolean {
  const raw = payload[CONTACT_HONEYPOT_FIELD];
  if (raw === undefined || raw === null) return false;
  return String(raw).trim().length > 0;
}

export function stripContactHoneypot<T extends Record<string, unknown>>(payload: T): T {
  if (!(CONTACT_HONEYPOT_FIELD in payload)) return payload;
  const { [CONTACT_HONEYPOT_FIELD]: _removed, ...rest } = payload;
  return rest as T;
}

export function getClientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export type ContactRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkContactRateLimit(ip: string, nowMs = Date.now()): ContactRateLimitResult {
  const key = ip || "unknown";
  const existing = rateBuckets.get(key);

  if (!existing || nowMs - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { count: 1, windowStart: nowMs });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (nowMs - existing.windowStart);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
