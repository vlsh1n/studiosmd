import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = new Set(["ru", "ro", "en"]);
const FALLBACK_RATE_LIMIT_WINDOW_MS = 60_000;
const FALLBACK_RATE_LIMIT_MAX_REQUESTS = 240;
const RATE_LIMIT_WINDOW_MS = parsePositiveInt(
  process.env.RATE_LIMIT_WINDOW_MS,
  FALLBACK_RATE_LIMIT_WINDOW_MS
);
const RATE_LIMIT_MAX_REQUESTS = parsePositiveInt(
  process.env.RATE_LIMIT_MAX_REQUESTS,
  FALLBACK_RATE_LIMIT_MAX_REQUESTS
);

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// Best-effort in-memory limiter. It works per runtime instance.
const rateLimitStore = new Map<string, RateLimitEntry>();

function parsePositiveInt(rawValue: string | undefined, fallback: number) {
  if (!rawValue) return fallback;
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getClientIdentifier(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstHop = xForwardedFor.split(",")[0]?.trim();
    if (firstHop) return `ip:${firstHop}`;
  }

  const realIp = request.headers.get("x-real-ip") ?? request.headers.get("cf-connecting-ip");
  if (realIp && realIp.trim().length > 0) {
    return `ip:${realIp.trim()}`;
  }

  if (request.ip && request.ip.trim().length > 0) {
    return `ip:${request.ip.trim()}`;
  }

  return null;
}

function consumeRateLimitToken(request: NextRequest) {
  const clientId = getClientIdentifier(request);
  if (!clientId) {
    return {
      limited: false,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetInSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || now >= entry.resetAt) {
    const nextEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(clientId, nextEntry);
    return {
      limited: false,
      remaining: RATE_LIMIT_MAX_REQUESTS - nextEntry.count,
      resetInSeconds: Math.ceil((nextEntry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  const resetInSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

  return {
    limited: entry.count > RATE_LIMIT_MAX_REQUESTS,
    remaining,
    resetInSeconds,
  };
}

export function middleware(request: NextRequest) {
  const rateLimit = consumeRateLimitToken(request);
  if (rateLimit.limited) {
    return new NextResponse("Too many requests. Please try again later.", {
      status: 429,
      headers: {
        "retry-after": String(rateLimit.resetInSeconds),
        "x-ratelimit-limit": String(RATE_LIMIT_MAX_REQUESTS),
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(rateLimit.resetInSeconds),
      },
    });
  }

  const { pathname } = request.nextUrl;
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = segment && SUPPORTED_LOCALES.has(segment) ? segment : "ro";

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  const response = NextResponse.next({
    request: { headers },
  });

  response.headers.set("x-ratelimit-limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.headers.set("x-ratelimit-remaining", String(rateLimit.remaining));
  response.headers.set("x-ratelimit-reset", String(rateLimit.resetInSeconds));

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
