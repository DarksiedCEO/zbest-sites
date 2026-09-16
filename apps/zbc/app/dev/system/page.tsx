import type { Metadata } from "next";
import { CookieConsent, Footer, Nav, SystemGallery } from "./parts";

/**
 * Phase 2 design-system gallery (Brief §3.2).
 *
 * NOT a site page — unlinked, noindex, and must stay out of sitemap.xml when
 * Phase 3 builds one.
 *
 * The Focus Areas dropdown carries `focus` on its children, which is what makes
 * the Entertainment/Brands accent swap visible in the nav itself rather than
 * only on the pages (§B1: the distinction must read through page accent, nav
 * dropdown, CTA color and card edge).
 */
export const metadata: Metadata = {
  title: "Design system — Z Best Clips",
  robots: { index: false, follow: false },
};

export default function DevSystemPage() {
  return (
    <>
      <Nav
        brandName="Z Best Clips"
        items={[
          {
            label: "Focus Areas",
            href: "/focus-areas",
            children: [
              { label: "Entertainment", href: "/entertainment", focus: "entertainment" },
              { label: "Brands", href: "/brands", focus: "brands" },
            ],
          },
          { label: "How It Works", href: "/how-it-works" },
          { label: "Pricing", href: "/pricing" },
          { label: "Become a Clipper", href: "/become-a-clipper" },
        ]}
        cta={{ label: "Launch a Campaign", href: "/launch-a-campaign" }}
      />

      <main className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide">
        <header className="mb-section">
          <p className="type-label text-accent">Phase 2 — design system</p>
          <h1 className="type-display mt-3">Z Best Clips</h1>
          <p className="type-body-lead mt-5 text-text-secondary">
            Every reusable piece §3.2 calls for, on one page. Unlinked and
            noindex — a development surface, not a site page.
          </p>
        </header>

        <SystemGallery brand="zbc" />

        {/*
          Focus-area accent system (§B1). The two blocks below are identical
          except for data-focus, which is the whole demonstration: Entertainment
          and Brands are structurally different services and must read as
          visually distinct, so the accent is functional rather than decorative.
        */}
        <section id="focus-areas" className="mt-section scroll-mt-24">
          <p className="type-label text-accent">Focus-area accents</p>
          <p className="type-small mt-2 max-w-prose text-text-secondary">
            Same markup, different <code className="type-mono">data-focus</code>.
            Entertainment is rented distribution, Brands is owned — the color is
            carrying that difference, not decorating it.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div data-focus="entertainment" className="border border-text-secondary/20 border-l-2 border-l-accent bg-panel p-6">
              <p className="type-label text-accent">Entertainment</p>
              <p className="type-title mt-2">Rented distribution</p>
              <p className="type-small mt-2 text-text-secondary">
                Clips post from the network&rsquo;s own accounts. Goal: discovery.
              </p>
              <span className="type-label mt-5 inline-block whitespace-nowrap bg-accent px-4 py-2.5 text-base">
                Launch a Campaign
              </span>
            </div>
            <div data-focus="brands" className="border border-text-secondary/20 border-l-2 border-l-accent bg-panel p-6">
              <p className="type-label text-accent">Brands</p>
              <p className="type-title mt-2">Owned distribution</p>
              <p className="type-small mt-2 text-text-secondary">
                Clips post to accounts the business controls. Goal: compounding reach.
              </p>
              <span className="type-label mt-5 inline-block whitespace-nowrap bg-accent px-4 py-2.5 text-base">
                Launch a Campaign
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer
        brandName="Z Best Clips"
        endorsement={{ label: "Z Best Clips, by Z Best Media", href: "https://www.zbestmedia.com" }}
        columns={[
          {
            heading: "Company",
            links: [
              { label: "About", href: "/about" },
              { label: "Media Kit", href: "/media-kit" },
              { label: "Become a Clipper", href: "/become-a-clipper" },
              { label: "Launch a Campaign", href: "/launch-a-campaign" },
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
        ]}
      />

      <CookieConsent />
    </>
  );
}
