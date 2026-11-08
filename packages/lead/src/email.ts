import { neutralizeCell } from "./text";
import type { LeadApp, LeadEmail, LeadRecord } from "./types";

/**
 * The founder notification (Brief §6.2: "an email … with the payload").
 * Plain text, built only from validated values. The subject uses the form
 * name, the source tag (regex-validated) and the service slugs (an enum), and
 * every line break is stripped from it regardless, so no header can be
 * injected through a field. The body is plain text (never HTML), and the
 * visitor's own words sit inside a labelled fence, every line quoted "> ".
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

/**
 * Every character a mail client might treat as a line break: CRLF, LF, CR,
 * VT, FF, NEL, U+2028, U+2029.
 */
// VT and FF are matched on purpose: some clients render them as breaks.
// eslint-disable-next-line no-control-regex
const LINE_BREAK = /\r\n|[\n\r\u000B\u000C\u0085\u2028\u2029]/;

/**
 * The visitor block, quoted (AEGIS r3 F4): every visitor-supplied line —
 * including continuation lines of a multi-line answer, however they were
 * broken — starts with "> ". A forged fence is then structurally impossible:
 * the real fences are the only lines in the email between the header and the
 * footer that do NOT start with "> ", whatever lookalike characters
 * (blank Hangul fillers, combining marks, box-drawing or spaced dashes) a
 * visitor uses. No character class to keep growing.
 */
export function quoteVisitorBlock(payload: Record<string, unknown>): string[] {
  return Object.entries(payload).flatMap(([key, value]) => {
    // Red team RTS-10: each line of a value is neutralised as a spreadsheet
    // cell would be (a leading = + - @ TAB CR gets a ' prefix) and loses its
    // bidi controls, so a pasted or exported line is never a formula and text
    // cannot reorder itself on screen. Keys are the app's own schema names.
    const [first = "", ...rest] = render(value).split(LINE_BREAK).map(neutralizeCell);
    return [`${key}: ${first}`, ...rest].map((line) => `> ${line}`);
  });
}

/** A reply goes straight to the visitor when they gave an email address. */
function replyAddress(payload: Record<string, unknown>): string | undefined {
  const contact = payload.contact as Record<string, unknown> | undefined;
  for (const candidate of [payload.email, payload.reach, contact?.reach]) {
    if (typeof candidate === "string" && EMAIL.test(candidate.trim())) return candidate.trim();
  }
  return undefined;
}

/**
 * Keys sorted at every depth (AEGIS r2 M2): Postgres jsonb does not keep the
 * submitted key order, so an email built from the request and one built from
 * the stored row must not differ by order — retries under one idempotency key
 * must carry a byte-identical body.
 */
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortDeep((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

export function leadEmail(unsorted: LeadRecord, receivedAt: Date): LeadEmail {
  const record = { ...unsorted, payload: sortDeep(unsorted.payload) as Record<string, unknown> };
  const parts = [`New lead — ${BRAND[record.app]}`, record.form];
  if (record.services.length) parts.push(record.services.join(", "));
  if (record.source) parts.push(`src:${record.source}`);

  const lines = [
    `Form: ${record.form}`,
    `Submission: ${record.submission_id}`,
    `Received: ${receivedAt.toISOString()}`,
    `Source tag: ${record.source ?? "—"}`,
    // An enum code, validated server-side: never visitor free text.
    `Region: ${record.service_area}`,
    ...(record.services.length ? [`Services: ${record.services.join(", ")}`] : []),
    "",
    // Everything between the fences was typed by the visitor and is
    // unverified (AEGIS L7): it can imitate headers or carry links.
    "----- visitor-supplied, unverified -----",
    ...quoteVisitorBlock(record.payload),
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
