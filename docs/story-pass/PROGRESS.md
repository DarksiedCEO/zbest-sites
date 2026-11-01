# Story-image integration

Authority: founder final 36-image handoff and subsequent instruction to defer PR prerequisites and complete the rest (2026-10-31). Images only; no backend work.

Base: PR #13 rollout commit 08dd3d3bfd14b8cfbbd968045703f0cfab1f979d. PR #13/#15 merges and #12 closure are deferred by the founder; this branch must not be merged until the base is reconciled. PR #15 handoff read at 208cae5de4cf6d0992f4aac2307dda5e4ab2d84c.

- Source imported: 36 original PNGs, byte-compared to immutable source commit; hashes and exact sizes in inventory.json and asset manifest.
- All 36 class concept; provenance is founder-declared, not legal verification. Full REVIEW rows retained as facesCheck; four local retouch notes recorded.
- Rendering decision: preserve entire source canvas; no frame cropping or zoom for these images. Full-canvas keep bounds make later unsafe crops fail closed.
- All 36 slots implemented across 15 pages; all source dimensions preserved.
- Independent read-only review completed; source bytes/metadata/placement confirmed. Section/step regression assertions and ancestor-visibility hardening addressed.
- Initial focused browser run: 60 passed, 4 global coverage failures. All 36 story images passed at 1440/390 with motion on/off; remaining failures are documented in REVIEW.md.
- Typecheck, lint, media check and 86 unit tests passed.27 existing database integration tests skipped by the unit suite.
- Gitleaks 8.30.1: changed source/documentation and 244-commit history scans passed; no leaks.
- Full E2E: 584 passed, 2 skipped, 4 blocking coverage failures (8.8min). Final fresh-build media/story verification after manifest cleanup: 64/64 passed (2.2min). No builder-complete or certification claim.
- Evidence complete; preparing the focused draft PR against main. Prerequisite merges and global coverage remain outstanding.
