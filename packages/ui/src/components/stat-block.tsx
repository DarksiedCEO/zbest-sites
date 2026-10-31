import type { ReactNode } from "react";

export type StatRow = {
  label: ReactNode;
  value: ReactNode;
};

/**
 * Label/value rows separated by ledger rules — the hero's right-hand column on
 * Z Best Media (Brief §A4) and the company-facts table on the ZBC media kit
 * (§B4).
 *
 * Values are mono with tabular numerals so figures align down the column; that
 * alignment is the whole point of the device (§A1).
 */
export function StatBlock({
  rows,
  className = "",
}: {
  rows: StatRow[];
  className?: string;
}) {
  // Each <div> directly holds one <dt> and one <dd> (WCAG 1.3.1: a <dl> may
  // contain only dt/dd groups wrapped in div — no <hr>, no nested wrappers),
  // so the ledger rules are drawn as borders matching LedgerRule: a /20
  // hairline above each row and the /45 emphasis rule under the last.
  return (
    <dl className={`w-full ${className}`}>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-text-secondary/20 py-ledger ${
            i === rows.length - 1 ? "border-b border-b-text-secondary/45" : ""
          }`}
        >
          <dt className="type-label text-text-secondary">{row.label}</dt>
          <dd className="type-mono text-right text-text-primary">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
