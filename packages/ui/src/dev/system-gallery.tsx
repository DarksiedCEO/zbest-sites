import type { ReactNode } from "react";
import { Card } from "../components/card";
import { Counter } from "../components/counter";
import { FAQ } from "../components/faq";
import { IllustrativeBadge } from "../components/illustrative-badge";
import { LedgerRule } from "../components/ledger-rule";
import { StatBlock } from "../components/stat-block";

/**
 * Every Phase 2 deliverable on one page (Brief §3.2, the "/dev/system route to
 * see them all" option).
 *
 * Shared by both apps so the two galleries cannot drift apart — the point of
 * the page is to compare brands, which only works if the specimens are
 * identical and only the brand scope differs.
 *
 * Nav, Footer and CookieConsent are rendered by the route rather than here,
 * because they are page furniture that has to sit in its real position.
 */

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="type-label text-accent">{title}</p>
      {note ? (
        <p className="type-small mt-2 max-w-prose text-text-secondary">{note}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const SWATCHES_SHARED = [
  { name: "--text-primary", hex: "#EDEBE6", use: "primary text" },
  { name: "--text-secondary", hex: "#8B8F98", use: "secondary text" },
];

const SWATCHES_ZBM = [
  { name: "--zbm-base", hex: "#0E0F12", use: "page base" },
  { name: "--zbm-panel", hex: "#16181D", use: "panel / card surface" },
  { name: "--zbm-accent", hex: "#C99A4B", use: "muted brass / ledger gold" },
  { name: "--zbm-accent-2", hex: "#4C8C88", use: "desaturated teal — data" },
];

const SWATCHES_ZBC = [
  { name: "--zbc-base", hex: "#0B0D10", use: "page base" },
  { name: "--zbc-panel", hex: "#13151A", use: "panel / card — §B1 amendment" },
  { name: "--zbc-ent", hex: "#FF6B5B", use: "Entertainment accent" },
  { name: "--zbc-brand", hex: "#4C8CFF", use: "Brands accent" },
];

function Swatches({
  rows,
}: {
  rows: { name: string; hex: string; use: string }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((row) => (
        <li key={row.name} className="border border-text-secondary/20">
          <div
            className="h-20 w-full border-b border-text-secondary/20"
            style={{ backgroundColor: row.hex }}
          />
          <div className="p-3">
            <p className="type-mono text-text-primary">{row.hex}</p>
            <p className="type-label mt-1 text-text-secondary">{row.name}</p>
            <p className="type-small mt-1 text-text-secondary">{row.use}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const FAQ_SPECIMEN = [
  {
    question: "Is this accordion keyboard operable?",
    answer:
      "Yes — real buttons with aria-expanded and aria-controls, and the panel stays in the DOM so find-in-page works.",
  },
  {
    question: "Does the counter respect reduced motion?",
    answer:
      "With prefers-reduced-motion the tick is disabled entirely and the final value renders immediately.",
  },
];

export function SystemGallery({ brand }: { brand: "zbm" | "zbc" }) {
  const swatches = brand === "zbm" ? SWATCHES_ZBM : SWATCHES_ZBC;

  return (
    <div className="flex flex-col gap-section">
      <Section
        id="color"
        title="Color tokens"
        note="Brand values resolve through [data-brand]; components only ever read the semantic names."
      >
        <div className="flex flex-col gap-6">
          <Swatches rows={swatches} />
          <Swatches rows={SWATCHES_SHARED} />
        </div>
      </Section>

      <Section
        id="type"
        title="Type scale"
        note="Real scale contrast is a requirement, not a preference — the jump from display to headline is deliberately large."
      >
        <div className="flex flex-col gap-5">
          <p className="type-display">Advertising you can audit</p>
          <LedgerRule />
          <p className="type-headline">Find out where your revenue is going</p>
          <LedgerRule />
          <p className="type-title">One team. Four ways to be seen.</p>
          <LedgerRule />
          <p className="type-body-lead">
            Lead paragraph. Most businesses aren&rsquo;t short on traffic —
            they&rsquo;re losing the traffic they already paid for.
          </p>
          <p className="type-body">
            Body copy. We audit first, show you the leak with real numbers, fix
            it, then scale what&rsquo;s proven.
          </p>
          <p className="type-small">Small copy, used for captions and notes.</p>
          <p className="type-label text-text-secondary">Label — IBM Plex Mono</p>
        </div>
      </Section>

      <Section
        id="numerals"
        title="Tabular numerals"
        note="Every number on both sites is IBM Plex Mono with tabular-nums. The columns below must align exactly; that alignment is the point."
      >
        <div className="type-stat flex flex-col gap-1">
          <span>1,240,000</span>
          <span>340,000</span>
          <span>215,000</span>
          <span>111,111</span>
        </div>
      </Section>

      <Section
        id="ledger-rule"
        title="LedgerRule"
        note="Default weight between rows; emphasis closes a set, like the rule under a column of figures."
      >
        <div className="flex flex-col gap-4">
          <LedgerRule />
          <LedgerRule emphasis />
        </div>
      </Section>

      <Section
        id="stat-block"
        title="StatBlock"
        note="The hero's right-hand column. Non-outcome facts only until a verified figure exists (§A4)."
      >
        <div className="max-w-xl">
          <StatBlock
            rows={[
              { label: "Disciplines", value: "4" },
              { label: "Standard", value: "Audit first. Evidence. Then scale." },
            ]}
          />
        </div>
      </Section>

      <Section
        id="counter"
        title="Counter"
        note="The one signature motion moment. Ticks once on viewport entry, never again; fully disabled under prefers-reduced-motion."
      >
        <div className="flex flex-wrap items-baseline gap-10">
          <p className="type-stat">
            <Counter value={1240000} />
          </p>
          <p className="type-stat">
            <Counter value={84} />
          </p>
        </div>
        <div className="mt-4">
          <IllustrativeBadge />
        </div>
      </Section>

      <Section
        id="card"
        title="Card"
        note="Flat by default — depth is the base-to-panel step, never a shadow. Accent draws the left edge in the active brand accent."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <Card eyebrow="Default" title="Digital Advertising">
            <p className="type-small text-text-secondary">
              Paid social, search, and platform campaigns that bring the traffic.
            </p>
          </Card>
          <Card accent eyebrow="Accent edge" title="Revenue Recovery">
            <p className="type-small text-text-secondary">
              The audit that finds where that traffic leaks — and fixes it.
            </p>
          </Card>
          <Card
            accent
            eyebrow="With badge"
            title="Independent single release"
            {...(brand === "zbc" ? { "data-focus": "brands" as const } : {})}
          >
            <p className="type-stat mb-3">
              <Counter value={1240000} />
            </p>
            <IllustrativeBadge />
          </Card>
        </div>
      </Section>

      <Section
        id="faq"
        title="FAQ"
        note="Accessible accordion — real buttons, aria-expanded/aria-controls, panels kept in the DOM."
      >
        <FAQ items={FAQ_SPECIMEN} />
      </Section>
    </div>
  );
}
