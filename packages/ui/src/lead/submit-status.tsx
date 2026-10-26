import { NOSCRIPT_COPY, STUCK_COPY, STATUS_LOADING_COPY } from "./use-hydrated";

/**
 * Everything a lead form says about its submit button before hydration
 * (AEGIS r5 N1, r6 O3/O4). Rendered right after the button, OUTSIDE any busy
 * region:
 *   - a visually hidden status line the button points at (aria-describedby),
 *     so a screen-reader user learns why there is no working Send yet;
 *   - a CSS-only fallback line that appears if the form is still not ready
 *     after ~10 s (styles/lead.css), for when a script chunk never arrives;
 *   - the <noscript> line for JavaScript turned off (the fallback line is
 *     hidden then, so there is one message, not two).
 */
export function SubmitStatus({ id, ready }: { id: string; ready: boolean }) {
  return (
    <>
      {ready ? null : (
        <span id={id} className="sr-only">
          {STATUS_LOADING_COPY}
        </span>
      )}
      <p className="lead-stuck type-small mt-3 text-text-secondary" data-lead-stuck>
        {STUCK_COPY}
      </p>
      <noscript>
        <p className="type-small mt-3 text-text-secondary">{NOSCRIPT_COPY}</p>
      </noscript>
    </>
  );
}
