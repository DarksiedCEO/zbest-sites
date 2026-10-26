import { createHash, createHmac } from "node:crypto";

/**
 * Which request header carries the client address, and how to read it.
 *
 * AEGIS r3 F1: client-address headers are client-controlled unless the proxy
 * in front sets them, and a proxy only guarantees the ONE header it sets. So
 * exactly one source is trusted:
 *   - on Vercel (VERCEL === "1" exactly): `x-vercel-forwarded-for`, which the
 *     edge sets, and nothing else;
 *   - elsewhere: the single header named by LEAD_TRUSTED_PROXY, from the list
 *     below. `x-vercel-forwarded-for` is never read off Vercel, because no
 *     other proxy strips a client-supplied one.
 */
export type IpSource =
  | { header: "x-vercel-forwarded-for"; hop: "first" }
  | { header: "x-real-ip" | "cf-connecting-ip" | "fly-client-ip"; hop: "only" }
  /**
   * A proxy APPENDS the address it saw to x-forwarded-for, so the rightmost
   * entry is the one it vouches for; anything to its left came from the client.
   */
  | { header: "x-forwarded-for"; hop: "last" };

/** The values LEAD_TRUSTED_PROXY may take (lowercase header names). */
export const TRUSTED_PROXY_HEADERS = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip", "fly-client-ip"] as const;

export function ipSourceFor(header: (typeof TRUSTED_PROXY_HEADERS)[number]): IpSource {
  return header === "x-forwarded-for" ? { header, hop: "last" } : { header, hop: "only" };
}

export const VERCEL_IP_SOURCE: IpSource = { header: "x-vercel-forwarded-for", hop: "first" };

const looksLikeIp = (v: string) => v.length > 0 && v.length <= 64 && /^[0-9A-Fa-f:.]+$/.test(v);

/** The client address from the one trusted header, or null if it is absent or not an address. */
export function clientIp(headers: Headers, source: IpSource | null): string | null {
  if (!source) return null;
  const raw = headers.get(source.header);
  if (!raw) return null;
  const parts = raw.split(",").map((p) => p.trim());
  const value = source.hop === "last" ? parts[parts.length - 1] : source.hop === "first" ? parts[0] : parts.length === 1 ? parts[0] : undefined;
  return value && looksLikeIp(value) ? value : null;
}

/** Brief §6.2 `ip_hash`: HMAC-SHA256 so the stored value cannot be reversed by a lookup table. */
export const hmacIp = (secret: string) => (ip: string) =>
  createHmac("sha256", secret).update(ip).digest("hex");

/** Rate-limit keys only (never stored): a plain hash so no raw IP leaves the process. */
export const plainIpKey = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 32);
