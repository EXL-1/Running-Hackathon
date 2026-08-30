import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { clientIp, rateLimit } from "@/lib/rate-limit";

type RouteLimit = {
  methods: string[];
  limit: number;
  windowMs: number;
};

const routeLimits: Record<string, RouteLimit> = {
  "/api/auth/session": { methods: ["POST"], limit: 20, windowMs: 60_000 },
  "/api/coach-voice": { methods: ["GET"], limit: 120, windowMs: 60_000 },
  "/api/voices": { methods: ["POST"], limit: 10, windowMs: 60_000 },
  "/api/runs": { methods: ["POST"], limit: 60, windowMs: 60_000 },
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const config = routeLimits[pathname];

  if (!config || !config.methods.includes(request.method)) {
    return NextResponse.next();
  }

  const ip = clientIp(request);
  const result = rateLimit(`${pathname}:${ip}`, {
    limit: config.limit,
    windowMs: config.windowMs,
  });

  if (!result.allowed) {
    const retryAfter = Math.max(
      1,
      Math.ceil((result.resetAt - Date.now()) / 1000),
    );

    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: {
          "retry-after": String(retryAfter),
          "x-ratelimit-limit": String(config.limit),
          "x-ratelimit-remaining": "0",
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-ratelimit-limit", String(config.limit));
  response.headers.set("x-ratelimit-remaining", String(result.remaining));
  return response;
}

export const config = {
  matcher: [
    "/api/auth/session",
    "/api/coach-voice",
    "/api/voices",
    "/api/runs",
  ],
};
