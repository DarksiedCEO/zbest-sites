import { createHash } from "node:crypto";

/** Object keys sorted at every depth, arrays in order — so equal content hashes equal. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export const payloadHash = (payload: unknown) => createHash("sha256").update(canonical(payload)).digest("hex");

/** Case, runs of whitespace, leading/trailing space and Unicode form do not make a message different. */
function normalized(value: unknown): unknown {
  if (typeof value === "string") return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  if (Array.isArray(value)) return value.map(normalized);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalized(v)]));
  }
  return value;
}

/**
 * Red team RTS-3: the dedupe key. The same words re-sent under a fresh
 * submission_id (a script, or a visitor pressing send in a new tab) hash
 * equal; any change in wording does not.
 */
export const contentHash = (content: { form: string; region: unknown; payload: unknown }) =>
  createHash("sha256").update(`content-v1:${canonical(normalized(content))}`).digest("hex");
