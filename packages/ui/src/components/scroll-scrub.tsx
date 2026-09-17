"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-scrubbed hero — one of the two lead techniques (Brief §A1, decided
 * Aug 26). As the hero scrolls out, its content drifts up and dims in step with
 * the scroll position; it is scrubbed, not triggered, so it never plays on its
 * own and never replays.
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
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
}
