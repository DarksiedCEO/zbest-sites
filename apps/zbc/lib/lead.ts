import { FOCUS_AREAS } from "@zbest/ui";
import { z } from "zod";

// No eval feature-check under the CSP (packages/ui/src/security-headers.ts).
z.config({ jitless: true });

/**
 * Z Best Clips lead form contract (Brief §6.1, §6.2), shared by the route
 * handler and the form so the two cannot disagree about a field. Form names,
 * field names and option lists live here and nowhere else (Backend Spec §9).
 */
export const LEAD_FORMS = ["campaign", "clipper"] as const;
export type LeadForm = (typeof LEAD_FORMS)[number];

/** §B4: the three platforms campaigns post to. */
export const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram-reels", label: "Instagram Reels" },
  { value: "youtube-shorts", label: "YouTube Shorts" },
] as const;

export const FOCUS_OPTIONS = [
  { value: "entertainment", label: "Entertainment" },
  { value: "brands", label: "Brands" },
] as const satisfies { value: (typeof FOCUS_AREAS)[number]; label: string }[];

const text = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters.`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max} characters.`).optional().default("");

const choice = <T extends readonly { value: string }[]>(options: T, message: string) =>
  z
    .string()
    .refine((v) => options.some((o) => o.value === v), message);

const isUrlOrEmpty = (value: string) => {
  if (value === "") return true;
  try {
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
};

export const LEAD_FIELDS = {
  // §6.1 Launch a Campaign: Name · Organization · What are you promoting? ·
  // Entertainment / Brands · Budget range (optional) · Best way to reach you
  campaign: z.object({
    name: text(200, "Enter your name."),
    organization: text(200, "Enter your organization."),
    promoting: text(5000, "Tell us what you are promoting."),
    focus: choice(FOCUS_OPTIONS, "Choose Entertainment or Brands."),
    budget: optionalText(200),
    reach: text(300, "Tell us the best way to reach you."),
  }),
  // §6.1 Become a Clipper (waitlist): Name · Email · Primary platform ·
  // Profile link (optional)
  clipper: z.object({
    name: text(200, "Enter your name."),
    email: z.string().trim().pipe(z.email("Enter a valid email address.")),
    platform: choice(PLATFORMS, "Choose your primary platform."),
    profile: optionalText(500).refine(isUrlOrEmpty, "Enter a profile link, like tiktok.com/@you."),
  }),
} satisfies Record<LeadForm, z.ZodTypeAny>;

/** §6.2: a client-generated submission_id so a double-click is one lead. */
export const LEAD_ENVELOPE = z.object({
  form: z.enum(LEAD_FORMS),
  submission_id: z.uuid(),
  fields: z.record(z.string(), z.unknown()),
  /** Honeypot (§6.2). Humans never see it; anything in it is a bot. */
  company_url: z.string().optional(),
});

export type { LeadResponse } from "@zbest/ui/lead";
