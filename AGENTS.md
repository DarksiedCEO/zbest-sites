Read docs/ZBM-ZBC-Build-Brief-v2.md before any work. It is the locked handoff.
Build in the phase order in Section 3 of the brief. Do not start a phase until
the previous one has Playwright screenshots (desktop 1440 + mobile 390)
committed under e2e/snapshots/<phase>/ and an AEGIS audit against the brief.
Backend contract is docs/backend-interface-spec-v0.2.md — DRAFT. All API calls
behind a typed adapter, fixtures only, no real funding/publication/payout.
Its Section 9 governs the frontend. Do not build against guessed DTOs.
Legal pages — Z Best Media: real Privacy, Terms, Cookie, Refund and
Accessibility documents are in effect (apps/zbm/lib/legal.ts; see CLAUDE.md).
Legal pages — Z Best Clips: outlines (topics only) until ZBC publishes its
terms; each shows "Z Best Clips is not yet accepting clients. These terms will
be published before launch." Founder decision Oct 30 2026: no attorney-review
or draft-status wording on either site, in pages, metadata or the cookie
banner.
Search Intelligence page (Brief §A4) is built but never linked: absent from
nav, footer, sitemap.xml, and internal links, with robots noindex.
Do not touch the existing zbestmedia-ui Vercel project.
