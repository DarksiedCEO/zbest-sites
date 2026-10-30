# Spec amendment — service area on every lead form (Oct 30, 2026)

**Status:** applied on branch `site-region-2026-10-30`. It is not merged to `main`. It is **pending the backend author's acceptance** (the spec is DRAFT, and §11/§12 are built against fixtures behind the typed adapter).
**Amends:** `backend-interface-spec-v0.4.md` §11.3 (`AssessmentRequest`) and §12.7 (`ReadinessRequest`), which are certified at `92cbf36` and `2758bfb`. The spec text is amended in place, the same way the 2026-09-18 founder ruling amended §11.3 after certification. The file name and version stay v0.4, because CLAUDE.md pins that path.

## Why

Founder decisions, Oct 30 2026:
- **11:50** — the service area is the 50 US states, DC, Puerto Rico and Guam only; no Canada or UK. (Relayed by the coordinator; paraphrased.)
  - The form asks for "State or territory" with ISO codes, and the server validates it with zod against that exact set.
  - "Outside these areas" gets a polite decline, and nothing is stored.
- **12:51** — the select must include **all inhabited US territories**. That adds the US Virgin Islands (VI), American Samoa (AS) and the Northern Mariana Islands (MP), for 56 codes.

So the rule is: **the service area is the 50 states, DC and all inhabited US territories, enforced at intake.** Every lead form now asks for the business's state or territory. The free assessment (§11) and the readiness check (§12) are lead forms: §11.3 says "Submitting an assessment records the lead exactly as the current lead route does", and §12 inherits that. So their requests gain the field too.

This is a founder-driven change to a certified contract, not a guessed DTO. It is recorded here so the backend author can accept or reject it explicitly.

## What changed in the contract

| | Before (certified) | After (amended) |
|---|---|---|
| `AssessmentRequest` (§11.3) | `submission_id, rule_set_version, contact, answers` | same, plus **`region: { state }`** (required) |
| `ReadinessRequest` (§12.7) | `submission_id, rule_set_version, contact, answers` | same, plus **`region: { state }`** (required) |
| `state` values | — | exactly 56 codes: `US-AL`…`US-WY` (50), `US-DC`, `PR`, `GU`, `VI`, `AS`, `MP`; or `"outside"` |
| `"outside"` | — | `422 { ok: false, error: { code: "region_unavailable" } }`. No result is returned, and nothing is stored or sent. |
| missing, non-object or unknown | — | `422`, `fields: { state: "Choose your state or territory." }` |
| `contact` | four fields | **unchanged** (`region` is a sibling, not a fifth contact field) |
| results (§11.5, §12.7) | — | **unchanged** |

The 56 codes are `SERVICE_AREAS` in `packages/lead/src/region.ts`. The forms render their options from that list, and both client and server validate with `REGION` from the same file (§11.3 "One schema, both sides"). The database enforces the same set with `leads_service_area_check` (`packages/lead/sql/005_region_territories.sql`), and `migrate.mjs` refuses to finish unless the live constraint accepts exactly those codes.

## What the backend author is asked to accept

1. Both request DTOs carry `region: { state }` with the 56-code set above, required.
2. `region_unavailable` (422) is a typed refusal that records nothing. Every lead route already has it (`packages/ui/src/lead/contract.ts`).
3. A recorded lead stores the code as `service_area` (nullable only for rows from before this change).

If the backend rejects this, the fallback is to collect the area in a separate lead step. That would change the forms, not the scoring contract. Nothing in scoring (§11.4, §12.6) reads `region`.

## Not changed

- The questions, rule sets, rule-set versions and hashes.
- The result DTOs, routing and copy.
- §11 and §12 stay DESIGN_NOW_IMPLEMENT_LATER on the backend. The frontend still runs on fixtures.
- Privacy Policy text. The legal-text agent adds the collected field there, on its own branch.
