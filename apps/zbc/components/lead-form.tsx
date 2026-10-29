import { LeadForm as SharedLeadForm, type LeadField } from "@zbest/ui/lead";
import { FOCUS_OPTIONS, PLATFORMS, type LeadForm as LeadFormName } from "@/lib/lead";

/** Labels are the §6.1 field names, verbatim. */
const FIELDS: Record<LeadFormName, LeadField[]> = {
  campaign: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "organization", label: "Organization", autoComplete: "organization" },
    { name: "promoting", label: "What are you promoting?", kind: "textarea" },
    { name: "focus", label: "Entertainment / Brands", kind: "select", options: [...FOCUS_OPTIONS] },
    { name: "budget", label: "Budget range", optional: true },
    { name: "reach", label: "Best way to reach you" },
  ],
  clipper: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "email", label: "Email", kind: "email", autoComplete: "email" },
    { name: "platform", label: "Primary platform", kind: "select", options: [...PLATFORMS] },
    { name: "profile", label: "Profile link", kind: "url", optional: true },
  ],
};

/** Z Best Clips' two §6.1 forms on the shared lead form. */
export function LeadForm({ form, submitLabel }: { form: LeadFormName; submitLabel: string }) {
  return <SharedLeadForm form={form} fields={FIELDS[form]} submitLabel={submitLabel} />;
}
