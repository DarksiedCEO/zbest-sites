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
      <ol
        className={[
          "relative grid gap-stack",
          // The track: a vertical line at 390, a horizontal one at 1440.
          "before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-text-secondary/45",
          "lg:grid-cols-4 lg:gap-x-8 lg:before:inset-x-0 lg:before:bottom-auto lg:before:left-0 lg:before:top-[5px] lg:before:h-px lg:before:w-auto",
        ].join(" ")}
      >
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
