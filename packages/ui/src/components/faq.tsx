"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

/**
 * Accessible accordion (Brief §3.2). Built on real buttons with
 * aria-expanded/aria-controls rather than a div-and-onClick, so it is keyboard
 * operable and announces its state — §3.6 puts Lighthouse Accessibility ≥ 90 on
 * the launch checklist, and an accordion is the usual place that is lost.
 *
 * Answers stay in the DOM and are hidden with `hidden`, so browser find-in-page
 * behaves and no content depends on JS having run.
 */
export function FAQ({
  items,
  className = "",
}: {
  items: FaqItem[];
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={className}>
      <LedgerRule />
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-baseline justify-between gap-6 py-ledger text-left"
              >
                <span className="type-title">{item.question}</span>
                <span
                  aria-hidden="true"
                  className="type-mono shrink-0 text-accent"
                >
                  {isOpen ? "—" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-ledger"
            >
              <div className="type-body text-text-secondary">{item.answer}</div>
            </div>
            <LedgerRule emphasis={i === items.length - 1} />
          </div>
        );
      })}
    </div>
  );
}
