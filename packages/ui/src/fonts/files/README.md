# Self-hosted font files

Every type face on both sites (four families) is served from these files through `next/font/local`, so a
build never fetches anything from Google Fonts. Founder decision, Oct 31, 2026,
after a CI build failed on a fonts.gstatic.com fetch.

**Provenance.** These are the exact Latin-subset files that `next/font/google`
downloaded for the build of `main` at d32457a, the files production served
before this change. They were copied byte for byte from `.next/static/media`,
so the glyphs, metrics and variable axes match what the sites already showed.

**Subset.** Latin only (U+0000–00FF and Google's Latin punctuation set). Every
character in the sites' copy is either in that range or was already drawn by a
system font, because no Google subset of these families carries it (→ ↗ ≤ ≥
─ ▶ ▾). The one change from before: a Latin-Extended or Vietnamese letter typed
into a form field (e.g. "ł") now renders in the metric-matched fallback rather
than the brand face.

**License.** SIL Open Font License 1.1 for all four families; each family's
OFL text sits beside its files. IBM Plex carries the Reserved Font Name "Plex".
These files are Google's own unmodified web subsets, redistributed as served.

| File | Family | Axes / weight | sha256 |
|---|---|---|---|
| `bricolage-grotesque-latin-opsz-wdth-wght.woff2` | Bricolage Grotesque 1.001 | opsz 12–96, wdth 75–100, wght 200–800 | `9fee080fcc2d2e0e…` |
| `fraunces-latin-wght.woff2` | Fraunces 1.000 | wght 100–900 | `88e17be075f1be50…` |
| `ibm-plex-mono-latin-400.woff2` | IBM Plex Mono 2.3 | 400 static | `c36f509c0a8f9f85…` |
| `ibm-plex-mono-latin-500.woff2` | IBM Plex Mono 2.3 | 500 static | `a76f53ca6612e7b3…` |
| `ibm-plex-mono-latin-600.woff2` | IBM Plex Mono 2.3 | 600 static | `ad4580d8cb4b5f62…` |
| `ibm-plex-sans-latin-wght.woff2` | IBM Plex Sans 3.201 | wght 100–700 (used 400–700) | `056e4e2459f57a00…` |
