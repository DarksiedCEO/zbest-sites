/**
 * The only logger the lead pipeline uses. NO PII: it accepts an allowlist of
 * keys whose values are codes, ids or counts — never a field value, an IP, a
 * user agent, an email address, a provider response body or a connection
 * string. Anything outside the allowlist is dropped, not redacted, so a
 * careless call site cannot leak by adding a key.
 */

const ALLOWED = [
  "app",
  "form",
  "submission_id",
  "code",
  "notify",
  "status",
  "sqlstate",
  "missing",
  "mode",
  "limiter",
  // Retention purge counts (numbers only).
  "deleted",
  "ua_cleared",
  "days",
] as const;

export type LogFields = Partial<Record<(typeof ALLOWED)[number], string | number>>;

export type LeadLogger = (level: "info" | "warn" | "error", event: string, fields?: LogFields) => void;

/** Only these characters survive in a value: no spaces, @, or free text. */
const SAFE = /[^A-Za-z0-9_.,:/-]/g;

export function sanitize(fields: LogFields = {}): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const key of ALLOWED) {
    const value = fields[key];
    if (value === undefined) continue;
    out[key] = typeof value === "number" ? value : value.replace(SAFE, "").slice(0, 400);
  }
  return out;
}

export const consoleLogger: LeadLogger = (level, event, fields) => {
  const line = JSON.stringify({ scope: "lead", event, ...sanitize(fields) });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
};
