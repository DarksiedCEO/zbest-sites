# Builder Handoff: zbest-sites (tool-agnostic: Codex, Claude Code, or any agent)

**Written:** 2026-10-31 by the independent reviewer, at the founder's request ("take this to the max, then we move it to Codex").
**Read this, then `AGENTS.md`, before any work.** This file is the current state of play. It does not override the locked Brief, DESIGN.md or FD-VISUAL-01.

## 1. Roles: do not blur them
- **Founder (Andre):** the only one who approves visuals (FD-VISUAL-01 §7.7), merges to `main`, rules on copy and legal, and authorizes production cutover.
- **Builder (you):** writes code on branches and opens PRs. **Never merge, never push to `main`, never force-push.** Stop at every gate with evidence.
- **Independent reviewer:** reviews PRs and captures and posts findings as PR comments. Comments that start with **BLOCKING** must be fixed before you continue. Reply to each one with what you changed.
- A builder's own tests or its own AEGIS pass are **builder evidence**, not certification.

## 2. Rules every change follows
1. **Authority:** cite the governing doc (Brief §, DESIGN.md, FD-VISUAL-01 §, or a founder ruling with its date) in the PR body.
2. **Evidence:** `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm e2e`, all green. Commit Playwright captures at **1440 and 390**, first frame (motion on) **and** reduced motion, for every changed page.
3. **Honesty (non-negotiable):**
   - No unverified claims.
   - Every invented-brand asset carries `ConceptBadge`, and every unsourced number carries `IllustrativeBadge`.
   - No stock photos, no photoreal faces, no real brand marks or products.
   - Never write privacy or legal copy that the code doesn't do.
4. **No empty frames, ever.** A media slot without its file renders **nothing**, never a blank box.
5. **Package manager is pnpm 9.15.0.** `npm install` fails on `workspace:*`; that's expected.
6. Do not touch the old `zbestmedia-ui` Vercel project. The Search Intelligence page stays unlinked and `noindex`.

## 3. Current state (verified 2026-10-31)
- `main` = `226420e`: CI, truthful copy, security headers, `/dev` out of production, secret scan, and FD-VISUAL-01 primitives plus the 3 pilot showpieces. Production is READY on both Vercel projects (`zbm-site-v2`, `zbc-site-v1`).
- **Vercel previews** failed because of the Neon free-plan cap of 10 branches per project. It was cleared on 2026-10-30 23:06 PT. If previews fail again with "Resource provisioning failed", the cap is full again. **Ask the founder before deleting Neon branches.**
- **Vercel plan is probably Hobby (non-commercial only).** The founder must move to Pro before launch, and the crons need Pro.

### Open PRs and reviewer verdicts
| PR | What | Verdict | Next action |
|---|---|---|---|
| #13 `rollout/fd-visual-01` | FD-VISUAL-01 §10 rollout: one hero image per page, all pages | No BLOCKING; CI green | **Awaiting founder visual approval.** Founder says one image per page is not enough (see §4). Merge only on the founder's word. |
| #12 | Duplicate of #13 batch 1 | Superseded | Close only on the founder's word |
| #7 site hardening | Retention purge, keyed rate limit, GPC, health | Approve with conditions | Rebase on `main` (mechanical conflicts in both `next.config.ts` and `package.json`). After merge: migrations 002/003, `CRON_SECRET`, one real purge |
| #8 service area | Required state/territory on lead forms | Approve with conditions | Retarget to `main` after #7; CI has never run; ZBC clipper copy says "businesses" for individuals (`packages/lead/src/region.ts:72,75`) |
| #9 accessibility | WCAG 2.2 AA fixes, axe gate | **Revise** | Redo on top of FD-VISUAL-01: ZBC `timeline.tsx` `ol::before` regression; Home `<main>` skip link |
| #10 legal "in effect" | Removes the "Draft — pending attorney review" banner | **HOLD: founder decision** | Do not merge or build on it. The authority was "relayed", not witnessed; there's no attorney review; text/code mismatches (cookie "equal prominence"; Refund Policy cites a contract and services not on the site) |
| #14 red-team fixes | Lead pipeline, ZBC forms → 410, policy copy | **Not yet reviewed** | Stacked on #10 (HOLD), so it can't land until #10 is decided. It also requires migrations 006–012, Vercel Pro crons, new secrets and a Full-access Resend key |

**WIP warning:** there are 4 stacked PRs (#7→#8→#9→#10→#14) plus the visual lane. Rebase the stack onto `main` once, then move each PR's base to `main` as the one before it merges.

## 4. The next primary lane: the story-image pass (founder ruling 2026-10-31)
**Founder ruling:** "Humans like to see images… the images have to tell the picture of what the site truly does." One hero image per page is not enough.

**Standard:** *no screen of text without a picture.* Each page tells its story in images: **problem, what we do, what you get.**

**Source of truth for the images:** `claude/copy/image-prompts-story-pass-2026-10-31.md` in the founder's project (36 files, names fixed). The founder is producing them in ChatGPT and on his phone. Real photos are allowed and preferred, with no faces, no visible logos and nothing private on screen.

### Build this now, before the images exist
1. **Story-image slots** on every page, keyed by the exact file names below. Each slot sits beside its section and renders **nothing** until its file exists in the asset manifest; then it renders in a `MediaFrame` with the right badge. Real photos get no ConceptBadge, but do get a manifest entry with `class: "real"`.
2. **FD-VISUAL-01 §7.1 media-coverage check** in the Playwright gate: no 900px band at 1440 (844px at 390) is text-only, except on Start, Launch a Campaign, FAQ, Legal and 404. It runs **report-only** until the images land, then becomes **blocking**.
3. **Self-host all five fonts** with `next/font/local`. CI already failed once fetching Google Fonts.
4. **§4.2 choreographed reveals:** ledger rows draw in, images unmask along a rule, one play per section, all off under reduced motion.

### Slot map (file name → page → section)
| Page | Files (in section order) |
|---|---|
| Revenue Recovery | `rr-missed-call` (hero/problem), `rr-broken-form`, `rr-no-follow-up`, `rr-slow-page`, `rr-wrong-page` (beside the matching leak rows), `rr-leak-report` (what you get) |
| Digital Advertising | `da-problem-wasted-spend`, `da-work-campaign`, `da-result-lead` |
| TV & Streaming | `tv-problem-wrong-room`, `tv-work-set`, `tv-result-watching` |
| Radio & Audio | `radio-problem-commute`, `radio-work-studio`, `radio-result-car` |
| Out-of-Home | `ooh-work-planning`, `ooh-result-street` |
| Social Media | `social-problem-dead-page`, `social-work-calendar`, `social-result-engaged` |
| Creative & Production | `creative-work-storyboard`, `creative-work-shoot` |
| Influencer & Creator | `influencer-work-filming`, `influencer-work-brief` |
| Websites | `web-problem-old-site`, `web-work-wireframes` |
| Home | `home-how-we-work` ("How we work") |
| About | `about-workspace`; the founder portrait is still pending, so render no frame until it exists |
| ZBC How It Works | `zbc-step1-brief`, `zbc-step2-clippers`, `zbc-step3-review`, `zbc-step4-results` (one per step) |
| ZBC Entertainment | `zbc-ent-studio`, `zbc-ent-fans` |
| ZBC Brands | `zbc-brands-filming` |
| ZBC Become a Clipper | `zbc-clipper-paid` (`IllustrativeBadge` on any amount) |

When the founder delivers the files, the only work left is adding each file to the manifest. No layout work.

### Approved assets (as of 2026-10-31, 20 of 36)
- **Location:** branch `design-inputs/story-pass`, folder `design-inputs/story-pass/`. Read `RULES.md` and `REVIEW.md` there first. Every file in that folder is founder-approved and canonical; copy them into the app assets unchanged.
- **Approved:** all 6 `rr-*`, `da-work-campaign`, `tv-work-set`, `radio-work-studio`, `ooh-work-planning`, `social-work-calendar`, `creative-work-storyboard`, `creative-work-shoot`, `influencer-work-filming`, `web-work-wireframes`, `home-how-we-work`, `zbc-step1-brief` through `zbc-step4-results`.
- **Use each file's own aspect ratio.** Several differ from the prompt list (e.g. `rr-broken-form` is 16:9; `rr-slow-page`, `creative-work-shoot` and `influencer-work-filming` are 4:5; all four `zbc-step*` are 16:9). Slots read width/height from the manifest; never crop to force the listed ratio.
- **`zbc-step*` are 832 px wide.** Render them only inside the 4-column How It Works timeline (`sizes` ≤ 416px on desktop). Never full-width or hero.
- The other 16 are enhancements; their slots stay empty (render nothing) until files land.

## 5. Launch blockers (target Nov 8; founder is weighing a move to about Nov 15)
| Item | Owner |
|---|---|
| Legal decision (#10): attorney review, or the founder adopts the policies; the mismatches get fixed either way | Founder |
| Vercel Pro | Founder |
| One real test lead, end to end (form → Postgres → Resend email to andre@zbestmedia.com) | Builder plus founder |
| Story images (§4) | Founder produces, builder places |
| Ivo Solace source video (Higgsfield credits) and founder portrait | Founder |
| Name checks: 5 concept brands plus handles `quellmontmotors`, `marenvale.aesthetics`, `creator` | Founder |
| Domain cutover with a tested rollback to the current live site | Founder authorizes, builder executes |

## 6. Stop conditions
Stop and report raw output if CI is red (apart from a Neon-cap Vercel preview), if any honesty rule would be broken, if you're asked to merge, or if a founder ruling is ambiguous. **UNKNOWN and HOLD are valid answers.**
