import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

export type LegalPart = {
  /** Only for documents with more than one audience, e.g. ZBC's two Terms. */
  heading?: string;
  /** Section headings only: what the published document will cover. */
  sections: string[];
};

/**
 * Legal page outline for a site whose terms are not published yet (Z Best
 * Clips, until launch). It shows the structure of each document and a notice
 * the app supplies; it never reads as a policy, a promise or a term.
 *
 * Founder decision, Oct 30 2026: no review-status or draft wording on either
 * site. Every visible sentence comes from the app (`notice`, `pendingText`,
 * `issuerText`), so this shared module carries none of its own.
 *
 * The notice is first in <main>, above the title, so it cannot be scrolled
 * past on the way to the content.
 */
export function LegalShell({
  title,
  site,
  parts,
  notice,
  pendingText,
  issuerText,
  children,
}: {
  title: string;
  site: string;
  parts: LegalPart[];
  /** Shown first on the page, e.g. that the site is not accepting clients yet. */
  notice: string;
  /** Shown under each section heading in place of text. */
  pendingText: string;
  /** Shown as the issuer while it is not yet confirmed. */
  issuerText: string;
  /** Page-specific controls, e.g. Cookie Settings on the Cookie Policy. */
  children?: ReactNode;
}) {
  let n = 0;
  return (
    <main id="main" className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide">
      <div
        role="note"
        aria-label="Legal page notice"
        data-legal-notice
        className="border border-accent bg-panel px-5 py-4"
      >
        <p className="type-label text-accent">{notice}</p>
      </div>

      <header className="mt-stack max-w-3xl">
        <p className="type-label text-text-secondary">Legal · {site}</p>
        <h1 className="type-headline mt-3">{title}</h1>
        <p className="type-small mt-4 text-text-secondary">
          Issued by:{" "}
          <span data-placeholder className="type-mono text-text-primary">
            {issuerText}
          </span>
        </p>
      </header>

      {children ? <div className="mt-stack">{children}</div> : null}

      <div className="mt-stack max-w-3xl">
        {parts.map((part) => (
          <section key={part.heading ?? "document"} className="mt-stack first:mt-0">
            {part.heading ? (
              <h2 className="type-title mb-4">{part.heading}</h2>
            ) : null}
            <LedgerRule />
            <ol>
              {part.sections.map((heading, i) => {
                n += 1;
                return (
                  <li key={heading}>
                    <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-ledger sm:grid-cols-[3.5rem_1fr]">
                      <span className="type-mono text-text-secondary">
                        {String(n).padStart(2, "0")}
                      </span>
                      <div>
                        {/* h2 when the part has no heading of its own, so the outline never skips h1 → h3 (WCAG 1.3.1). */}
                        {part.heading ? (
                          <h3 className="type-body font-semibold">{heading}</h3>
                        ) : (
                          <h2 className="type-body font-semibold">{heading}</h2>
                        )}
                        <p
                          data-placeholder
                          className="type-small mt-1.5 text-text-secondary"
                        >
                          {pendingText}
                        </p>
                      </div>
                    </div>
                    <LedgerRule emphasis={i === part.sections.length - 1} />
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
