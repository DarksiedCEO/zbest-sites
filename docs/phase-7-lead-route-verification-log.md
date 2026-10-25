# Lead route — verification log (branch `lead-route-v1`, Oct 25, 2026)

Design and the founder decisions it needs are in `docs/LEAD-ROUTE-DESIGN.md`. **Nothing is merged, deployed or configured on Vercel.**

## What was run (sandbox)
| Check | Result |
|---|---|
| `pnpm lint` | 6/6 packages pass |
| `pnpm typecheck` | 5/5 pass |
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
