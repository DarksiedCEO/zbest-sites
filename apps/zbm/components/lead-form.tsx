import { LeadForm as SharedLeadForm, type LeadField } from "@zbest/ui/lead";
import type { LeadForm as LeadFormName } from "@/lib/lead";

/** Labels are the §6.1 field names, verbatim. */
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
};

/** Z Best Media's two §6.1 forms on the shared stub-marked form. */
export function LeadForm({ form, submitLabel }: { form: LeadFormName; submitLabel: string }) {
  return <SharedLeadForm form={form} fields={FIELDS[form]} submitLabel={submitLabel} />;
}
