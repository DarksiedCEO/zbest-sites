import Link from "next/link";
import { LedgerRule } from "./ledger-rule";

/**
 * 404 body, shared by both apps (Brief §3.3). Nav and footer come from the root
 * layout, so a visitor who lands on a dead address still has the whole site in
 * reach.
 *
 * The brief supplies no copy for this page; the wording is kept to a plain
 * statement of what happened and one way back.
 */
export function NotFoundContent() {
  return (
    <main id="main" className="mx-auto max-w-[90rem] px-gutter py-section-lg lg:px-gutter-wide">
      <p className="type-label text-accent">404</p>
      <h1 className="type-headline mt-3 max-w-3xl">This page isn&rsquo;t here.</h1>
      <p className="type-body-lead mt-5 text-text-secondary">
        The address doesn&rsquo;t match any page on this site.
      </p>
      <LedgerRule className="mt-stack max-w-3xl" />
      <Link
        href="/"
        className="type-label mt-stack inline-block whitespace-nowrap bg-accent px-4 py-2.5 text-base"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
