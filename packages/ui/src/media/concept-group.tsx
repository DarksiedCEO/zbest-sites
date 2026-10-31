import type { ReactNode } from "react";
import type { AssetId } from "./assets";
import { ConceptBadge } from "./concept-badge";

/**
 * One label for a set of crops cut from one badged source (amendment §3.2.5,
 * founder ruling 2026-10-30): "Concept — 6 clips cut from one source". The
 * crops inside render with `badge="group"` and carry no badge of their own.
 * Every frame inside must be a crop of `source`; CI checks that.
 */
export function ConceptGroup({
  source,
  count,
  noun = "clips",
  className = "",
  children,
}: {
  source: AssetId;
  count: number;
  noun?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-concept-group={source} className={className}>
      {children}
      <div className="mt-2 border-t border-text-secondary/30 pt-2">
        <ConceptBadge data-concept-group-badge>{`Concept — ${count} ${noun} cut from one source`}</ConceptBadge>
      </div>
    </div>
  );
}
