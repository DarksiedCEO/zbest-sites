Read docs/ZBM-ZBC-Build-Brief-v2.md before any work. It is the locked handoff.
Build in the phase order in Section 3 of the brief. Do not start a phase until
the previous one has Playwright screenshots (desktop 1440 + mobile 390)
committed under e2e/snapshots/<phase>/ and an AEGIS audit against the brief.
Backend contract is docs/backend-interface-spec-v0.4.md — §11 certified at 92cbf36
(the Phase 5 assessment), §12 certified at 2758bfb (the AI Visibility Readiness
Check); document status DRAFT pending backend acceptance. All API calls behind a
typed adapter, fixtures only, no real funding/publication/payout. Its Section 9
governs the frontend; Section 11 governs the Revenue Recovery assessment;
Section 12 governs the AI Visibility Readiness Check. Do not build against
guessed DTOs.
Legal pages — Z Best Media: founder decision Oct 30 2026 put real Privacy
Policy, Terms of Service, Cookie Policy and Refund and Cancellation Policy
(/legal/refunds, must match the MSA/SOW refund terms) text IN EFFECT now, plus
an Accessibility Statement (/legal/accessibility) whose known limitations must
be updated in the same commit as each accessibility fix. Service area: the
United States, including DC and all U.S. territories (PR, GU, VI, AS, MP).
Text lives in apps/zbm/lib/legal.ts and must match what the code collects,
stores, sends and sets in the browser: change it in the same commit as any
such code change. ZBM legal pages carry no status notice. Bracketed
[UPPER CASE] tokens are unfilled facts; any production build fails while any
remain (exempt: Vercel preview, and the e2e gate via
ZBEST_ALLOW_LEGAL_PLACEHOLDERS=1).
Legal pages — Z Best Clips: outlines (topics only) until ZBC publishes its
terms; each shows "Z Best Clips is not yet accepting clients. These terms will
be published before launch." Founder decision Oct 30 2026: no attorney-review
or draft-status wording on either site, in pages, metadata or the cookie
banner.
Search Intelligence page (Brief §A4) is built but never linked: absent from
nav, footer, sitemap.xml, and internal links, with robots noindex.
Do not touch the existing zbestmedia-ui Vercel project.
