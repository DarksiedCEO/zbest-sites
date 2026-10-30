/**
 * Shared design system for Z Best Media and Z Best Clips.
 *
 * Fonts are deliberately NOT re-exported here: each brand imports its own module
 * (@zbest/ui/fonts/zbm | /zbc) so neither app self-hosts the other's headline
 * face.
 */
export { ButtonLink } from "./components/button-link";
export { Card } from "./components/card";
export { CookieConsent, CookieSettingsButton } from "./components/cookie-consent";
export type { ConsentChoice } from "./components/cookie-consent";
export { Counter } from "./components/counter";
export { FAQ } from "./components/faq";
export type { FaqItem } from "./components/faq";
export { Footer } from "./components/footer";
export type { FooterColumn } from "./components/footer";
export { IllustrativeBadge } from "./components/illustrative-badge";
export { LedgerRule } from "./components/ledger-rule";
export { LegalShell, LEGAL_DRAFT_BANNER } from "./components/legal-shell";
export type { LegalPart } from "./components/legal-shell";
export { LegalDocument, legalDocumentStrings, legalPlaceholders } from "./components/legal-document";
export type { InEffectLegalDocument, LegalBlock, LegalSection } from "./components/legal-document";
export type { ConsentCategory } from "./components/cookie-consent";
export { Nav } from "./components/nav";
export type { NavItem } from "./components/nav";
export { NotFoundContent } from "./components/not-found-content";
export { ScrollScrub } from "./components/scroll-scrub";
export { SkipLink } from "./components/skip-link";
export { StatBlock } from "./components/stat-block";
export type { StatRow } from "./components/stat-block";
export { FOCUS_AREAS } from "./focus";
export type { Focus } from "./focus";
export { pageMetadata, siteMetadata } from "./metadata";
export type { SiteIdentity } from "./metadata";
