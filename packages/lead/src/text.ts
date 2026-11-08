/**
 * Text hygiene for lead submissions (red team 2026-10-30, RTS-7 and RTS-10).
 * No Node-only imports: the forms' shared contracts may import it too.
 *
 * cleanText / cleanJson — before validation and storage:
 *   - NUL (U+0000) is removed: Postgres jsonb refuses it (SQLSTATE 22P05), so
 *     a pasted NUL used to lose the lead behind a "try again" message forever;
 *   - unpaired UTF-16 surrogates are removed: JSON text with one is not valid
 *     Unicode and Postgres refuses it (22P02);
 *   - the result is NFC-normalised, so the same words typed on two systems
 *     compare (and dedupe) equal.
 *
 * neutralizeCell / stripBidi — when visitor text is rendered somewhere a
 * person reads or a spreadsheet parses it (the founder email today, any CSV
 * export later):
 *   - a value starting with = + - @ TAB or CR is prefixed with ' so no
 *     spreadsheet treats it as a formula (OWASP CSV injection guidance);
 *   - bidirectional control characters are removed, so text cannot visually
 *     reorder itself (e.g. disguise a link or a file name).
 */

// eslint-disable-next-line no-control-regex -- matching NUL is the point
const NUL = /\u0000/g;
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
/** LRM, RLM, ALM, LRE, RLE, PDF, LRO, RLO, LRI, RLI, FSI, PDI. */
const BIDI = /[\u200E\u200F\u061C\u202A-\u202E\u2066-\u2069]/g;
const FORMULA_START = /^[=+\-@\t\r]/;

export const cleanText = (value: string): string =>
  value.replace(NUL, "").replace(LONE_SURROGATE, "").normalize("NFC");

/** True when cleanText would change nothing that the database refuses. */
export const storable = (value: string): boolean => !value.includes("\u0000") && !new RegExp(LONE_SURROGATE.source).test(value);

/** Every string — values and object keys — cleaned, at any depth. Other JSON values unchanged. */
export function cleanJson(value: unknown): unknown {
  if (typeof value === "string") return cleanText(value);
  if (Array.isArray(value)) return value.map(cleanJson);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
      // defineProperty: a cleaned "__proto__" key stays an own property, never a prototype.
      Object.defineProperty(out, cleanText(key), { value: cleanJson(inner), enumerable: true, writable: true, configurable: true });
    }
    return out;
  }
  return value;
}

/** Any string anywhere in `value` that the database would refuse. */
export function hasUnstorable(value: unknown): boolean {
  if (typeof value === "string") return !storable(value);
  if (Array.isArray(value)) return value.some(hasUnstorable);
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).some(([k, v]) => !storable(k) || hasUnstorable(v));
  }
  return false;
}

export const stripBidi = (value: string): string => value.replace(BIDI, "");

/** One cell (or one line) as a spreadsheet would read it: bidi controls removed, formulas defused. */
export function neutralizeCell(value: string): string {
  const plain = stripBidi(value);
  return FORMULA_START.test(plain) ? `'${plain}` : plain;
}
