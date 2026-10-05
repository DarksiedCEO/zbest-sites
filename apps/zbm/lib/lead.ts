import { z } from "zod";
import { INTAKE_SERVICE_VALUES } from "@/content/services";

/**
 * Lead form contract (Brief §6.1, §6.2), shared by the route handler and the
 * client adapter so the two cannot disagree about a field.
 *
 * Form names and field names live here and nowhere else (Backend Spec §9:
 * enums are never hard-coded into components).
 */
export const LEAD_FORMS = ["contact", "assessment", "start"] as const;
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

/**
 * Universal intake (/start, amendment Oct 4 2026). Budget and timing are
 * optional and coarse on purpose: enough to route and size a reply, not a
 * qualification gate. Values live here, labels in components/lead-form.tsx.
 */
export const INTAKE_BUDGETS = ["under-5k", "5k-25k", "25k-100k", "100k-plus", "not-sure"] as const;
export const INTAKE_TIMINGS = ["asap", "30-days", "1-3-months", "exploring"] as const;

/**
 * Campaign/source tag carried from ?src= or ?utm_campaign= — never free text.
 * Case-insensitive on the way in, stored lowercase, so BB-I405 and bb-i405
 * count as one campaign.
 */
export const SOURCE_TAG = /^[a-z0-9][a-z0-9._-]{0,63}$/i;

/** Optional fields: whitespace-only counts as empty, then empty or valid. */
const blankOr = <T extends z.ZodType<unknown, string>>(schema: T) =>
  z.string().trim().pipe(z.union([z.literal(""), schema]));

/** The custom message sits on the union: an inner one is discarded by it. */
const optionalChoice = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.string().trim().pipe(z.union([z.literal(""), z.enum(values)], { error: message }));

/** "a,b,c" from the checkbox group → a de-duplicated list of known services. */
const intakeServices = z
  .string()
  .transform((raw) => [...new Set(raw.split(",").map((v) => v.trim()).filter(Boolean))])
  .pipe(
    z
      .array(z.enum(INTAKE_SERVICE_VALUES, { error: "Choose from the list." }))
      .min(1, "Pick at least one — or “Not sure yet.”")
      .max(INTAKE_SERVICE_VALUES.length),
  );

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
  // Universal intake: What do you need? · Name · Business · Best way to reach you
  // · Website (optional) · Budget (optional) · Timing (optional) · Details (optional)
  start: z.object({
    services: intakeServices,
    name: text(200, "Enter your name."),
    business: text(200, "Enter your business name."),
    reach: text(300, "Tell us the best way to reach you."),
    website: blankOr(website),
    budget: optionalChoice(INTAKE_BUDGETS, "Choose a budget range from the list."),
    timing: optionalChoice(INTAKE_TIMINGS, "Choose a timing from the list."),
    details: z.string().trim().max(5000, "Keep this under 5000 characters."),
    // Hidden attribution tag: a bad value is dropped, never shown as an error
    // the visitor cannot see or fix.
    source: blankOr(z.string().regex(SOURCE_TAG).transform((v) => v.toLowerCase())).catch(""),
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

export type { LeadResponse } from "@zbest/ui/lead";
