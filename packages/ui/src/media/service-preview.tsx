"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LedgerRule } from "../components/ledger-rule";
import type { AssetId } from "./assets";
import { MediaFrame, type FrameKind } from "./media-frame";
import { useMotionAllowed } from "./showpiece";

export type PreviewItem = {
  title: string;
  href: string;
  external?: boolean;
  body?: ReactNode;
  /** The service's lead image; rows without one leave the preview as it is. */
  asset?: AssetId;
  frame?: FrameKind;
};

/**
 * A service list whose rows preview their lead image (FD-VISUAL-01 §4.2).
 *
 * Desktop: hovering or focusing a row swaps the image in the panel beside the
 * list. The panel always shows an image — the first row's until another is
 * chosen — so the composition never depends on hover.
 * Mobile: each row carries its image inline; nothing depends on hover.
 *
 * Only rows react to hover, because rows are links (§4.3).
 */
export function ServicePreview({ items }: { items: PreviewItem[] }) {
  const firstWithAsset = items.findIndex((i) => i.asset);
  const [active, setActive] = useState(Math.max(firstWithAsset, 0));
  const motionAllowed = useMotionAllowed();
  const current = items[active];

  return (
    <div className="grid gap-stack lg:grid-cols-12 lg:gap-x-10" data-service-preview>
      <ol className="lg:col-span-7">
        {items.map((item, i) => {
          const choose = () => item.asset && setActive(i);
          return (
            <li key={item.title} onMouseEnter={choose}>
              {i === 0 ? <LedgerRule /> : null}
              <div className="grid grid-cols-[1fr_6.5rem] items-start gap-x-5 gap-y-2 py-ledger sm:grid-cols-[minmax(0,15rem)_1fr_6.5rem] lg:grid-cols-[minmax(0,15rem)_1fr]">
                <h3 className="type-title">
                  <Link
                    href={item.href}
                    onFocus={choose}
                    data-active={i === active || undefined}
                    className="group inline-block"
                    {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                  >
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-[var(--duration-hover)] ease-[var(--ease-ledger)] group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                      {item.title}
                    </span>
                    {" "}
                    <span
                      aria-hidden="true"
                      className="type-mono inline-block text-accent transition-transform duration-[var(--duration-hover)] ease-[var(--ease-ledger)] group-hover:translate-x-1"
                    >
                      {item.external ? "↗" : "→"}
                    </span>
                  </Link>
                </h3>
                {item.body ? (
                  <div className="type-body col-start-1 row-start-2 text-text-secondary sm:col-start-auto sm:row-start-auto">
                    {item.body}
                  </div>
                ) : null}
                {/* Inline on mobile: the image is part of the row, not a hover reward. */}
                <div className="col-start-2 row-span-2 row-start-1 sm:col-start-3 lg:hidden">
                  {item.asset ? (
                    <MediaFrame
                      asset={item.asset}
                      frame="plate"
                      aspect="1 / 1"
                      sizes="104px"
                      caption={false}
                      badge="compact"
                      className="[&_[data-concept-badge]]:left-1.5 [&_[data-concept-badge]]:top-1.5"
                    />
                  ) : null}
                </div>
              </div>
              <LedgerRule emphasis={i === items.length - 1} />
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            {current?.asset ? (
              <motion.div
                key={current.asset}
                initial={motionAllowed ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={motionAllowed ? { opacity: 0 } : undefined}
                transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <MediaFrame
                  asset={current.asset}
                  frame={current.frame ?? "plate"}
                  sizes="(min-width: 1440px) 520px, 36vw"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
