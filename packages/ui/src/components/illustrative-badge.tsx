import type { ComponentProps } from "react";

/**
 * Marks a number or example that is not a real client result.
 *
 * Brief §9 calls this a stated integrity standard rather than a suggestion, and
 * §7 requires it anywhere a figure exists without a verified source. It is
 * deliberately legible instead of subtle — a badge nobody notices fails its only
 * job.
 */
export function IllustrativeBadge({
  children = "Illustrative example — not a client result",
  className = "",
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={`type-label inline-flex items-center gap-2 border border-text-secondary/35 px-2 py-1 text-text-secondary ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="inline-block size-1.5 bg-accent" />
      {children}
    </span>
  );
}
