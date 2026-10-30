import Link from "next/link";

/**
 * Notice at collection (Privacy Policy, in effect Oct 30 2026; CCPA regs
 * §7012 pattern). Rendered ABOVE the submit button so it is read before
 * anything is sent, and links straight to the policy sections that list what
 * we collect, why, how long we keep it, and the visitor's rights.
 */
export function CollectionNotice() {
  return (
    <p data-collection-notice className="type-small mt-stack max-w-prose text-text-secondary">
      We save what you send so a person can reply. We don’t sell it or use it for ads. See our{" "}
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
