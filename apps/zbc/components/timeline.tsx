"use client";

import { useMotionAllowed } from "@zbest/ui";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * The timeline / scrubber device (Brief §B1): How It Works' structural divider,
 * justified because that content is sequential. Horizontal at 1440 — a ruler
 * track — and a vertical timeline at 390.
 *
 * FD-VISUAL-01 §5: the spec's original scrubber, now built. Scroll drives a
 * playhead along the track, the track fills behind it, and each step's marker
 * fills as the playhead reaches it. Transform and opacity only.
 *
 * Static (reduced motion, no JS, server HTML): the playhead parked on step one,
 * as before. The live version starts from exactly that state.
 *
 * Only for sequential content; do not reuse it as decoration (apps/zbc/DESIGN.md).
 */
export function Timeline({ steps }: { steps: { title: string; body: ReactNode }[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const live = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.5"] });

  // Marker offsets along the track, measured, so the playhead lands on each one
  // exactly at either breakpoint. Held in motion values, not React state.
  const horizontal = useMotionValue(0); // 1 at lg, 0 below
  const end = useMotionValue(0); // last marker's offset along the track, px
  const positions = useRef(steps.map(() => 0));

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const lg = window.matchMedia("(min-width: 1024px)").matches;
      horizontal.set(lg ? 1 : 0);
      const origin = list.getBoundingClientRect();
      markerRefs.current.forEach((m, i) => {
        if (!m) return;
        const r = m.getBoundingClientRect();
        positions.current[i] = lg ? r.left - origin.left : r.top - origin.top;
      });
      end.set(positions.current[positions.current.length - 1] ?? 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [horizontal, end]);

  const travel = useTransform([scrollYProgress, end], ([p, e]: number[]) => (p ?? 0) * (e ?? 0));
  const x = useTransform([travel, horizontal], ([t, h]: number[]) => (h ? t : 0));
  const y = useTransform([travel, horizontal], ([t, h]: number[]) => (h ? 0 : t));
  // A function transform, so Motion computes it per frame (see clip-split.tsx).
  const fill = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v)));

  return (
    <div className="relative" data-timeline data-scrubber={live ? "live" : "static"}>
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
        ref={listRef}
        className={[
          "relative grid gap-stack",
          // The track: a vertical line at 390, a horizontal one at 1440.
          "before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-text-secondary/45",
          "lg:grid-cols-4 lg:gap-x-8 lg:before:inset-x-0 lg:before:bottom-auto lg:before:left-0 lg:before:top-[5px] lg:before:h-px lg:before:w-auto",
        ].join(" ")}
      >
        {live ? (
          <>
            {/* Filled track behind the playhead. */}
            <motion.span
              aria-hidden="true"
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent lg:hidden"
              style={{ scaleY: fill }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-accent lg:block"
              style={{ scaleX: fill }}
            />
            {/* The playhead. */}
            <motion.span
              aria-hidden="true"
              data-playhead
              className="absolute left-0 top-1 z-10 block size-[11px] border border-accent bg-accent lg:top-0"
              style={{ x, y }}
            />
          </>
        ) : null}
        {steps.map((step, i) => (
          <Step
            key={step.title}
            index={i}
            step={step}
            live={live}
            travel={travel}
            positions={positions}
            markerRef={(el) => {
              markerRefs.current[i] = el;
            }}
          />
        ))}
      </ol>
    </div>
  );
}

function Step({
  index,
  step,
  live,
  travel,
  positions,
  markerRef,
}: {
  index: number;
  step: { title: string; body: ReactNode };
  live: boolean;
  travel: MotionValue<number>;
  positions: React.RefObject<number[]>;
  markerRef: (el: HTMLSpanElement | null) => void;
}) {
  // A marker fills once the playhead reaches it; step one is filled from the start.
  const reached = useTransform(travel, (t) => (index === 0 || t >= (positions.current[index] ?? 0) - 1 ? 1 : 0));

  return (
    <li className="relative pl-9 lg:pl-0 lg:pt-10">
      <span
        ref={markerRef}
        aria-hidden="true"
        className={`absolute left-0 top-1 block size-[11px] border lg:top-0 ${
          index === 0 ? "border-accent bg-accent" : "border-text-secondary/70 bg-base"
        }`}
      >
        {live && index > 0 ? (
          <motion.span className="absolute inset-[-1px] bg-accent" style={{ opacity: reached }} />
        ) : null}
      </span>
      <p className="type-label text-accent">Step {String(index + 1).padStart(2, "0")}</p>
      <h3 className="type-title mt-2">{step.title}</h3>
      <div className="type-body mt-2 text-text-secondary">{step.body}</div>
    </li>
  );
}
