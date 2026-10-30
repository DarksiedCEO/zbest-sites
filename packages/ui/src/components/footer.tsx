import Link from "next/link";
import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
};

/**
 * Site footer (Brief §A3, §B3).
 *
 * §B3 is explicit that columns must be addable without a layout change — Z Best
 * Clips gains Services, Campaigns and Platforms columns post-launch, and both
 * footers gain Blog with the first post. So the grid is column-count driven
 * rather than hand-placed, and adding an entry to `columns` is the whole edit.
 *
 * `endorsement` carries "Z Best Clips, by Z Best Media" under the ZBC wordmark
 * (§B1, §B3), linking to the ZBM site.
 */
export function Footer({
  brandName,
  columns,
  endorsement,
  className = "",
}: {
  brandName: ReactNode;
  columns: FooterColumn[];
  endorsement?: { label: string; href: string };
  className?: string;
}) {
  return (
    <footer className={`mt-section-lg ${className}`}>
      <LedgerRule />
      <div className="mx-auto max-w-[90rem] px-gutter py-stack lg:px-gutter-wide">
        <div className="flex flex-col gap-stack lg:flex-row lg:justify-between">
          <div>
            <p className="type-title">{brandName}</p>
            {endorsement ? (
              <p className="type-small mt-2 text-text-secondary">
                <Link href={endorsement.href} className="underline-offset-4 hover:underline">
                  {endorsement.label}
                </Link>
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-stack sm:grid-cols-3 lg:flex lg:gap-14">
            {columns.map((column) => (
              <div key={column.heading}>
                {/* A real heading (WCAG 1.3.1): it names the link list below. */}
                <h2 className="type-label mb-3 text-text-secondary">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="type-small text-text-secondary hover:text-text-primary"
                        {...(link.external
                          ? { rel: "noopener noreferrer", target: "_blank" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
