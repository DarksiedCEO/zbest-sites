import { LeadForm as SharedLeadForm, type LeadField } from "@zbest/ui/lead";
import { NOT_SURE, SERVICES } from "@/content/services";
import type { LeadForm as LeadFormName } from "@/lib/lead";

/** Labels for the intake's coarse choices; values live in lib/lead.ts. */
const BUDGET_OPTIONS = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-25k", label: "$5,000–$25,000" },
  { value: "25k-100k", label: "$25,000–$100,000" },
  { value: "100k-plus", label: "$100,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const TIMING_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "30-days", label: "Within 30 days" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "exploring", label: "Just exploring" },
];

/** Labels are the §6.1 field names, verbatim, for the Brief's two forms. */
const FIELDS: Record<LeadFormName, LeadField[]> = {
  contact: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "problem", label: "What are you looking to solve?", kind: "textarea" },
    { name: "reach", label: "Best way to reach you" },
  ],
  assessment: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "website", label: "Website", kind: "url", autoComplete: "url" },
    { name: "reach", label: "Best way to reach you" },
  ],
  // Universal intake (amendment Oct 4, 2026). Options come from the catalog.
  start: [
    {
      name: "services",
      label: "What do you need? Pick everything that applies.",
      kind: "checkboxes",
      options: [
        ...SERVICES.map((s) => ({ value: s.slug, label: s.name, hint: s.summary })),
        { value: NOT_SURE.slug, label: NOT_SURE.name },
      ],
    },
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "reach", label: "Best way to reach you" },
    { name: "website", label: "Website", kind: "url", autoComplete: "url", optional: true },
    { name: "budget", label: "Budget", kind: "select", options: BUDGET_OPTIONS, optional: true },
    { name: "timing", label: "When do you want to start?", kind: "select", options: TIMING_OPTIONS, optional: true },
    { name: "details", label: "Anything we should know?", kind: "textarea", optional: true },
    { name: "source", label: "Source", kind: "hidden" },
  ],
};

/**
 * Z Best Media's forms on the shared stub-marked form. `defaults` pre-fills
 * by field name — the intake uses it to pre-tick the service a campaign link
 * or service page sent the visitor for.
 */
export function LeadForm({
  form,
  submitLabel,
  defaults = {},
}: {
  form: LeadFormName;
  submitLabel: string;
  defaults?: Record<string, string | string[]>;
}) {
  const fields = FIELDS[form].map((f) => (f.name in defaults ? { ...f, defaultValue: defaults[f.name] } : f));
  return <SharedLeadForm form={form} fields={fields} submitLabel={submitLabel} />;
}
