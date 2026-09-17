import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * The two CTA weights both sites use: `primary` is filled with the active
 * accent (so ZBC's page focus recolors it), `secondary` is a hairline outline.
 *
 * No hover transition — hover effects on everything is an anti-reference
 * (§2.2). The underline on the secondary label is the only state change.
 */
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: { variant?: "primary" | "secondary" } & ComponentProps<typeof Link>) {
  const look =
    variant === "primary"
      ? "bg-accent text-base"
      : "border border-text-secondary/40 text-text-primary hover:underline underline-offset-4";
  return (
    <Link
      className={`type-label inline-flex shrink-0 items-center whitespace-nowrap px-5 py-3.5 ${look} ${className}`}
      {...props}
    />
  );
}
