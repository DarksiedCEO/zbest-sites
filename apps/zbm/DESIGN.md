# Design System: Z Best Media

> **This file defines no tokens.** The root `DESIGN.md` is the only place tokens
> live. This file names which brand scope applies and the page-level vernacular.
> If a value is needed that is not at root, **add it at root** — do not add it here.

## Overview

**Brand scope: `[data-brand="zbm"]`** — see root `DESIGN.md` → Colors → Z Best Media
for the token values, and `packages/ui/src/styles/tokens.css` for the implementation.
Applying that attribute to `<html>` binds `--base`, `--panel`, `--accent` and
`--accent-2` to the ZBM values; components consume only the semantic names.

**Headline face:** Fraunces. **Body:** IBM Plex Sans. **Numbers:** IBM Plex Mono.
Loaded via `@zbest/ui/fonts/zbm`, which deliberately excludes Bricolage Grotesque so
this app never self-hosts the sibling brand's display face.

ZBM has a **single accent** (`--accent`, muted brass) doing narrow work, with the
desaturated teal reserved for data and charts. There is no per-page accent switching
on this site — that mechanism belongs to Z Best Clips.

## Page-level vernacular: the ledger / the audit

Every visual choice on this site should read as *"we show you evidence."* The
furniture is financial-audit furniture, used literally rather than as a metaphor:

- **Hairline rules are ledger lines**, not decorative separators. They run between
  data rows — the hero stat block, the four-disciplines section, the leak taxonomy —
  and they are the primary structural device on the page.
- **Numbers align down a column.** Tabular numerals are required wherever a figure
  appears; the alignment is the point.
- **The hero is asymmetric** — claim left, stat block right — and stacks
  claim-then-stats at 390.
- **Editorial typography with real scale contrast** carries the type. Imagery is
  required on every major page [FD-VISUAL-01 §3]: concept work for the sample
  brands, badged, in real-world frames.

The two lead techniques are a scroll-scrubbed hero and monumental editorial
typography. [FD-VISUAL-01 §4–§5] Each page has one showpiece (Home: the reel;
Out-of-Home: the billboard that scales toward the viewer) plus the root motion
vocabulary. The counter still ticks up once on
viewport entry — and until a verified recovered-revenue figure exists, that counter
is built but **not wired to a claim.**

## Layout

Left-aligned and grid-driven. Mobile-first: build at 390, then widen. The type and
spacing scales are Phase 2 work and are recorded at root once built.

## Do's and Don'ts

The §2.2 anti-references at root apply in full. App-specific additions:

### Do:
- **Do** let sections read well empty. There are no case studies and no named
  clients; the "How we work" section carries no case study cards at all.
- **Do** keep the hero stat block to non-outcome facts until a real figure exists.

### Don't:
- **Don't** render the Digital Advertising certifications block. Hidden means **not
  rendered**, not `display:none`.
- **Don't** link Search Intelligence from nav, footer, `sitemap.xml`, or any internal
  link. It is `noindex` and direct-URL-only.
- **Don't** switch accent color per page. That is the ZBC mechanism, not this one.
- **Don't** rewrite the Revenue Recovery page copy — it carries over from the live
  site and is extracted, not authored.
