import type { ReactNode } from "react";

/**
 * The timeline / scrubber device (Brief §B1): How It Works' structural divider,
 * justified because that content is sequential. Horizontal at 1440 — a ruler
 * track with the playhead parked on step one — and a vertical timeline at 390.
 *
 * Only for sequential content; do not reuse it as decoration (apps/zbc/DESIGN.md).
 * Static by design: the page's one motion moment is the view counters.
 */
export function Timeline({
  steps,
}: {
  steps: { title: string; body: ReactNode }[];
}) {
  return (
    <div className="relative" data-timeline>
      {/* Ruler ticks along the desktop track — the scrubber's scale. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 hidden h-3 lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgb(139 143 152 / 0.35) 0 1px, transparent 1px 1.5rem)",
        }}
      />
      {/* The track: a vertical line at 390, a horizontal one at 1440. A real
          element, not an ol::before: axe cannot measure text contrast over a
          pseudo-element's background and reported the step labels as "needs
          review" (AEGIS F5). Outside the <ol>, which may only hold <li>s; this
          div and the <ol> share one box, so the position is unchanged. */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[5px] top-2 w-px bg-text-secondary/45 lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[5px] lg:h-px lg:w-auto"
      />
      <ol className="relative grid gap-stack lg:grid-cols-4 lg:gap-x-8">
        {steps.map((step, i) => (
          <li key={step.title} className="relative pl-9 lg:pl-0 lg:pt-10">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 block size-[11px] border lg:top-0 ${
                i === 0 ? "border-accent bg-accent" : "border-text-secondary/70 bg-base"
              }`}
            />
            <p className="type-label text-accent">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="type-title mt-2">{step.title}</h3>
            <div className="type-body mt-2 text-text-secondary">{step.body}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
