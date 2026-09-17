"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LedgerRule } from "./ledger-rule";

export type ConsentChoice = "accepted-all" | "rejected-non-essential";

const STORAGE_KEY = "zbest-cookie-consent";

/** Dispatched on window to bring the banner back so a choice can be changed. */
const OPEN_EVENT = "zbest:cookie-settings";

/**
 * Cookie consent banner (Brief §3.2, §5; Legal Brief Part One §C).
 *
 * Rejecting non-essential cookies is a first-class button, not something behind
 * a "Manage preferences" step — CCPA/CPRA posture for a California business,
 * and the Legal Brief asks for a mechanism that allows rejection, not one that
 * technically permits it.
 *
 * NOTHING CONSUMES THIS CHOICE YET. There are no analytics or advertising
 * pixels on either site at this phase. The stored value is the record of what
 * the visitor chose; wiring it to real tags is the job of whoever adds the first
 * tag, and they must read it before loading anything non-essential.
 *
 * Category descriptions below are PLACEHOLDER text pending attorney review
 * (CLAUDE.md, Brief §5) and are marked as such in the UI.
 */
export function CookieConsent({
  policyHref = "/legal/cookie-policy",
  className = "",
}: {
  policyHref?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    // Storage can throw in private mode or with site data blocked; a banner
    // that crashes the page is worse than one that shows twice.
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }

    // "Cookie Settings" (§A3, §B3) has to be able to reopen a choice that was
    // already made — a consent that can be given but never changed is not one.
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() }),
      );
    } catch {
      /* Choice still applies for this page view. */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-heading"
      className={`fixed inset-x-0 bottom-0 z-[60] border-t border-text-secondary/25 bg-panel ${className}`}
    >
      <div className="mx-auto max-w-[90rem] px-gutter py-5 lg:px-gutter-wide">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            <p id="cookie-consent-heading" className="type-title">
              Cookies on this site
            </p>
            <p className="type-small mt-1.5 max-w-prose text-text-secondary">
              We use strictly necessary cookies to run the site. Analytics and
              advertising cookies are optional and off unless you accept them.{" "}
              <Link href={policyHref} className="underline underline-offset-4">
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDetail(!showDetail)}
              aria-expanded={showDetail}
              aria-controls="cookie-consent-detail"
              className="type-label text-text-secondary underline underline-offset-4"
            >
              {showDetail ? "Hide details" : "What we store"}
            </button>
            <button
              type="button"
              onClick={() => choose("rejected-non-essential")}
              className="type-label border border-text-secondary/40 px-4 py-2.5 text-text-primary"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() => choose("accepted-all")}
              className="type-label bg-accent px-4 py-2.5 text-base"
            >
              Accept all
            </button>
          </div>
        </div>

        <div id="cookie-consent-detail" hidden={!showDetail} className="mt-5">
          <p className="type-label mb-3 text-accent">
            Draft — pending attorney review. Not yet in effect.
          </p>
          <LedgerRule />
          {[
            {
              name: "Strictly necessary",
              body: "Required for the site to function. Cannot be switched off. Placeholder description.",
            },
            {
              name: "Analytics",
              body: "Traffic measurement so we can see which pages do their job. Placeholder description.",
            },
            {
              name: "Advertising",
              body: "Used to measure and retarget advertising campaigns. Placeholder description.",
            },
          ].map((row, i, all) => (
            <div key={row.name}>
              <div className="flex flex-col gap-1 py-ledger sm:flex-row sm:gap-8">
                <p className="type-label w-44 shrink-0 text-text-secondary">
                  {row.name}
                </p>
                <p className="type-small text-text-secondary">{row.body}</p>
              </div>
              <LedgerRule emphasis={i === all.length - 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Reopens the consent banner. Rendered on the Cookie Policy shell, which is
 * where the footer's "Cookie Settings" entry leads (§A3, §B3).
 */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={`type-label border border-text-secondary/40 px-4 py-2.5 text-text-primary ${className}`}
    >
      Change cookie settings
    </button>
  );
}
