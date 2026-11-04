/**
 * Security headers for both apps (Phase 6 step 3, approved Oct 28 2026).
 * Imported by apps/zbm/next.config.ts and apps/zbc/next.config.ts.
 *
 * Read at build time: on Vercel, VERCEL_ENV is "production" or "preview".
 * - Preview only: Vercel's comment toolbar (vercel.live) is allowed.
 * - Dev only (`next dev`): 'unsafe-eval' and websockets for React and HMR.
 *
 * script-src keeps 'unsafe-inline' because Next.js puts per-page inline
 * startup scripts in every statically built page. Nonces would make every
 * page render per request. Post-launch upgrade: a hash-based CSP (logged in
 * RUN_LOG.md).
 *
 * zod is set to jitless in every module that imports it, so its eval
 * feature-check never runs and the CSP sees no violation.
 */

type Env = { NODE_ENV?: string; VERCEL_ENV?: string };

export function contentSecurityPolicy(env: Env = process.env): string {
  const dev = env.NODE_ENV === "development";
  const preview = env.VERCEL_ENV === "preview";
  const live = preview ? ["https://vercel.live"] : [];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : []), ...live],
    "style-src": ["'self'", "'unsafe-inline'", ...live],
    "img-src": ["'self'", "data:", "blob:", ...(preview ? ["https://vercel.live", "https://vercel.com"] : [])],
    "font-src": ["'self'", ...(preview ? ["https://vercel.live", "https://assets.vercel.com"] : [])],
    "connect-src": ["'self'", ...(dev ? ["ws:"] : []), ...(preview ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : [])],
    ...(preview ? { "frame-src": ["https://vercel.live"] } : {}),
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "manifest-src": ["'self'"],
  };
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

/** The six headers every response carries, as key/value pairs. */
export function securityHeaderList(env: Env = process.env): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(env) },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    { key: "X-Frame-Options", value: "DENY" },
  ];
}

export function securityHeaders(env: Env = process.env) {
  return [{ source: "/:path*", headers: securityHeaderList(env) }];
}

/** True when some segment of a raw URL path is not valid percent-encoding (e.g. /legal/%E0%A4%A). */
export function malformedPath(rawPath: string): boolean {
  try {
    decodeURIComponent(rawPath);
    return false;
  } catch {
    return true;
  }
}

/**
 * Red team RTS-9: a malformed percent-encoding in a dynamic route used to
 * end in Next's bare text/plain 500, which skips the next.config headers.
 * Each app's proxy.ts answers such a request itself — 400, plain text, no
 * detail — with all six headers.
 */
export function malformedPathResponse(env: Env = process.env): Response {
  const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
  for (const { key, value } of securityHeaderList(env)) headers.set(key, value);
  return new Response("Bad request", { status: 400, headers });
}
