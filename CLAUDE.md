Read docs/ZBM-ZBC-Build-Brief-v2.md before any work. It is the locked handoff.
Build in the phase order in Section 3 of the brief. Do not start a phase until
the previous one has Playwright screenshots (desktop 1440 + mobile 390)
committed under e2e/snapshots/<phase>/ and an AEGIS audit against the brief.
Backend contract is docs/backend-interface-spec-v0.3.md — certified at 92cbf36 as
the Phase 5 contract; document status DRAFT pending backend acceptance. All API
calls behind a typed adapter, fixtures only, no real funding/publication/payout.
Its Section 9 governs the frontend; Section 11 governs the Revenue Recovery
assessment. Do not build against guessed DTOs.
Legal pages use clearly marked placeholders until attorney text is provided.
Scope is docs/ZBM-ZBC-Legal-Document-Brief.md; every legal page shell shows
"Draft — pending attorney review. Not yet in effect."
Search Intelligence page (Brief §A4) is built but never linked: absent from
nav, footer, sitemap.xml, and internal links, with robots noindex.
Do not touch the existing zbestmedia-ui Vercel project.
