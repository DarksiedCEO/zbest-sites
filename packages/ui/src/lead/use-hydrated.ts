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
