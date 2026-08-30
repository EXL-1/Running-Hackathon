type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory sliding-window rate limiter. Each Vercel isolate keeps its
 * own map, so this curbs casual abuse but is not a global cap — pair with
 * Vercel Firewall on production if you need edge-wide limits.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
  };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}
