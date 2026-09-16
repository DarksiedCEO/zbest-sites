"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type NavItem = {
  label: string;
  href: string;
  /** Dropdown depth is exactly one layer (Brief §A2, decided Sep 7). */
  children?: { label: string; href: string; focus?: "entertainment" | "brands" }[];
};

/**
 * Sticky top navigation with a short menu and a dropdown exactly one layer deep
 * (Brief §A2, §B2).
 *
 * The dropdown opens on click, not hover: hover effects on everything is an
 * anti-reference (§2.2), and a hover-only menu is unusable on the 390 viewport
 * this is built at first.
 *
 * `cta` renders the button-styled primary action Z Best Clips puts on "Launch a
 * Campaign" (§B2). Z Best Media has no nav CTA.
 */
export function Nav({
  brandName,
  brandHref = "/",
  items,
  cta,
  className = "",
}: {
  brandName: React.ReactNode;
  brandHref?: string;
  items: NavItem[];
  cta?: { label: string; href: string };
  className?: string;
}) {
  const baseId = useId();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-text-secondary/20 bg-base/95 backdrop-blur-sm ${className}`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-gutter py-4 lg:px-gutter-wide"
      >
        <Link href={brandHref} className="type-title shrink-0 whitespace-nowrap">
          {brandName}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {items.map((item) => {
            const menuId = `${baseId}-${item.label}`;
            const isOpen = openMenu === item.label;
            return (
              <li key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                      onClick={() => setOpenMenu(isOpen ? null : item.label)}
                      className="type-small flex items-center gap-1.5 whitespace-nowrap text-text-secondary hover:text-text-primary"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-[0.65em]">
                        ▾
                      </span>
                    </button>
                    <ul
                      id={menuId}
                      hidden={!isOpen}
                      className="absolute left-0 top-full mt-3 min-w-56 border border-text-secondary/20 bg-panel p-2"
                    >
                      {item.children.map((child) => (
                        <li key={child.href} data-focus={child.focus}>
                          <Link
                            href={child.href}
                            className="type-small flex items-center gap-2.5 px-3 py-2 text-text-secondary hover:text-text-primary"
                          >
                            {child.focus ? (
                              <span
                                aria-hidden="true"
                                className="inline-block size-1.5 bg-accent"
                              />
                            ) : null}
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="type-small whitespace-nowrap text-text-secondary hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          {cta ? (
            <Link
              href={cta.href}
              className="type-label hidden shrink-0 whitespace-nowrap bg-accent px-4 py-2.5 text-base lg:inline-block"
            >
              {cta.label}
            </Link>
          ) : null}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={`${baseId}-mobile`}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="type-label shrink-0 text-text-secondary lg:hidden"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        id={`${baseId}-mobile`}
        hidden={!mobileOpen}
        className="border-t border-text-secondary/20 px-gutter py-4 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="type-small block py-2 text-text-secondary"
              >
                {item.label}
              </Link>
              {item.children ? (
                <ul className="mb-1 ml-4 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <li key={child.href} data-focus={child.focus}>
                      <Link
                        href={child.href}
                        className="type-small flex items-center gap-2.5 py-1.5 text-text-secondary"
                      >
                        {child.focus ? (
                          <span
                            aria-hidden="true"
                            className="inline-block size-1.5 bg-accent"
                          />
                        ) : null}
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
          {cta ? (
            <li className="mt-3">
              <Link
                href={cta.href}
                className="type-label inline-block whitespace-nowrap bg-accent px-4 py-2.5 text-base"
              >
                {cta.label}
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
}
