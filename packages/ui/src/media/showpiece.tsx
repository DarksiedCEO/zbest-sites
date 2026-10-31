"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

/**
 * The page's one showpiece (FD-VISUAL-01 §4–§5), and the switch between its two
 * states:
 *
 *   static — the composed frame. Server HTML, no-JS, and every visitor with
 *            prefers-reduced-motion: reduce. It must pass the Visual Gate on
 *            its own (§4.5), so it is a finished composition, not a fallback.
 *   live   — the motion version, after hydration, when motion is allowed.
 *
 * The motion preference is read with useSyncExternalStore. Its server snapshot
 * is "reduce", so the server and the first client render agree (no hydration
 * mismatch), and a preference changed mid-visit takes effect at once.
 *
 * Nothing in a showpiece starts hidden (founder pilot review, 2026-10-30: no
 * empty frames). The live version's first frame is identical to the static
 * frame, and motion is layered on top as the visitor scrolls, so hydration
 * changes nothing on screen.
 */
const LiveContext = createContext(false);

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useMotionAllowed(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** True inside a live showpiece: motion allowed and hydrated. */
export function useShowpieceLive(): boolean {
  return useContext(LiveContext);
}

export function Showpiece({
  name,
  label,
  className = "",
  children,
}: {
  /** Stable id, e.g. "zbm-home-reel"; tests and captures key on it. */
  name: string;
  /** Accessible name for the showpiece region. */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const live = useMotionAllowed();
  return (
    <section
      data-showpiece={name}
      data-showpiece-state={live ? "live" : "static"}
      aria-label={label}
      className={className}
    >
      <LiveContext.Provider value={live}>{children}</LiveContext.Provider>
    </section>
  );
}
