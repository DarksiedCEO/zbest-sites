"use client";

import { animate } from "motion";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const defaultFormat = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * The signature motion moment on both sites: a number that ticks up ONCE when
 * scrolled into view (Brief §A1, §B1). Not on hover, not on a loop, not again
 * on the way back up.
 *
 * Brief §9 requires prefers-reduced-motion to disable the tick entirely and the
 * content to stay fully readable with motion off — so the reduced path is not a
 * shorter animation, it is the final value rendered immediately.
 *
 * The element carries its final value in aria-label and the animating text is
 * aria-hidden, so assistive tech is never read a number mid-count.
 *
 * `format` is held in a ref rather than listed as an effect dependency. An
 * inline or default-parameter function is a new identity on every render, and
 * since each tick sets state, listing it re-ran the effect mid-animation: the
 * cleanup stopped the tween and the once-only guard refused to restart it, so
 * the counter froze on whatever number it had reached.
 */
export function Counter({
  value,
  format = defaultFormat,
  className = "",
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const formatRef = useRef(format);
  formatRef.current = format;

  const [display, setDisplay] = useState(() => format(0));
  const hasRun = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(formatRef.current(value));
      return;
    }
    if (!inView || hasRun.current) return;
    hasRun.current = true;

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (latest) => setDisplay(formatRef.current(latest)),
      onComplete: () => setDisplay(formatRef.current(value)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
