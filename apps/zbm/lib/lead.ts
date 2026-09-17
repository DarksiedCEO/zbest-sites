import { z } from "zod";

/**
 * Lead form contract (Brief §6.1, §6.2), shared by the route handler and the
 * client adapter so the two cannot disagree about a field.
 *
 * Form names and field names live here and nowhere else (Backend Spec §9:
 * enums are never hard-coded into components).
 */
export const LEAD_FORMS = ["contact", "assessment"] as const;
export type LeadForm = (typeof LEAD_FORMS)[number];

const text = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters.`);

/**
 * Accepts "example.com" as well as "https://example.com": people type a
 * website the way they say it. Anything that still will not parse as a URL
 * is rejected.
 */
const website = z
  .string()
  .trim()
  .min(1, "Enter your website.")
  .max(500, "Keep this under 500 characters.")
  .refine((value) => {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      return url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Enter a website address, like example.com.");

export const LEAD_FIELDS = {
  // §6.1 Contact: Name · Business · What are you looking to solve? · Best way to reach you
  contact: z.object({
    name: text(200, "Enter your name."),
    business: text(200, "Enter your business name."),
    problem: text(5000, "Tell us what you are looking to solve."),
    reach: text(300, "Tell us the best way to reach you."),
  }),
  // §6.1 Get an Assessment: Name · Business · Website · Best way to reach you
  assessment: z.object({
    name: text(200, "Enter your name."),
    business: text(200, "Enter your business name."),
    website,
    reach: text(300, "Tell us the best way to reach you."),
  }),
} satisfies Record<LeadForm, z.ZodTypeAny>;

export type LeadFields<F extends LeadForm> = z.infer<(typeof LEAD_FIELDS)[F]>;

/** §6.2: a client-generated submission_id so a double-click is one lead. */
export const LEAD_ENVELOPE = z.object({
  form: z.enum(LEAD_FORMS),
  submission_id: z.uuid(),
  fields: z.record(z.string(), z.unknown()),
  /** Honeypot (§6.2). Humans never see it; anything in it is a bot. */
  company_url: z.string().optional(),
});

export type LeadResponse =
  | { ok: true; stub: true; submission_id: string }
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "bad_request" } };
