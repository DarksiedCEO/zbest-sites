import { CookieConsent, Footer, Nav, siteMetadata } from "@zbest/ui";
import { GateNonce } from "@zbest/ui/gate";
import { zbcFontVariables } from "@zbest/ui/fonts/zbc";
import { ENDORSEMENT, FOOTER_COLUMNS, NAV_CTA, NAV_ITEMS, SITE } from "@/lib/site";
import "./globals.css";

export const metadata = siteMetadata(SITE);

/**
 * Shared scaffolding (Brief §3.3): nav, footer and the cookie banner wrap every
 * route, the 404 included. Pages render their own <main>.
 *
 * Focus color (§B1): a focus-area page sets data-page-focus on its <main>, and
 * tokens.css recolors this whole document from it — nav CTA, footer and banner
 * included — without the layout needing to know which page it is wrapping.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-brand="zbc" className={zbcFontVariables}>
      <body className="bg-base font-sans text-text-primary antialiased">
        <GateNonce />
        <Nav brandName={SITE.name} items={NAV_ITEMS} cta={NAV_CTA} />
        {children}
        <Footer brandName={SITE.name} columns={FOOTER_COLUMNS} endorsement={ENDORSEMENT} />
        <CookieConsent />
      </body>
    </html>
  );
}
