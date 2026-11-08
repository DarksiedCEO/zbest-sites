# Z Best Media & Z Best Clips — Backend Interface Spec v0.4

Reconciled with Phase 1 domain contracts — MINIMUM GOVERNED PILOT model

**Status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** This is not an approved API contract, not production-ready, and does not authorize any real money movement or live publication. Phase 1 uses simulated/fake adapters throughout. This supersedes v1 — v1's core entities were directionally right but under-specified on money integrity, fraud evidence, and tenancy; those corrections are incorporated below.

**Amended after certification, 2026-10-30 (founder decision: service area).** §11.3 and §12.7 each gain one required request field, `region: { state }`, and one typed refusal, `422 region_unavailable`. Nothing else in v0.4 changes; The certifications of §11 at `92cbf36` and §12 at `2758bfb` cover the text before this amendment only; this amendment is **not covered by either certification** and is pending the backend author's acceptance. Record: `docs/SPEC-AMENDMENT-2026-10-30-service-area.md`.

**v0.4 changes (2026-09-18).** One addition: **§12 (new)**, the AI Visibility Readiness Check, carrying founder decision 11 (`docs/TOOLING.md`). Sections 1–11 are carried over from v0.3 **unchanged, byte for byte**, including §11 as amended after its certification. The auditor certified §12 at `b440211` with one condition, C3. The founder then approved every item first written as PROPOSED — the eight categories, their tie-break order, the eight questions and the Visibility Gap Library copy — with the business-profile wording changed and the routing decided (2026-09-18). C3 is applied in §12.8. Status is unchanged: DRAFT. Nothing in §12 is built until the founder gives the go for the build.

**v0.3 changes (2026-09-18).** Written by the frontend build session under explicit founder delegation (2026-09-18), to carry the founder ruling of 2026-09-17 on the free assessment — recorded as founder decision 10 in `docs/TOOLING.md`. Sections 1–9 are carried over from v0.2 **unchanged, byte for byte**; only two things move:

- **§10** — the deferred Revenue Recovery assessment item is removed from the deferred list and promoted.
- **§11 (new)** — the Revenue Recovery assessment: two tiers that differ in kind, their shapes, and the rule that connects them.

The two parts of §11 first written as PROPOSED were approved by the founder on 2026-09-18, after the auditor's gate at `f6450b6`: the eight-question set in §11.3, with its answer scale changed to "Not true · Somewhat true · Very true", and the tie-break priority order in §11.4, as proposed. Because the build session wrote the contract it will later build against, this revision is reviewed by the auditor before approval, and the backend author accepts it before implementing it. Status is unchanged: DRAFT.

**Governing principle:** build the minimum governed model — not maximum enterprise machinery, not a collapsed prototype. Authority, money, and evidence boundaries are not optional because the pilot is pre-revenue. Implementation depth can be deferred; correctness of boundaries cannot.

Every entity and decision below is labeled:

- **IMPLEMENT_NOW** — required for Phase 1, low deferral cost is false (retrofitting later is expensive or unsafe)
- **DESIGN_NOW_IMPLEMENT_LATER** — shape agreed now so nothing has to be re-architected, full build deferred
- **DEFER_UNTIL_EVIDENCE** — real campaign usage should inform the actual design; building it now risks guessing wrong

## 1. Identity and Tenancy — IMPLEMENT_NOW

```
User {
  id: UUID
  email: string
  status: enum ["active", "suspended", "pending_verification"]
  created_at: datetime
}

RoleAssignment {
  user_id: UUID (FK -> User.id)
  role: enum ["clipper", "client", "admin"]
}

Organization {
  id: UUID
  name: string
  type: enum ["client_org", "internal"]
}

Membership {
  user_id: UUID (FK -> User.id)
  organization_id: UUID (FK -> Organization.id)
  membership_role: enum ["owner", "member"]
}

ClipperProfile {
  user_id: UUID (FK -> User.id)
  display_name: string
  payout_provider_id: string | null      // see Money section — no raw tax ID stored here
  status: enum ["active", "under_review", "suspended"]
}

SocialAccountConnection {
  clipper_id: UUID (FK -> ClipperProfile.user_id)
  platform: enum ["tiktok", "instagram", "youtube"]
  connection_type: "read_only"
  oauth_state: string
  token_vault_ref: string                // actual token lives in a vault, not this table
  scopes: [string]
  status: enum ["pending", "connected", "revoked"]
}
```

A Campaign belongs to an Organization, never directly to a single user. A user may hold multiple role assignments. Every governed resource carries organization and campaign scope where applicable. This costs one extra foreign key now and prevents a real authorization-model rewrite once a client has more than one team member.

## 2. Reward Policy — IMPLEMENT_NOW

```
RewardPolicy {
  id: UUID
  campaign_id: UUID (FK -> Campaign.id)
  schema_version: string
  calculation_version: string
  currency: string                          // ISO 4217, e.g. "USD"
  reward_rate_per_1000_minor_units: integer
  minimum_eligible_views: integer
  minimum_payout_minor_units: integer
  maximum_payout_minor_units: integer        // per-creator, per-video cap
  approved_post_fee_minor_units: integer | null   // Brand campaigns: guaranteed flat fee
  performance_rate_minor_units_per_1000: integer | null  // Brand campaigns: bonus on top
  policy_hash: string                        // SHA-256 of the canonical policy content
  created_at: datetime
  activated_at: datetime | null
  status: enum ["draft", "active", "superseded"]
}
```

Immutable after activation. Changing a campaign's economics creates a new `RewardPolicy` record (new version, new hash) — it never edits the policy that governed already-accepted work. This directly protects the "guaranteed flat fee" and "disclosed rate" promises already published in the site copy; without this, those promises aren't actually enforceable in the data.

Entertainment vs. Brand weighting is not hard-coded in application logic — it's expressed entirely through which fields on a given `RewardPolicy` are populated. The calculation layer reads the policy, it doesn't branch on `focus_area` in code.

## 3. Fraud and Disputes — IMPLEMENT_NOW (minimum structured form)

```
EvidenceEntry {
  id: UUID
  submission_id: UUID (FK -> Submission.id)
  signal_type: string                       // typed, schema-versioned JSONB payload
  signal_data: JSONB
  schema_version: string
  recorded_at: datetime
}   // append-only — never edited or deleted

FraudCase {
  id: UUID
  submission_id: UUID (FK -> Submission.id)
  status: enum ["open", "investigating", "resolved"]
  opened_at: datetime
}

FraudDecision {
  id: UUID
  fraud_case_id: UUID (FK -> FraudCase.id)
  decision: enum ["cleared", "rejected"]
  decided_by: UUID (FK -> User.id, admin)
  rationale: string
  decided_at: datetime
}

Appeal {
  id: UUID
  submission_id: UUID (FK -> Submission.id)   // unique constraint: one appeal per submission, enforced at the DB level
  clipper_id: UUID (FK -> ClipperProfile.user_id)
  written_explanation: string
  status: enum ["pending", "upheld", "overturned"]
  resolved_by: UUID (FK -> User.id, admin) | null
  resolved_at: datetime | null
  submitted_at: datetime
}
```

No single mutable `bot_score` field as the source of truth. A submission's fraud signals accumulate as append-only `EvidenceEntry` records; a `FraudCase` and its `FraudDecision` are separate from the appeal that may follow. The person who flags, the person who decides, and the person who resolves an appeal should be separable — this is what makes the "human review, real appeal process" promise in the copy actually true in the system rather than aspirational.

## 4. Money — IMPLEMENT_NOW (ledger-derived, simulated execution only)

```
BudgetReservation {
  id: UUID
  campaign_id: UUID (FK -> Campaign.id)
  currency: string
  amount_minor_units: integer
  status: enum ["reserved", "released", "consumed"]
  created_at: datetime
}

RewardObligation {
  id: UUID
  submission_id: UUID (FK -> Submission.id)
  reward_policy_id: UUID (FK -> RewardPolicy.id)
  amount_minor_units: integer
  status: enum ["pending", "confirmed", "voided"]
  created_at: datetime
}

LedgerEntry {
  id: UUID
  account_ref: string                       // clipper or campaign account reference
  amount_minor_units: integer                // signed
  entry_type: enum ["reservation", "obligation", "payout", "reversal"]
  related_id: UUID                           // FK to whichever record generated this entry
  created_at: datetime
}   // append-only — balances are always derived by summing entries, never stored as a mutable field

ExternalEffectIntent {
  id: UUID
  reward_obligation_id: UUID (FK -> RewardObligation.id)
  adapter: enum ["fake_ach", "fake_instant", "fake_wire"]   // Phase 1: FAKE adapters only, no real processor execution
  status: enum ["pending", "sent", "failed"]
  created_at: datetime
}

ExternalEffectOutcome {
  id: UUID
  intent_id: UUID (FK -> ExternalEffectIntent.id)
  outcome: enum ["success", "failure"]
  receipt_ref: string
  recorded_at: datetime
}
```

Balances are always derived from `LedgerEntry` sums — never a stored, mutable total. Phase 1 supports simulated payouts only, through fake adapters. No ACH, Venmo, crypto, or wire execution is active. Tax identity is held by a regulated payout provider wherever viable — Z Best Clips stores a `payout_provider_id` and verification status, not a raw SSN/EIN. This decision also resolves part of the Merchant of Record question raised in v1: whether Z Best Media acts as principal, agent, or marketplace operator still needs counsel and accounting review, but the data model doesn't hold sensitive tax identity regardless of how that's answered.

## 5. Measurement — IMPLEMENT_NOW

```
MetricObservation {
  id: UUID
  submission_id: UUID (FK -> Submission.id)
  raw_views: integer
  eligible_views: integer
  excluded_views: integer
  exclusion_reason: string | null
  observation_window_start: datetime
  observation_window_end: datetime
  collection_method: string
  schema_version: string
  recorded_at: datetime
}   // append-only
```

Current totals shown to clients and clippers (the "verified reporting" feature described throughout the site copy) are derived read-model aggregates, never the authoritative record. The authoritative record is the observation history — this is what lets a dispute be resolved by looking at what was actually observed and when, rather than trusting whatever the current total happens to say.

## 6. Editorial and Rights — DESIGN_NOW_IMPLEMENT_LATER (simplified from the full proposed lineage)

```
SourceAsset {
  id: UUID
  campaign_id: UUID (FK -> Campaign.id)
  asset_ref: string                          // governed artifact ID, not a raw public URL
  content_hash: string
}

RightsGrant {
  id: UUID
  source_asset_id: UUID (FK -> SourceAsset.id)
  granted_by: UUID (FK -> User.id, client)
  scope: string
}

Approval {
  id: UUID
  source_asset_id: UUID (FK -> SourceAsset.id)
  approved_by: UUID (FK -> User.id, admin)
  status: enum ["approved", "rejected"]
  approved_at: datetime
}
```

Deliberately narrower than the full eight-stage lineage proposed in review (`SourceAsset → SourcePackage → EditVersion → RightsGrant → CreativeApproval → RightsApproval → Publication → MetricObservation` with cascading invalidation). That level of formal content-versioning is real, sound design for a mature platform — but it's workflow machinery justified by a scale of operation Z Best Clips doesn't have yet. Getting this wrong costs a manual fix, not a financial or fraud-integrity failure, which is a different risk category than Sections 2-5 above. Full lineage and approval-invalidation cascades move to explicit `DEFER_UNTIL_EVIDENCE` — revisit once real campaigns show whether clients actually need that level of formal control over asset versions.

## 7. Campaign and Submission Core

```
Campaign {
  id: UUID
  organization_id: UUID (FK -> Organization.id)     // not a user
  focus_area: enum ["entertainment", "brands"]
  distribution_mode: enum ["CREATOR_OWNED_ACCOUNT", "CLIENT_OWNED_ACCOUNT"]  // explicit, not derived from focus_area
  vertical: enum ["music", "film", "sports", "streaming", "podcast", "auto_dealership", "med_spa"]
  status: enum ["draft", "control_review", "funding_confirmed", "simulation_ready", "simulation_active", "paused", "completed", "cancelled"]
  active_reward_policy_id: UUID (FK -> RewardPolicy.id)
  platforms: [enum: "tiktok", "instagram_reels", "youtube_shorts"]
  target_views: integer | null
  created_at: datetime
}

Submission {
  id: UUID
  campaign_id: UUID (FK -> Campaign.id)
  clipper_id: UUID (FK -> ClipperProfile.user_id)
  platform: enum ["tiktok", "instagram_reels", "youtube_shorts"]
  post_ref: string
  status: enum ["pending_review", "approved", "rejected", "under_fraud_review"]
  submitted_at: datetime
}
```

IMPLEMENT_NOW: `distribution_mode` as an explicit field, not derived from `focus_area` — a campaign's actual posting mechanics should never be inferred from an unrelated classification field. Funding does not automatically activate a campaign — `funding_confirmed` and `simulation_active` are distinct states, with production activation not available in Phase 1 at all.

## 8. API Design — IMPLEMENT_NOW baseline

- Commands (`POST`, `PATCH`) and queries (`GET`) kept structurally separate
- No single review endpoint triggers payout — editorial approval, fraud decision, appeal resolution, and payout execution are separate authorities, separate endpoints
- Tenant-aware authorization on every request
- Idempotency keys on all mutating requests
- Optimistic concurrency (version checks) on updates
- Standard error envelope, pagination, audit correlation IDs
- API and schema versioning from the first endpoint
- OAuth: full authorization/callback/revocation flow for social account connections, not a single POST

## 9. Frontend Compatibility — IMPLEMENT_NOW

Frontend-facing read DTOs are defined separately from the authoritative write/persistence models above — the frontend never receives or depends on internal ledger or evidence-table shapes directly. Claude Code's frontend build should:

- Keep all API calls behind a typed adapter
- Clearly label any data as fixtures until this contract is implemented
- Never hard-code these enums directly into components
- Perform no real publication, funding, or payout — Phase 1 is simulated end to end
- Expect DTOs to shift during reconciliation as real endpoints come online

## 10. Explicit Deferred Items — DEFER_UNTIL_EVIDENCE

- Full eight-stage editorial/rights lineage and cascading approval invalidation (Section 6)
- Full fraud case-management tooling beyond the minimum four records in Section 3
- Any real payment processor integration (Stripe Connect or equivalent) — Phase 1 uses fake adapters exclusively
- Multi-organization permission granularity beyond owner/member

*Removed in v0.3:* "The Revenue Recovery assessment tool's real input schema — still needs to be pulled from the live tool before `AssessmentResult` can be finalized." Promoted to §11. Its precondition is **superseded, not satisfied**: the founder ruling ends the live tool's role as the free deliverable, and the free tier's input is designed in §11.3 against the leak taxonomy. The live tool is reference only.

## 11. Revenue Recovery Assessment — DESIGN_NOW_IMPLEMENT_LATER

Founder ruling, 2026-09-17 (`docs/TOOLING.md`, founder decision 10). Promoted from §10 in v0.3. Shape agreed now; built in Phase 5, against fixtures behind the typed adapter (§9), only after this section is approved.

### 11.1 Two tiers, differing in kind

| | Free assessment | Paid Revenue Recovery Audit |
|---|---|---|
| Produced by | a deterministic rule set | an AI draft, a deterministic verifier, then human approval |
| Returns | one leak category with its rationale and remediation — or `insufficient_signal` | the approved Audit document |
| Timing | immediate, synchronous | asynchronous, gated on approval |
| Human in the loop | never | always, before release |
| Dollar figures | impossible by construction | none specified in v0.3 |
| Model-generated text | impossible by construction | yes, verifier-gated |

Guarantees in this section are **per tier**. Nothing below applies to both tiers unless it says so. Conflating them is the main way this gets built wrong.

### 11.2 AssessmentRuleSet — the free tier's rules, as data

```
AssessmentRuleSet {
  id: UUID
  version: string
  taxonomy: [LeakCategory]                 // all eight, served to the frontend — §9: never hard-coded
  questions: [AssessmentQuestion]
  priority_order: [LeakCategory]           // total order over all eight; breaks ties (§11.4)
  copy: { [LeakCategory]: { rationale: string, remediation: string } }
  rules_hash: string                       // SHA-256 of the canonical content of every field above
  status: enum ["draft", "active", "superseded"]
  created_at: datetime
  activated_at: datetime | null
}

LeakCategory = enum ["traffic", "conversion", "trust", "offer",
                     "follow_up", "tracking", "creative", "visibility"]

AssessmentQuestion {
  id: string                               // stable key; in v0.3 equal to its category
  category: LeakCategory                   // exactly one category per question in v0.3
  statement: string
  scale: enum ["likert_3"]                 // 0 = Not true · 1 = Somewhat true · 2 = Very true
}
```

Immutable after activation — the same pattern and the same reason as `RewardPolicy` (§2). Changing a question, the priority order, or any copy creates a new version with a new hash; it never edits the rule set that produced results already returned. Every result records the version and hash that produced it. That is what makes "deterministic" checkable rather than asserted: the same answers under the same `rules_hash` always return the same result.

**The rule set's copy is derived, not authored.** The active rule set's `copy` is derived from the published Revenue Leak Library: each category's `rationale` is that library's description of the category and its `remediation` is that library's "Fix direction", both character for character. Editing the copy means editing the published Leak Library, which is certified site copy, and then deriving a new rule set version from it — never writing different text into a rule set directly.

The eight categories and their display names are exactly those already published in the site's Revenue Leak Library: Traffic, Conversion, Trust, Offer, Follow-Up, Tracking, Creative, Visibility.

**"Messaging Leak" is Offer, not a ninth category** (founder ruling, 2026-09-18). The Industry Leak Patterns section of the same page labels one pattern "Messaging Leak" — Professional Services, "the value proposition is too abstract to move buyers." That is an industry-specific name for the Offer category ("the value is not clear or compelling"), kept on the page as written. The taxonomy stays at eight. No result may return `messaging`; a Professional Services business whose leak is its value proposition receives `offer`.

### 11.3 AssessmentRequest — the free tier's input

Extends the existing "Get an Assessment" form. The four contact fields are unchanged; `answers` is new, and `region` was added by the amendment of 2026-10-30 (below).

```
AssessmentRequest {
  submission_id: UUID                      // client-generated idempotency key, as the lead route already uses
  rule_set_version: string                 // the version the form was rendered from
  contact: { name, business, website, reach }    // unchanged from the current form
  region: { state: ServiceArea | "outside" }     // amendment 2026-10-30; required
  answers: [{ question_id: string, value: 0 | 1 | 2 }]
}
```

**Amended after certification, 2026-10-30 (founder decision: service area).** Z Best Media serves businesses in the 50 US states, the District of Columbia and all five inhabited US territories, and the rule is enforced at intake. Every lead form, this one included, therefore carries `region`:

- `ServiceArea` is exactly 56 codes: the 50 states as ISO 3166-2 (`US-AL` … `US-WY`), `US-DC`, and the territories as ISO 3166-1 alpha-2 (`PR`, `GU`, `VI`, `AS`, `MP`). The list is published as `SERVICE_AREAS` in `packages/lead/src/region.ts`, the one schema both client and server validate from (see "One schema, both sides" below), and the database enforces the same set (`leads_service_area_check`).
- `"outside"` ("Outside these areas") is a valid answer that is **declined**: `422 { ok: false, error: { code: "region_unavailable" } }`. No result is returned, no lead is recorded and nothing is sent.
- A missing `region`, a non-object, or any other `state` value is a field error: `422` with `fields: { state: "Choose your state or territory." }`. Codes are case-sensitive and trimmed of surrounding whitespace.
- `region` is a sibling of `contact`, so the four contact fields stay exactly as certified. A recorded lead stores the code as `service_area`.

- Every question in the rule set is answered exactly once. Values outside {0, 1, 2}, unknown `question_id`s, and duplicates are rejected.
- A request against a superseded `rule_set_version` is rejected with a typed error, so the form re-renders against the active version rather than being scored against rules the respondent never saw.
- **No free-text field feeds the rule.** A deterministic rule cannot map prose onto a category, and anything that could would be a model — which is what the free tier no longer contains.
- **One schema, both sides.** Client and server validate from the same schema definition, not two hand-written ones. The live tool's extraction records four client/server validation mismatches; this requirement makes that class of defect impossible by construction rather than something review has to catch.
- Submitting an assessment records the lead exactly as the current lead route does. v0.3 does not change lead recording.

**Question set — founder-approved, 2026-09-18.** Customer-facing copy, approved after the auditor's gate. One statement per category, each written about the *cause* the business can observe rather than the symptom — because the symptoms of Conversion, Offer and Trust overlap heavily from the outside ("people visit but don't buy" fits all three), while their causes do not:

| id | Statement shown to the respondent |
|---|---|
| `follow_up` | When a lead comes in, we don’t always respond fast or follow up consistently. |
| `conversion` | Our site or booking process makes it hard for people to take the next step. |
| `offer` | People aren’t sure what they get from us, or why it’s worth it. |
| `trust` | We don’t have enough reviews, proof, or credentials in front of visitors. |
| `tracking` | We can’t tell which ads, pages, or channels actually bring in revenue. |
| `creative` | Our ads get attention or clicks, but not many real buyers. |
| `visibility` | We’re hard to find in search results, map listings, or AI search. |
| `traffic` | We don’t get enough qualified visitors or inquiries in the first place. |

**Amended after certification, 2026-09-18 (founder ruling):** the six statements containing apostrophes use curly apostrophes (’, U+2019), matching the site's typography; they were first written with straight ones. The wording is unchanged. Under §11.2 a changed question is a new rule-set version, so the fixture moved from `fixture-2026-09-18.1` to `fixture-2026-09-18.2` with a new hash.

Answered on one scale throughout: **Not true · Somewhat true · Very true** (founder ruling, 2026-09-18 — changed from the proposed "Not really · Somewhat · Very true" so that all three answers take the same form).

### 11.4 The rule

1. Score each category as the value given for its question.
2. If every score is 0, return `insufficient_signal`. **Do not pick a category.**
3. Otherwise return the category with the highest score. Break ties by `priority_order`.

**Priority order — founder-approved, 2026-09-18, as proposed:** Follow-Up, Conversion, Offer, Trust, Tracking, Creative, Visibility, Traffic.

The reason is the site's own published thesis — "Most businesses aren't short on traffic. They're losing the traffic they already paid for — at the phone, the form, the follow-up," and "conversion repaired before a dollar more goes into spend." Leaks that lose traffic already paid for rank above anything that would recommend buying more of it, and Traffic ranks last. Note the consequence: because Conversion, Offer and Trust can plausibly all score 2 for the same business, the tie-break carries real weight for those three. That is a reason to review the order deliberately, not a defect in it.

### 11.5 FreeAssessmentResult — the frontend read DTO

```
FreeAssessmentResult {
  tier: "free"
  submission_id: UUID
  status: enum ["leak_identified", "insufficient_signal"]
  category: LeakCategory | null            // null if and only if status is insufficient_signal
  rationale: string | null
  remediation: string | null
  because: {                               // null if and only if status is insufficient_signal
    question_id: string
    statement: string
    value: 1 | 2
    value_label: enum ["Somewhat true", "Very true"]
  } | null
  tie_broken_by_priority: boolean
  rule_set_version: string
  rule_set_hash: string
  produced_at: datetime
}
```

Invariants, by construction — enforced on the type, not merely true in practice:

- **No text in the free path is generated, assembled from free input, or model-written.** Every string is either copied verbatim from the active rule set or an enumerated label. Where the frontend shows a sentence joining them ("Because you said … is very true for you"), that sentence is a fixed template.
- `rationale` is the published Revenue Leak Library description of `category`, verbatim. `remediation` is that library's published "Fix direction", verbatim. The free result introduces no new copy.
- **The Phase 5 gate asserts it.** The gate checks that the fixture rule set's `rationale` and `remediation` strings equal the corresponding `LEAK_LIBRARY` strings character for character, for all eight categories. A mismatch fails the gate; it is never resolved by changing the assertion.
- **No field may hold a currency, a monetary amount, or any numeric estimate of revenue lost or recovered.** A backend change that needs one is a change to this contract, not an implementation detail.
- **No field is approval-gated.** A result that needs a human before release is not a free-tier result.
- `insufficient_signal` is a first-class outcome, not an error. The frontend routes it to the paid Audit and to Talk to Us. A category is never invented to avoid returning it.
- `tie_broken_by_priority` exists so the frontend can say so honestly — "several leaks scored equally; this is the one we'd fix first" — instead of implying a certainty the scoring doesn't have.

### 11.6 Paid Audit — governance envelope only

The document itself is the existing AI-drafted Audit, and its body schema stays where it is. v0.3 specifies how it is governed, not what it contains.

```
PaidAuditDocument {
  tier: "paid"
  id: UUID
  submission_id: UUID
  status: enum ["drafting", "verifier_failed", "awaiting_approval",
                "approved", "rejected", "delivered"]
  verifier_result: enum ["pass", "fail"] | null
  verifier_report_ref: string | null
  approved_by: UUID (FK -> User.id, admin) | null
  approved_at: datetime | null
  delivered_at: datetime | null
  document_ref: string                     // governed artifact reference, as §6 SourceAsset.asset_ref
  created_at: datetime
}
```

Each transition is a separate authority — the same principle as §8, where editorial approval, fraud decision and payout are separate endpoints:

- `drafting → awaiting_approval` only on a verifier `pass`; a `fail` goes to `verifier_failed`.
- `awaiting_approval → approved | rejected` only by an admin, recorded in `approved_by`.
- `approved → delivered` only from `approved`.
- **`rejected` is terminal.** A redraft is a new `PaidAuditDocument` with a new `id` against the same `submission_id`. A rejected document is never edited back into `drafting`, so its record, its verifier report and its rejection stay intact for audit.
- **`verifier_failed` is terminal.** A redraft is a new `PaidAuditDocument` with a new `id` against the same `submission_id`. A document that failed the verifier is never edited back into `drafting`, so its record and its verifier report stay intact for audit.

No path reaches `delivered` without `approved`, and none reaches `approved` without a verifier pass. **Delivery is an explicit state with its own timestamp**, because the live tool records no delivery path to the lead at all; making it a state makes it auditable.

### 11.7 Not in this contract

- **Pricing.** The paid tier's price is commercial, not contractual. No price, currency or payment field appears anywhere in §11. Taking payment for the Audit through the site would be a separate contract and an explicit future decision.
- **The Audit document's body schema** — see §11.6.
- **Any real endpoint.** Phase 5 builds against fixtures behind the typed adapter (§9) until this section is approved and implemented.

## 12. AI Visibility Readiness Check — DESIGN_NOW_IMPLEMENT_LATER

Founder decision 11, 2026-09-18 (`docs/TOOLING.md`). The free check offered on the Search Intelligence page. Shape agreed now; built only after v0.4 is certified, against fixtures behind the typed adapter (§9). The page, and the check with it, stays unlinked and noindex.

### 12.1 What it is, and what it is not

**It is** a deterministic, rule-based readiness check. The prospect rates eight statements about signals AI answer engines use; rules return **one prioritized visibility gap**, with a because-line and a fix direction.

**It is not** a measurement of what any engine says. No live engine queries, no AI drafting, no dollar figure, and **no claim about what any engine currently says, shows or ranks for the business**. The result describes readiness signals the prospect reported, never observed engine output.

**Retired permanently from the free tier:** "whether and how your business currently shows up when someone asks ChatGPT, Gemini, or Perplexity", and any equivalent. Live engine observation belongs to the paid Audit or the Search Intelligence backend, later, and is not specified here.

**Name:** AI Visibility Readiness Check.

**Vocabulary:** "gap", never "leak". No type, field, status or copy in §12 reuses §11's leak vocabulary, and nothing collides with the Revenue Leak Library. §11 has a "Visibility Leak"; §12 has visibility gaps, and they are different tools that must not read as the same.

### 12.2 What §12 inherits from §11, unchanged

- **The scale:** `likert_3`, with the same three labels — Not true · Somewhat true · Very true — scored 0, 1, 2.
- **The rule's shape (§11.4):** all zeros is `insufficient_signal`; otherwise the highest score wins and `priority_order` breaks ties, recorded in `tie_broken_by_priority`.
- **An immutable rule set (§11.2):** versioned and hashed; any change to a question, the order or the copy is a new version with a new hash, never an edit in place.
- **Copy derived, not authored (§11.2, C2):** the rule set's rationale and remediation are derived from one published library, and the gate asserts they equal it character for character, for every category.
- **One schema, both sides (§11.3):** client and server validate from the same schema; no free-text answer feeds the rule.
- **Errors (§11.3):** a malformed envelope is 400; a field or answer problem is 422 with field-level errors; a superseded `rule_set_version` is refused with a typed 409 and never scored.
- **By construction (§11.5):** no currency, amount or estimate field on the result type; no model-written text; no approval-gated field; `insufficient_signal` is first-class and a category is never invented.

**Not inherited:** §11's taxonomy, questions, priority order and Leak Library. §12 is a separate rule set with its own taxonomy, and neither rule set reads the other.

### 12.3 VisibilityGapRuleSet

```
VisibilityGapRuleSet {
  id: UUID
  version: string
  taxonomy: [VisibilityGapCategory]         // served to the frontend — §9: never hard-coded
  questions: [ReadinessQuestion]
  priority_order: [VisibilityGapCategory]   // total order over all eight (§12.6)
  copy: { [VisibilityGapCategory]: { name: string, rationale: string, remediation: string } }
  rules_hash: string                        // SHA-256 of the canonical content of every field above
  status: enum ["draft", "active", "superseded"]
  created_at: datetime
  activated_at: datetime | null
}

VisibilityGapCategory = enum ["business_profile", "entity_consistency", "reviews", "crawlability",
                              "structured_data", "answer_content", "brand_citations", "local_listings"]   // founder-approved 2026-09-18

ReadinessQuestion {
  id: string                                // stable key; equal to its category
  category: VisibilityGapCategory           // exactly one category per question
  statement: string
  scale: enum ["likert_3"]
}
```

### 12.4 The Visibility Gap Library — founder-approved copy, the source the rule set derives from

§11 could derive its copy because the Revenue Leak Library was already published, certified site copy before any rule set existed. **Nothing equivalent exists for §12.** So the library below is new customer-facing copy. It was proposed here, gated as copy by the auditor and approved by the founder on 2026-09-18. It is still **published on the Search Intelligence page and certified there before any rule set derives from it.** The published page is the source; this table is the approved text to publish.

**Business-profile wording (founder ruling, 2026-09-18, on the auditor's copy finding).** The proposal said "your own business profile", which a respondent who doesn't know the term would have to guess at. It now describes the profile rather than naming a vendor: **"business profile on maps and in search"**, used the same way in all four places the term appears (Business Profile's row and question, and Local Listings' row and question). Naming a vendor product was declined, since it would go out of date if the search landscape shifts.

Business Profile and Local Listings are hard to tell apart from the outside, since a business profile is itself a listing, so the library defines them apart. **Business Profile** is the business's main profile on maps and in search. **Local Listings** is its presence on the other directories and map apps beyond that profile. **Entity Consistency** is about whether details *match* everywhere, not whether they exist.

| Category | Name | Description (the `rationale`) | Fix direction (the `remediation`) |
|---|---|---|---|
| `business_profile` | Business Profile Gap | The basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search. | Claim your business profile on maps and in search, complete every field, and keep it current. |
| `entity_consistency` | Entity Consistency Gap | Your business name, address, phone number or description reads differently from one place to the next. | Use one exact name, address, phone number and description everywhere your business appears. |
| `reviews` | Reviews Gap | You have few recent reviews, or the reviews you get go unanswered. | Ask every satisfied customer for a review, and respond to the reviews you receive. |
| `crawlability` | Crawlability Gap | Automated crawlers may not be able to reach or read the pages that matter most on your site. | Check your site’s crawler rules and sitemap so your key pages can be reached and read. |
| `structured_data` | Structured Data Gap | Your website doesn’t label its key facts in a machine-readable way. | Add structured data for your business, your services and your most-asked questions. |
| `answer_content` | Answer Content Gap | Your website doesn’t directly answer the questions customers actually ask. | Publish clear, specific answers to the questions your customers ask most. |
| `brand_citations` | Brand Citations Gap | Few other credible websites mention or link to your business. | Earn mentions on credible local and industry websites. |
| `local_listings` | Local Listings Gap | Your business is missing from the directories and map apps beyond your business profile on maps and in search. | Get listed in the directories and map apps that matter for your area and industry. |

The descriptions state what a gap *is*, never that any engine currently misses the business. Consistent with §12.1, none of them claims an observed result.

### 12.5 The eight questions — founder-approved

One statement per category. A statement describes a problem, so "Very true" means the gap is present, as in §11.3. Each is written so a non-technical owner can answer from what they know. That matters most for Crawlability and Structured Data, which an owner cannot inspect. Those two are framed as *whether they have checked or added something*, which they do know, rather than as the technical state of their site, which they would only be guessing at.

| id | Statement shown to the respondent |
|---|---|
| `business_profile` | Our business profile on maps and in search is incomplete, or hasn’t been updated in months. |
| `entity_consistency` | Our business name, address or phone number isn’t written the same way everywhere. |
| `reviews` | We have few recent reviews, or we don’t respond to the ones we get. |
| `crawlability` | We haven’t checked whether search engines and AI crawlers can reach our key pages. |
| `structured_data` | We haven’t added structured data (schema markup) to our website. |
| `answer_content` | Our website doesn’t directly answer the questions customers ask us most. |
| `brand_citations` | Few other websites mention or link to our business. |
| `local_listings` | We’re missing from directories and map apps beyond our business profile on maps and in search. |

Answered on one scale throughout: **Not true · Somewhat true · Very true**.

### 12.6 The rule and the tie-break order — the order is founder-approved

The rule is §11.4 exactly, applied to this taxonomy.

**Order — founder-approved 2026-09-18, as proposed:** Business Profile, Entity Consistency, Reviews, Crawlability, Structured Data, Answer Content, Brand Citations, Local Listings.

**Its principle is its own, not §11's.** §11.4 ranks leaks that lose traffic already paid for above anything that recommends buying more. That principle has no equivalent here, because none of these gaps is about spend. This order ranks by **highest leverage and cheapest to fix first**: a business profile is free and fast to complete and underpins most of the rest, while earning citations and listings takes the longest. Review it on that basis, not as a copy of §11's.

### 12.7 Request and result

The contact fields are the same four as §11.3; no new ones. `region` is required exactly as in §11.3 (amendment of 2026-10-30): the same 56 codes, the same `422 region_unavailable` for `"outside"`, and the same `fields: { state }` error otherwise.

```
ReadinessRequest {
  submission_id: UUID
  rule_set_version: string
  contact: { name, business, website, reach }
  region: { state: ServiceArea | "outside" }     // amendment 2026-10-30; required
  answers: [{ question_id: string, value: 0 | 1 | 2 }]
}

VisibilityReadinessResult {
  tier: "free"
  check: "ai_visibility_readiness"          // so a result is never mistaken for §11's
  submission_id: UUID
  status: enum ["gap_identified", "insufficient_signal"]
  category: VisibilityGapCategory | null    // null if and only if insufficient_signal
  rationale: string | null
  remediation: string | null
  because: { question_id: string, statement: string, value: 1 | 2,
             value_label: enum ["Somewhat true", "Very true"] } | null
  tie_broken_by_priority: boolean
  rule_set_version: string
  rule_set_hash: string
  produced_at: datetime
}
```

Invariants, by construction, in addition to everything inherited in §12.2:

- **No field or string states or implies what any AI engine currently says, shows, cites or ranks for the business.** A result reports a readiness gap the prospect described. It is never an observation.
- `rationale` and `remediation` equal the published Visibility Gap Library, character for character. The Phase 5 gate asserts it for all eight categories.
- **Routing (founder ruling, 2026-09-18).** `gap_identified` routes to **Talk to Us** and to the page's **`#pricing`** section: a found gap makes the paid product an honest next step. `insufficient_signal` routes to **Talk to Us only**, because sending "we found no gap" to pricing would be pressure, not a next step. It never invents a gap.

### 12.8 Gate conditions for the build

- **Derivation, as C2:** the fixture rule set's strings equal the published Visibility Gap Library character for character, for all eight.
- **Retirement, as decision 10's — condition C3, with exact strings.** The gate fails any rendered ZBM page whose text matches any of these, so the retired promise and the retired name cannot return through a content edit:
  1. `whether and how your business currently shows up` — the retired promise;
  2. `Free AI Visibility Check` — the retired section label;
  3. `a free AI Visibility Check is available now` — the retired FAQ line;
  4. `Free Visibility Check` — the two retired CTA buttons, "Get Your Free Visibility Check". This one is not in the auditor's three; without it both old buttons would pass the gate unchanged.

  As one pattern: `/whether and how your business currently shows up|free (ai )?visibility check/i`. It does not match the new name, "AI Visibility Readiness Check", since "Readiness" sits between "Visibility" and "Check". **The FAQ answer is rewritten, not just stripped.** "A free AI Visibility Check is available now" is currently false, since nothing is available, so the build replaces the whole answer with one that is true. Until the build, the unlinked Search Intelligence page still carries all four; the build removes them.
- **Separation:** no §12 type, field, status or rendered string contains "leak", and §11's and §12's rule sets share no taxonomy.

### 12.9 Not in this contract

- **Live engine observation.** Deferred to the paid Audit or the Search Intelligence backend, and unspecified.
- **Pricing.** No price, currency or payment field in §12.
- **Any real endpoint.** Fixtures behind the typed adapter until §12 is certified and implemented.

---

**Final status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** Nothing in this document constitutes an approved API contract, production readiness, or authorization for real money movement. Reconcile against actual frontend requirements before Claude Code wires the campaign dashboard or submission flow to live endpoints.
