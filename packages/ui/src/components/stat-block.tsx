import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

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
  return (
    <dl className={`w-full ${className}`}>
      <LedgerRule />
      {rows.map((row, i) => (
        <div key={i}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-ledger">
            <dt className="type-label text-text-secondary">{row.label}</dt>
            <dd className="type-mono text-right text-text-primary">
              {row.value}
            </dd>
          </div>
          <LedgerRule emphasis={i === rows.length - 1} />
        </div>
      ))}
    </dl>
  );
}
