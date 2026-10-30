import { FAQ, type FaqItem } from "../components/faq";
import { LedgerRule } from "../components/ledger-rule";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Page furniture shared by both sites (Phase 4; moved here from apps/zbm when
 * the ZBC chunk started, so the two sites cannot drift). Every page is a ledger:
 * a monumental header, then sections opened by an emphasis rule, with the
 * section's label and headline in a narrow left column and the rows in a wide
 * right one — claim left, evidence right, stacking at 390.
 */

const FRAME = "mx-auto max-w-[90rem] px-gutter lg:px-gutter-wide";

export function PageHeader({
  label,
  title,
  children,
  aside,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  /** Right column on desktop, below the claim on mobile. */
  aside?: ReactNode;
}) {
  return (
    <header className={`${FRAME} pt-section pb-4 lg:pt-section-lg`}>
      <div className={aside ? "grid gap-stack lg:grid-cols-12 lg:gap-x-10" : ""}>
        <div className={aside ? "lg:col-span-7" : ""}>
          <p className="type-label text-accent">{label}</p>
          <h1 className="type-display mt-4 max-w-5xl">{title}</h1>
          {children ? <div className="mt-stack flex flex-col gap-5">{children}</div> : null}
        </div>
        {aside ? <div className="lg:col-span-5 lg:pt-10">{aside}</div> : null}
      </div>
    </header>
  );
}

export function PageSection({
  id,
  label,
  title,
  intro,
  children,
  band = false,
}: {
  id?: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** Panel-surface band for the one featured section on a page. */
  band?: boolean;
}) {
  const inner = (
    <div className={FRAME}>
      <LedgerRule emphasis />
      <div className="grid gap-stack pt-stack lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <p className="type-label text-text-secondary">{label}</p>
          {title ? <h2 className="type-headline mt-3">{title}</h2> : null}
        </div>
        <div className="flex flex-col gap-stack lg:col-span-8">
          {intro ? <div className="flex flex-col gap-4">{intro}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${band ? "mt-section bg-panel py-section lg:mt-section-lg lg:py-section-lg" : "mt-section lg:mt-section-lg"}`}
    >
      {inner}
    </section>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="type-body-lead text-text-secondary">{children}</p>;
}

export function Body({ children }: { children: ReactNode }) {
  return <p className="type-body text-text-secondary">{children}</p>;
}

export type LedgerItem = {
  title: string;
  body?: ReactNode;
  href?: string;
  external?: boolean;
  /** Label/value pairs under the body, e.g. "Symptom" / "Fix direction". */
  facts?: { label: string; value: ReactNode }[];
};

/** Rows between ledger rules; numbered in mono when `numbered`. */
export function LedgerList({
  items,
  numbered = false,
}: {
  items: LedgerItem[];
  numbered?: boolean;
}) {
  return (
    <ol>
      {items.map((item, i) => {
        const title = item.href ? (
          <Link
            href={item.href}
            className="group"
            {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
          >
            <span className="group-hover:underline underline-offset-4">{item.title}</span>
            {/* Non-breaking join keeps the arrow on the title's last line. */}
            {"\u00a0"}
            <span aria-hidden="true" className="type-mono text-accent">
              {item.external ? "↗" : "→"}
            </span>
          </Link>
        ) : (
          item.title
        );
        const hasDetail = Boolean(item.body || item.facts);
        // A title with nothing beside it takes the whole row rather than
        // wrapping inside a narrow column next to empty space.
        const cols = numbered
          ? hasDetail
            ? "grid-cols-[2.25rem_1fr] sm:grid-cols-[2.75rem_minmax(0,17rem)_1fr]"
            : "grid-cols-[2.25rem_1fr] sm:grid-cols-[2.75rem_1fr]"
          : hasDetail
            ? "sm:grid-cols-[minmax(0,17rem)_1fr]"
            : "";
        return (
          <li key={item.title}>
            {i === 0 ? <LedgerRule /> : null}
            <div
              className={`grid gap-x-8 gap-y-2 py-ledger ${cols}`}
            >
              {numbered ? (
                <span className="type-mono pt-0.5 text-text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <h3 className="type-title">{title}</h3>
              {hasDetail ? (
                <div className={`flex flex-col gap-3 ${numbered ? "col-start-2 sm:col-start-auto" : ""}`}>
                  {item.body ? <div className="type-body text-text-secondary">{item.body}</div> : null}
                  {item.facts ? (
                    <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[9rem_1fr]">
                      {item.facts.map((f) => (
                        <div key={f.label} className="contents">
                          <dt className="type-label pt-1 text-text-secondary">{f.label}</dt>
                          <dd className="type-small text-text-primary">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              ) : null}
            </div>
            <LedgerRule emphasis={i === items.length - 1} />
          </li>
        );
      })}
    </ol>
  );
}

/** Plain bullet-free list between ledger rules, for "what's included" copy. */
export function RuledList({ items }: { items: ReactNode[] }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          {i === 0 ? <LedgerRule /> : null}
          <p className="type-body py-ledger text-text-primary">{item}</p>
          <LedgerRule emphasis={i === items.length - 1} />
        </li>
      ))}
    </ul>
  );
}

export function CtaRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

/**
 * Inline source citation (Brief §A4 Out-of-Home build note: cite the primary
 * source beside the figure). Opens the source in a new tab.
 */
export function Cite({ href, children }: { href: string; children: ReactNode }) {
  return (
    <span className="type-small text-text-secondary">
      {" ("}
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        data-source-cite
        className="underline underline-offset-4"
      >
        {children}
      </a>
      {")"}
    </span>
  );
}

/**
 * Marks a CTA or control that stands in for something not built yet. Uses the
 * same visual language as IllustrativeBadge so a reader learns one signal.
 */
export function FixtureNote({ children }: { children: ReactNode }) {
  return (
    <p data-fixture-note className="type-small flex items-start gap-2 text-text-secondary">
      <span aria-hidden="true" className="mt-[0.45em] inline-block size-1.5 shrink-0 bg-accent" />
      <span>{children}</span>
    </p>
  );
}

/** Same look as FixtureNote, for a note that is not a placeholder. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p data-note className="type-small flex items-start gap-2 text-text-secondary">
      <span aria-hidden="true" className="mt-[0.45em] inline-block size-1.5 shrink-0 bg-accent" />
      <span>{children}</span>
    </p>
  );
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return <FAQ items={items} />;
}
