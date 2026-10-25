import type { LeadApp, LeadEmail, LeadRecord } from "./types";

/**
 * The founder notification (Brief §6.2: "an email … with the payload").
 * Plain text, built only from validated values. The subject uses the form
 * name, the source tag (regex-validated) and the service slugs (an enum), and
 * every line break is stripped from it regardless, so no header can be
 * injected through a field.
 */

const BRAND: Record<LeadApp, string> = { zbm: "Z Best Media", zbc: "Z Best Clips" };
const EMAIL = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function render(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value.join(", ") || "—";
  return JSON.stringify(value, null, 2);
}

/** A reply goes straight to the visitor when they gave an email address. */
function replyAddress(payload: Record<string, unknown>): string | undefined {
  const contact = payload.contact as Record<string, unknown> | undefined;
  for (const candidate of [payload.email, payload.reach, contact?.reach]) {
    if (typeof candidate === "string" && EMAIL.test(candidate.trim())) return candidate.trim();
  }
  return undefined;
}

export function leadEmail(record: LeadRecord, receivedAt: Date): LeadEmail {
  const parts = [`New lead — ${BRAND[record.app]}`, record.form];
  if (record.services.length) parts.push(record.services.join(", "));
  if (record.source) parts.push(`src:${record.source}`);

  const lines = [
    `Form: ${record.form}`,
    `Submission: ${record.submission_id}`,
    `Received: ${receivedAt.toISOString()}`,
    `Source tag: ${record.source ?? "—"}`,
    ...(record.services.length ? [`Services: ${record.services.join(", ")}`] : []),
    "",
    ...Object.entries(record.payload).map(([key, value]) => `${key}: ${render(value)}`),
    "",
    "A person reads every submission (/start promise). Reply using the contact above.",
  ];

  return {
    subject: oneLine(parts.join(" · ")).slice(0, 200),
    text: lines.join("\n"),
    replyTo: replyAddress(record.payload),
  };
}
