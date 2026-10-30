import type { ConsentCategory } from "@zbest/ui";

/**
 * Z Best Clips cookie-banner copy. ZBC's legal pages are still outlines
 * (CLAUDE.md), so its banner keeps the placeholder rows and the draft label.
 * Moved here from the shared component so none of it reaches Z Best Media's
 * bundle.
 */
export const ZBC_CONSENT_SUMMARY =
  "We use strictly necessary cookies to run the site. Analytics and advertising cookies are optional and off unless you accept them.";

export const ZBC_CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    name: "Strictly necessary",
    body: "Required for the site to function. Cannot be switched off. Placeholder description.",
  },
  {
    name: "Analytics",
    body: "Traffic measurement so we can see which pages do their job. Placeholder description.",
  },
  {
    name: "Advertising",
    body: "Used to measure and retarget advertising campaigns. Placeholder description.",
  },
];

export const ZBC_CONSENT_DETAIL_NOTICE = "Draft — pending attorney review. Not yet in effect.";
