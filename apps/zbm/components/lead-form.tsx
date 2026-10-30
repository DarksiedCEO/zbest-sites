import { LeadForm as SharedLeadForm, type LeadField } from "@zbest/ui/lead";
import Link from "next/link";
import { NOT_SURE, SERVICES } from "@/content/services";
import { INTAKE_BUDGETS, INTAKE_TIMINGS, type LeadForm as LeadFormName } from "@/lib/lead";

/**
 * Labels for the intake's coarse choices. Values come from lib/lead.ts and the
 * Record type makes a value without a label a compile error.
 */
const BUDGET_LABELS: Record<(typeof INTAKE_BUDGETS)[number], string> = {
  "under-5k": "Under $5,000",
  "5k-25k": "$5,000–$25,000",
  "25k-100k": "$25,000–$100,000",
  "100k-plus": "$100,000+",
  "not-sure": "Not sure yet",
};
const TIMING_LABELS: Record<(typeof INTAKE_TIMINGS)[number], string> = {
  asap: "As soon as possible",
  "30-days": "Within 30 days",
  "1-3-months": "In 1–3 months",
  exploring: "Just exploring",
};
const BUDGET_OPTIONS = INTAKE_BUDGETS.map((value) => ({ value, label: BUDGET_LABELS[value] }));
const TIMING_OPTIONS = INTAKE_TIMINGS.map((value) => ({ value, label: TIMING_LABELS[value] }));

/** The "State or territory" select: the service-area rule, on every form. */
const REGION_FIELD: LeadField = { name: "region", label: "State or territory", kind: "region" };

/** Labels are the §6.1 field names, verbatim, for the Brief's two forms. */
const FIELDS: Record<LeadFormName, LeadField[]> = {
  contact: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    REGION_FIELD,
    { name: "problem", label: "What are you looking to solve?", kind: "textarea" },
    { name: "reach", label: "Best way to reach you" },
  ],
  assessment: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "website", label: "Website", kind: "url", autoComplete: "url" },
    REGION_FIELD,
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
    REGION_FIELD,
    { name: "reach", label: "Best way to reach you" },
    { name: "website", label: "Website", kind: "url", autoComplete: "url", optional: true },
    { name: "budget", label: "Budget", kind: "select", options: BUDGET_OPTIONS, optional: true },
    { name: "timing", label: "When do you want to start?", kind: "select", options: TIMING_OPTIONS, optional: true },
    { name: "details", label: "Anything we should know?", kind: "textarea", optional: true },
    { name: "source", label: "Source", kind: "hidden" },
  ],
};

/**
 * Z Best Media's forms on the shared lead form. `defaults` pre-fills
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
  return (
    <>
      <SharedLeadForm form={form} fields={fields} submitLabel={submitLabel} />
      {/*
        Notice at collection (Privacy Policy, in effect Oct 30 2026). The
        assessment carries its own note above the form, so it is not repeated.
      */}
      {form === "assessment" ? null : (
        <p data-collection-notice className="type-small mt-4 text-text-secondary">
          We save what you send so we can reply. See our{" "}
          <Link href="/legal/privacy-policy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </>
  );
}
