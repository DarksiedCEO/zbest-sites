import Link from "next/link";
import type { ReactNode } from "react";
import { LedgerRule } from "./ledger-rule";

/**
 * In-effect legal document (founder decision Oct 30 2026, ZBM first).
 *
 * Where LegalShell renders an outline with placeholders, this renders real
 * policy text. The text lives in each app's lib/legal.ts as data; this
 * component only lays it out.
 *
 * Inline syntax inside any string:
 *   [Link text](/path)      an internal link (site-relative paths only;
 *                           "//host" is not a link and renders as text)
 *   [UPPER CASE TOKEN]      a fact still to be supplied. Rendered visibly
 *                           marked with data-placeholder so it can never pass
 *                           for real text, and found by legalPlaceholders()
 *                           so a production build can refuse to ship one.
 */

export type LegalBlock =
  | { p: string }
  | { list: string[] }
  | { table: { caption: string; head: string[]; rows: string[][] } };

export type LegalSection = {
  /** Anchor id, stable across edits so links into a section keep working. */
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type InEffectLegalDocument = {
  title: string;
  /** One line under the title, e.g. what the document covers. */
  subtitle: string;
  /** "The short version" — plain-English bullets. Not a substitute for the text. */
  summary: string[];
  sections: LegalSection[];
};

/** A placeholder is a bracketed token of capitals that is not a link label. */
const PLACEHOLDER = /\[([A-Z0-9][A-Z0-9 ,.'’/&—()-]*)\](?!\()/g;
const TOKEN = /\[([^\]]+)\]\((\/(?!\/)[^)\s]*)\)|\[([A-Z0-9][A-Z0-9 ,.'’/&—()-]*)\](?!\()/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (m[1] !== undefined && m[2] !== undefined) {
      out.push(
        <Link key={at} href={m[2]} className="underline underline-offset-4">
          {m[1]}
        </Link>,
      );
    } else {
      out.push(
        <mark
          key={at}
          data-placeholder
          className="type-mono bg-transparent px-0.5 text-accent outline outline-1 outline-accent"
        >
          [{m[3]}]
        </mark>,
      );
    }
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Every unfilled placeholder in the given strings, de-duplicated, in order. */
export function legalPlaceholders(strings: readonly string[]): string[] {
  const found = new Set<string>();
  for (const s of strings) for (const m of s.matchAll(PLACEHOLDER)) found.add(`[${m[1]}]`);
  return [...found];
}

/** Every string a document renders, for legalPlaceholders(). */
export function legalDocumentStrings(doc: InEffectLegalDocument): string[] {
  const strings = [doc.title, doc.subtitle, ...doc.summary];
  for (const s of doc.sections) {
    strings.push(s.heading);
    for (const b of s.blocks) {
      if ("p" in b) strings.push(b.p);
      else if ("list" in b) strings.push(...b.list);
      else strings.push(b.table.caption, ...b.table.head, ...b.table.rows.flat());
    }
  }
  return strings;
}

export function LegalDocument({
  doc,
  site,
  issuer,
  effectiveDate,
  lastUpdated,
  children,
}: {
  doc: InEffectLegalDocument;
  site: string;
  /** The legal entity issuing the document. May be a placeholder token. */
  issuer: string;
  effectiveDate: string;
  lastUpdated: string;
  /** Page-specific controls, e.g. Cookie Settings on the Cookie Policy. */
  children?: ReactNode;
}) {
  return (
    <main
      id="main"
      data-legal-document
      className="mx-auto max-w-[90rem] px-gutter py-section lg:px-gutter-wide"
    >
      <header className="max-w-3xl">
        <p className="type-label text-text-secondary">Legal · {site}</p>
        <h1 className="type-headline mt-3">{doc.title}</h1>
        <p className="type-body mt-4 text-text-secondary">{inline(doc.subtitle)}</p>
        <dl className="type-small mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-text-secondary">
          <dt>Issued by</dt>
          <dd data-legal-issuer className="text-text-primary">
            {inline(issuer)}
          </dd>
          <dt>Effective</dt>
          <dd data-legal-effective className="text-text-primary">
            {inline(effectiveDate)}
          </dd>
          <dt>Last updated</dt>
          <dd className="text-text-primary">{inline(lastUpdated)}</dd>
        </dl>
      </header>

      {children ? <div className="mt-stack">{children}</div> : null}

      <section aria-labelledby="legal-short-version" className="mt-stack max-w-3xl border border-text-secondary/25 bg-panel px-5 py-5">
        <h2 id="legal-short-version" className="type-title">
          The short version
        </h2>
        <ul className="type-body mt-3 list-disc space-y-2 pl-5">
          {doc.summary.map((s) => (
            <li key={s}>{inline(s)}</li>
          ))}
        </ul>
        <p className="type-small mt-3 text-text-secondary">
          This summary helps you find your way. The full text below is what applies.
        </p>
      </section>

      <nav aria-label={`${doc.title} contents`} className="mt-stack max-w-3xl">
        <p className="type-label text-text-secondary">Contents</p>
        <ol className="type-small mt-3 grid gap-1.5 sm:grid-cols-2">
          {doc.sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="underline-offset-4 hover:underline">
                <span className="type-mono text-text-secondary">{String(i + 1).padStart(2, "0")}</span>{" "}
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-stack max-w-3xl">
        <LedgerRule />
        {doc.sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
            <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-ledger sm:grid-cols-[3.5rem_1fr]">
              <span className="type-mono text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h2 id={`${s.id}-h`} className="type-title">
                  {s.heading}
                </h2>
                <div className="type-body mt-3 space-y-4">
                  {s.blocks.map((b, j) => {
                    if ("p" in b) return <p key={j}>{inline(b.p)}</p>;
                    if ("list" in b)
                      return (
                        <ul key={j} className="list-disc space-y-2 pl-5">
                          {b.list.map((item) => (
                            <li key={item}>{inline(item)}</li>
                          ))}
                        </ul>
                      );
                    return (
                      // No sideways scrolling (WCAG 1.4.10, and no unreachable
                      // scroll box for keyboard users): below the sm breakpoint
                      // each row is a stacked description list; from sm up it is
                      // a table whose cells wrap. Only one is displayed, so
                      // assistive technology meets the content once.
                      <div key={j}>
                        <div className="sm:hidden" data-legal-table-stacked>
                          <p className="type-label mb-2 text-text-secondary">{b.table.caption}</p>
                          <ul className="space-y-3">
                            {b.table.rows.map((row) => (
                              <li key={row[0]} className="border-b border-text-secondary/15 pb-3">
                                <dl className="type-small space-y-1.5">
                                  {row.map((cell, k) => (
                                    <div key={k}>
                                      <dt className="font-semibold">{b.table.head[k]}</dt>
                                      <dd>{inline(cell)}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <table className="type-small hidden w-full border-collapse text-left sm:table">
                          <caption className="type-label mb-2 text-left text-text-secondary">
                            {b.table.caption}
                          </caption>
                          <thead>
                            <tr>
                              {b.table.head.map((h) => (
                                <th key={h} scope="col" className="border-b border-text-secondary/40 py-2 pr-4 align-bottom font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.table.rows.map((row) => (
                              <tr key={row[0]}>
                                {row.map((cell, k) => (
                                  <td key={k} className="border-b border-text-secondary/15 py-2 pr-4 align-top">
                                    {inline(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <LedgerRule emphasis={i === doc.sections.length - 1} />
          </section>
        ))}
      </div>
    </main>
  );
}
