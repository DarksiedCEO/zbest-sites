import type { ComponentProps } from "react";

export const CONCEPT_LABEL = "Concept — not a client campaign";

/**
 * Labels work made for an invented sample brand (FD-VISUAL-01 §3.2.5). A
 * sibling of IllustrativeBadge — mono, uppercase, hairline-bordered — but it
 * sits on the asset's frame, never in a footnote, and on a solid base so it
 * stays legible over any image.
 *
 * `compact` is for frames too small for the full line: it shows "Concept" and
 * keeps the full label for assistive tech and hover.
 */
export function ConceptBadge({
  compact = false,
  className = "",
  ...props
}: ComponentProps<"span"> & { compact?: boolean }) {
  return (
    <span
      data-concept-badge
      title={compact ? CONCEPT_LABEL : undefined}
      className={`type-label inline-flex items-center gap-2 border border-text-primary/30 bg-base/90 px-2 py-1 text-text-primary ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="inline-block size-1.5 bg-accent" />
      {compact ? (
        <>
          <span aria-hidden="true">Concept</span>
          <span className="sr-only">{CONCEPT_LABEL}</span>
        </>
      ) : (
        CONCEPT_LABEL
      )}
    </span>
  );
}
