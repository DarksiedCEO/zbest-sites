import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { LeadLogger, LogFields } from "../src/log";
import type { ParsedLead } from "../src/pipeline";

export const tempOutbox = () => mkdtempSync(path.join(tmpdir(), "lead-outbox-"));

export function readJsonl<T = Record<string, unknown>>(dir: string, file: string): T[] {
  try {
    return readFileSync(path.join(dir, file), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as T);
  } catch {
    return [];
  }
}

export function captureLogger() {
  const lines: { level: string; event: string; fields?: LogFields }[] = [];
  const logger: LeadLogger = (level, event, fields) => lines.push({ level, event, fields });
  return { lines, logger, text: () => JSON.stringify(lines) };
}

export const PII = {
  name: "Ada Lovelace-PII",
  business: "Analytical Engines PII Ltd",
  reach: "ada.pii@example.com",
  ip: "203.0.113.77",
  ua: "PII-Agent/1.0",
};

export const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": PII.ip,
      "user-agent": PII.ua,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

/** A toy parser standing in for an app's zod schemas. */
export function toyParse(json: unknown): ParsedLead {
  const j = json as Record<string, unknown> | null;
  if (!j || typeof j !== "object" || typeof j.submission_id !== "string") return { kind: "bad_request" };
  const fields = (j.fields ?? {}) as Record<string, string>;
  if (j.company_url) return { kind: "honeypot", form: "start", body: { ok: true, submission_id: j.submission_id } };
  if (!fields.name) {
    return { kind: "reject", status: 422, body: { ok: false, error: { code: "validation", fields: { name: "Enter your name." } } } };
  }
  return {
    kind: "lead",
    form: "start",
    submission_id: j.submission_id,
    payload: fields,
    services: fields.services ? fields.services.split(",") : [],
    source: fields.source || null,
    body: { ok: true, submission_id: j.submission_id },
  };
}
