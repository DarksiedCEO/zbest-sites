import { createHash, createHmac } from "node:crypto";

/**
 * The client address, or null when none can be trusted (AEGIS M4).
 *
 * These headers are client-controlled unless a proxy in front of the app
 * overwrites them. Vercel's edge sets `x-vercel-forwarded-for` and
 * `x-real-ip` and rewrites `x-forwarded-for`, so they are trusted only when
 * `trustProxy` is on: automatically on Vercel (VERCEL=1), or when an operator
 * sets LEAD_TRUSTED_PROXY=1 for a host whose proxy does the same. Otherwise
 * the address is unknown — never guessed from a header anyone can send.
 */
export function clientIp(headers: Headers, trustProxy: boolean): string | null {
  if (!trustProxy) return null;
  for (const name of ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"]) {
    const value = headers.get(name)?.split(",")[0]?.trim();
    if (value && value.length <= 64 && /^[0-9A-Fa-f:.]+$/.test(value)) return value;
  }
  return null;
}

/** Brief §6.2 `ip_hash`: HMAC-SHA256 so the stored value cannot be reversed by a lookup table. */
export const hmacIp = (secret: string) => (ip: string) =>
  createHmac("sha256", secret).update(ip).digest("hex");

/** Rate-limit keys only (never stored): a plain hash so no raw IP leaves the process. */
export const plainIpKey = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 32);
