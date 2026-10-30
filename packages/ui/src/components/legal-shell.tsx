import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

/** The exact banner wording Brief §5 requires on every legal page shell. */
export const LEGAL_DRAFT_BANNER = "Draft — pending attorney review. Not yet in effect.";

export type LegalPart = {
  /** Only for documents with more than one audience, e.g. ZBC's two Terms. */
  heading?: string;
  /** Section headings only — the scope an attorney fills, never the language. */
  sections: string[];
};

/**
 * Legal page shell (Brief §5; scope from ZBM-ZBC-Legal-Document-Brief.md).
 *
 * The Legal Document Brief is explicit that none of its language may be
 * published, so a shell carries STRUCTURE only: section headings naming what
 * the attorney-drafted document must cover, each with a marked placeholder
 * where the text will go. Nothing here reads as a policy, a promise or a term.
 *
 * The contracting entity is deliberately a placeholder too — the Legal Brief's
 * cross-cutting note 2 leaves it for the attorney to confirm.
 *
 * The banner is first in <main>, above the title, so it cannot be scrolled past
 * on the way to the content.
 */
export function LegalShell({
  title,
  site,
  parts,
  children,
}: {
  title: string;
  site: string;
  parts: LegalPart[];
  /** Page-specific controls, e.g. Cookie Settings on the Cookie Policy. */
  children?: ReactNode;
}) {
  let n = 0;
  return (
    <main className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide">
      <div
        role="note"
        aria-label="Legal draft notice"
        data-legal-draft-banner
        className="border border-accent bg-panel px-5 py-4"
      >
        <p className="type-label text-accent">{LEGAL_DRAFT_BANNER}</p>
        <p className="type-small mt-2 max-w-prose text-text-secondary">
          This page is a placeholder outline. The text of each section has not
          been written or approved.
        </p>
      </div>

      <header className="mt-stack max-w-3xl">
        <p className="type-label text-text-secondary">Legal · {site}</p>
        <h1 className="type-headline mt-3">{title}</h1>
        <p className="type-small mt-4 text-text-secondary">
          Issued by:{" "}
          <span data-placeholder className="type-mono text-text-primary">
            [Legal entity — pending attorney confirmation]
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
                          [Placeholder — attorney-drafted text pending.]
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
