import type { Focus } from "./focus";

/**
 * Open Graph card, rendered by next/og (Brief §7: "generated per page with
 * next/og from the page title on the brand base color").
 *
 * next/og renders with Satori, which cannot read CSS custom properties, so the
 * brand values are repeated here as literals. The Phase 3 gate compares every
 * one of them against styles/tokens.css, so the two cannot drift silently.
 *
 * Phase 3 ships the site-wide default in each app's root opengraph-image.tsx.
 * Phase 4 pages add their own opengraph-image.tsx passing the page title.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_COLORS = {
  "zbm-base": "#0e0f12",
  "zbm-accent": "#c99a4b",
  "zbc-base": "#0b0d10",
  "zbc-ent": "#ff6b5b",
  "zbc-brand": "#4c8cff",
  "text-primary": "#edebe6",
  "text-secondary": "#8b8f98",
} as const;

export type OgBrand =
  | { brand: "zbm" }
  | { brand: "zbc"; focus?: Focus };

export function OgCard({
  title,
  domain,
  ...brand
}: {
  title: string;
  /** Shown bottom-left, e.g. "zbestmedia.com". */
  domain: string;
} & OgBrand) {
  const isZbm = brand.brand === "zbm";
  const base = isZbm ? OG_COLORS["zbm-base"] : OG_COLORS["zbc-base"];
  const accent = isZbm
    ? OG_COLORS["zbm-accent"]
    : brand.focus === "brands"
      ? OG_COLORS["zbc-brand"]
      : OG_COLORS["zbc-ent"];
  const siteName = isZbm ? "Z Best Media" : "Z Best Clips, by Z Best Media";
  // The same families DESIGN.md declares; the app registers them with next/og
  // under exactly these names.
  const display = isZbm ? "Fraunces" : "Bricolage Grotesque";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: base,
        color: OG_COLORS["text-primary"],
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "IBM Plex Mono",
          fontSize: 22,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {siteName}
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: display,
          fontSize: title.length > 40 ? 76 : 96,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* The ledger rule — the shared structural device (§A1). */}
        <div
          style={{
            display: "flex",
            height: 2,
            width: "100%",
            background: OG_COLORS["text-secondary"],
            opacity: 0.45,
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "IBM Plex Mono",
            fontSize: 22,
            color: OG_COLORS["text-secondary"],
          }}
        >
          {domain}
        </div>
      </div>
    </div>
  );
}
