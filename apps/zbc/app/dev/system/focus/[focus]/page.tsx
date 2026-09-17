import { Card, FOCUS_AREAS, type Focus } from "@zbest/ui";
import type { Metadata } from "next";

/**
 * Phase 3 specimen of the Entertainment/Brands color-coded system (Brief §B1,
 * §3.3), one page per focus.
 *
 * The real Entertainment and Brands pages are Phase 4. This route shows the
 * mechanism they will use — `data-page-focus` on <main> — acting on the real
 * root-layout nav, CTA, footer and consent banner, so the system is verified
 * before any copy lands on it.
 *
 * Development surface: unlinked, noindex, excluded from sitemap.xml and
 * robots.txt, like the rest of /dev.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return FOCUS_AREAS.map((focus) => ({ focus }));
}

export const metadata: Metadata = {
  title: "Focus system",
  robots: { index: false, follow: false },
};

const MODEL: Record<Focus, { name: string; model: string; note: string }> = {
  entertainment: {
    name: "Entertainment",
    model: "Rented distribution",
    note: "Clips post from the network’s own accounts. Goal: discovery.",
  },
  brands: {
    name: "Brands",
    model: "Owned distribution",
    note: "Clips post to accounts the business controls. Goal: compounding reach.",
  },
};

export default async function FocusSpecimenPage({
  params,
}: {
  params: Promise<{ focus: Focus }>;
}) {
  const { focus } = await params;
  const self = MODEL[focus];
  const other = focus === "entertainment" ? "brands" : "entertainment";

  return (
    <main
      data-page-focus={focus}
      className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide"
    >
      <header className="mb-section">
        <p className="type-label text-accent">Phase 3 — page focus</p>
        <h1 className="type-display mt-3">{self.name}</h1>
        <p className="type-body-lead mt-5 text-text-secondary">
          <code className="type-mono">data-page-focus=&quot;{focus}&quot;</code> on
          this page&rsquo;s main element recolors the whole document: page
          accent, nav CTA, card edge and consent banner. The Focus Areas
          dropdown keeps each entry in its own color on every page.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card accent eyebrow="Card edge — page focus" title={self.model} data-testid="page-card">
          <p className="type-small text-text-secondary">{self.note}</p>
          <span
            data-testid="page-cta"
            className="type-label mt-5 inline-block whitespace-nowrap bg-accent px-4 py-2.5 text-base"
          >
            Launch a Campaign
          </span>
        </Card>

        {/*
          A card scoped to the OTHER focus, on this page. How It Works shows
          both models side by side (§B4), so a page focus must never bleed into
          an explicitly scoped subtree.
        */}
        <Card
          accent
          eyebrow="Card edge — explicit data-focus"
          title={MODEL[other].model}
          data-focus={other}
          data-testid="other-card"
        >
          <p className="type-small text-text-secondary">{MODEL[other].note}</p>
        </Card>
      </div>
    </main>
  );
}
