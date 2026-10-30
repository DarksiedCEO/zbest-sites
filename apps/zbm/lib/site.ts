import type { FooterColumn, NavItem, SiteIdentity } from "@zbest/ui";
import { SERVICES } from "@/content/services";

/**
 * Z Best Media site configuration — the one place the nav, footer, sitemap and
 * canonical host are defined (Brief §A2, §A3, §3.3).
 */

/** Canonical host is www (founder decision 3, Phase 1 close). */
export const SITE: SiteIdentity = {
  name: "Z Best Media",
  origin: "https://www.zbestmedia.com",
  description: "Advertising you can audit.",
};

/** Z Best Clips lives on its own domain, not a subdomain (§1.1, decided Sep 7). */
export const ZBC_ORIGIN = "https://zbestclips.com";

/**
 * Where every "Get an Assessment" CTA points: the §6.1 request form at the
 * foot of Revenue Recovery (founder decision, Phase 4).
 */
export const ASSESSMENT_HREF = "/revenue-recovery#assessment";

/**
 * Primary nav. AMENDED Oct 4, 2026 (docs/BRIEF-AMENDMENT-2026-10-04-full-service.md):
 * the Brief's four-discipline menu (§A2) is replaced by a Services dropdown
 * listing everything Z Best Media sells, with Revenue Recovery and Z Best Clips
 * kept at the top level. Still a short top-level menu with depth exactly one
 * layer down (§A2, decided Sep 7). Work stays out until one named client
 * exists (decided Sep 13).
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Services",
    children: [
      { label: "All Services", href: "/services" },
      ...SERVICES.map((s) => ({ label: s.name, href: s.href })),
    ],
  },
  { label: "Revenue Recovery", href: "/revenue-recovery" },
  { label: "Z Best Clips", href: ZBC_ORIGIN },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** The nav's primary action: the universal intake (amendment Oct 4, 2026). */
export const NAV_CTA = { label: "Start a Project", href: "/start" };

/**
 * §A3. Blog joins Resources with the first post; Work joins Company with the
 * first named client. Neither is here until then.
 */
/** Build-time flag for the reserved "Your Privacy Choices" footer link. */
const PRIVACY_CHOICES = process.env.NEXT_PUBLIC_PRIVACY_CHOICES === "1";

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Services",
    // Amended Oct 4, 2026: every service, from the catalog.
    links: [
      ...SERVICES.map((s) => ({ label: s.name, href: s.href, ...(s.external ? { external: true } : {}) })),
      { label: "All Services", href: "/services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Start a Project", href: "/start" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { heading: "Resources", links: [{ label: "FAQ", href: "/faq" }] },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-of-service" },
      { label: "Cookie Settings", href: "/legal/cookie-policy" },
      // Reserved slot (privacy sweep 2026-10-30, F9): CCPA's "Your Privacy
      // Choices" link is needed only if the site ever sells or shares
      // personal information. Off unless NEXT_PUBLIC_PRIVACY_CHOICES=1 at
      // build time; the target anchor belongs to the Privacy Policy.
      ...(PRIVACY_CHOICES ? [{ label: "Your Privacy Choices", href: "/legal/privacy-policy#your-privacy-choices" }] : []),
    ],
  },
];

type Route = {
  path: string;
  /** The page exists in this build. Pages land in Phase 4 (§3.4). */
  built: boolean;
  /** Eligible for search engines once built. */
  indexable: boolean;
};

/**
 * Every linked route, and the sitemap's only source. A route is listed in
 * sitemap.xml when it is both built and indexable — the gate requests every
 * listed URL and fails on anything but a 200, so flipping `built` early is
 * caught.
 *
 * Legal pages are built but NOT indexable. Since Andre's Oct 30 2026 decision
 * they carry real, in-effect text (lib/legal.ts); they stay noindex until the
 * bracketed placeholders are filled, then flipping `indexable` is his call.
 */
export const ROUTES: Route[] = [
  { path: "/", built: true, indexable: true },
  { path: "/digital-advertising", built: true, indexable: true },
  { path: "/revenue-recovery", built: true, indexable: true },
  { path: "/out-of-home", built: true, indexable: true },
  // Amendment Oct 4, 2026: the full-service catalog pages, the hub, and the intake.
  { path: "/services", built: true, indexable: true },
  ...SERVICES.filter((s) => s.page).map((s) => ({ path: s.href, built: true, indexable: true })),
  { path: "/start", built: true, indexable: true },
  { path: "/about", built: true, indexable: true },
  { path: "/contact", built: true, indexable: true },
  { path: "/faq", built: true, indexable: true },
  { path: "/legal/privacy-policy", built: true, indexable: false },
  { path: "/legal/terms-of-service", built: true, indexable: false },
  { path: "/legal/cookie-policy", built: true, indexable: false },
];

/*
 * NEVER LISTED — not in ROUTES, nav, footer, sitemap.xml, robots.txt, or any
 * internal link:
 *
 *   /search-intelligence  Brief §A4: built in Phase 4, unlinked and noindex
 *                         until the reveal (§8 item 9). Not named in robots.txt
 *                         either: a Disallow line would publish the path, and
 *                         would stop crawlers from ever reading its noindex.
 *   /dev/*                Development surfaces (Phase 2 gallery), noindex.
 */
