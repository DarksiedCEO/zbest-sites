"use client";

import { useEffect, useRef } from "react";

/**
 * Moves keyboard focus to where a form's outcome is, once it arrives
 * (WCAG 2.4.3 Focus Order, with 3.3.1 support).
 *
 * Before this, every submit dropped focus to <body>: the submit button was
 * `disabled` while sending (Chromium then blurs it), and neither the errors
 * nor the result were ever focused, so a keyboard user restarted from the top
 * of the page. The forms now mark the button aria-disabled while sending (it
 * keeps focus, and a guard ignores repeat submits) and call this hook with
 * their state's `kind`.
 *
 * `targets` maps a state kind to the element that should take focus when the
 * form enters that state. Kinds with no entry (idle, submitting) leave focus
 * where it is. The element must be focusable: a control, or carry
 * tabIndex={-1}.
 */
export function useOutcomeFocus(
  kind: string,
  targets: Partial<Record<string, () => HTMLElement | null | undefined>>,
) {
  const latest = useRef(targets);
  useEffect(() => {
    latest.current = targets;
  });
  useEffect(() => {
    const el = latest.current[kind]?.();
    // preventScroll: false — the browser scrolls it into view, honouring the
    // document's scroll-padding (sticky header, consent banner).
    el?.focus();
  }, [kind]);
}

/**
 * The first control the server marked invalid inside `root`, in DOM order:
 * a field with aria-invalid, or the first input of a group (fieldset) marked
 * data-invalid — radios cannot carry aria-invalid (ARIA 1.2), so a radio
 * group's error lives on its fieldset.
 */
export const firstInvalid = (root: HTMLElement | null) =>
  root?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input:not([type="hidden"])') ?? null;
