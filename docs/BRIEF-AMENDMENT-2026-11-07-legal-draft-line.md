# Brief amendment: draft line on legal pages until the founder adopts them (Nov 7, 2026)

**Status:** applied on branch `legal-zbm-in-effect` (PR #10). Founder direction of Nov 7 2026, relayed by the launch work order; this session did not witness it.
**Supersedes, until adoption:** item 1 of `BRIEF-AMENDMENT-2026-10-30-legal-banner.md` (no draft wording).

## Decision
- The founder adopts the policies himself; attorney review comes later.
- Until he approves `docs/LEGAL-ADOPTION-SUMMARY.md` in writing on PR #10, every legal page on both sites shows **"Draft — pending attorney review."** first in `<main>` (`[data-legal-status]`).
- No other status wording appears on the pages, in their metadata or in the cookie banner. The e2e gate (`e2e/tests/phase-3.spec.ts`) still enforces this.
- After approval, set `LEGAL_ADOPTED` (apps/zbm/lib/legal.ts), `ZBC_LEGAL_ADOPTED` (apps/zbc/lib/legal.ts) and the `LEGAL_ADOPTED` mirror in phase-3.spec.ts to `true` in one change.

## Also in this change
- Cookie banner: "Accept all" and "Reject non-essential" share one style. This makes the Cookie Policy's "equal prominence" claim true, and phase-3 compares the two buttons' computed styles.
- Refund Policy: no longer cites an MSA, SOWs, Stripe, or the SEO audit and Revenue Recovery packages, none of which exist. It states minimum promises for any signed client agreement. `legal-zbm.spec.ts` guards against their return.
- Terms: removed "media buying" (founder ruling: no media-buy claims) and the MSA/SOW example.
- Privacy: names Neon as the database host and says assessment results are stored.
