/** Most visitors tracked at once; beyond this the oldest windows are dropped. */
export const MAX_TRACKED_KEYS = 10_000;

/**
 * Small in-memory rate limiter (fixed window per key). On serverless hosting
 * each instance keeps its own counts, so this is a speed bump against one
 * client hammering a form, not a hard global limit — pair it with a hosting
 * firewall rule for that. Memory is bounded: expired windows are swept at most
 * once per window, and the map never holds more than MAX_TRACKED_KEYS entries.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = MAX_TRACKED_KEYS }: { limit: number; windowMs: number; maxKeys?: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  let nextSweep = 0;

  return function allow(key: string, now = Date.now()): boolean {
    if (now >= nextSweep) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      nextSweep = now + windowMs;
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      // Maps keep insertion order, so the first key is the oldest window.
      while (hits.size >= maxKeys) hits.delete(hits.keys().next().value as string);
      hits.delete(key);
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}
