import type { FooterColumn, NavItem, SiteIdentity } from "@zbest/ui";

/**
 * Z Best Clips site configuration — the one place the nav, footer, sitemap and
 * canonical host are defined (Brief §B2, §B3, §3.3).
 */

/** Own domain, not a ZBM subdomain (§1.1, decided Sep 7). */
export const SITE: SiteIdentity = {
  name: "Z Best Clips",
  origin: "https://zbestclips.com",
  description: "One source. Dozens of clips. Real reach.",
};

/** Canonical ZBM host is www (founder decision 3, Phase 1 close). */
export const ZBM_ORIGIN = "https://www.zbestmedia.com";

/** §B1, §B3 — under the wordmark in the footer, linking to the ZBM site. */
export const ENDORSEMENT = { label: "Z Best Clips, by Z Best Media", href: ZBM_ORIGIN };

/**
 * §B2. Each Focus Areas entry carries its focus, which is what colors its
 * dropdown marker (§B1). Work/Results is deferred until real campaign results
 * exist (decided Sep 7).
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Focus Areas",
    children: [
      { label: "Entertainment", href: "/entertainment", focus: "entertainment" },
      { label: "Brands", href: "/brands", focus: "brands" },
    ],
  },
  // "/" serves How It Works (founder decision, Phase 4); /how-it-works redirects.
  { label: "How It Works", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Become a Clipper", href: "/become-a-clipper" },
];

/** §B2 — the primary CTA, button-styled. */
export const NAV_CTA = { label: "Launch a Campaign", href: "/launch-a-campaign" };

/**
 * §B3 launch configuration. Services, Campaigns and Platforms columns arrive
 * post-launch in batches, and Blog joins Resources with the first post — the
 * Footer grid is column-count driven, so each is an entry here and nothing else.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Become a Clipper", href: "/become-a-clipper" },
      { label: "Launch a Campaign", href: "/launch-a-campaign" },
      // §B3: Contact goes to the Launch a Campaign form.
      { label: "Contact", href: "/launch-a-campaign" },
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
 * Every linked route, and the sitemap's only source. Listed in sitemap.xml
 * when built AND indexable; the gate requests every listed URL and fails on
 * anything but a 200.
 *
 * Legal pages are built but NOT indexable: they are outlines until Z Best Clips
 * publishes its terms, and must not surface in search as the company's terms.
 */
export const ROUTES: Route[] = [
  // How It Works (founder decision, Phase 4: "/" serves it).
  { path: "/", built: true, indexable: true },
  { path: "/entertainment", built: true, indexable: true },
  { path: "/brands", built: true, indexable: true },
  { path: "/pricing", built: true, indexable: true },
  { path: "/become-a-clipper", built: true, indexable: true },
  { path: "/launch-a-campaign", built: true, indexable: true },
  { path: "/about", built: true, indexable: true },
  { path: "/media-kit", built: true, indexable: true },
  { path: "/faq", built: true, indexable: true },
  { path: "/legal/privacy-policy", built: true, indexable: false },
  { path: "/legal/terms-of-service", built: true, indexable: false },
  { path: "/legal/cookie-policy", built: true, indexable: false },
];

/*
 * NEVER LISTED — not in ROUTES, nav, footer, sitemap.xml, robots.txt, or any
 * internal link:
 *
 *   /dev/*   Development surfaces (Phase 2 gallery, Phase 3 focus specimens),
 *            noindex. Not named in robots.txt: a crawler barred by Disallow
 *            never reads the noindex.
 */
