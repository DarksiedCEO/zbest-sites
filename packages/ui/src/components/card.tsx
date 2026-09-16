import type { ComponentProps, ReactNode } from "react";

/**
 * A panel surface with a single-pixel edge. Depth comes from the base-to-panel
 * value step, never from a shadow — a ledger is flat (root DESIGN.md).
 *
 * `accent` draws the left edge in the active brand accent, which is how Z Best
 * Clips carries the Entertainment/Brands distinction down to card level (§B1).
 * Nesting is not supported on purpose: cards inside cards is an anti-reference
 * (§2.2).
 */
export function Card({
  accent = false,
  eyebrow,
  title,
  children,
  className = "",
  ...props
}: {
  accent?: boolean;
  eyebrow?: ReactNode;
  title?: ReactNode;
} & ComponentProps<"div">) {
  return (
    <div
      className={`border border-text-secondary/20 bg-panel p-6 ${accent ? "border-l-2 border-l-accent" : ""} ${className}`}
      {...props}
    >
      {eyebrow ? (
        <p className="type-label mb-3 text-text-secondary">{eyebrow}</p>
      ) : null}
      {title ? <h3 className="type-title mb-2">{title}</h3> : null}
      {children}
    </div>
  );
}
