/**
 * Honeypot field name — must match hidden inputs on contact forms.
 * Avoids common autofill tokens (company, website, url, email, name).
 */
export const CONTACT_HONEYPOT_FIELD = "meshLedgerSlot";

const RATE_LIMIT_MAX = 5;
/** Shared bucket when no trustworthy client IP is available — higher ceiling so one bot cannot exhaust a tight shared quota for everyone. */
const RATE_LIMIT_MAX_NO_IP = 40;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_BUCKET_MAX_ENTRIES = 10_000;
const PRUNE_EVERY_N_CHECKS = 64;

/** Internal map key when X-Forwarded-For / X-Real-IP yield no usable address. */
export const CONTACT_RATE_LIMIT_NO_IP_KEY = "__no_client_ip__";

/**
 * How many X-Forwarded-For hops to count from the right (Google's front end appends
 * the immediate client IP as the rightmost entry on Cloud Run; leftmost values are
 * client-controlled and must not be trusted).
 */
const DEFAULT_TRUSTED_XFF_HOP_COUNT = 1;

function trustedXffHopCountFromEnv(): number {
  const raw = process.env.CONTACT_RATE_LIMIT_TRUSTED_XFF_HOPS;
  if (!raw) return DEFAULT_TRUSTED_XFF_HOP_COUNT;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : DEFAULT_TRUSTED_XFF_HOP_COUNT;
}

type Bucket = { count: number; windowStart: number };

/**
 * In-memory per-IP rate limit for contact submissions.
 * Cloud Run may run multiple instances; limits apply per instance (best-effort).
 */
const rateBuckets = new Map<string, Bucket>();
let checksSincePrune = 0;

export function resetContactRateLimitForTests(): void {
  rateBuckets.clear();
  checksSincePrune = 0;
}

/** Test-only: current number of rate-limit buckets in memory. */
export function getContactRateBucketCountForTests(): number {
  return rateBuckets.size;
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

/**
 * Parses X-Forwarded-For using the rightmost trusted hop(s).
 * @param trustedHopCount — 1 = rightmost entry (Cloud Run / Google LB default).
 */
export function pickTrustedClientIpFromForwardedFor(
  forwarded: string,
  trustedHopCount = DEFAULT_TRUSTED_XFF_HOP_COUNT,
): string | null {
  const hops = forwarded
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  if (hops.length === 0) return null;
  const index = hops.length - trustedHopCount;
  const hop = hops[Math.max(0, index)];
  return hop ?? null;
}

export function getClientIpFromRequest(
  request: Request,
  trustedHopCount = trustedXffHopCountFromEnv(),
): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const trusted = pickTrustedClientIpFromForwardedFor(forwarded, trustedHopCount);
    if (trusted) return trusted;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return CONTACT_RATE_LIMIT_NO_IP_KEY;
}

function pruneExpiredBuckets(nowMs: number): void {
  for (const [key, bucket] of rateBuckets) {
    if (nowMs - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
      rateBuckets.delete(key);
    }
  }
}

function evictOldestBucket(): void {
  let oldestKey: string | null = null;
  let oldestStart = Infinity;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.windowStart < oldestStart) {
      oldestStart = bucket.windowStart;
      oldestKey = key;
    }
  }
  if (oldestKey !== null) rateBuckets.delete(oldestKey);
}

function maybeMaintainRateBuckets(nowMs: number): void {
  checksSincePrune += 1;
  if (checksSincePrune >= PRUNE_EVERY_N_CHECKS) {
    checksSincePrune = 0;
    pruneExpiredBuckets(nowMs);
  }
  if (rateBuckets.size >= RATE_BUCKET_MAX_ENTRIES) {
    pruneExpiredBuckets(nowMs);
    while (rateBuckets.size >= RATE_BUCKET_MAX_ENTRIES) {
      evictOldestBucket();
    }
  }
}

function rateLimitMaxForKey(ip: string): number {
  if (!ip || ip === CONTACT_RATE_LIMIT_NO_IP_KEY) return RATE_LIMIT_MAX_NO_IP;
  return RATE_LIMIT_MAX;
}

export type ContactRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkContactRateLimit(ip: string, nowMs = Date.now()): ContactRateLimitResult {
  maybeMaintainRateBuckets(nowMs);

  const key = ip || CONTACT_RATE_LIMIT_NO_IP_KEY;
  const max = rateLimitMaxForKey(key);
  const existing = rateBuckets.get(key);

  if (!existing || nowMs - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { count: 1, windowStart: nowMs });
    return { allowed: true };
  }

  if (existing.count >= max) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (nowMs - existing.windowStart);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
