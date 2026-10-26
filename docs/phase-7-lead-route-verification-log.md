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

---

# Round 3 — AEGIS re-review r2 of 00349ee (N1–N9)

The r2 verdict was CERTIFIED WITH CONDITIONS for the merge and NOT CERTIFIED for go-live (nothing is deployed). This round fixes N1–N5 and N9. N6–N8 were trivial enough to fix; the one N7 choice not taken is documented in the design note.

## What changed, by finding
| Finding | Fix | Proven by |
|---|---|---|
| **N1** shared bucket lets one client lock everyone out | Off Vercel without `LEAD_TRUSTED_PROXY` → `503 not_configured` (`LEAD_TRUSTED_PROXY:required-off-vercel`); no request ever reaches a shared bucket. Trusted but no client address (a backstop; Vercel's edge always sends one) → keyed fallback, never global: same-origin browser requests by a UA/language fingerprint, others per app `no-origin`. The rate limit is charged only after the honeypot check, so honeypot hits and 413s never spend real visitors' tokens. | Unit: untrusted → 503 for every header variant, nothing stored; a no-Origin script exhausts only `no-origin` while a same-origin visitor still gets 200; a same-origin attacker exhausts only its own fingerprint; 10 honeypot hits + 20 oversized bodies (declared and streamed) consume nothing (then 200, 200, 429 at limit 2). |
| **N2** harmless vendor params refused | `supa`, `connection_limit`, `pool_timeout` validated and dropped. `options` accepted only as `endpoint=<id>` and **passed through** as the startup `options` parameter (the driver supports it, via `connection.options`). Unknown or repeated params are still refused. | Unit: Supabase URL with `supa`, Prisma params and `pgbouncer` parses. Neon `options=endpoint%3D…` → `startup_options`. `-c search_path`, uppercase or embedded-space options refused. Duplicate `sslmode` refused. **Real PG:** `options=endpoint%3Dep-test-123` reaches the server, which rejects it as command-line syntax (`42601`), proving the pass-through. Neon's proxy consumes it instead. |
| **N3** TLS semantics | `verify-full` / `verify-ca` → verified TLS. Documented as **recommended for Neon/Supabase**. `require` = encrypted, unverified (libpq semantics); `channel_binding` accepted but not enforced; remote default stays TLS. | Unit: mode mapping. **Real PG with a cert for IP 127.0.0.1 / DNS localhost:** `require` connects to the self-signed server. `verify-full` without the CA is refused. With the CA (`NODE_EXTRA_CA_CERTS`), `verify-full` + `channel_binding=require` stores a row; `verify-full` to `lead-wrong-host.test` (a hosts entry → 127.0.0.1, a name not in the cert) → `ERR_TLS_CERT_ALTNAME_INVALID`. Found while testing: for an IP-literal host the driver checks the chain but not the name. That is documented; vendor hosts are DNS names. |
| **N4** fence forgery with leading whitespace / zero-width | Any line starting with horizontal whitespace, invisible or zero-width characters and then 3+ dashes (incl. Unicode dashes) is defused, including after CR / U+2028. | Unit (non-vacuous: the forged closer starts its own line after `note: hello`): 8 prefixes (none, spaces, tab, U+200B, U+FEFF, NBSP, mixed) → exactly one line reads as the closer, and it is the real one, at the end. Plus CR, U+2028 and Unicode-dash cases, and inline `---` left alone. |
| **N5** surviving mutants | New tests: console/stdio spies on an internal throw; canonical-key hash; `form` in the hash (same id and fields under another form → 409). Incompatible-table test now requires the column-check message. Partially compatible table (missing `notify_status`) → named. Round trip catches a trigger that rewrites rows, and one that re-keys rows. E2E for the UI after a 409. | Mutation run below. **E2E (both viewports):** first send stored but its response dropped → "couldn't confirm"; the edit resends the same id → 409 and the conflict copy, no "Received"; send again → a new id, 200, "Received"; two rows (original + edit). |
| **N6** fake-transport residuals | `KUBERNETES_SERVICE_HOST` marker; outbox resolved through symlinks (deepest existing ancestor) before the tmp check; `ZBEST_LEAD_TRANSPORT` must be exactly `fake`; stale comment fixed. | Unit: symlink under tmp → `/var/tmp` refused (as the dir and as a parent); `" fake "` and `"fake\n"` refused; k8s marker refused. |
| **N7** Origin nits | `Sec-Fetch-Site` case-insensitive; an Origin with userinfo or a path is refused. **Not done:** scheme matching — documented in the design note. | Unit: `Cross-Site` → 403; `https://user:pw@host` → 403; `…/path` → 403. |
| **N8** harness took raw URLs | Test admin connections use the product parser (`connect()`), so `LEAD_TEST_POSTGRES_URL` may be vendor-shaped. | — |
| **N9** migrate nits | Session advisory lock. A pre-existing `leads` table is column-checked before anything is applied. After applying: columns, then a full unique index on exactly `(app, submission_id)`, then a round trip that inserts twice (the repeat must be a no-op) and reads back form, payload, hash, default services and `notify_status`. | Real processes against real PG: missing unique → named; a run blocks while the test holds the lock and completes after release; 3 concurrent runs → 1 applies, 2 skip, all exit 0. |

## Mutation testing
The reviewer's driver, adapted to this repo and this session's database, is at `/tmp/claude-0/-home-claude/507835c2-f88c-57d2-8bb7-588397ac8f5c/scratchpad/r3lead/mut.py`.
- Code that moved has its mutants retargeted at the same guard: tmpdir check, policy trust, the fallback limiter, the round trip, the `unknown-param` refusal, and the `Sec-Fetch-Site` check.
- 22 mutants were added for N1–N9.
- **Result: 55 / 55 killed** (unit + integration suite, PG with TLS on and the CA loaded).
- That includes all 7 r2 survivors: the error-logging catch, hash key sort, `form` in the hash, the migrate column check, the migrate round trip, plus `unfence` and resolve-try.
- An earlier run had 1 survivor, the advisory-lock removal, because the race test was timing-dependent. It is now killed by the deterministic lock-wait test.

## Round 3 runs (sandbox)
| Check | Result |
|---|---|
| `pnpm exec turbo run lint typecheck --force` | **11/11, 0 cached** |
| vitest, TLS PG + SCRAM role, **without** CA | 84 passed, 2 skipped (the two CA-only verify-full positives) |
| vitest, TLS PG + SCRAM role, **with** CA | 85 passed, 1 skipped (the no-CA verify-full negative) |
| (together) | all 86 tests ran and passed in one mode or the other |
| vitest without database (`pnpm test`) | 66 passed, 20 skipped |
| Full Playwright, sandbox config | **398 passed, 2 skipped, 0 failed** (6.5 min). Skips are the desktop-only phase-3 OG test and the desktop-only M1 spawned-server test. |
| phase-7 gate | 15 tests × 2 = 30 runs: 29 pass, 1 skipped (M1 on mobile) |
| Server log events | `conflict` 4, `forbidden_origin` 2, `not_configured` 6, `rate_limited` 4, with no values |

**E2E config:** gate servers now set `LEAD_TRUSTED_PROXY=1`, as required off Vercel. `next start` acts as the proxy and sets `x-forwarded-for` from the socket. On 3000, `ip_hash` is again asserted as an HMAC, never the raw IP.

**Sandbox changes for this round, outside the repo:**
- Local PG16 regenerated with a cert for `IP:127.0.0.1, DNS:localhost`, listening on 127.0.0.1 and .2.
- An `/etc/hosts` line `127.0.0.1 lead-wrong-host.test`, for the hostname-mismatch test.

## Still unverified after round 3
Unchanged from round 2:
- real Neon (run `pnpm --filter @zbest/lead migrate` with the real URL, preferably with `?sslmode=verify-full`);
- whether Vercel sets `VERCEL=1` and the IP headers in the function runtime;
- real Resend and real KV;
- WebKit and the canonical `pnpm e2e` on the Mac;
- preview-deployment email end-to-end;
- the independence condition.

Also unverified: the format of the Vercel–Supabase `supa=` parameter in a live integration. It is accepted for any short `[A-Za-z0-9._-]` value.

---

# Round 4 — AEGIS r3 findings on 403f50e (F1–F6), branch `lead-route-v2`

`lead-route-v1@403f50e` was fast-forwarded into `full-service-v1` and `main` (founder YES; r3 CERTIFIED WITH CONDITIONS). This round is on `lead-route-v2`, from `origin/main` = 403f50e. It is not merged.

## What changed, by finding
| Finding | Fix | Proven by |
|---|---|---|
| **F1** a client-sent `x-vercel-forwarded-for` bypassed the per-IP limit off Vercel | Exactly **one** client-address header is trusted. On Vercel (`VERCEL` exactly `"1"`) that is `x-vercel-forwarded-for` only. Off Vercel it is the header **named** by `LEAD_TRUSTED_PROXY` (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip` or `fly-client-ip`); any other value, including the old `1`, → `503 not_configured`. For `x-forwarded-for` the **rightmost** hop (the one the proxy appended) is used. A single-value header carrying several values is refused. `x-forwarded-host` is believed only on Vercel. The memory limiter now evicts least-recently-seen keys instead of `clear()`-ing every bucket at 50,000. | Unit, reproducing r3 probe P2: off Vercel, `LEAD_TRUSTED_PROXY=x-forwarded-for`, limit 2, fixed XFF + rotating `x-vercel-forwarded-for` + rotating `x-real-ip` → `200, 200, 429, 429…` (2 of 20 allowed). A client-prepended XFF hop is ignored. `VERCEL=true` trusts nothing. 5 invalid `LEAD_TRUSTED_PROXY` values → 503. A blocked bucket survives a key flood. On Vercel, distinct `x-vercel-forwarded-for` values get distinct buckets. |
| **F2** fingerprint fallback could lock out shared fingerprints and was evadable; the note overclaimed | Trusted header absent, empty or malformed → **`503 not_configured`**, logged `no_client_address:<header>`. The fallback limiter and `LEAD_RATE_LIMIT_FLOOD` are removed. The design note now says the old claim was wrong. | Unit: off Vercel (XFF) and on Vercel policy, with an empty header and a same-origin Origin → 503 both times, logged with the header name, nothing stored. |
| **F3** session advisory lock unreliable through a transaction pooler | Migrate reads `POSTGRES_URL_NON_POOLING`, then `DATABASE_URL_UNPOOLED`, then `POSTGRES_URL`; it prints the variable **name** and warns on a `-pooler` host. **And** the whole run is one transaction under `pg_advisory_xact_lock`: apply, checks, and a round trip in a rolled-back savepoint. The lock lives on one backend and is released by `COMMIT`/`ROLLBACK`; a failed check rolls back everything, migration included. | Real PG, real processes: NON_POOLING beats a refused `POSTGRES_URL`/`DATABASE_URL_UNPOOLED`; UNPOOLED beats a refused `POSTGRES_URL`; a refused NON_POOLING is reported by name; no URL or password printed. Pooled-host warning shown. Atomicity: a round-trip failure on a fresh DB leaves **no** `schema_migrations` and **no** 001 index. The lock-wait test (a session lock held on the same key blocks the xact lock) and the 3-way concurrent run (1 applies, 2 skip) both pass. |
| **F4** fence lookalikes | Every visitor line is quoted `> `, continuation lines included, split on LF, CRLF, CR, VT, FF, NEL, U+2028 and U+2029. Between the fences no line can start with anything else. The r2 character-class defuser is removed. | Unit: 13 lookalike closers × 8 line breaks = 104 cases. Every line between the real fences starts `> `; exactly one opener and one closer; no break character survives inside a line; the forged line is present, quoted. The lookalikes are: bare, space, tab, ZWSP, BOM, NBSP, **U+3164, U+FFA0, U+034F, box-drawing, U+2E3A, spaced dashes**, em dashes. Multi-line JSON answers are quoted line by line. |
| **F5** charging untested; r3 survivors | Tests: malformed JSON, a 400 bad_request and a 422 validation failure each spend the token (the next valid lead → 429). Migrate tests: a **partial** unique index and a **non-unique** index on `(app, submission_id)` are each named as "lacks UNIQUE". | Mutation run below. |
| **F6** info | Migrate passes the same startup parameters as the app (`options=endpoint`). The design note warns that `sslmode=prefer`/`allow` can be downgraded to plaintext. | — |

## Mutation testing (`/tmp/claude-0/-home-claude/507835c2-f88c-57d2-8bb7-588397ac8f5c/scratchpad/r4lead/mut.py`)
- **Base:** r3's driver (55 implementer + 14 reviewer mutants), re-pointed at this repo and this session's TLS-only SCRAM PG, with the CA loaded.
- **Retired (18):** mutants whose target code no longer exists — the fingerprint/flood fallback, the unfence defuser, the session unlock and the boolean trust flag. Where the same guard survives in new code it is retargeted: the trust requirement, `x-forwarded-host` on Vercel, `VERCEL` exactly `"1"`, the migrate lock, the pre-check and the post-apply column check.
- **Added for F1–F5:**
  - vercel header off Vercel; any value accepted; old `1` accepted;
  - XFF leftmost; first of many; IP shape unchecked;
  - LRU replaced by a global reset; LRU without refresh;
  - no-address allowed; a shared key;
  - NON_POOLING ignored; UNPOOLED ignored; pooler warning removed; not atomic;
  - no quoting; LF-only split; first line only quoted;
  - malformed JSON not charged; rejects not charged.
- **Result: 77 / 77 killed.**
  - The full run killed 76 / 77. The one survivor was `m4-no-source-trusted-anyway`, removing the null-source guard in `clientIp`, which the pipeline never reaches with a null source.
  - A direct unit assertion now kills it; confirmed with a targeted re-run.
  - All 7 r3 survivors are covered:
    - partial and non-unique index → killed;
    - badjson and reject charging → killed;
    - `VERCEL` truthy → killed;
    - fingerprint UA-only and session unlock → retired (code removed: no fallback; xact lock).
- Green baseline first: 94 passed, 1 skipped.

## Round 4 runs (sandbox)
| Check | Result |
|---|---|
| `pnpm exec turbo run lint typecheck --force` | **11/11, 0 cached** |
| vitest, TLS-only SCRAM PG, without CA | 93 passed, 2 skipped (the CA-only verify-full positives) |
| vitest, same, with CA | 94 passed, 1 skipped (the no-CA negative) |
| (together) | all 95 tests ran and passed in one mode or the other |
| vitest without database | 70 passed, 25 skipped |
| Full Playwright, sandbox config | **398 passed, 2 skipped, 0 failed** (5.3 min); skips are desktop-only by design |
| Server log events | `conflict` 4, `forbidden_origin` 2, `not_configured` 6, `rate_limited` 4; no `no_client_address` (the gate servers always carry their trusted header) |

**E2E config:** 3000/3001 use `LEAD_TRUSTED_PROXY=x-forwarded-for`, which `next start` fills from the socket. 3003, the rate-limit server, uses `x-real-ip`, which its test sets per viewport.

## Still unverified after round 4
- Vercel's edge overwriting a client-sent `x-vercel-forwarded-for` (r3 go-live #1). Now the only header trusted on Vercel, so this matters more, not less. Run the 9-POST spoof test on the vercel.app deployment.
- Raw preview evidence (deployment ID, migrate output, Resend message ID).
- `verify-full` in the production URL; `migrate` on the non-pooled URL (now the default when `POSTGRES_URL_NON_POOLING` is set).
- The KV decision, WebKit on the Mac, retention/CCPA, independence.
- PgBouncer itself was not run here: F3's fix rests on the documented one-backend-per-transaction guarantee of transaction pooling.
