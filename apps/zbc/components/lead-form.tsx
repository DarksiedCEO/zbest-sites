import { LeadForm as SharedLeadForm, type LeadField } from "@zbest/ui/lead";
import { FOCUS_OPTIONS, PLATFORMS, type LeadForm as LeadFormName } from "@/lib/lead";

/** The "State or territory" select: the service-area rule, on every form. */
const REGION_FIELD: LeadField = { name: "region", label: "State or territory", kind: "region" };

/** Labels are the §6.1 field names, verbatim. */
const FIELDS: Record<LeadFormName, LeadField[]> = {
  campaign: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "organization", label: "Organization", autoComplete: "organization" },
    REGION_FIELD,
    { name: "promoting", label: "What are you promoting?", kind: "textarea" },
    { name: "focus", label: "Entertainment / Brands", kind: "select", options: [...FOCUS_OPTIONS] },
    { name: "budget", label: "Budget range", optional: true },
    { name: "reach", label: "Best way to reach you" },
  ],
  clipper: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "email", label: "Email", kind: "email", autoComplete: "email" },
    REGION_FIELD,
    { name: "platform", label: "Primary platform", kind: "select", options: [...PLATFORMS] },
    { name: "profile", label: "Profile link", kind: "url", optional: true },
  ],
};

/** Z Best Clips' two §6.1 forms on the shared lead form. */
export function LeadForm({ form, submitLabel }: { form: LeadFormName; submitLabel: string }) {
  return <SharedLeadForm form={form} fields={FIELDS[form]} submitLabel={submitLabel} />;
}
