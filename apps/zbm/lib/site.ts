import type { FooterColumn, NavItem, SiteIdentity } from "@zbest/ui";

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

/** §A2. Work is removed until one named client exists (decided Sep 13). */
export const NAV_ITEMS: NavItem[] = [
  { label: "Digital Advertising", href: "/digital-advertising" },
  { label: "Revenue Recovery", href: "/revenue-recovery" },
  { label: "Out-of-Home", href: "/out-of-home" },
  { label: "Z Best Clips", href: ZBC_ORIGIN },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * §A3. Blog joins Resources with the first post; Work joins Company with the
 * first named client. Neither is here until then.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "Digital Advertising", href: "/digital-advertising" },
      { label: "Revenue Recovery", href: "/revenue-recovery" },
      { label: "Out-of-Home", href: "/out-of-home" },
      { label: "Z Best Clips", href: ZBC_ORIGIN, external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
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
 * Legal shells are built but NOT indexable: they are placeholders marked "Not
 * yet in effect" (§5), and a search result must not present one as the
 * company's policy. They become indexable with attorney-approved text (§8).
 */
export const ROUTES: Route[] = [
  { path: "/", built: true, indexable: true },
  { path: "/digital-advertising", built: false, indexable: true },
  { path: "/revenue-recovery", built: false, indexable: true },
  { path: "/out-of-home", built: false, indexable: true },
  { path: "/about", built: false, indexable: true },
  { path: "/contact", built: false, indexable: true },
  { path: "/faq", built: false, indexable: true },
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
