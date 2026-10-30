"use client";

/**
 * "Skip to content" (WCAG 2.4.1 Bypass Blocks): the first tab stop on every
 * page, visually hidden until focused. Rendered by both root layouts, before
 * the nav.
 *
 * Without JavaScript it is a plain link to #main, which every page's <main id="main">
 * carries. With JavaScript it also works on a <main id="main"> that forgot the id (a
 * page added later), and it moves focus into <main id="main"> itself, not only the
 * scroll position, so the next Tab continues from the content.
 */
export function SkipLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = document.getElementById("main") ?? document.querySelector("main");
        if (!main) return;
        event.preventDefault();
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        main.focus();
      }}
      className={`type-label sr-only z-[70] bg-accent px-4 py-2.5 text-base focus:not-sr-only focus:fixed focus:left-4 focus:top-3 ${className}`}
    >
      Skip to content
    </a>
  );
}
