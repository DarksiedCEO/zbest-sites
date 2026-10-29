import { useEffect, useState } from "react";

/**
 * True once React has hydrated this component (AEGIS r5 N1). Until then the
 * page is visible and typable but no submit handler is attached, so a native
 * submit would post the page itself and lose the lead silently. Lead forms
 * keep their submit button disabled — labelled NOT_READY_LABEL — until this
 * is true, and mark the form `data-ready="true"` when it is.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** The submit button's text before hydration: it says why it cannot be pressed yet. */
export const NOT_READY_LABEL = "Loading…";

/** Shown only when JavaScript is off, where the button stays disabled. */
export const NOSCRIPT_COPY = "This form needs JavaScript to send. Please enable it and reload the page.";

/** The button's description before hydration, for assistive technology (AEGIS r6 O4). */
export const STATUS_LOADING_COPY = "The form is still loading. Send will be available in a moment.";

/**
 * Shown by CSS alone if the form is still not ready after ~10 s (AEGIS r6 O3):
 * a script chunk failed or hydration aborted. No contact address is offered —
 * the site copy has none to point to — only the action that recovers.
 */
export const STUCK_COPY = "Still loading? Please refresh the page.";
