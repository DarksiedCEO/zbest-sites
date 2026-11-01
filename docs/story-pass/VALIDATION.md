# Story-pass validation

Final tested implementation (fresh-build image suite): `9e75d22c97fc2f2ddaa4d4061db14bf8965342b2` on `codex/story-pass-images`. Environment: macOS arm64, Node v24.9.0, pnpm 9.15.0. The Playwright harness creates fresh production builds, verifies its nonce, and uses test-fake transports.

| Check | Result |
|---|---|
| `pnpm typecheck` | PASS, 5 workspace tasks |
| `pnpm lint` | PASS, 6 workspace tasks |
| `pnpm test` | PASS, 86 tests; 27 existing PostgreSQL integration tests skipped |
| `pnpm check:media` | PASS, 49 assets; 36 story hashes, sizes, classifications and provenance verified |
| `pnpm e2e` on `252c9c2` | PASS, 658 passed, 2 existing skips, 0 failures (10.0m) |
| Final fresh-build image/coverage/geometry suite | PASS, 146 tests on final source after metadata-only legal/404 placement correction |
| Blocking full-page media coverage | PASS, both sites at both viewports; zero failing bands |
| Story/supporting image captures | PASS, 132 tests covering 33 routes in both motion settings at both widths |
| Geometry regressions | PASS, 6 runs including final-viewport and mobile-continuation cases |
| Manifest, badges, protected text, motion, keyboard/navigation, copy and security-header checks | PASS within full E2E |
| Gitleaks 8.30.1 Git history | PASS, 248 commits, no leaks |
| Independent review | Source and representative rendered review completed; findings addressed |

## Image integrity and evidence

All 36 PNGs were byte-compared again to immutable source commit `136c5ac75f398a99f572038a09916e54fca59ccc`: exact matches. Source declarations and accepted artwork limitations remain unchanged. All story canvases are protected in full; no source image was regenerated, retouched, cropped or replaced.

[SCREENSHOTS.md](SCREENSHOTS.md) indexes 198 PNGs: 132 normal/reduced full-page captures and 66 normal first frames. Full captures include dimension/scale sidecars. CAPTURE-HASHES.json records every PNG; BUILD-INPUTS.json records the exact production and test inputs. Dedicated captures are committed under `e2e/snapshots/story-pass/`.

The earlier four coverage-test failures have been resolved. [MEDIA-COVERAGE.md](MEDIA-COVERAGE.md) explains the relevant artwork/illustration additions and the independently reviewed final-viewport correction. The gate remains blocking with its original substantive-media threshold and route exceptions.

A full-suite attempt caught numeric process markers on the figure-free About page. Markers were replaced with dots, the strict copy test was preserved, and the complete suite was rerun successfully. A subsequent metadata-only correction lists concrete legal/404 footer placements; the rendered manifest check now explicitly visits these routes. After that correction, all 146 image, geometry and coverage tests were rerun against fresh builds and all final captures were regenerated. [REVIEW.md](REVIEW.md) records this and the other addressed findings.

## Remaining review and release constraints

- Founder explicitly deferred PR #13/#15 merges and #12 closure. The branch inherits rollout commit `08dd3d3bfd14b8cfbbd968045703f0cfab1f979d`; reconcile the base after those operations before merging.
- Local results are not a claim about remote CI or Vercel checks. Their current state is reported on the new PR.
- Founder visual/release approval remains outstanding. Independent review is not AEGIS certification.
- The approved source review's known limitations remain, including the small keypad-digit defect in `rr-missed-call.png`.
- Backend implementation, scoring, adapters, transport and production configuration are unchanged. The two optional form illustration props affect presentation only.

The full suite regenerated legacy screenshots as well. They remain locally retained and excluded from this change; automatic approval previously rejected discarding them because of possible uncommitted work. Only the dedicated final story-pass captures are included.
