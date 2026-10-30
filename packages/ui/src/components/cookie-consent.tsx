"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LedgerRule } from "./ledger-rule";

export type ConsentChoice = "accepted-all" | "rejected-non-essential";

const STORAGE_KEY = "zbest-cookie-consent";

/** Dispatched on window to bring the banner back so a choice can be changed. */
const OPEN_EVENT = "zbest:cookie-settings";

/**
 * Global Privacy Control (privacy sweep 2026-10-30, F9): a browser that sends
 * GPC has already said no to sale/sharing, so it is recorded as "Reject
 * non-essential" without asking, and "Accept all" is not offered to it.
 */
const gpcOn = () => {
  try {
    return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  } catch {
    return false;
  }
};

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
  const [gpc, setGpc] = useState(false);
  // True only when "Change cookie settings" brought the banner back AND a
  // choice is already stored. Escape may then close it without a new choice;
  // a first-visit banner (nothing stored), even one reopened from that
  // button, stays until the visitor chooses (AEGIS r2 N2).
  const [reopened, setReopened] = useState(false);
  const detailToggleRef = useRef<HTMLButtonElement>(null);
  const a11y = useBannerFocusSafety(visible);

  useEffect(() => {
    // Storage can throw in private mode or with site data blocked; a banner
    // that crashes the page is worse than one that shows twice.
    const signal = gpcOn();
    setGpc(signal);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (signal) {
        // GPC wins over any earlier choice, and needs no banner.
        if (!stored?.includes('"rejected-non-essential"')) {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ choice: "rejected-non-essential", at: new Date().toISOString(), gpc: true }),
          );
        }
      } else if (!stored) {
        setVisible(true);
      }
    } catch {
      if (!signal) setVisible(true);
    }

    // "Cookie Settings" (§A3, §B3) has to be able to reopen a choice that was
    // already made — a consent that can be given but never changed is not one.
    const reopen = () => {
      let stored = false;
      try {
        stored = !!window.localStorage.getItem(STORAGE_KEY);
      } catch {
        /* Unreadable storage: treat as no choice, so Escape cannot dismiss. */
      }
      setReopened(stored);
      setVisible(true);
    };
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

  // Escape (AEGIS F9) never records a consent choice. Inside the banner it
  // collapses the details and returns focus to their toggle; with the details
  // closed, it closes a banner reopened over a STORED choice (the choice
  // stands, focus goes back to "Change cookie settings"). With no stored
  // choice — a first visit, even if "Change cookie settings" was pressed —
  // the banner stays open until the visitor chooses.
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !a11y.bannerRef.current?.contains(document.activeElement)) return;
      if (showDetail) {
        setShowDetail(false);
        detailToggleRef.current?.focus();
      } else if (reopened) {
        setVisible(false);
      } else return;
      event.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, showDetail, reopened, a11y.bannerRef]);

  if (!visible) return null;

  return (
    <>
    {/* a11y (WCAG 2.4.11): in-flow spacer the height of the banner, so the
        last items on the page can scroll clear of it. */}
    <div aria-hidden="true" style={{ height: a11y.height }} />
    <div
      ref={a11y.bannerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-heading"
      className={`fixed inset-x-0 bottom-0 z-[60] max-h-[50dvh] overflow-y-auto overscroll-contain border-t border-text-secondary/25 bg-panel ${className}`}
    >
      <div className="mx-auto max-w-[90rem] px-gutter py-5 lg:px-gutter-wide">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            <p id="cookie-consent-heading" ref={a11y.headingRef} tabIndex={-1} className="type-title">
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
              ref={detailToggleRef}
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
            {gpc ? (
              <p className="type-small text-text-secondary" data-gpc-note>
                Your browser’s Global Privacy Control is on, so non-essential cookies stay off.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => choose("accepted-all")}
                className="type-label bg-accent px-4 py-2.5 text-base"
              >
                Accept all
              </button>
            )}
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
    </>
  );
}

/**
 * Accessibility support for the banner, kept apart from the consent logic.
 *
 * - WCAG 2.4.11 Focus Not Obscured: while the banner is open, the document's
 *   scroll-padding-bottom equals its height, so the browser scrolls any newly
 *   focused element clear of it; the spacer above lets the page's last items
 *   scroll that far. Chosen over "banner first in tab order", which only helps
 *   until focus leaves the banner — every later tab stop would still be able
 *   to land underneath it.
 * - WCAG 1.4.10 Reflow: the banner is capped at half the viewport and scrolls
 *   inside itself, so at 400% zoom its heading and buttons stay reachable.
 * - WCAG 2.4.3 Focus Order: when "Change cookie settings" reopens the banner,
 *   focus moves to its heading; once a choice is made it returns to the
 *   button that opened it.
 */
function useBannerFocusSafety(visible: boolean) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onOpen = () => {
      const active = document.activeElement;
      opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
      // Already open (e.g. the first-visit banner is still up): `visible`
      // does not change, so the effect below will not run — move focus now.
      if (bannerRef.current && opener.current) headingRef.current?.focus();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = bannerRef.current;
    if (!visible || !el) {
      root.style.removeProperty("scroll-padding-bottom");
      setHeight(0);
      return;
    }
    const sync = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      root.style.setProperty("scroll-padding-bottom", `${h}px`);
      setHeight(h);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("scroll-padding-bottom");
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      if (opener.current) headingRef.current?.focus();
    } else if (opener.current) {
      const back = opener.current;
      opener.current = null;
      if (back.isConnected) back.focus();
    }
  }, [visible]);

  return { bannerRef, headingRef, height };
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
