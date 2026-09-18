import { createHash } from "node:crypto";
import { ACTIVE_RULE_SET } from "./rules";

/**
 * §11.2 `rules_hash` — SHA-256 over the canonical content of the rule set.
 *
 * Server-only: it imports node:crypto, so a client import fails the build
 * rather than shipping a second hashing path. Canonical means object keys
 * sorted at every depth and arrays kept in order, so the hash changes when and
 * only when a question, the scale, the priority order or any copy changes.
 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export const RULE_SET_HASH = createHash("sha256").update(canonical(ACTIVE_RULE_SET)).digest("hex");
