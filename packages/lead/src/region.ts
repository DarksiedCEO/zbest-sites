import { z } from "zod";

// No eval feature-check under the CSP (packages/ui/src/security-headers.ts):
// this module reaches client bundles, possibly before an app's own lib sets it.
z.config({ jitless: true });

/**
 * Service area (founder decision, 2026-10-30 11:50): the 50 US states, the
 * District of Columbia, Puerto Rico and Guam. Nothing else: no Canada, no
 * UK, no other territory or country.
 *
 * Pure and client-safe (no `server-only`), so the forms render their options
 * from the same list the server validates against (Backend Spec §9: option
 * lists are never hard-coded in a component).
 *
 * Self-declared, not geo-IP: the area is what the visitor tells us. The
 * enforcement point is the shared pipeline (pipeline.ts), so no form can
 * forget it: every lead carries a Region, and "Outside these areas" is
 * declined politely before anything is stored or sent. A missing or unknown
 * value is a field error (422), so it is never stored either.
 *
 * Codes are ISO 3166-2 for the states and DC (US-CA, US-DC) and ISO 3166-1
 * alpha-2 for Puerto Rico and Guam (PR, GU), as the founder specified.
 */

export const US_STATES = [
  ["US-AL", "Alabama"], ["US-AK", "Alaska"], ["US-AZ", "Arizona"], ["US-AR", "Arkansas"],
  ["US-CA", "California"], ["US-CO", "Colorado"], ["US-CT", "Connecticut"], ["US-DE", "Delaware"],
  ["US-FL", "Florida"], ["US-GA", "Georgia"], ["US-HI", "Hawaii"], ["US-ID", "Idaho"],
  ["US-IL", "Illinois"], ["US-IN", "Indiana"], ["US-IA", "Iowa"], ["US-KS", "Kansas"],
  ["US-KY", "Kentucky"], ["US-LA", "Louisiana"], ["US-ME", "Maine"], ["US-MD", "Maryland"],
  ["US-MA", "Massachusetts"], ["US-MI", "Michigan"], ["US-MN", "Minnesota"], ["US-MS", "Mississippi"],
  ["US-MO", "Missouri"], ["US-MT", "Montana"], ["US-NE", "Nebraska"], ["US-NV", "Nevada"],
  ["US-NH", "New Hampshire"], ["US-NJ", "New Jersey"], ["US-NM", "New Mexico"], ["US-NY", "New York"],
  ["US-NC", "North Carolina"], ["US-ND", "North Dakota"], ["US-OH", "Ohio"], ["US-OK", "Oklahoma"],
  ["US-OR", "Oregon"], ["US-PA", "Pennsylvania"], ["US-RI", "Rhode Island"], ["US-SC", "South Carolina"],
  ["US-SD", "South Dakota"], ["US-TN", "Tennessee"], ["US-TX", "Texas"], ["US-UT", "Utah"],
  ["US-VT", "Vermont"], ["US-VA", "Virginia"], ["US-WA", "Washington"], ["US-WV", "West Virginia"],
  ["US-WI", "Wisconsin"], ["US-WY", "Wyoming"],
] as const;

/** Every area served, in the order the select shows them. */
export const SERVICE_AREAS = [
  ...US_STATES.map(([value, label]) => ({ value, label })),
  { value: "US-DC", label: "District of Columbia" },
  { value: "PR", label: "Puerto Rico" },
  { value: "GU", label: "Guam" },
] as const;

/** The one option that is declined. */
export const OUTSIDE = { value: "outside", label: "Outside these areas" } as const;

export type ServiceArea = (typeof SERVICE_AREAS)[number]["value"];
/**
 * As posted AND as parsed (no transform), so a value the client already
 * parsed with REGION is still valid when the server parses it again.
 */
export type Region = { state: ServiceArea | typeof OUTSIDE.value };

const AREA_VALUES = [...SERVICE_AREAS.map((a) => a.value), OUTSIDE.value] as unknown as [Region["state"], ...Region["state"][]];

/** The field name on the wire and in the forms (one place, both sides). */
export const REGION_FIELD_NAME = "state";

export const REGION_COPY = {
  label: "State or territory",
  /** Shown under the select, so nobody fills the form to find out. */
  hint: "We currently work with businesses in the 50 US states, the District of Columbia, Puerto Rico and Guam.",
  choose: "Choose your state or territory.",
  /** The polite decline (422 region_unavailable). Says nothing was kept. */
  refused:
    "Sorry — we can only work with businesses in the 50 US states, the District of Columbia, Puerto Rico and Guam right now, so nothing was saved or sent.",
} as const;

/** The region as the forms post it: `state`, one of SERVICE_AREAS or "outside". */
export const REGION = z.object({
  state: z.string({ error: REGION_COPY.choose }).trim().pipe(z.enum(AREA_VALUES, { error: REGION_COPY.choose })),
}) satisfies z.ZodType<Region, unknown>;

/** The founder's rule: served exactly when the area is one of SERVICE_AREAS. */
export function regionServed(region: Region): region is { state: ServiceArea } {
  return region.state !== OUTSIDE.value && (AREA_VALUES as readonly string[]).includes(region.state);
}
