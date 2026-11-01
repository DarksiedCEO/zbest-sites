# Digital Advertising media-coverage repair

The first PR #17 GitHub run failed only the desktop ZBM coverage test: 665 passed, 2 existing skips, 1 failed. Both attempts reported the Digital Advertising band at 2700–3600 CSS pixels.

Evidence: [GitHub run 41258211639](https://github.com/DarksiedCEO/zbest-sites/actions/runs/41258211639), job `124705798243`, trace in artifact `13065106071`. The trace measured the preceding story image ending at 2243.375px and the footer image starting at 3579.171875px. That leaves only 20.828125px of footer artwork in the failing band, below the unchanged 24px minimum. The local macOS build placed the footer at 3549.046875px, so its 50.953125px overlap passed. The page relied on a narrow overlap with footer artwork instead of carrying a relevant visual through its lower content.

The dedicated Digital Advertising page had missed the lower “Who this is for” service sample already present on the catalog-rendered service pages. Restore its previously approved `quellmont-feed-sticker` creative there in the original phone/feed frame, capped at 320px, with the Concept badge and full square canvas. Add the concrete placement to the manifest. The 36 source story PNGs and their slots are unchanged; copy, backend, test thresholds and route exceptions are unchanged.

A regression assertion requires that sample in the audience-fit section, its Concept badge and alt prefix, and its square canvas. Before the fix, the assertion failed because the sample count was zero. After the fix, the focused suite covers both sites’ media coverage and manifest checks, geometry regressions, and Digital Advertising captures at desktop/mobile with normal/reduced motion.

Local verification: typecheck, lint and media validation passed; all 18 focused E2E tests passed in 2.0m. Updated desktop/mobile screenshots and hashes accompany this repair. Existing legacy captures remain unstaged.
