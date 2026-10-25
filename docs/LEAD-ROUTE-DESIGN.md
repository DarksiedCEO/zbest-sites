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
- **Flow:** validate → rate-limit → honeypot → `INSERT … ON CONFLICT (app, submission_id) DO NOTHING` → email the founder through Resend → update `notify_status` on the row.
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
  | `POSTGRES_URL` | yes | Lead store. Parsed by `src/pg-url.ts`, and the driver gets discrete options, never the raw URL (AEGIS H1/M1). Accepted params: `sslmode`; `channel_binding` (accepted, **not enforced**: the driver has no channel binding); `pgbouncer`, `supa`, `connection_limit`, `pool_timeout` (validated, then dropped as harmless hints); `options` **only** as `endpoint=<neon-id>`, passed to the server as the startup `options` parameter; `connect_timeout`. Any other param, or a repeated one, → `not_configured`, naming the key only. A remote host with no `sslmode` uses TLS. **Recommended: `?sslmode=verify-full`** for Neon and Supabase (public CAs). `require` encrypts but does not verify the certificate, as in libpq. Verification of an IP-literal host checks the chain only, not the name (a driver limit); vendor hosts are DNS names. A remote `sslmode=disable` is honoured as the operator's choice. Neon pooled/direct and Supabase pooler/direct formats are tested. |
  | `LEAD_IP_HASH_SECRET` | yes (with Postgres) | HMAC key for `ip_hash`. The raw IP is never stored. |
  | `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO` | yes, unless `LEAD_NOTIFY=disabled` | Founder notification. |
  | `LEAD_NOTIFY=disabled` | optional | Explicit store-only mode, for running before the Resend domain is verified. Rows get `notify_status = 'disabled'`. It is never inferred from a missing key. |
  | `LEAD_RATE_LIMIT` | optional, default `8/600` | Requests per window (seconds) per trusted client IP, per app. |
  | `LEAD_TRUSTED_PROXY=1` | **required off Vercel**; automatic on Vercel (`VERCEL=1`) | Trust `x-vercel-forwarded-for` / `x-real-ip` / `x-forwarded-for`. Off Vercel without it the route answers `503 not_configured` (AEGIS r2 N1): there is no client address to limit by, and a shared bucket would let one client lock every visitor out. Set it only when a proxy in front overwrites those headers. |
  | `LEAD_RATE_LIMIT_FLOOD` | optional, default `200/600` | The **fallback** limit, used only when the proxy is trusted but sent no client address (a backstop; Vercel's edge always sends one). There is never one global bucket. A same-origin browser request is keyed by a fingerprint of its `user-agent`, `accept-language` and `sec-ch-ua-platform`, so a script cannot lock real visitors out. A request without a matching `Origin` (non-browser) is keyed per app `no-origin`, a bucket only such clients share. The limit is higher than the per-IP one because a fingerprint can be shared. |
  | `LEAD_ALLOWED_ORIGINS` | optional | Extra browser origins allowed to post (comma list of `https://host`). Same-origin is always allowed; anything else is `403` (AEGIS M3). |
  | `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` + `_TOKEN`) | optional, **needed for a global cap** | Shared rate-limit counter. Without them each serverless instance counts on its own, so the limits above are per instance, not global. Whether to add KV before launch is a founder decision (§5). |
  | `ZBEST_LEAD_TRANSPORT=fake` + `ZBEST_LEAD_FAKE_OUTBOX` + `ZBEST_LEAD_FAKE_ACK` | tests only | Writes rows and emails to JSONL files. Runs only when **all** hold: the ack equals the gate's per-run `ZBEST_GATE_NONCE`; the outbox is under the OS temp dir; and no platform marker (`VERCEL`, `VERCEL_ENV`, `RAILWAY_ENVIRONMENT`, `FLY_APP_NAME`, `RENDER`, `K_SERVICE`, `DYNO`, …) is set (AEGIS M2). `NODE_ENV` cannot be the test, because `next start` always runs as production. |

- **Order inside the handler:**
  1. `Content-Type` must be `application/json` (`415`). This forces a CORS preflight, which a foreign site cannot pass;
  2. `Origin` must be same-origin or listed; a cross-site fetch-metadata request with no Origin is refused too (`403`);
  3. declared size over 64 KB (`413`);
  4. config check (`503 not_configured`), including the trusted-proxy requirement;
  5. body read with a 64 KB cap (`413`, **not charged** to the rate limit), then JSON;
  6. honeypot (a filled one answers exactly like a success; nothing is stored or sent; **not charged**, so bot hits never spend real visitors' tokens);
  7. rate limit (`429` with `Retry-After`), charged for everything that reaches validation (including malformed JSON);
  8. envelope and field validation (`400` / `422`; the assessment/readiness `answers` list is capped at 32);
  9. store (on failure, `503 unavailable`, and the form says nothing was saved);
  10. notify (a failure is logged and recorded on the row; the visitor still sees success, per §6.2).
  - Any unexpected throw becomes a bare `503 unavailable` and an `internal_error` event, never a logged error object.
- **Idempotency:**
  - `(app, submission_id)` is the unique key, so a ZBM and a ZBC lead can never collide in a shared database. A repeat insert with the **same** payload (by `payload_hash`) is a no-op that still returns success and **does not send a second email**. The same id with **different** content is `409 conflict`. The first row stands, and the form starts a new id so the next send is a new lead (AEGIS L2). A scored form's duplicate result is recomputed from identical answers, so it matches what was stored.
  - Resend also gets `Idempotency-Key: lead-<app>-<submission_id>`.
- **Source tag:**
  - `source` is validated by the `/start` schema (`SOURCE_TAG`) and stored lowercase in its own column.
  - `services[]` gets its own column too.
  - Both go into the email subject.
- **PII in logs:**
  - One structured logger with an allowlist of keys: event, app, form, submission_id, code, notify status, and the HTTP status or SQLSTATE.
  - It never logs field values, IP, user agent, provider error bodies, or the connection string.
- **Schema:** `packages/lead/sql/001_leads.sql`, applied by `pnpm --filter @zbest/lead migrate` (reads `POSTGRES_URL`; Node 22.6+).
  - The runner records versions in `schema_migrations`.
  - It checks the `leads` columns and types against what the app writes, so an older table is caught rather than trusted.
  - It does a rolled-back round-trip insert, so a bad URL or permissions fail before launch.
  - The app never runs DDL at request time.
- **Email body:** plain text. The visitor's words sit between `----- visitor-supplied, unverified -----` fences, which a visitor cannot close (AEGIS L7).
- **Honeypot:** the HTML input is named `zbx_hp_7f3` with `autocomplete="off"` and password-manager ignore hints. It is sent under the wire key `company_url` (AEGIS L4). Honeypot hits are logged as `honeypot` events; watch that count after launch.
- **`server-only`:** `@zbest/lead` imports it first, so a client import fails the build (AEGIS L8).
- **Migration runner:**
  - A session advisory lock serialises concurrent runs.
  - A pre-existing `leads` table is column-checked **before** anything is applied, so the mismatch is named rather than masked by a DDL error.
  - After applying, it checks columns, then the full `UNIQUE (app, submission_id)` index the app's `ON CONFLICT` needs, then the round trip. The round trip inserts twice (the repeat must be a no-op) and reads back form, payload, hash, default `services` and `notify_status`.
  - Versions are the `NNN` prefix of files matching `^\d{3}_.+\.sql$` (AEGIS r2 N9).
- **Fake transport, extra guards (AEGIS r2 N6):**
  - `KUBERNETES_SERVICE_HOST` is a platform marker.
  - The outbox path is resolved through symlinks before the temp-dir check.
  - `ZBEST_LEAD_TRANSPORT` must be exactly `fake`, with no trimming.
- **Origin check, remaining choices (AEGIS r2 N7):**
  - `Sec-Fetch-Site` is compared case-insensitively, and an Origin with userinfo, a path or a query is refused.
  - **Not enforced:** the scheme. An `http://` Origin on the site's own host is accepted, because behind Vercel the request scheme the app sees is not reliably the visitor's, and no browser on a third-party site can send our host as its Origin. The site is HTTPS-only at the edge.
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
- **Whether to add a shared rate-limit store (Upstash / Vercel KV) before launch.** Without it the per-IP and fallback limits apply per serverless instance, not globally. The AEGIS review treats this as a launch decision.
- **The hosting target.** On Vercel nothing extra is needed. Anywhere else, `LEAD_TRUSTED_PROXY=1` is required, and is only correct behind a proxy that overwrites the client-IP headers.
- Confirm the new form copy, because these are commitments:
  - Success (every §6.1 form and `/start`): "Received" / "Thanks — we have your details." / "A person reads every submission and will reply using the contact you gave us."
  - Assessment and readiness results: "Received" / "Scored on fixture rules. We have your details, and a person will follow up using the contact you gave us." Before submitting: "This form [check] scores your answers on fixture rules."
  - Failures (`packages/ui/src/lead/contract.ts`, `FAILURE_COPY`):
    - not configured: "This form isn't accepting submissions yet, so nothing was saved or sent."
    - unavailable: "We couldn't save that just now, so nothing was sent. Please try again in a few minutes."
    - too many attempts: "Too many attempts from your connection. Nothing was saved — please wait a few minutes and try again."
    - network/other, outcome unknown: "We couldn't confirm that went through — please try again." (AEGIS L3: no claim that nothing was saved; a retry is safe because it reuses the id.)
    - changed resubmission (409): "We already have an earlier version of this from you. Send again to submit these changes as a new message."

## 6. Not done here
- No CRM and no backend forwarder (Option B later, behind a spec revision).
- No automatic retention purge.
- No CAPTCHA (Brief: none at launch).
- Nothing was deployed, no Vercel env was set, and neither the `zbestmedia-ui` project nor anything on Railway was touched.
