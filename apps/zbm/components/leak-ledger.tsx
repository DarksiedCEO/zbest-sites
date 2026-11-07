import { IllustrativeBadge } from "@zbest/ui";

/**
 * Revenue Recovery hero visual (FD-VISUAL-01 §10, rollout batch 4): the six
 * leaks as a code-drawn ledger — a sample leak report, redacted, with the
 * traffic line running down its left edge and thinning at each leak.
 *
 * No numbers anywhere in it (rollout brief): no figures, no counts, no row
 * numbers. The loss is shown by the line, not quantified. The rows are the
 * same six as the page's "Where revenue leaks" list (content/revenue-recovery.ts),
 * so the two cannot drift apart. Process visual, illustrative: it carries
 * IllustrativeBadge on the sheet's caption strip, never over the drawing.
 *
 * Real text, not a picture of text: screen readers get the six leaks as a list.
 */
export function LeakLedger({ leaks }: { leaks: readonly string[] }) {
  // The traffic line: full width at the top, thinner after every leak.
  const widths = leaks.map((_, i) => 10 - (i * 7) / leaks.length);
  const after = 10 - 7;

  return (
    <figure data-leak-ledger className="w-full">
      <div className="border border-text-primary/12 bg-panel p-4 lg:p-5">
        <div className="type-label flex justify-between text-text-secondary">
          <span>Leak report — sample</span>
          <span>Redacted</span>
        </div>
        <div aria-hidden="true" className="mt-3 h-px bg-text-secondary/30" />

        <div className="mt-4 grid grid-cols-[2.25rem_1fr]">
          <span aria-hidden="true" className="flex justify-center">
            <span className="h-full bg-text-primary/80" style={{ width: `${widths[0]}px` }} />
          </span>
          <p className="type-label pb-3 pl-4 text-text-secondary">Traffic in</p>
          <ol className="contents" aria-label="Where revenue leaks">
            {leaks.map((leak, i) => (
              <li key={leak} className="contents">
                {/* Rail: the traffic line, and the leak running off it. */}
                <span aria-hidden="true" className="relative flex justify-center">
                  <span className="h-full bg-text-primary/80" style={{ width: `${widths[i]}px` }} />
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-accent" />
                  <span className="absolute left-[calc(50%+1.25rem)] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent" />
                </span>
                <div className="border-t border-text-secondary/25 py-3 pl-4">
                  <p className="type-body text-text-primary">{leak}</p>
                  <span aria-hidden="true" className="mt-2 flex gap-1.5">
                    <span className="h-1.5 w-2/5 bg-text-secondary/25" />
                    <span className="h-1.5 w-1/5 bg-text-secondary/15" />
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className="flex justify-center">
            <span className="h-10 bg-text-primary/80" style={{ width: `${after}px` }} />
          </span>
          <p className="type-label self-end border-t border-text-secondary/25 pl-4 pt-3 text-text-secondary">
            What reaches revenue
          </p>
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-start gap-x-3 gap-y-1.5 border-t border-text-secondary/30 pt-2">
        <IllustrativeBadge className="shrink-0">Illustrative — not a client report</IllustrativeBadge>
        <span className="type-mono block min-w-0 flex-1 basis-48 text-[0.7rem] leading-snug text-text-secondary">
          Revenue Recovery · sample leak report · drawn, not measured
        </span>
      </figcaption>
    </figure>
  );
}
