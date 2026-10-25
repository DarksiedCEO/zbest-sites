# Lead route — verification log (branch `lead-route-v1`, Oct 25, 2026)

Two rounds. Round 1 is the build at `55d3437`. Round 2 addresses the AEGIS review of that commit (CERTIFIED WITH CONDITIONS) and is the current evidence.

Design and the founder decisions it needs are in `docs/LEAD-ROUTE-DESIGN.md`. **Nothing is merged, deployed or configured on Vercel.**

## What was run (sandbox)
| Check | Result |
|---|---|
| `pnpm lint` | 6/6 pass — **correction:** this row may have been a Turbo cache replay (AEGIS L10). Superseded by the uncached run in round 2 below. |
| `pnpm typecheck` | 5/5 pass — same correction as above. |
| `next build` (zbm, zbc; Turbopack, run by the gate and separately) | pass; `/api/lead` is dynamic (ƒ) in both |
| `@zbest/lead` unit + integration (`vitest`) with `LEAD_TEST_POSTGRES_URL` → disposable local PostgreSQL 16 | 29/29 pass (17 pipeline, 8 adapter, 4 real-Postgres) |
| Same, without a database URL (`pnpm test`) | 25 pass, 4 Postgres tests skipped |
| Full Playwright suite, `playwright.sandbox.config.ts` | **391 passed, 1 skipped, 0 failed** (5.9 min). The skip is pre-existing: `phase-3` "OG literals" runs on desktop only by design. |
| New gate `e2e/tests/phase-7-lead-route.spec.ts` | 11 tests × 2 viewports = 22, all pass |

Screenshots: `e2e/snapshots/phase-7-lead-route/` — `zbm-start-received`, `zbm-start-not-configured`, `zbm-start-rate-limited`, each at `desktop-1440` and `mobile-390`.

## What the phase-7 gate proves
- **Success:** a `/start` lead from `?service=out-of-home&src=BB-Lead-Gate` is stored once (fake outbox `rows.jsonl`), emailed once (`emails.jsonl`, subject carries services and `src:bb-lead-gate`, reply-to the visitor), and marked `notify_status: sent`. The row has `services[]` and lowercase `source` as their own fields and an HMAC `ip_hash`, never the IP.
- **Idempotency:** a real double-click plus two concurrent replays of the same `submission_id` → one row, one email.
- **Validation:** field errors shown, nothing stored.
- **Honeypot:** indistinguishable success for the bot, nothing stored or sent.
- **Rate limit:** on the tight-limit server, request 4 → `429` with `Retry-After`, and the form shows the rate-limit message.
- **Misconfiguration:** on the server with no transport env → `503 not_configured`; the form says nothing was saved and keeps the visitor's entries; the assessment shows no result.
- **ZBC:** clipper lead stored as `app: zbc`, never in ZBM's store.
- **Assessment / readiness:** the lead (contact, answers, result summary) is recorded before the result is returned.
- **Tampered source tag:** stored as `null`.

Unit tests additionally prove: the email failure mode of Brief §6.2 (row kept, visitor sees success, row marked `failed`, failure logged); store failure → `503 unavailable` and no email; partial live config (store without Resend) → `503`; fake transport refused when `VERCEL` is set; malformed `LEAD_RATE_LIMIT` → `503`; per-app rate buckets; Upstash/KV limiter and its memory fallback; Resend request shape and `Idempotency-Key`; no CR/LF in the subject; **no visitor data (name, business, email, IP, user agent) in any log line**, through the injected logger and the real console logger.

Server log lines seen during the e2e run were only `{"scope":"lead","event":…,"app":…,"missing":…}` — no PII.

## Existing tests changed (intended: the stub is gone)
`phase-4-zbm`, `phase-4-zbc`, `phase-5`, `phase-5-visibility`, `phase-6-full-service`: stub assertions (`X-Zbest-Lead-Stub`, `stub: true`, "Stub — not delivered", "Nothing is stored or sent.") now assert the opposite — no stub marker, `X-Zbest-Lead-Transport: fake`, "Received". No other assertion changed.

Earlier phases' committed screenshots were **not** overwritten (restored after the run).

## Sandbox caveats — re-run the canonical gate before treating this as closed
- No WebKit: the 390 project ran on Chromium emulating iPhone 14 (as in phase 6).
- Google Fonts blocked: the build used `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` pointing at a sandbox-only file mapping the four exact Google CSS URLs to local `@fontsource` woff2 files served from 127.0.0.1. Nothing font-related is committed.
- Run `pnpm e2e` on the Mac. The config now starts four servers (3000 zbm fake, 3001 zbc fake, 3002 zbm unconfigured, 3003 zbm rate-limited); 3002/3003 reuse the 3000 build.

## Not verified
- Real Resend delivery (no key, domain not verified).
- Neon / Vercel-hosted Postgres (only local PostgreSQL 16, `prepare: false`, no pooler) and `pnpm --filter @zbest/lead migrate` against it.
- Upstash/Vercel KV (unit-tested with a fake fetch only).
- Vercel's `x-real-ip` / `x-forwarded-for` behaviour; on any other host those headers are client-controlled.
- Per-instance memory rate limit on serverless (not a global cap without KV).
- Preview-deployment end-to-end email (Brief §3 launch checklist item) — blocked on the founder decisions.


---

# Round 2 — AEGIS conditions (H1, M1–M4, L1–L8, L10)

## What changed, by finding
| Finding | Fix | Proven by |
|---|---|---|
| **H1** Neon `channel_binding` → 42704, every lead 503 | `src/pg-url.ts` parses `POSTGRES_URL`. The driver gets discrete options, never the URL. `channel_binding` / `pgbouncer` are dropped, `sslmode` is mapped, `connect_timeout` is kept; any other param → `not_configured` naming the key only. A remote host with no `sslmode` uses TLS. | Unit: Neon pooled, Neon direct, Supabase pooler (± `pgbouncer`), Supabase direct, percent-encoded password, 7 refusal cases. **Real Postgres:** a Neon-shaped URL `postgresql://leadscram:<pct-encoded>@127.0.0.1:55432/leads_test?sslmode=require&channel_binding=require` against PG16 with `ssl=on`, a role that `pg_hba` allows **only** over TLS with SCRAM-SHA-256 → row stored. The same URL handed to the driver raw → `42704` (regression proof). |
| **M1** malformed URL → 500 and the password in logs | URL parse failures → `POSTGRES_URL:<reason>` → `503 not_configured`. `resolveTransport` never throws. Any unexpected throw in the pipeline → bare `503` plus an `internal_error` event, with no error object logged. Driver error codes are logged only if they match `^[A-Z0-9_]+$`. | Unit: three malformed URLs (`[bad`, `%ZZ`, port 99999) → 503, and the password appears in no `console.*`, `process.stdout` or `process.stderr` call. **E2E on a real `next start`** (port 3004, spawned by the test, `POSTGRES_URL=postgres://u:<random>@[bad/db`): three POSTs → 503 `not_configured`; the server's full stdout+stderr contains `POSTGRES_URL:unparseable` and not the password, `[bad`, `TypeError` or `Invalid URL`. |
| **M2** fake transport accepted off Vercel | Requires **all** of: `ZBEST_LEAD_FAKE_ACK` equal to the gate's per-run `ZBEST_GATE_NONCE` (16+ chars); outbox under `os.tmpdir()`; no platform marker (`VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, `RAILWAY_*`, `FLY_APP_NAME`, `RENDER`, `K_SERVICE`, `NETLIFY`, `AWS_LAMBDA_FUNCTION_NAME`, `DYNO`). `NODE_ENV` is not usable, because `next start` is always production; the per-run nonce is the equivalent. | Unit: missing, wrong or short ack refused; outbox outside tmp refused (incl. `..` escape); each marker refused; the reviewer's exact env refused; a refused fake at the route → 503 with nothing written. |
| **M3** cross-site `text/plain` POST accepted | `415` unless `application/json`. `403` for a foreign or opaque `Origin`, or for `Sec-Fetch-Site: cross-site` without one. Same-origin is always allowed, and `LEAD_ALLOWED_ORIGINS` adds more. `x-forwarded-host` counts only behind a trusted proxy. | Unit: 5 content types → 415; JSON with charset → 200; foreign, `null` and look-alike-suffix origins → 403; allowlist works; a malformed allowlist → 503. **E2E:** API `text/plain` → 415, foreign Origin → 403, nothing stored. **A real browser on the ZBC origin**: a `no-cors` text/plain POST to ZBM is sent but stores nothing (415), and a JSON POST is blocked by the preflight. No row with that marker exists. |
| **M4** spoofable IP, and "unknown" was one global bucket | Client-IP headers are trusted only on Vercel (`VERCEL=1`: `x-vercel-forwarded-for` → `x-real-ip` → `x-forwarded-for`) or with `LEAD_TRUSTED_PROXY=1`, and must look like an IP. With no trusted address, the per-IP limit does not apply; a separate per-app flood ceiling does (`LEAD_RATE_LIMIT_FLOOD`, default `200/600`), and `rate_limit_no_client_ip` is logged. The design note says KV is needed for a global cap and lists it as a launch decision. | Unit: untrusted rotating `x-real-ip` → all share the flood ceiling (`200,200,200,429,429`); untrusted no-IP → 10/10 pass with per-IP limit 1 (not one tiny bucket); trusted → distinct buckets; malformed flood setting → 503. E2E rate-limit test runs on a server with `LEAD_TRUSTED_PROXY=1`. |
| **L1** unbounded body and answers | `413` for a declared length over 64 KB; the stream is read with a 64 KB cap (cancelled past it). `answers` is `.max(32)` with `abort`, so no per-id echo. | Unit: declared 65 KB → 413; a 16 MB stream → 413 after fewer than 10 chunks pulled. E2E: 70 KB body → 413. |
| **L2** changed resubmission silently dropped | `payload_hash` column; same id + same hash → 200 (no second email); same id + different hash → `409 conflict`, first row kept. The form shows the conflict copy and starts a new id. | Unit (fake) and **real Postgres**: 3 concurrent identical inserts → 1 inserted + 2 `samePayload`; an edited insert → `samePayload: false`. E2E: 200 then 409, row keeps "First", one email. |
| **L3** "Nothing was saved" on unknown outcomes | `failed` → "We couldn't confirm that went through — please try again." | copy in `FAILURE_COPY` |
| **L4** honeypot autofill | input name `zbx_hp_7f3`, `autocomplete="off"`, 1Password/LastPass ignore attributes; wire key stays `company_url` | E2E honeypot test uses the new input, asserts `autocomplete="off"` |
| **L5** no migration version table | `schema_migrations`; per-file transaction; column/type check against what the app writes; rolled-back round-trip insert | **Real process against real Postgres:** fresh DB → `applied 001`, `schema ok; round-trip insert ok`; second run → `skip 001`; incompatible older `leads` → non-zero exit; a URL with `?options=` → refused, password not printed. |
| **L6** idempotency key | `lead-<app>-<submission_id>` | unit + e2e |
| **L7** visitor text in email | plain text inside `----- visitor-supplied, unverified -----` fences; visitor lines starting with `-----` are defused | unit: a visitor cannot close the fence |
| **L8** server-only | `import "server-only"` first in `src/index.ts` (vitest aliases it to an empty stub) | unit asserts it; `next build` passes with it |
| **L9** forgeable source tag | inherent; no change | — |
| **L10** cached lint/typecheck | re-run with `--force` | below |

## Round 2 runs (sandbox)
| Check | Result |
|---|---|
| `pnpm exec turbo run lint typecheck --force` | **11/11 tasks, 0 cached** (lint 6, typecheck 5) |
| `vitest` with `LEAD_TEST_POSTGRES_URL` + `LEAD_TEST_POSTGRES_NEON_URL` (PG16, TLS on, SCRAM role) | **64/64 pass**: hardening 30, pipeline 17, adapters 8, Postgres 9 (incl. TLS/SCRAM/channel_binding, raw-URL 42704 regression, migrate runner ×3) |
| `vitest` without database URLs (`pnpm test`) | 55 pass, 9 skipped (the Postgres file) |
| Full Playwright, sandbox config (builds both apps) | **396 passed, 2 skipped, 0 failed** (6.3 min). Skips: the pre-existing desktop-only phase-3 OG test, and the new M1 spawned-server test (desktop-only by design; it's server behaviour). |
| phase-7 gate | 14 tests × 2 viewports = 28 runs: 27 pass, 1 skipped (M1 on mobile, by design) |
| Server log events seen during the run | `conflict` 2, `forbidden_origin` 2, `not_configured` 6, `rate_limited` 4. No field values, emails, IPs, URLs or error objects. |

**One flake observed and not caused by this change:** in the round-2 attempt before the final run, `phase-2` "counter ticks once, and prefers-reduced-motion disables the tick" (desktop) read `0` instead of `1,240,000` once. It passed on the targeted re-run and in the final full run. That test and the counter are untouched by this branch.

**E2E changes in round 2:** the gate servers now pass the M2 proof (`ZBEST_LEAD_FAKE_ACK = nonce`). 3003 sets `LEAD_TRUSTED_PROXY=1` (it stands in for Vercel's edge in the rate-limit test). 3000 and 3001 raise `LEAD_RATE_LIMIT_FLOOD`, because their requests carry no trusted IP. On 3000, `ip_hash` is now asserted `null`, which is correct for an untrusted host; the HMAC path is unit-tested. The double-submit replay now resends the exact browser request, since changed content is a 409 by design.

## Still unverified after round 2
- **Real Neon.** The H1 proof is a Neon-shaped URL against stock PG16 with TLS and SCRAM, not Neon's proxy. Run `pnpm --filter @zbest/lead migrate` with the real Vercel/Neon `POSTGRES_URL`: it parses with the app's own parser and does a round-trip insert, so it is the pre-launch check.
- That Vercel sets `VERCEL=1` in the function runtime (the trusted-IP switch) and overwrites `x-vercel-forwarded-for` / `x-real-ip`.
- Origin/Host equality behind Vercel's edge on a custom domain plus `www` redirect. If the apex and `www` both serve the form, add the other to `LEAD_ALLOWED_ORIGINS`.
- Real Resend, real KV. Per-instance limits without KV.
- WebKit and the canonical `pnpm e2e` on the Mac. Preview-deployment email end-to-end.
- The independence condition: builder and reviewer were both Claude sessions sharing a scratchpad.
