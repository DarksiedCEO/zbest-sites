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
Policy, Terms of Service and Cookie Policy text IN EFFECT now (attorney review
later), plus an Accessibility Statement (/legal/accessibility) whose known
limitations must be updated in the same commit as each accessibility fix.
Text lives in apps/zbm/lib/legal.ts and must match what the code collects,
stores, sends and sets in the browser: change it in the same commit as any
such code change. ZBM legal pages show no draft banner. Bracketed
[UPPER CASE] tokens are unfilled facts; a Vercel production build fails while
any remain.
Legal pages — Z Best Clips: unchanged. Clearly marked placeholders until
attorney text is provided; scope is docs/ZBM-ZBC-Legal-Document-Brief.md; every
ZBC legal page shell shows "Draft — pending attorney review. Not yet in effect."
Search Intelligence page (Brief §A4) is built but never linked: absent from
nav, footer, sitemap.xml, and internal links, with robots noindex.
Do not touch the existing zbestmedia-ui Vercel project.
