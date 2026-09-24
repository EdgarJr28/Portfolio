/**
 * Best-effort in-memory rate limiter.
 *
 * NOTE: this holds state in a module-level Map, so it only limits within a
 * single warm server instance. On a serverless platform (e.g. Vercel) each
 * instance keeps its own memory and cold starts reset it, so treat this as
 * friction against casual spam, not a hard guarantee. For real protection
 * across instances, back it with a shared store (Upstash/Redis).
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

// Occasionally evict expired buckets so the Map does not grow unbounded.
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number; // seconds until the window resets
}

/**
 * @param key    Identity to limit on (usually the client IP).
 * @param limit  Max requests allowed inside the window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const hit = buckets.get(key);
  if (!hit || hit.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt, retryAfter: 0 };
  }

  if (hit.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: hit.resetAt,
      retryAfter: Math.ceil((hit.resetAt - now) / 1000),
    };
  }

  hit.count += 1;
  return {
    ok: true,
    remaining: limit - hit.count,
    resetAt: hit.resetAt,
    retryAfter: 0,
  };
}

/** Extracts the client IP from proxy headers, falling back to a constant. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
