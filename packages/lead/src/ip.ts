import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";

/**
 * Which request header carries the client address, and how to read it.
 *
 * AEGIS r3 F1: client-address headers are client-controlled unless the proxy
 * in front sets them, and a proxy only guarantees the ONE header it sets. So
 * exactly one source is trusted:
 *   - on Vercel (VERCEL === "1" exactly): `x-vercel-forwarded-for`, which the
 *     edge sets to the single client address — a list is refused (r4);
 *   - elsewhere: the single header named by LEAD_TRUSTED_PROXY, from the list
 *     below. `x-vercel-forwarded-for` is never read off Vercel, because no
 *     other proxy strips a client-supplied one.
 *
 * AEGIS r4 R1: `x-forwarded-for` is only trustworthy when the proxies in
 * front APPEND to it. Read from the right, the n-th entry
 * (LEAD_TRUSTED_PROXY_HOPS, default 1) is the address the outermost of your n
 * trusted proxies saw; everything to its left is client-supplied. A bare
 * `next start` does NOT append — Next 16 only fills x-forwarded-for when it is
 * absent — so it must never be exposed directly with LEAD_TRUSTED_PROXY set.
 */
export type IpSource =
  | { header: "x-vercel-forwarded-for" | "x-real-ip" | "cf-connecting-ip" | "fly-client-ip"; hop: "only" }
  | { header: "x-forwarded-for"; hop: "from-right"; hops: number };

/** The values LEAD_TRUSTED_PROXY may take (lowercase header names). */
export const TRUSTED_PROXY_HEADERS = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip", "fly-client-ip"] as const;

export function ipSourceFor(header: (typeof TRUSTED_PROXY_HEADERS)[number], hops = 1): IpSource {
  return header === "x-forwarded-for" ? { header, hop: "from-right", hops } : { header, hop: "only" };
}

export const VERCEL_IP_SOURCE: IpSource = { header: "x-vercel-forwarded-for", hop: "only" };

/** A normalised client address: `address` for the HMAC, `key` for the rate limit. */
export type ClientAddress = { address: string; key: string };

/**
 * AEGIS r4 R2: one client, one key.
 *   - strips a port: `1.2.3.4:5678` and `[2001:db8::1]:443`;
 *   - unwraps IPv4 carried in IPv6 — mapped, translated or compatible, in any
 *     spelling (`::ffff:1.2.3.4`, `0:0:0:0:0:FFFF:102:304` → `1.2.3.4`);
 *   - validates with `net.isIP` — anything else is no address (→ 503);
 *   - keys IPv6 by its /64, the block one subscriber or VM typically holds,
 *     so rotating addresses inside it does not mint new buckets.
 */
export function normalizeIp(raw: string): ClientAddress | null {
  let value = raw.trim();
  if (value.length === 0 || value.length > 64) return null;
  const validPort = (p: string | undefined) => p === undefined || (Number(p) >= 1 && Number(p) <= 65535);
  const bracketed = /^\[([^\]]+)\](?::(\d{1,5}))?$/.exec(value);
  const v4port = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/.exec(value);
  if (bracketed) {
    if (!validPort(bracketed[2])) return null;
    value = bracketed[1]!;
  } else if (v4port) {
    if (!validPort(v4port[2])) return null;
    value = v4port[1]!;
  }
  // A zone id (fe80::1%eth0) is local-only and never a client address.
  if (value.includes("%")) return null;
  const family = isIP(value);
  if (family === 4) return { address: value, key: `v4:${value}` };
  if (family === 6) {
    const groups = expandIpv6(value);
    if (!groups) return null;
    // IPv4 carried in IPv6, in ANY spelling (AEGIS r5 N3) — detected on the
    // expanded groups, so uncompressed, hex, upper-case and dotted forms all
    // key as the same IPv4 client instead of one shared zero-/64:
    //   ::ffff:a.b.c.d    (mapped,        ::ffff:0:0/96)
    //   ::ffff:0:a.b.c.d  (translated,    ::ffff:0:0:0/96)
    //   ::a.b.c.d         (compatible,    ::/96, except :: and ::1)
    const embedded = embeddedIpv4(groups);
    if (embedded) return { address: embedded, key: `v4:${embedded}` };
    const address = groups.join(":");
    return { address, key: `v6/64:${groups.slice(0, 4).join(":")}` };
  }
  return null;
}

function embeddedIpv4(groups: string[]): string | null {
  const zero = (from: number, to: number) => groups.slice(from, to).every((g) => g === "0000");
  const mapped = zero(0, 5) && groups[5] === "ffff";
  const translated = zero(0, 4) && groups[4] === "ffff" && groups[5] === "0000";
  const tail = parseInt(groups[6]! + groups[7]!, 16);
  const compatible = zero(0, 6) && tail > 1; // not :: (unspecified) or ::1 (loopback)
  if (!mapped && !translated && !compatible) return null;
  return [tail >>> 24, (tail >>> 16) & 255, (tail >>> 8) & 255, tail & 255].join(".");
}

/** Eight 4-digit lowercase hex groups, or null. Input already passed isIP === 6. */
function expandIpv6(value: string): string[] | null {
  let text = value.toLowerCase();
  // Embedded IPv4 tail (e.g. 64:ff9b::1.2.3.4) → two hex groups.
  const v4 = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(text);
  if (v4) {
    const [a, b, c, d] = v4.slice(1).map(Number) as [number, number, number, number];
    text = `${text.slice(0, v4.index)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = text.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0) return null;
  const groups = [...head, ...Array(fill).fill("0"), ...tail];
  if (groups.length !== 8) return null;
  return groups.map((g) => g.padStart(4, "0"));
}

/** The client address from the one trusted header, or null if it is absent or not an address. */
export function clientIp(headers: Headers, source: IpSource | null): ClientAddress | null {
  if (!source) return null;
  const raw = headers.get(source.header);
  if (!raw) return null;
  const parts = raw.split(",").map((p) => p.trim());
  let value: string | undefined;
  if (source.hop === "from-right") {
    // Fewer entries than trusted hops: the chain is not what the operator said.
    value = parts.length >= source.hops ? parts[parts.length - source.hops] : undefined;
  } else {
    value = parts.length === 1 ? parts[0] : undefined;
  }
  return value ? normalizeIp(value) : null;
}

/** Brief §6.2 `ip_hash`: HMAC-SHA256 so the stored value cannot be reversed by a lookup table. */
export const hmacIp = (secret: string) => (ip: string) =>
  createHmac("sha256", secret).update(ip).digest("hex");

/** Rate-limit keys only (never stored): a plain hash so no raw IP leaves the process. */
export const plainIpKey = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 32);
