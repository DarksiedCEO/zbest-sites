import type { ComponentProps } from "react";

/**
 * A hairline that reads as a ruled line in a ledger, not a decorative divider
 * (Brief §A1). This is the primary structural device on both sites.
 *
 * `emphasis` marks the line that closes a set of rows — the equivalent of the
 * rule under a column of figures.
 */
export function LedgerRule({
  emphasis = false,
  className = "",
  ...props
}: { emphasis?: boolean } & ComponentProps<"hr">) {
  return (
    <hr
      className={`border-0 bg-current ${emphasis ? "h-px text-text-secondary/45" : "h-px text-text-secondary/20"} ${className}`}
      {...props}
    />
  );
}
