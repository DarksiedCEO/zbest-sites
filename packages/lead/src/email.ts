import type { LeadApp, LeadEmail, LeadRecord } from "./types";

/**
 * The founder notification (Brief §6.2: "an email … with the payload").
 * Plain text, built only from validated values. The subject uses the form
 * name, the source tag (regex-validated) and the service slugs (an enum), and
 * every line break is stripped from it regardless, so no header can be
 * injected through a field. The body is plain text (never HTML), and the
 * visitor's own words sit inside a labelled fence.
 */

const BRAND: Record<LeadApp, string> = { zbm: "Z Best Media", zbc: "Z Best Clips" };
const EMAIL = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/**
 * A visitor line can never look like a fence: three or more dashes at the
 * start of any line — after any run of horizontal whitespace, invisible or zero-width
 * characters (AEGIS r2 N4) — are defused. `^` with the m flag also matches
 * after \r, U+2028 and U+2029, which mail clients may render as line breaks.
 */
const LEADING_INVISIBLE = "[\\t\\v\\f \\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F\\u3000\\u00AD\\u180E\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\uFEFF]*";
const FENCE_LIKE = new RegExp(`^${LEADING_INVISIBLE}[-\\u2010-\\u2015\\u2212\\uFE58\\uFE63\\uFF0D]{3,}`, "gm");
export const unfence = (s: string) => s.replace(FENCE_LIKE, "- - -");

function render(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return unfence(value);
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
    // Everything between the fences was typed by the visitor and is
    // unverified (AEGIS L7): it can imitate headers or carry links.
    "----- visitor-supplied, unverified -----",
    ...Object.entries(record.payload).map(([key, value]) => `${key}: ${render(value)}`),
    "----- end visitor-supplied -----",
    "",
    "A person reads every submission (/start promise). Reply using the contact above.",
  ];

  return {
    subject: oneLine(parts.join(" · ")).slice(0, 200),
    text: lines.join("\n"),
    replyTo: replyAddress(record.payload),
  };
}
