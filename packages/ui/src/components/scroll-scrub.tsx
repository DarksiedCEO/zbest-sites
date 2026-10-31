"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-scrubbed hero — one of the two lead techniques (Brief §A1, decided
 * Aug 26). As the hero scrolls out, its content drifts up in step with the
 * scroll position; it is scrubbed, not triggered, so it never plays on its own
 * and never replays.
 *
 * It no longer dims (WCAG 1.4.3): the fade took the lead paragraph to 4.18:1
 * at opacity 0.8 and 2.48:1 at 0.53 while it was still fully on screen. Body
 * text needs opacity >= 0.85 to hold 4.5:1 on the base colour, which leaves no
 * visible fade worth keeping, so the opacity transform is gone and the drift
 * carries the effect.
 *
 * At scroll position zero it renders exactly like static content, so there is
 * no "before" state to flash. prefers-reduced-motion renders the static
 * version outright (§9: the scroll-scrubbed hero is disabled with motion off).
 */
export function ScrollScrub({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
