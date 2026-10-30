import type { Metadata } from "next";
import { SystemGallery } from "./parts";

/**
 * Phase 2 design-system gallery (Brief §3.2).
 *
 * NOT a site page. It is absent from nav, footer and every internal link, and
 * carries robots noindex — the same discoverability posture as Search
 * Intelligence (§A4), for a different reason: this one is a development
 * surface, not a staged reveal. It is kept out of sitemap.xml and robots.txt
 * (lib/site.ts).
 *
 * Nav, Footer and CookieConsent come from the root layout since Phase 3.
 */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function DevSystemPage() {
  return (
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
  );
}
