# Z Best Media & Z Best Clips — Backend Interface Spec v0.2

Reconciled with Phase 1 domain contracts — MINIMUM GOVERNED PILOT model

**Status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** This is not an approved API contract, not production-ready, and does not authorize any real money movement or live publication. Phase 1 uses simulated/fake adapters throughout. This supersedes v1 — v1's core entities were directionally right but under-specified on money integrity, fraud evidence, and tenancy; those corrections are incorporated below.

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
- The Revenue Recovery assessment tool's real input schema — still needs to be pulled from the live tool before `AssessmentResult` can be finalized

---

**Final status: DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION.** Nothing in this document constitutes an approved API contract, production readiness, or authorization for real money movement. Reconcile against actual frontend requirements before Claude Code wires the campaign dashboard or submission flow to live endpoints.
