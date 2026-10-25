# Lead route design: where a lead goes

Oct 25, 2026. Branch `lead-route-v1`, from `full-service-v1` (`118d7ce`). Not merged.
This is go-live step 1 from `FULL-SERVICE-DESIGN.md` §4.

## Verdict first
- **Recommendation: Option A.** It is what Brief §6.2 already specifies: a Next.js route handler in each app validates the lead, stores it in Postgres, then emails the founder through Resend.
- **The code is built on this branch.** It sits behind a typed adapter (`@zbest/lead`), and real delivery stays **off** until env vars switch it on. With no config, the route answers `503 not_configured` and the form says nothing was saved. It never pretends to succeed.
- **Andre has to make five decisions before it can go live** (see "Decisions only Andre can make" below). None of them is code.

## 1. The stub this replaces
`apps/zbm/app/api/lead/route.ts` and `apps/zbc/app/api/lead/route.ts` on `full-service-v1`.
- **What the stub does:**
  - zod validation and the §6.2 field-error envelope;
  - a honeypot that answers like a success;
  - a `submission_id` in the envelope.
- **What it does not do:** store anything, send anything, or rate-limit. Every response carries `stub: true` and `X-Zbest-Lead-Stub: no-delivery`, and each form says it is a stub.
- **Forms posting to it:**
  - **ZBM:** `contact`, `assessment` (§11.3), `readiness` (§12.7) and `start` (the universal intake).
  - **ZBC:** `campaign` and `clipper`.

## 2. What a lead must contain, and where it must go

| Requirement | Source | What it says |
|---|---|---|
| Mechanism | Brief §6.2 | One Next.js route handler per app (`app/api/lead/route.ts`), server-only. |
| Validation | Brief §6.2; Spec §11.3 | zod. Reject with a field-level error envelope. The client and the server use one schema. |
| Storage | Brief §6.2 | **Vercel Postgres** `leads` table with `id, app, form, payload JSONB, created_at, ip_hash, user_agent`. |
| Extra columns | FULL-SERVICE-DESIGN §4.1 | Store `services[]` and `source` as columns, not only inside the JSON, so leads can be counted per campaign and per service. |
| Notification | Brief §6.2 | Email through **Resend** to the founder's inbox, carrying the payload. |
| Spam / abuse | Brief §6.2 | Honeypot field, plus a per-IP rate limit (Vercel KV, or an in-memory token bucket). **No CAPTCHA at launch.** |
| Idempotency | Brief §6.2; Spec §8 | The client sends a `submission_id` (UUID), and the handler upserts on it, so a double-click is one lead. |
| Secrets | Brief §6.2 | `RESEND_API_KEY` and `POSTGRES_URL` live in Vercel env vars only, never in the repo. |
| Failure mode | Brief §6.2 | Email fails → the row is still written and the visitor still sees success; the failure is logged. DB write fails → return an error and do not claim success. |
| Assessment leads | Spec §11.3, §12.7 | Submitting the assessment or the readiness check "records the lead exactly as the current lead route does". |
| CRM | Brief §6.2 | None at launch. When one is chosen, "it hangs off the same handler." |
| Consent | Brief, Legal Brief | **The forms carry no consent requirement.** The cookie banner is cookie-only. The Legal Brief (Privacy §B) asks the Privacy Policy to disclose what is collected and how long it is kept. That is attorney text, not a form checkbox. |
| PII handling | Legal Brief §B; Brief §6.2 | Store `ip_hash`, not the raw IP (Brief). The Privacy Policy must disclose the data categories (Legal Brief). Nothing else is specified. |
| Retention | Legal Brief §B | "How long assessment and contact data is kept, and how a person can request deletion" is listed for the attorney. **No period is set anywhere.** |

### The backend has no lead endpoint
I checked `docs/backend-interface-spec-v0.4.md` end to end:
- §1–§7 cover identity, rewards, fraud, money, measurement, editorial and the campaign/submission core.
- §8–§9 set API conventions and frontend rules.
- §11–§12 define the assessment request and result DTOs, but say the lead is recorded *by the lead route*, not by the backend.
- **No lead or intake endpoint is specified.**

The live site's older backend is the `zbm-server` service in the Railway project `zbestmedia-backend`. **Neither this repo nor its docs contain any code, URL or contract for it.** The only trace of the live site is `docs/sources/live-zbestmedia-home-2026-09-16.txt`, which is rendered page text. Its lead contract is therefore unknown here, and nothing below depends on it.

## 3. Options

### A. Route handler on Vercel → Postgres + Resend (the Brief's design) — **recommended**
- **Flow:** validate → rate-limit → honeypot → `INSERT … ON CONFLICT (submission_id) DO NOTHING` → email the founder through Resend → update `notify_status` on the row.
- **Pros:**
  - It is exactly Brief §6.2, so it needs no brief amendment.
  - The lead lands in our own database, where the founder owns it.
  - The DB write is the source of truth. If Resend is down or not yet verified, no lead is lost, because `notify_status = 'failed'` marks rows to chase.
  - It does not depend on the Railway deploy.
- **Cons:**
  - It needs two vendors configured: a Postgres store and Resend.
  - An in-memory rate limit only counts per serverless instance. A shared store (Upstash/KV) is needed for a real global limit. The adapter supports both.
  - Lead PII lives in two places: the database and Resend's message log.
- **Note:** "Vercel Postgres" and "Vercel KV" are now sold through the Vercel Marketplace (Neon and Upstash). The code uses a plain `POSTGRES_URL` with the vendor-neutral `postgres` driver, so Neon, Supabase or any Postgres works. Confirm the current product names in the Vercel dashboard.

### B. Post to a backend endpoint (`zbm-zbc` orchestrator)
- **Pros:**
  - One system of record with the departments that will act on the lead, such as Onboarding (dept 1) and New Business.
  - Matches the eventual "CRM hangs off the handler" path.
- **Cons:**
  - **No endpoint is specified** (see §2 above). Building one now means a guessed DTO, which CLAUDE.md forbids.
  - It couples go-live to the Railway deploy and to a public, unauthenticated write path on the orchestrator.
  - It needs a spec revision first, and `FULL-SERVICE-DESIGN.md` §4.4 already queues that as a later step.
- **Verdict:** later, as a forwarder added *after* the DB write in Option A. Not now.

### C. Reuse the live site's `zbm-server` (Railway `zbestmedia-backend`)
- **Pros:** it already captures the live site's leads, so it may already email someone.
- **Cons:**
  - Its contract is unknown here, and nothing in this repo describes it.
  - It belongs to the old stack that V2 replaces by canary.
  - We may not touch it.
  - It would tie the new site to a service due for retirement.
- **Verdict:** rejected. Andre should still say whether leads currently go somewhere he reads, so the canary does not split leads across two inboxes unnoticed.

### D. Email only (Resend, no database)
- **Pros:** one vendor and the fewest moving parts.
- **Cons:**
  - It breaks the Brief's failure rule: with no row, an email failure loses the lead.
  - Resend DNS is not set up yet, so today every lead would be lost.
  - No per-campaign counting.
- **Verdict:** rejected.

### E. Third-party form backend or sheet (Formspree, Google Sheets, Airtable)
- **Pros:** fast, with no database to run.
- **Cons:**
  - It is not in the Brief.
  - Lead PII goes to a vendor nobody has assessed.
  - Rate limiting and idempotency would be theirs, not ours.
  - It needs a data-processing review.
- **Verdict:** rejected.

## 4. The recommended design as built

- **Typed adapter:** `packages/lead` (`@zbest/lead`, server-only).
  - Interfaces: `LeadStore`, `LeadNotifier` and `RateLimiter`.
  - Implementations: Postgres, Resend, an in-memory token bucket, an Upstash/KV REST limiter, and a **fake transport** for tests.
  - Both apps' routes call one `handleLead` pipeline. Each app keeps its own zod schemas.
- **Config (env), resolved per request. A missing setting fails closed with `503 not_configured`.** Only the *names* of missing settings are logged, never values.

  | Variable | Required | Meaning |
  |---|---|---|
  | `POSTGRES_URL` | yes | Lead store. |
  | `LEAD_IP_HASH_SECRET` | yes (with Postgres) | HMAC key for `ip_hash`. The raw IP is never stored. |
  | `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO` | yes, unless `LEAD_NOTIFY=disabled` | Founder notification. |
  | `LEAD_NOTIFY=disabled` | optional | Explicit store-only mode, for running before the Resend domain is verified. Rows get `notify_status = 'disabled'`. It is never inferred from a missing key. |
  | `LEAD_RATE_LIMIT` | optional, default `8/600` | Requests per window (seconds) per IP, per app. |
  | `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` + `_TOKEN`) | optional | Shared rate-limit counter. Without them the limiter is per-instance memory. |
  | `ZBEST_LEAD_TRANSPORT=fake` + `ZBEST_LEAD_FAKE_OUTBOX` | tests only | Writes rows and emails to JSONL files. **It refuses to run when `VERCEL` is set**, so it cannot be enabled on a deployment. |

- **Order inside the handler:**
  1. parse the request;
  2. rate limit (`429` with `Retry-After`);
  3. config check (`503 not_configured`);
  4. envelope and field validation (`400` / `422`);
  5. honeypot (a filled one answers exactly like a success, and nothing is stored or sent);
  6. store (on failure, `503 unavailable`, and the form says nothing was saved);
  7. notify (a failure is logged and recorded on the row; the visitor still sees success, per §6.2).
- **Idempotency:**
  - `submission_id` is the unique key. A repeat insert is a no-op that still returns success and **does not send a second email**.
  - Resend also gets `Idempotency-Key: lead-<submission_id>`.
- **Source tag:**
  - `source` is validated by the `/start` schema (`SOURCE_TAG`) and stored lowercase in its own column.
  - `services[]` gets its own column too.
  - Both go into the email subject.
- **PII in logs:**
  - One structured logger with an allowlist of keys: event, app, form, submission_id, code, notify status, and the HTTP status or SQLSTATE.
  - It never logs field values, IP, user agent, provider error bodies, or the connection string.
- **Schema:** `packages/lead/sql/001_leads.sql`, applied by `pnpm --filter @zbest/lead migrate` (reads `POSTGRES_URL`). The app never runs DDL at request time.
- **What the visitor sees:**
  - The stub notices are removed.
  - On success, the form says the details were received and a person will reply.
  - Each failure has its own honest message ("nothing was saved"): not configured, unavailable, and too many attempts.
  - The assessment and readiness results keep the "Scored on fixture rules" label (§9). Only the no-delivery wording is removed.

## 5. Decisions only Andre can make
1. **Destination inbox (`LEAD_NOTIFY_TO`).** Which address gets every lead? One inbox for both brands, or one per app? (Each Vercel project has its own env, so per-app works with no code change.)
2. **Resend sending domain (`LEAD_NOTIFY_FROM`).**
   - Which domain sends: `zbestmedia.com`, a subdomain such as `notify.zbestmedia.com`, or `zbestclips.com` for ZBC?
   - The DNS records (SPF/DKIM) have to be added at the registrar.
   - Until then, choose between two options:
     - (a) go live store-only with `LEAD_NOTIFY=disabled` and check the table, or
     - (b) Resend's test sender, which can only deliver to the Resend account owner's own address.
3. **Storage vendor.**
   - Neon (the Vercel Marketplace Postgres the Brief's "Vercel Postgres" became), Supabase, or another Postgres. Code is identical for each; only `POSTGRES_URL` changes.
   - Also decide who holds the account, and whether ZBM and ZBC share one database (the `app` column separates them) or use two. ZBC is a separate entity with its own EIN, so separate stores may be the cleaner record.
4. **Retention and deletion.**
   - How long are leads kept, and who handles a deletion request?
   - No period is set in the Brief. The Legal Brief hands this to the attorney.
   - The table supports a purge by `created_at`. Nothing purges automatically until a period is chosen.
5. **Consent / privacy notice on forms.**
   - The Brief requires no consent checkbox, so none was added.
   - Counsel should say whether the forms need a "see our Privacy Policy" line once the policy is final (CCPA notice at collection). The policy is still a draft shell.

**Smaller items:**
- Whether the live `zbm-server` currently delivers leads anywhere he reads. This matters for the canary, so leads don't split across two systems.
- Whether to buy a shared rate-limit store (Upstash) now, or accept a per-instance limit at launch.
- Confirm the new form copy (listed in the branch's commit message), because these are commitments.

## 6. Not done here
- No CRM and no backend forwarder (Option B later, behind a spec revision).
- No automatic retention purge.
- No CAPTCHA (Brief: none at launch).
- Nothing was deployed, no Vercel env was set, and neither the `zbestmedia-ui` project nor anything on Railway was touched.
