import Link from "next/link";

/**
 * Notice at collection (Privacy Policy and Terms, in effect Oct 30 2026; CCPA
 * regs §7012 pattern). Rendered ABOVE the submit button on every ZBM form so
 * it is read before anything is sent. It is also the point of assent to the
 * Terms, including the service-area confirmation (AEGIS M7).
 */
export function CollectionNotice() {
  return (
    <p data-collection-notice className="type-small mt-stack max-w-prose text-text-secondary">
      We save what you send so a person can reply. We don’t sell it or use it for ads. By sending,
      you agree to our{" "}
      <Link href="/legal/terms-of-service" className="underline underline-offset-4">
        Terms of Service
      </Link>{" "}
      and confirm that you are 18 or older and submitting on behalf of a business in our service
      area: the United States, including DC and all U.S. territories. See our{" "}
      <Link href="/legal/privacy-policy#california" className="underline underline-offset-4">
        Privacy Policy
      </Link>{" "}
      for what we collect and how long we keep it, and{" "}
      <Link href="/legal/privacy-policy#rights" className="underline underline-offset-4">
        your rights
      </Link>
      .
    </p>
  );
}
