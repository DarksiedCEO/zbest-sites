# Brief amendment: no draft or attorney-review wording on either site (Oct 30, 2026)

**Status:** applied on branch `legal-zbm-in-effect`. Founder decision. It is not merged to `main`.
**Amends:** `ZBM-ZBC-Build-Brief-v2.md`. The Brief itself is locked and is not edited; this note supersedes the lines below.

## Decision
**Founder decisions, Oct 30 2026.** Relayed by the coordinator; this session did not witness them.

1. Neither website shows "Draft — pending attorney review. Not yet in effect." or any similar attorney-review or draft-status wording. That covers the pages, their metadata and the cookie banner. The founder never asked for that wording.
2. Z Best Media's legal documents are published and in effect: Privacy Policy, Terms of Service, Cookie Policy, Refund and Cancellation Policy and Accessibility Statement. The text lives in `apps/zbm/lib/legal.ts`. It must match what the code does, and a production build fails while any bracketed fact is unfilled.
3. Until Z Best Clips publishes its terms, each of its legal pages is an outline of topics and shows: **"Z Best Clips is not yet accepting clients. These terms will be published before launch."** The pages stay noindex and are not presented as in effect.

## Lines superseded
| Brief location | Brief says | Now |
|---|---|---|
| §5 Legal documents, line 166 | The documents "require attorney review before publishing", and the page shells carry a visible banner, "Draft — pending attorney review. Not yet in effect." | ZBM: in-effect documents with no status banner. ZBC: the not-yet-accepting-clients notice above. No draft or review-status wording on either site. |
| §3 launch checklist, line 156 | "legal pages show placeholder banners" | ZBM legal pages show their in-effect text and no banner. ZBC legal pages show the not-yet-accepting-clients notice. |
| Post-launch list, line 716 | "Attorney-reviewed legal text → replace placeholders, remove banners." | ZBM's text is already in effect. When Z Best Clips publishes its terms, the outlines and notice are replaced by those terms. |

## How it is held
- `e2e/tests/phase-3.spec.ts` fails if either site's legal pages, their meta descriptions or the cookie banner contain "pending attorney", "attorney review", "not yet in effect" or the word "draft".
- It also checks that the ZBC pages show the notice above, first in `<main>`, and that they are noindex.
- `packages/ui` carries no status wording of its own. `LegalShell` and `CookieConsent` take every visible sentence from the app.
- `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` and `docs/ZBM-ZBC-Legal-Document-Brief.md` record the same decision.
