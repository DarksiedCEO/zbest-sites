import type { ComponentProps } from "react";

export const CONCEPT_LABEL = "Concept — not a client campaign";

/**
 * Labels work made for an invented sample brand (FD-VISUAL-01 §3.2.5). A
 * sibling of IllustrativeBadge — mono, uppercase, hairline-bordered. It sits
 * in the caption strip directly under the asset's frame — on the frame, never
 * in a footnote, and never over the creative's own type.
 *
 * `children` replaces the label only for a ConceptGroup's shared label.
 *
 * `compact` is for frames too small for the full line: it shows "Concept" and
 * keeps the full label for assistive tech and hover.
 */
export function ConceptBadge({
  compact = false,
  className = "",
  children,
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
        (children ?? CONCEPT_LABEL)
      )}
    </span>
  );
}
