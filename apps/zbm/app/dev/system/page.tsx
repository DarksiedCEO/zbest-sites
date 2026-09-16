import type { Metadata } from "next";
import { CookieConsent, Footer, Nav, SystemGallery } from "./parts";

/**
 * Phase 2 design-system gallery (Brief §3.2).
 *
 * NOT a site page. It is absent from nav, footer and every internal link, and
 * carries robots noindex — the same discoverability posture as Search
 * Intelligence (§A4), for a different reason: this one is a development
 * surface, not a staged reveal. It must stay out of sitemap.xml when Phase 3
 * builds one.
 */
export const metadata: Metadata = {
  title: "Design system — Z Best Media",
  robots: { index: false, follow: false },
};

export default function DevSystemPage() {
  return (
    <>
      <Nav
        brandName="Z Best Media"
        items={[
          { label: "Digital Advertising", href: "/digital-advertising" },
          { label: "Revenue Recovery", href: "/revenue-recovery" },
          { label: "Out-of-Home", href: "/out-of-home" },
          { label: "Z Best Clips", href: "https://zbestclips.com" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <main className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide">
        <header className="mb-section">
          <p className="type-label text-accent">Phase 2 — design system</p>
          <h1 className="type-display mt-3">Z Best Media</h1>
          <p className="type-body-lead mt-5 text-text-secondary">
            Every reusable piece §3.2 calls for, on one page. Unlinked and
            noindex — a development surface, not a site page.
          </p>
        </header>

        <SystemGallery brand="zbm" />
      </main>

      <Footer
        brandName="Z Best Media"
        columns={[
          {
            heading: "Services",
            links: [
              { label: "Digital Advertising", href: "/digital-advertising" },
              { label: "Revenue Recovery", href: "/revenue-recovery" },
              { label: "Out-of-Home", href: "/out-of-home" },
              { label: "Z Best Clips", href: "https://zbestclips.com", external: true },
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
        ]}
      />

      <CookieConsent />
    </>
  );
}
