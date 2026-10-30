import type { RateDecision, RateLimiter } from "./types";

/**
 * Brief §6.2 per-IP rate limit. Two implementations behind one port:
 *
 * - memoryLimiter: a token bucket in this server instance's memory. On Vercel
 *   each serverless instance has its own, so the effective limit is per
 *   instance — the Brief allows it, and it still stops a single-connection
 *   flood, but it is not a global cap.
 * - restLimiter: a fixed-window counter in Upstash Redis / Vercel KV over
 *   their REST API, shared by every instance. If the store is unreachable it
 *   falls back to the memory limiter rather than blocking real visitors.
 */

export type RateLimitSpec = { limit: number; windowSec: number };

export const DEFAULT_RATE_LIMIT: RateLimitSpec = { limit: 8, windowSec: 600 };

/** "8/600" → 8 requests per 600 s. Anything malformed → null. */
export function parseRateLimit(raw: string | undefined): RateLimitSpec | null {
  if (raw === undefined || raw.trim() === "") return DEFAULT_RATE_LIMIT;
  const match = /^\s*(\d{1,6})\s*\/\s*(\d{1,6})\s*$/.exec(raw);
  if (!match) return null;
  const limit = Number(match[1]);
  const windowSec = Number(match[2]);
  if (limit < 1 || windowSec < 1) return null;
  return { limit, windowSec };
}

export type MemoryLimiter = RateLimiter & {
  /** Buckets currently held (for tests and diagnostics). */
  size(): number;
};

export function memoryLimiter(spec: RateLimitSpec, now: () => number = Date.now, maxKeys = 50_000): MemoryLimiter {
  const buckets = new Map<string, { tokens: number; at: number }>();
  const windowMs = spec.windowSec * 1000;
  const refillPerMs = spec.limit / windowMs;
  /**
   * Expiry (privacy sweep 2026-10-30, F7): a bucket untouched for a whole
   * window has refilled completely, so it is indistinguishable from a new
   * one and holding it only keeps a derivative of someone's address in
   * memory. The map is in least-recently-used order, so expired buckets are
   * all at the front: drop them until the first live one.
   */
  const expire = (t: number) => {
    for (const [key, bucket] of buckets) {
      if (t - bucket.at < windowMs) break;
      buckets.delete(key);
    }
  };
  return {
    size: () => buckets.size,
    async hit(key: string): Promise<RateDecision> {
      const t = now();
      expire(t);
      const bucket = buckets.get(key) ?? { tokens: spec.limit, at: t };
      // Least-recently-used order: re-inserting moves this key to the end.
      buckets.delete(key);
      // Bounded memory without a global reset (AEGIS r3 F1): a flood of new
      // keys evicts only the least recently seen buckets, never everyone's.
      while (buckets.size >= maxKeys) {
        const oldest = buckets.keys().next().value;
        if (oldest === undefined) break;
        buckets.delete(oldest);
      }
      bucket.tokens = Math.min(spec.limit, bucket.tokens + (t - bucket.at) * refillPerMs);
      bucket.at = t;
      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        buckets.set(key, bucket);
        return { allowed: true };
      }
      buckets.set(key, bucket);
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((1 - bucket.tokens) / refillPerMs / 1000)) };
    },
  };
}

export function restLimiter(opts: {
  url: string;
  token: string;
  spec: RateLimitSpec;
  fallback: RateLimiter;
  onFallback?: () => void;
  fetchImpl?: typeof fetch;
  now?: () => number;
}): RateLimiter {
  const doFetch = opts.fetchImpl ?? fetch;
  const now = opts.now ?? Date.now;
  return {
    async hit(key: string): Promise<RateDecision> {
      const windowIndex = Math.floor(now() / 1000 / opts.spec.windowSec);
      const redisKey = `lead:rl:${key}:${windowIndex}`;
      try {
        const response = await doFetch(`${opts.url.replace(/\/$/, "")}/pipeline`, {
          method: "POST",
          headers: { Authorization: `Bearer ${opts.token}`, "Content-Type": "application/json" },
          body: JSON.stringify([
            ["INCR", redisKey],
            ["EXPIRE", redisKey, String(opts.spec.windowSec), "NX"],
          ]),
          signal: AbortSignal.timeout(2000),
        });
        if (!response.ok) throw new Error("rate store rejected");
        const body = (await response.json()) as [{ result?: unknown }, unknown];
        const count = Number(body[0]?.result);
        if (!Number.isFinite(count)) throw new Error("rate store reply");
        if (count <= opts.spec.limit) return { allowed: true };
        const windowEnd = (windowIndex + 1) * opts.spec.windowSec;
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(windowEnd - now() / 1000)) };
      } catch {
        opts.onFallback?.();
        return opts.fallback.hit(key);
      }
    },
  };
}
