# Brief amendment — full-service catalog (Oct 4, 2026)

**Status:** applied on branch `full-service-v1` and awaiting the founder's review. It is not merged to `main`.
**Amends:** `ZBM-ZBC-Build-Brief-v2.md` §A2 (nav), §A3 (footer), §A4 Home §1–2, §4–5, About, and FAQ. It adds three pages and six service pages.

## Why
Founder direction, Oct 4 2026, 22:33 (paraphrased; the quotes are his words):
- Z Best Media is "a full service advertising agency and we will service the customer any way that they need."
- "My website needs to show everything that we do from day one."
- Campaigns will send people "to specific areas" of the site: billboards, TV, social media, Revenue Recovery, and so on.
- "Every customer that comes my way is the first customer." The site must be ready for all of them.

The Brief's four-discipline structure was narrower than that, so this amendment replaces it.

## What changed
| Area | Brief v2 | Now |
|---|---|---|
| Nav (§A2) | 6 flat items | **Services ▾** (All Services + all 10 services) · Revenue Recovery · Z Best Clips · About · Contact. CTA **Start a Project** → `/start`. Depth is still one layer. |
| Footer (§A3) | Services: 4 entries | Services: all 10 + All Services. Company gains Start a Project. |
| Home hero | CTA "Get an Assessment"; stat row "Disciplines \| 4" | CTA **Start a Project**; stat row "Services \| 10". The subhead names the channels. The assessment CTA stays in the featured RR section and the closing CTA. |
| Home §2 | "One team. Four ways to be seen." (4 rows) | "One team. Every way to be seen." (all 10, from the catalog) plus an All Services link |
| Home §4 Scale / §5 | "digital, out-of-home, clips" / Assessment + Talk to Us | "digital, TV, radio, out-of-home, social, clips" / Start a Project + Get an Assessment |
| About | "four disciplines" | "a full-service advertising agency" plus the channel list. Talk to Us is kept; Start a Project is added. |
| FAQ | 3 groups | 3 groups + the 6 new services' FAQ blocks |
| DA / OOH heroes | Talk to Us | Start a Project (pre-selects the service) + Talk to Us |
| Contact | — | One line linking to `/start` |

**New pages:**
- `/services`: a hub listing every service, grouped Media / Content & social / Conversion. It also lists industries served (no clients) and a 5-step process.
- `/start`: the universal intake (see `FULL-SERVICE-DESIGN.md`).
- Six service pages, all rendered from one catalog (`apps/zbm/content/services.ts`):
  - `/tv-streaming`
  - `/radio-audio`
  - `/social-media`
  - `/creative-production`
  - `/influencer-marketing`
  - `/websites`

## Earlier rulings this supersedes
- **Sep 17 ruling, CTA primacy** (`docs/TOOLING.md:422-423`). That ruling put "Get an Assessment" first on Home and "Talk to Us" first on DA, OOH and About.
- Under this amendment, **Start a Project** is the first hero action on Home, every service page and About.
- What the assessment keeps:
  - first place on Revenue Recovery,
  - the featured RR section on Home,
  - the closing row on Home.
- "Talk to Us" stays on every page as the secondary action.
- The new placement is asserted in `phase-6-full-service.spec.ts`.

## What did NOT change
- **Search Intelligence remains built, unlinked and noindex** (CLAUDE.md, §A4). Linking it is a founder decision because it reverses a deliberate one. It was not taken here.
- **Political Advertising** (roster dept 14) has no page. It carries its own legal regime (FEC/state "paid for by" disclaimers, broadcast political-file rules, platform political-ad authorization, state AI-in-political-ads laws). Advertising it before Compliance/Legal cover it would invite clients ZBM cannot yet lawfully serve. This is a founder decision.
- The lead route is **still the marked STUB**: nothing is stored or sent, and every form says so. `/start` uses that same stub.
- No legal pages, design tokens or ZBC pages were changed. ZBC is unaffected except for the shared form component's new, additive field kinds.

## Copy rules applied to every new page
These match the Brief and the Sep 17 founder rulings, and they are enforced by `e2e/tests/phase-6-full-service.spec.ts`:
- Nothing is presented as a result: no statistics, percentages, outcome claims, case studies, client names, certifications or guarantees.
- No named networks, station groups or platforms are implied as buying relationships.
- No invented prices. New services state how they are scoped. The only published price is still Digital Advertising's, from the Brief.
- TV and audio measurement is described as directional, with confidence stated.

## Copy the founder should confirm (these are commitments, not facts)
1. `/start` "What happens next" makes four promises: a person reads every submission, there are no autoresponders, every quote comes as a written plan, and nothing starts until approved in writing.
2. `/services` process: Tell us → Plan & quote → Agree (in writing) → Run → Report.
3. Social Media FAQ: the approval options offered to clients.
4. Creative FAQ: rights and ownership written into the agreement before production.
5. Influencer: creator fees quoted separately from the management fee, and paid posts checked for disclosure after they go live.
6. Websites: "The site you're reading is our own work". It also names Shopify, WordPress and Webflow as platforms ZBM will build in. **Confirm ZBM will take that work.**
7. Websites: "built to WCAG 2.2 AA as the target, and checked". This is a target, not a compliance claim.
8. TV & Radio pricing: the media is paid "by you directly, or through us at cost", written into the agreement. **This depends on the CPA/counsel media pass-through answer.** See `FULL-SERVICE-DESIGN.md` §3. Until then, the client pays the media vendors directly.
9. TV, Radio and Social: "through our Creative & Production service". At launch that service is delivered by people and vendors (crews, voice talent, music licensing), not an in-house studio.
10. Radio: host reads "must be identified as a paid message".
    - For broadcast, sponsorship identification is the station's duty under FCC rules (47 CFR 73.1212).
    - For podcasts it falls under the FTC Endorsement Guides.
    - ZBM can require it in the insertion order, but cannot guarantee a third party's conduct.
11. Influencer:
    - "you can require approval before anything posts"
    - sales reported "wherever codes or tracked links make them measurable"
    - the disclosure answer. **Counsel should check the disclosure answer against 16 CFR 255 and the FTC's "Disclosures 101" before launch.**
12. `/services` "Who we serve" lists clinics and legal services. Advertising for clinics raises HIPAA/tracking-pixel questions, and advertising for law firms is subject to state bar advertising rules. Both raise the same kind of issue that kept Political Advertising off the site. Decide whether to keep them listed before campaigns target them.
13. The Websites page says lead capture is "tested before launch" while this site's own forms are still the stub. Wire the lead route before running ads to the Websites page.

## AEGIS review
An independent reviewer read the full diff on Oct 4 2026 (read-only).
- **Result:** 0 Critical, 0 High, 4 Medium, 4 Low.
- **All 8 were addressed in the follow-up commit:**
  - the copy fixes above, with commitments added to this list (items 8–13);
  - the intake budget/timing field errors now show their own messages, and their values are derived from `lib/lead.ts`;
  - `src` tags are stored lowercase;
  - the nav test is scoped to the Services menu;
  - the CTA primacy test was added;
  - each checkbox's hint is moved out of its accessible name.

## Verification on this branch (sandbox)
- `pnpm lint` and `pnpm typecheck` pass. `next build` (zbm) passes.
- Playwright: 310 of the existing tests passed unchanged. 19 failed only on the intended IA changes; those tests (phase-3 ZBM nav/footer, phase-4-zbm Home §2/stat/Scale, FAQ groups) were updated to the amended values.
- The new phase-6 gate has 20 tests × 2 viewports (40 runs). All pass. Screenshots are in `e2e/snapshots/phase-6-full-service/`.
- **Sandbox caveats** (see `e2e/playwright.sandbox.config.ts`):
  - The cloud sandbox has no WebKit, so the 390 project ran on Chromium emulating iPhone 14.
  - Google Fonts is blocked there. The build used the same families served locally from `@fontsource`.
  - **Re-run the canonical gate (`pnpm e2e`) on the Mac before treating this phase as closed.** Earlier phases' committed screenshots were deliberately not overwritten.
