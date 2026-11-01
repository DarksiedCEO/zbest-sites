import { CookieConsent, Footer, Nav, SkipLink, siteMetadata } from "@zbest/ui";
import { GateNonce } from "@zbest/ui/gate";
import { zbmFontVariables } from "@zbest/ui/fonts/zbm";
import { FOOTER_COLUMNS, NAV_CTA, NAV_ITEMS, SITE } from "@/lib/site";
import "./globals.css";

export const metadata = siteMetadata(SITE);

/**
 * Shared scaffolding (Brief §3.3): nav, footer and the cookie banner wrap every
 * route, the 404 included. Pages render their own <main>.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-brand="zbm" className={zbmFontVariables}>
      <body className="bg-base font-sans text-text-primary antialiased">
        <GateNonce />
        <SkipLink />
        <Nav brandName={SITE.name} items={NAV_ITEMS} cta={NAV_CTA} />
        {children}
        <Footer brandName={SITE.name} columns={FOOTER_COLUMNS} />
        <CookieConsent />
      </body>
    </html>
  );
}
