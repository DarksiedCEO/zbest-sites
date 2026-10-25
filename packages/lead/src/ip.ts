import { createHash, createHmac } from "node:crypto";

/**
 * The client IP, as Vercel reports it. Vercel's edge sets `x-real-ip` and
 * overwrites `x-forwarded-for`, so on Vercel neither can be spoofed by the
 * client. Anywhere else these headers are client-controlled; the rate limit
 * is only as trustworthy as the proxy in front of the app.
 */
export function clientIp(headers: Headers): string {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

/** Brief §6.2 `ip_hash`: HMAC-SHA256 so the stored value cannot be reversed by a lookup table. */
export const hmacIp = (secret: string) => (ip: string) =>
  createHmac("sha256", secret).update(ip).digest("hex");

/** Rate-limit keys only (never stored): a plain hash so no raw IP leaves the process. */
export const plainIpKey = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 32);
