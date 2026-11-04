/**
 * Red team RTS-1 (2026-10-30): Z Best Clips has not launched and its Privacy
 * Policy is not published, so its pages collect no personal data. Where the
 * lead forms were, this says so and offers an email address — no form, no
 * post, nothing stored. /api/lead answers 410 not_accepting for the same
 * reason. Restore the forms only together with a published ZBC Privacy
 * Policy and a notice at collection.
 */
export const CONTACT_EMAIL = "hello@zbestmedia.com";
export const NOT_ACCEPTING_COPY = "Z Best Clips is not yet accepting clients or clippers.";

export function NotAccepting({ children }: { children?: React.ReactNode }) {
  return (
    <div data-not-accepting className="border border-text-secondary/40 bg-panel p-6">
      <p className="type-title">{NOT_ACCEPTING_COPY}</p>
      {children ? <p className="type-body mt-3 text-text-secondary">{children}</p> : null}
      <p className="type-body mt-3 text-text-primary">
        Questions in the meantime? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
