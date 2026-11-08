import type { ConsentCategory } from "@zbest/ui";
import { ZBC_LEGAL_NOTICE } from "./legal";

/**
 * Z Best Clips cookie-banner copy. It says only what the site does today: the
 * site loads no analytics or advertising tools (shared CSP, no tag code) and
 * keeps one browser-storage item for the banner choice. The detail panel
 * carries the not-yet-accepting-clients notice until ZBC publishes its terms
 * (founder decision, Oct 30 2026: no review-status or draft wording).
 */
export const ZBC_CONSENT_SUMMARY =
  "This site doesn’t use analytics or advertising cookies. We keep one setting in your browser to remember this choice. Optional tools, if we ever add them, stay off unless you accept them.";

export const ZBC_CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    name: "Strictly necessary",
    body: "One item in your browser’s local storage that remembers your choice on this banner. It never leaves your browser.",
  },
  { name: "Analytics", body: "Not used on this site." },
  { name: "Advertising", body: "Not used on this site." },
];

export const ZBC_CONSENT_DETAIL_NOTICE = ZBC_LEGAL_NOTICE;
