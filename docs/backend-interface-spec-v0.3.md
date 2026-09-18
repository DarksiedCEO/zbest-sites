# Z Best Media & Z Best Clips — Backend Interface Spec v0.3

Reconciled with Phase 1 domain contracts — MINIMUM GOVERNED PILOT model

**Status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** This is not an approved API contract, not production-ready, and does not authorize any real money movement or live publication. Phase 1 uses simulated/fake adapters throughout. This supersedes v1 — v1's core entities were directionally right but under-specified on money integrity, fraud evidence, and tenancy; those corrections are incorporated below.

**v0.3 changes (2026-09-18).** Written by the frontend build session under explicit founder delegation (2026-09-18), to carry the founder ruling of 2026-09-17 on the free assessment — recorded as founder decision 10 in `docs/TOOLING.md`. Sections 1–9 are carried over from v0.2 **unchanged, byte for byte**; only two things move:

- **§10** — the deferred Revenue Recovery assessment item is removed from the deferred list and promoted.
- **§11 (new)** — the Revenue Recovery assessment: two tiers that differ in kind, their shapes, and the rule that connects them.

Two parts of §11 are **PROPOSED, not settled**, and need founder approval before anything is built: the eight-question set in §11.3, which is customer-facing copy, and the tie-break priority order in §11.4. Because the build session wrote the contract it will later build against, this revision is reviewed by the auditor before approval, and the backend author accepts it before implementing it. Status is unchanged: DRAFT.

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
  scale: enum ["likert_3"]                 // 0 = Not really · 1 = Somewhat · 2 = Very true
}
```

Immutable after activation — the same pattern and the same reason as `RewardPolicy` (§2). Changing a question, the priority order, or any copy creates a new version with a new hash; it never edits the rule set that produced results already returned. Every result records the version and hash that produced it. That is what makes "deterministic" checkable rather than asserted: the same answers under the same `rules_hash` always return the same result.

The eight categories and their display names are exactly those already published in the site's Revenue Leak Library: Traffic, Conversion, Trust, Offer, Follow-Up, Tracking, Creative, Visibility.

**"Messaging Leak" is Offer, not a ninth category** (founder ruling, 2026-09-18). The Industry Leak Patterns section of the same page labels one pattern "Messaging Leak" — Professional Services, "the value proposition is too abstract to move buyers." That is an industry-specific name for the Offer category ("the value is not clear or compelling"), kept on the page as written. The taxonomy stays at eight. No result may return `messaging`; a Professional Services business whose leak is its value proposition receives `offer`.

### 11.3 AssessmentRequest — the free tier's input

Extends the existing "Get an Assessment" form. The four contact fields are unchanged; `answers` is new.

```
AssessmentRequest {
  submission_id: UUID                      // client-generated idempotency key, as the lead route already uses
  rule_set_version: string                 // the version the form was rendered from
  contact: { name, business, website, reach }    // unchanged from the current form
  answers: [{ question_id: string, value: 0 | 1 | 2 }]
}
```

- Every question in the rule set is answered exactly once. Values outside {0, 1, 2}, unknown `question_id`s, and duplicates are rejected.
- A request against a superseded `rule_set_version` is rejected with a typed error, so the form re-renders against the active version rather than being scored against rules the respondent never saw.
- **No free-text field feeds the rule.** A deterministic rule cannot map prose onto a category, and anything that could would be a model — which is what the free tier no longer contains.
- **One schema, both sides.** Client and server validate from the same schema definition, not two hand-written ones. The live tool's extraction records four client/server validation mismatches; this requirement makes that class of defect impossible by construction rather than something review has to catch.
- Submitting an assessment records the lead exactly as the current lead route does. v0.3 does not change lead recording.

**PROPOSED question set — needs founder approval before build.** Customer-facing copy, so it is not settled by this spec. One statement per category, each written about the *cause* the business can observe rather than the symptom — because the symptoms of Conversion, Offer and Trust overlap heavily from the outside ("people visit but don't buy" fits all three), while their causes do not:

| id | Statement shown to the respondent |
|---|---|
| `follow_up` | When a lead comes in, we don't always respond fast or follow up consistently. |
| `conversion` | Our site or booking process makes it hard for people to take the next step. |
| `offer` | People aren't sure what they get from us, or why it's worth it. |
| `trust` | We don't have enough reviews, proof, or credentials in front of visitors. |
| `tracking` | We can't tell which ads, pages, or channels actually bring in revenue. |
| `creative` | Our ads get attention or clicks, but not many real buyers. |
| `visibility` | We're hard to find in search results, map listings, or AI search. |
| `traffic` | We don't get enough qualified visitors or inquiries in the first place. |

Answered on one scale throughout: **Not really · Somewhat · Very true**.

### 11.4 The rule

1. Score each category as the value given for its question.
2. If every score is 0, return `insufficient_signal`. **Do not pick a category.**
3. Otherwise return the category with the highest score. Break ties by `priority_order`.

**PROPOSED priority order — needs founder approval before build:** Follow-Up, Conversion, Offer, Trust, Tracking, Creative, Visibility, Traffic.

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
    value_label: enum ["Somewhat", "Very true"]
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

No path reaches `delivered` without `approved`, and none reaches `approved` without a verifier pass. **Delivery is an explicit state with its own timestamp**, because the live tool records no delivery path to the lead at all; making it a state makes it auditable.

### 11.7 Not in this contract

- **Pricing.** The paid tier's price is commercial, not contractual. No price, currency or payment field appears anywhere in §11. Taking payment for the Audit through the site would be a separate contract and an explicit future decision.
- **The Audit document's body schema** — see §11.6.
- **Any real endpoint.** Phase 5 builds against fixtures behind the typed adapter (§9) until this section is approved and implemented.

---

**Final status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** Nothing in this document constitutes an approved API contract, production readiness, or authorization for real money movement. Reconcile against actual frontend requirements before Claude Code wires the campaign dashboard or submission flow to live endpoints.
