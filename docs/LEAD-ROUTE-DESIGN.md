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
  | `LEAD_IP_HASH_SECRET` | yes (with Postgres) | HMAC key for the rate-limit key (≥ 16 chars). Since 2026-10-30 nothing derived from the IP is stored: `ip_hash` is no longer written (no code read it) and `sql/002_retention.sql` cleared old values. The raw IP is never stored. |
  | `CRON_SECRET` | **yes, for the retention purge** (≥ 16 chars) | Vercel sends it as `Authorization: Bearer <CRON_SECRET>` on each cron call to `/api/cron/purge-leads` (`vercel.json`, daily). Without it the purge route refuses to run (`503`, error-level `purge_not_configured` on every invocation) and `/api/health` answers `503 cron_secret_missing`; a wrong or missing header is `401` and nothing is touched. Each successful run is recorded in `lead_purge_runs`; `/api/health` is `503 overdue` after 48 h without one (body `{"ok":false,"status":"overdue"}`, cached 60 s). See §5a. |
  | `LEAD_RETENTION_DAYS` | optional, default `730` | Leads are deleted this many days after **submission** (`created_at`). There is no "last contact" column, so disclosures must count from submission. Whole days 1–3650; anything else → `503 not_configured` on the purge. |
  | `LEAD_UA_RETENTION_DAYS` | optional, default `90` | The stored user agent is blanked this many days after submission (must not exceed `LEAD_RETENTION_DAYS`). |
  | `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO` | yes, unless `LEAD_NOTIFY=disabled` | Founder notification. |
  | `LEAD_NOTIFY=disabled` | optional | Explicit store-only mode, for running before the Resend domain is verified. Rows get `notify_status = 'disabled'`. It is never inferred from a missing key. |
  | `LEAD_RATE_LIMIT` | optional, default `8/600` | Requests per window (seconds) per trusted client IP, per app. |
  | `LEAD_TRUSTED_PROXY` | **required off Vercel**; ignored on Vercel | Names the **one** header the proxy in front sets for the client address: `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip` or `fly-client-ip` (AEGIS r3 F1). Any other value, including the old `1`, → `503 not_configured`. Off Vercel without it → `503` (AEGIS r2 N1): there is no client address to limit by. For `x-forwarded-for` the **rightmost** entry is used (or the n-th from the right, see `LEAD_TRUSTED_PROXY_HOPS`), the hop the proxy appended; anything to its left is client-supplied. **`x-forwarded-for` is valid only behind exactly the configured number of proxies that APPEND to it** (AEGIS r4 R1). **A bare `next start` is not such a proxy:** Next 16.3.5 only *fills* `x-forwarded-for` from the socket when it is absent (`base-server.js:612`, `??=`), so a client-sent value reaches the route untouched and every request could pick its own bucket. Never expose `next start` directly with any `LEAD_TRUSTED_PROXY`. Put an appending or overwriting proxy in front, for example nginx with `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for` or `X-Real-IP $remote_addr`. **Client-address normalisation (AEGIS r4 R2):** a port is stripped, IPv4-mapped IPv6 becomes IPv4, the value must pass `net.isIP` (anything else → no address → `503`), and IPv6 is rate-limited by its /64, so rotating addresses inside one allocation does not mint new buckets. IPv4 carried in IPv6 — mapped `::ffff:a.b.c.d`, translated `::ffff:0:a.b.c.d` or compatible `::a.b.c.d`, in any spelling (uncompressed, hex, upper-case) — is detected after expansion and keyed as that IPv4 address (AEGIS r5 N3). **Residual limit (AEGIS r5 N4, accepted):** a client holding a /56 or /48, as many ISPs, clouds and free tunnel brokers delegate, can still mint 256 or 65,536 /64 buckets. Per-instance memory limits bound this on Vercel today. If KV is adopted, add a coarser /48 tier with a higher limit. **Further accepted residuals (AEGIS r6 O5), none attacker-reachable:** (1) NAT64 (`64:ff9b::/96`) clients are not unwrapped and share one /64. This matters only behind a trusted NAT64/SIIT hop, which Vercel is not. (2) `::2`–`::ffff` key as `0.0.0.x`. (3) A few reserved-space spellings share the zero /64. The HMAC in `ip_hash` is of the full normalised address. For the single-value headers, a value with several entries is refused. `x-vercel-forwarded-for` is **never** read off Vercel, because no other proxy strips a client-supplied one. **On Vercel** (`VERCEL` exactly `1`; `true`, ` 1` do not count) only `x-vercel-forwarded-for` is read, as a **single** value: a list is refused (fail closed). `x-forwarded-host` is believed only there, first hop only. **Do not ship a `vercel env pull` file:** it copies `VERCEL="1"` into `.env.local`, which would make a self-hosted `next start` trust a client-sent `x-vercel-forwarded-for`. **After launch, watch the `no_client_address` log count:** it should be zero on Vercel. |
  | `LEAD_TRUSTED_PROXY_HOPS` | optional, default `1`; only with `x-forwarded-for` | How many **appending** proxies sit in front (1–9). The n-th entry from the right is the address the outermost trusted proxy saw; everything to its left is client-supplied. Fewer entries than hops → no address → `503`. With any other header it is a misconfiguration (AEGIS r4 R1). **The inner proxies must be reachable only through the outer one** (AEGIS r5 N5). If the origin load balancer can be reached directly, a client sends `spoof, attacker` with HOPS=2 and `spoof` is selected. Firewall the inner hops to the outer proxy's egress. **Validated everywhere, including on Vercel:** on Vercel a *valid* `LEAD_TRUSTED_PROXY` / `LEAD_TRUSTED_PROXY_HOPS` pair is ignored, because only `x-vercel-forwarded-for` is read there. An *invalid* one, such as HOPS without `LEAD_TRUSTED_PROXY=x-forwarded-for`, is `503 not_configured` there too. That is a deliberate choice over silently ignoring it: a stray or malformed proxy setting is config drift, and failing closed is logged by name (`LEAD_TRUSTED_PROXY_HOPS:only-with-x-forwarded-for`), so it is visible at once instead of surviving until the site moves off Vercel. |
  | *(no fallback)* | — | A trusted header that arrives empty, absent or malformed → `503 not_configured`, logged as `no_client_address:<header>` (AEGIS r3 F2). An earlier version fell back to a fingerprint bucket and the note claimed "a script cannot lock real visitors out". **That claim was wrong:** the r3 review showed a script with a stock browser fingerprint locks out everyone who shares it, and rotating the user agent evades it. The fallback is removed; there is no shared or fingerprint bucket. `LEAD_RATE_LIMIT_FLOOD` no longer exists. |
  | `LEAD_ALLOWED_ORIGINS` | optional | Extra browser origins allowed to post (comma list of `https://host`). Same-origin is always allowed; anything else is `403` (AEGIS M3). |
  | `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` + `_TOKEN`) | optional, **needed for a global cap** | Shared rate-limit counter. Without them each serverless instance counts on its own, so the limits above are per instance, not global. Whether to add KV before launch is a founder decision (§5). |
  | `ZBEST_LEAD_TRANSPORT=fake` + `ZBEST_LEAD_FAKE_OUTBOX` + `ZBEST_LEAD_FAKE_ACK` | tests only | Writes rows and emails to JSONL files. Runs only when **all** hold: the ack equals the gate's per-run `ZBEST_GATE_NONCE`; the outbox is under the OS temp dir; and no platform marker (`VERCEL`, `VERCEL_ENV`, `RAILWAY_ENVIRONMENT`, `FLY_APP_NAME`, `RENDER`, `K_SERVICE`, `DYNO`, …) is set (AEGIS M2). `NODE_ENV` cannot be the test, because `next start` always runs as production. |

- **Order inside the handler:**
  1. `Content-Type` must be `application/json` (`415`). This forces a CORS preflight, which a foreign site cannot pass;
  2. `Origin` must be same-origin or listed; a cross-site fetch-metadata request with no Origin is refused too (`403`);
  3. declared size over 64 KB (`413`);
  4. config check (`503 not_configured`), including the trusted-proxy requirement, then the client address from the one trusted header (`503` if absent: no fallback);
  5. body read with a 64 KB cap (`413`, **not charged** to the rate limit), then JSON;
  6. honeypot (a filled one answers exactly like a success; nothing is stored or sent; **not charged**, so bot hits never spend real visitors' tokens);
  7. rate limit (`429` with `Retry-After`), charged per client address for everything that reaches validation: malformed JSON, `400` bad requests and `422` validation failures all spend a token, so probing and form-fuzzing are limited. Tests pin this (AEGIS r3 F5). The memory limiter evicts least-recently-seen keys when full; it never resets everyone's buckets;
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
- **Schema:** `packages/lead/sql/001_leads.sql`, applied by `pnpm --filter @zbest/lead migrate` (Node 22.6+). The runner reads the **direct** URL first: `POSTGRES_URL_NON_POOLING`, then `DATABASE_URL_UNPOOLED`, then `POSTGRES_URL`. It prints which variable it used, and warns if it falls back to a `-pooler` endpoint (AEGIS r3 F3).
  - The runner records versions in `schema_migrations`.
  - It checks the `leads` columns and types against what the app writes, so an older table is caught rather than trusted.
  - It does a rolled-back round-trip insert, so a bad URL or permissions fail before launch.
  - The app never runs DDL at request time.
- **Email body:** plain text. The visitor's words sit between `----- visitor-supplied, unverified -----` fences, and **every visitor line is quoted with `> `** (AEGIS r3 F4). That includes continuation lines, split on every line-break character (LF, CR, CRLF, VT, FF, NEL, U+2028, U+2029). Between the fences no line can begin with anything else, so no lookalike can pass as the closing fence: blank fillers, combining marks, box-drawing or spaced dashes. This replaces the r2 character-class defuser, which r3 showed was incomplete.
- **Honeypot:** the HTML input is named `zbx_hp_7f3` with `autocomplete="off"` and password-manager ignore hints. It is sent under the wire key `company_url` (AEGIS L4). Honeypot hits are logged as `honeypot` events; watch that count after launch.
- **`server-only`:** `@zbest/lead` imports it first, so a client import fails the build (AEGIS L8).
- **Migration runner:**
  - Everything runs in **one transaction** under a **transaction-scoped** advisory lock (`pg_advisory_xact_lock`): apply, column check, unique check, and a round trip in a savepoint that is rolled back. The lock stays on one backend even through a transaction pooler and is released by `COMMIT`/`ROLLBACK`, so it cannot leak. Concurrent runs serialise, and a failed check rolls back the whole run, migration included (AEGIS r3 F3).
  - It uses the same startup parameters as the app, including Neon's `options=endpoint` when present (AEGIS r3 F6).
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
- **TLS modes to avoid (AEGIS r3 F6):** `sslmode=prefer` and `allow`, like libpq, fall back to plaintext if the server or an active man in the middle refuses TLS. `require` encrypts but does not verify. Use `verify-full` in production.
- **Before hydration (AEGIS r5 N1):**
  - Until React has hydrated, every lead form's submit button is **disabled** and reads **"Loading…"**, and the form has `aria-busy`. A disabled default button also blocks implicit submission, so pressing Enter in a field does nothing.
  - Previously a press before hydration did a native POST of the page itself: the form came back blank, with no message, and the lead was lost.
  - The form gets `data-ready="true"` once hydrated, and the e2e helpers wait for it.
  - With JavaScript off, the button stays disabled and a `<noscript>` line says the form needs JavaScript.
  - **If the scripts never arrive** (a failed chunk, a content blocker, a version skew), a CSS-only line appears after ~10 s: "Still loading? Please refresh the page." (AEGIS r6 O3). It lives in `styles/lead.css`: hidden by default, revealed by a 10 s CSS animation only while the form lacks `data-ready`, and gone for good once hydrated. It offers no contact address, because the site copy has none to point to. With scripting off it stays hidden and the `<noscript>` line speaks.
  - **Accessibility (AEGIS r6 O4):**
    - `aria-busy` sits on the **button** only, never the form.
    - Until hydration the button has `aria-describedby`, pointing at a visually hidden line: "The form is still loading. Send will be available in a moment."
    - The `<noscript>` and fallback lines are outside any busy region.
    - Not verified with NVDA, JAWS or VoiceOver.
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
   - **Built 2026-10-30:** a daily Vercel Cron purge per app (`/api/cron/purge-leads`, `packages/lead/src/retention.ts`) deletes leads `LEAD_RETENTION_DAYS` (default 730) after submission and blanks user agents after `LEAD_UA_RETENTION_DAYS` (default 90). A deletion request is handled by hand with `packages/lead/scripts/delete-lead.mjs` (runbook in its header); there is no public deletion endpoint.
5. **Consent / privacy notice on forms.**
   - The Brief requires no consent checkbox, so none was added.
   - Counsel should say whether the forms need a "see our Privacy Policy" line once the policy is final (CCPA notice at collection). The policy is still a draft shell.

**Smaller items:**
- Whether the live `zbm-server` currently delivers leads anywhere he reads. This matters for the canary, so leads don't split across two systems.
- **Whether to add a shared rate-limit store (Upstash / Vercel KV) before launch.** Without it the per-IP limit applies per serverless instance, not globally. The AEGIS review treats this as a launch decision.
- **The hosting target.** On Vercel nothing extra is needed. Anywhere else, `LEAD_TRUSTED_PROXY=<header>` must name the one header the proxy sets, for example `x-real-ip` behind nginx with `proxy_set_header X-Real-IP $remote_addr`.
- Confirm the new form copy, because these are commitments:
  - Success (every §6.1 form and `/start`): "Received" / "Thanks — we have your details." / "A person reads every submission and will reply using the contact you gave us."
  - Assessment and readiness results: "Received" / "Scored on fixture rules. We have your details, and a person will follow up using the contact you gave us." Before submitting: "This form [check] scores your answers on fixture rules."
  - Before hydration (`packages/ui/src/lead/use-hydrated.ts`): the button reads "Loading…", and is described to assistive tech as "The form is still loading. Send will be available in a moment." If scripts never arrive, after ~10 s: "Still loading? Please refresh the page." With JavaScript off: "This form needs JavaScript to send. Please enable it and reload the page."
  - Failures (`packages/ui/src/lead/contract.ts`, `FAILURE_COPY`):
    - not configured: "This form isn't accepting submissions yet, so nothing was saved or sent."
    - unavailable: "We couldn't save that just now, so nothing was sent. Please try again in a few minutes."
    - too many attempts: "Too many attempts from your connection. Nothing was saved — please wait a few minutes and try again."
    - network/other, outcome unknown: "We couldn't confirm that went through — please try again." (AEGIS L3: no claim that nothing was saved; a retry is safe because it reuses the id.)
    - changed resubmission (409): "We already have an earlier version of this from you. Send again to submit these changes as a new message."

## 5a. Retention go-live runbook (the Privacy Policy's deletion promise depends on it)

Do these in order, per Vercel project (zbm-site-v2, zbc-site-v1), before the policy goes live:

1. **Migrate.** From a machine with the production env pulled (`vercel env pull .env.local`, then delete it afterwards): `pnpm --filter @zbest/lead migrate`. It must print `applied 002_retention.sql` and `applied 003_purge_runs.sql` (or `skip … (already applied)`), then `schema ok; unique key ok; round-trip insert ok (rolled back)`. 002 clears the unused `ip_hash` values; 003 creates `lead_purge_runs`, the ledger the health check reads. Deploying the code before the migration makes every purge fail, and `/api/health` then reports `unknown`.
2. **Set `CRON_SECRET`** (Production; a random string of at least 16 characters, e.g. from a password generator). Optional: `LEAD_RETENTION_DAYS` (default 730) and `LEAD_UA_RETENTION_DAYS` (default 90), whole days 1–3650, UA ≤ leads. Redeploy so the cron and the new env apply.
3. **Verify the first purge, for BOTH apps.** For each project (zbm-site-v2, then zbc-site-v1): Vercel → Settings → Cron Jobs lists `/api/cron/purge-leads` (daily 09:17 UTC); press **Run**. Then confirm both:
   - **Logs** (filter `requestPath:/api/cron/purge-leads`): `{"scope":"lead","event":"purged","app":"zbm","deleted":N,"ua_cleared":N,"ip_hash_cleared":N,"days":730}` (`"app":"zbc"` for ZBC).
   - **Ledger row**: `SELECT app, last_success_at, deleted, ua_cleared FROM lead_purge_runs ORDER BY app;` (Neon SQL editor) shows a row for **zbm and for zbc**, `last_success_at` a few minutes old. One app's row says nothing about the other.
   - Then `GET https://<domain>/api/health` returns **200** `{"ok":true,"status":"ok"}`. It is cached for up to 60 s per instance and at the CDN, so allow a minute or two after the run.

   **Deployment Protection can block the cron.** Both projects have Vercel Authentication on (`ssoProtection: all_except_custom_domains`) and, until a custom domain is attached, production is served only on `*.vercel.app`. How to tell who answered:
   - a 401/403 with **no** `purge_*` line from the route (or a Vercel login page) means Vercel blocked the call before the route ran, and nothing was purged. Check Settings → Deployment Protection; attach the custom domain (cron then calls it unprotected) or create a Protection Bypass for Automation secret. UNVERIFIED: whether Vercel Cron passes Deployment Protection on its own.
   - a 401 **with** a warn-level `purge_unauthorized` line means the route ran and rejected the header: `CRON_SECRET` does not match what Vercel sends (redeploy after setting it).
   - a 503 with `purge_not_configured` means `CRON_SECRET`, the retention settings or `POSTGRES_URL` are missing or invalid.

   Do not claim retention is enforced until a `purged` line and a `lead_purge_runs` row exist for each app.
4. **Alert on it.** Point an uptime monitor at `/api/health` (503 = degraded) and/or a log alert on `purge_degraded` and `purge_not_configured` (error level). Degraded statuses: `cron_secret_missing`, `misconfigured`, `never_run`, `overdue` (last success > 48 h), `unknown` (ledger unreadable). The endpoint is public and cheap: each instance checks the database at most once a minute and logs `purge_degraded` at most once a minute; the body is only `{"ok":bool,"status":"<code>"}`. Until a custom domain is attached, a monitor needs a Protection Bypass for Automation token to reach it.
5. **ip_hash.** 002 clears it once; the daily purge also clears any `ip_hash` a pre-hardening deployment wrote between the migration and this deploy (`ip_hash_cleared` in the log). The column stays, nullable and unused, as 002 documents.

**Service area (region branch).** Run `pnpm --filter @zbest/lead migrate` again **before** deploying the region change. It must print `applied 004_region.sql` and `applied 005_region_territories.sql` (or `skip …`), then `service area check ok (56 codes accepted, 14 near-misses refused; rolled back)`. Deploying before 004 makes every lead insert fail (503) on the missing `service_area` column. A database that ran an earlier 004 is corrected by 005. The check fails the run, and changes nothing, if the live constraint does not match `SERVICE_AREAS`. Smoke test after deploy: an "Outside these areas" submission gets the decline and stores nothing; a `VI` submission stores `service_area = 'VI'`.

A "delete my data" request is handled by hand: `packages/lead/scripts/delete-lead.mjs` (runbook in its header). There is no public deletion endpoint.

## 6. Not done here
- No CRM and no backend forwarder (Option B later, behind a spec revision).
- No CAPTCHA (Brief: none at launch).
- Nothing was deployed, no Vercel env was set, and neither the `zbestmedia-ui` project nor anything on Railway was touched.


## 7. Running the lead-route gate (Mac / CI)
Two runs, plus the canonical e2e. **Both unit runs are required.**

1. **No-database unit run:** `pnpm --filter @zbest/lead test`. The Postgres tests skip by design.
2. **Database run (AEGIS r6 O1/O2):** `pnpm --filter @zbest/lead test:integration`. It refuses to start without both URLs, and sets `LEAD_TEST_EXPECT_VERIFY_FULL=1`, so verify-full **must** run. It needs:
   - `LEAD_TEST_POSTGRES_URL`: an admin connection to a **disposable** database (the tests create and drop tables and databases);
   - `LEAD_TEST_POSTGRES_NEON_URL`: a TLS-only, SCRAM role on the same server, in Neon URL shape (`?sslmode=require&channel_binding=require`, percent-encoded password);
   - `NODE_EXTRA_CA_CERTS`: the CA that signed the server certificate. The certificate must name `localhost` (and `IP:127.0.0.1`);
   - `/etc/hosts`: `127.0.0.1 lead-wrong-host.test`, a name that resolves to the server but is **not** in its certificate.

   Without the CA, or without the hosts entry, the run **fails** and names the cause. It never skips quietly. The same applies to plain `vitest` whenever `LEAD_TEST_POSTGRES_NEON_URL` is set; `LEAD_TEST_EXPECT_VERIFY_FULL=0` opts out, for a deliberately CA-less local run only.
3. **Canonical e2e:** `pnpm e2e` (WebKit for the 390 project).
