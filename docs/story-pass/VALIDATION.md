# Story-pass validation

## Local results

Environment: macOS arm64, Node v24.9.0, pnpm 9.15.0. Production builds are started and nonce-verified by the existing Playwright harness; no existing server is reused. All transports remain the repository’s test fakes.

| Command / check | Result |
|---|---|
| `pnpm typecheck` | PASS, 5 workspace tasks |
| `pnpm lint` | PASS, 6 workspace tasks |
| `pnpm test` | PASS, 86 tests; 27 existing PostgreSQL integration tests skipped |
| `pnpm check:media` | PASS, 49 assets; 36 story sources hash/size/class/provenance verified |
| `pnpm e2e` | **FAIL: 584 passed, 2 skipped, 4 failed (8.8min)** |
| Full E2E image-specific assertions | PASS, 60/60 story tests; all 36 images at 1440/390 and normal/reduced motion |
| Existing rendered manifest/badge/crop checks | PASS,  both sites and viewports |
| Existing keyboard/navigation/security-header checks | PASS within full suite |
| Gitleaks 8.30.1 changed source/documentation | PASS, no leaks |
| Gitleaks 8.30.1 full Git history | PASS, 244 commits, no leaks |

The four E2E failures are exclusively the newly blocking FD-VISUAL-01 §7.1 coverage gate: one per site/viewport. See [coverage failures](COVERAGE-FAILURES.json) and [independent review](REVIEW.md). This is not green CI, release readiness or builder-complete certification.

## Final metadata verification

After the full run, five superseded old hero-page declarations were removed from the manifest. Their source images remain on Home/Services; no rendering or source artwork changed. Static media validation passed afterward. `pnpm --filter e2e exec playwright test tests/fd-visual-01-media.spec.ts tests/story-pass.spec.ts` passed **64/64 (2.2min)** against fresh builds after this cleanup. This final run also regenerated all story screenshots.

## Captures and provenance

[Capture index](SCREENSHOTS.md): 90 PNGs covering 15 changed pages — 60 full-page captures (both viewport sizes, normal/reduced motion), plus 30 normal first frames. Full captures have dimension/scale sidecars.

The harness captured a working tree, not a pre-existing commit; its dirty-tree notice is expected during implementation. Final build/test input hashes are recorded separately so the visual evidence can be compared with the committed source. No source image was regenerated, retouched, cropped or replaced. Every rendered source canvas is protected in full, including required text and subjects.

## Remaining blockers / limitations

- Site-wide media coverage needs approved placements or layout work beyond the 36 designated image slots; inherited media-free pages and long text-only stretches remain. The gate stays blocking.
- PR #13/#15 merges and #12 closure remain deferred by explicit founder instruction. This branch starts from the unmerged #13 rollout commit; reconcile with main before merge.
- Remote CI and Vercel checks have not been claimed green for this integration.
- Independent source/placement review is recorded; founder visual approval and release approval remain outstanding. No AEGIS certification.
- Source REVIEW.md’s accepted artwork limitations remain unchanged, including the small keypad-digit defect in rr-missed-call.png.
- Backend code, production services and release configuration were not changed.

Final coverage inventory: 90 failing bands are recorded in COVERAGE-FAILURES.json. The four blocking coverage tests remain unchanged.

Workspace note: the full suite also regenerated 175 legacy capture files. Automatic approval rejected cleanup because it could discard uncommitted files. Those files are retained locally and excluded from this PR; only the dedicated story-pass captures are committed.
