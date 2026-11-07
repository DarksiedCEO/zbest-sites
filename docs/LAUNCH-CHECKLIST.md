# Launch checklist: zbestmedia.com and zbestclips.com

**Written:** 2026-11-07, from the launch work order ("launch with what's on hand"). The homepage redesign (#20) is out of scope.
**Who does what:** builders open and update PRs. The founder merges, sets env vars, runs migrations, and changes DNS. Nothing here has been done yet.
**Vercel projects:** `zbm-site-v2` (Z Best Media) and `zbc-site-v1` (Z Best Clips), both in team `darksiedceo`. Do not change the legacy `zbestmedia-ui` project. The one exception is step 6b, moving the domain off it, and the founder does that by hand.

---

## 0. Blockers to clear before launch day

| # | Blocker | Owner | Why it blocks |
|---|---|---|---|
| B1 | Fill `[LEGAL ENTITY NAME]`, `[BUSINESS MAILING ADDRESS]`, `[EFFECTIVE DATE]` in `apps/zbm/lib/legal.ts` (via a small PR on top of #10/#14). | Founder supplies, builder commits | A production build of ZBM **throws** while any token remains (`app/legal/[document]/page.tsx`). Merging #10 to main without them breaks the ZBM production deploy. The previous deployment stays live, but nothing new ships. |
| B2 | Approve `docs/LEGAL-ADOPTION-SUMMARY.md` in writing on PR #10. | Founder | Until then every legal page shows "Draft — pending attorney review." The site can launch with the draft line on; approval only removes it. |
| B3 | **Register zbestclips.com.** `whois` on 2026-11-07 says "No match": the domain is not registered. | Founder | Nothing in §6c can happen until it is. |
| B4 | Make sure `privacy@`, `legalnotice@` and `billing@zbestmedia.com` exist in Google Workspace and someone reads them. | Founder | The policies promise replies by deadline at those addresses. `hello@zbestmedia.com` (ZBC's "not accepting" notice) too. |
| B5 | Replace `RESEND_API_KEY` in both projects with a **Full access** key. The current one is labelled "send-only". | Founder | #14's delivery check calls `GET /emails/{id}`. A send-only key makes `/api/health` warn `delivery_unverifiable` and turns the check off (docs/LEAD-ROUTE-DESIGN.md §8). |
| B6 | Confirm the Neon databases are in a US region (Neon console). | Founder | The Privacy Policy says data is stored in the United States. |

---

## 1. Merge order

Merge one PR at a time, into `main`. After each merge, the next PR must be green on GitHub against the new `main` before it is merged. If GitHub shows "out of date" or a conflict, a builder merges `main` into that branch (no force-push) and waits for CI.

| Step | PR | What it ships | Notes |
|---|---|---|---|
| 1 | #17 `codex/story-pass-images` | 36 story images | Green (e2e run 42411311965). |
| 2 | #21 `feat/self-host-fonts` | Fonts from the repo; no Google Fonts fetch at build | Ends the CI and Vercel build failures on fonts.gstatic.com. |
| 3 | #7 `site-hardening-2026-10-30` | Retention purge cron, keyed rate limit, GPC, `/api/health`, deps | Needs **migrations 002–003** and **`CRON_SECRET`** (§2, §3) *before* or right after deploy, or `/api/health` reports 503. |
| 4 | #8 `site-region-2026-10-30` | Required service area (state/territory) on every lead form | Needs **migrations 004–005**. Contains #7's commits. |
| 5 | #9 `a11y-wcag22aa` | WCAG 2.2 AA fixes and the axe gate | Retarget its base to `main` after #8 merges (GitHub does this when the base branch is deleted). |
| 6 | #10 `legal-zbm-in-effect` | Real policy text, refund policy, draft line, equal cookie buttons | **Needs B1 first** (or the production build fails). Retarget to `main` after #9. |
| 7 | #14 `site-redteam-fixes-2026-10-30` | Lead outbox, digests, quarantine, delivery checks, ZBC forms off, copy truth | Needs **migrations 006–012**. Retarget to `main` after #10. |
| 8 | (this PR) | This checklist | Docs only; any time. |

#15 (builder handoff docs) is independent and docs-only. #20 stays a stopped draft.

Steps 3–7 change the live lead route. Do them in one sitting, then run §4 before the domain cutover.

---

## 2. Environment variables (Vercel → Project → Settings → Environment Variables → Production)

Set on **both** `zbm-site-v2` and `zbc-site-v1` unless noted. Generate secrets with `openssl rand -hex 32`.

| Variable | Status on 2026-11-07 | Needed by | Value |
|---|---|---|---|
| `POSTGRES_URL` (+ `POSTGRES_URL_NON_POOLING`, `DATABASE_URL_UNPOOLED`) | **set** (Neon integration; separate database per project) | all lead code; migrations use the non-pooling URL | leave as is |
| `LEAD_IP_HASH_SECRET` | **set** | #7 rate limit | leave as is (≥ 16 chars) |
| `RESEND_API_KEY` | set, but **send-only** | lead emails; #14 delivery check | replace with a Full access key (B5) |
| `LEAD_NOTIFY` | set: `enabled` | lead emails | leave |
| `LEAD_NOTIFY_FROM` | set: `Z Best Media Leads <leads@zbestmedia.com>` / `Z Best Clips Leads <leads@zbestmedia.com>` | lead emails | leave |
| `LEAD_NOTIFY_TO` | set: `andre@zbestmedia.com` | lead emails | leave |
| **`CRON_SECRET`** | **missing** | #7: `/api/cron/purge-leads`, `/api/health`; #14: `/api/cron/retry-notify`, `/api/cron/ack-undelivered` | new random secret (≥ 16 chars). Without it the purge never runs (so the 24-month and 90-day deletions in the Privacy Policy don't happen) and `/api/health` returns `503 cron_secret_missing`. |
| `LEAD_ACK_SECRET` | missing | #14, recommended | new random secret (≥ 16), different from `CRON_SECRET` |
| `LEAD_FORM_SECRET` | missing | #14, optional | new random secret; otherwise derived from `LEAD_IP_HASH_SECRET` |
| `NEXT_PUBLIC_PRIVACY_CHOICES` | missing | ZBM footer "Your Privacy Choices" link | leave unset (nothing to opt out of today) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | missing | optional shared rate-limit store | leave unset; limits then live per server instance |
| `LEAD_RETENTION_DAYS`, `LEAD_UA_RETENTION_DAYS` | unset (defaults 730 / 90) | #7 purge | **leave unset**: the Privacy Policy promises exactly these defaults |
| `ZBEST_ALLOW_LEGAL_PLACEHOLDERS` | unset | e2e only | **never set in production** |

ZBC's forms are switched off by #14 (`/api/lead` answers 410), but its cron and health routes still run, so ZBC needs `CRON_SECRET` too.

Env changes take effect on the next deployment. After setting them, redeploy production (Vercel → Deployments → latest → Redeploy).

---

## 3. Database migrations (both databases)

Migrations are **not** run by the deploy. Run them from a trusted machine, once per project, in merge order.

```bash
cd ~/WebstormProjects/zbest-sites      # a checkout of main after the PR is merged
vercel link --project zbm-site-v2      # then again with zbc-site-v1
vercel env pull .env.local --environment=production
pnpm install --frozen-lockfile
pnpm --filter @zbest/lead migrate
rm .env.local                          # don't leave production secrets on disk
```

| After merging | Expect the migrate output to include |
|---|---|
| #7 | `applied 002_retention.sql`, `applied 003_purge_runs.sql` |
| #8 | `applied 004_region.sql`, `applied 005_region_territories.sql` |
| #14 | `applied 006_content_dedupe.sql` … `applied 012_ack_history_recovery_cap.sql` |
| every run | `schema ok; unique key ok; round-trip insert ok (rolled back)` |

It's fine to run once after #14 merges: the script applies whatever is missing, in order. The lead route will be degraded between the deploy and the migration, so keep that gap to minutes. `/api/health` reports `schema_outdated` until the migration runs.

---

## 4. Real-lead test (do on `zbm-site-v2.vercel.app` before the cutover, and again on www.zbestmedia.com after it)

1. **Health.** `curl -s https://zbm-site-v2.vercel.app/api/health` should return `200 {"ok":true,"status":"ok"}`. The response is cached up to 60 s.
   - `cron_secret_missing`: §2 isn't done.
   - `schema_outdated`: §3 isn't done.
   - `overdue` or `unknown` before the first daily purge: trigger the purge once by hand:

     ```bash
     curl -s -H "Authorization: Bearer $CRON_SECRET" https://zbm-site-v2.vercel.app/api/cron/purge-leads
     ```

2. **Submit.** Open `/contact` in a normal browser window.
   - Fill in: name `Launch Test`; business `ZBM Launch Test <date>`; state `California`; message `Launch test — please ignore`; reach = an email address you can read.
   - Submit. The page must show the success message.
3. **Check the Neon row** (Neon console → SQL editor, the zbm-site-v2 database):

   ```sql
   SELECT submission_id, app, form, service_area, notify_status, notify_email_id, created_at,
          ip_hash, length(user_agent) AS ua_len, payload->>'business' AS business
   FROM leads WHERE payload->>'business' LIKE 'ZBM Launch Test%' ORDER BY created_at DESC LIMIT 1;
   ```

   Expect `app = zbm`, `form = contact`, `service_area = US-CA`, `ip_hash` NULL, `ua_len` ≤ 500. `notify_status` should be `sent` within a minute, with a `notify_email_id`.
4. **Check the email.** `andre@zbestmedia.com` gets "New lead — Z Best Media · contact …" from `leads@zbestmedia.com`. The body quotes every field, and Reply goes to the test address. If it isn't there, check Spam, then Resend → Emails, then `/api/health` (`notify_backlog`).
5. **Out-of-area check.** Submit again with state = outside the US. The form must refuse it, and no new row appears.
6. **Clean up.** Delete the test lead:

   ```bash
   node --env-file=.env.local packages/lead/scripts/delete-lead.mjs --match "ZBM Launch Test"
   node --env-file=.env.local packages/lead/scripts/delete-lead.mjs --match "ZBM Launch Test" --confirm
   ```

   The first command is a dry run; the second deletes. Then delete the email from the inbox.
7. **ZBC.** `curl -s -o /dev/null -w "%{http_code}\n" -X POST https://zbc-site-v2.vercel.app/api/lead` should print `410` (forms off), and `/api/health` on ZBC should return 200.

---

## 5. Final pre-cutover checks

- [ ] All seven PRs merged in order. The latest production deployment on both projects is from `main` and shows "Ready".
- [ ] §4 passed on the `.vercel.app` URLs.
- [ ] Legal pages load and the cookie banner's two buttons look identical.
- [ ] `/search-intelligence` is still absent from nav, footer and sitemap (it stays unlinked).
- [ ] Note down the current DNS (below) and the legacy deployment URL, for rollback.

---

## 6. Domain cutover

### 6a. What's there now (checked 2026-11-07 with `dig` and the Vercel API)

**zbestmedia.com.** Registrar and DNS: Namecheap (`dns1/dns2.registrar-servers.com`). Domain expires 2032-07-04.

| Host | Type | Value now | Notes |
|---|---|---|---|
| `@` | A | `216.198.79.1` | Vercel. Attached to the **legacy `zbestmedia-ui`** project. |
| `www` | CNAME | `4e5e5c075b59248f.vercel-dns-017.com.` | Vercel. Legacy project. |
| `@` | MX | `1 smtp.google.com.` | Google Workspace. **Do not touch.** |
| `send` | MX / TXT | `10 feedback-smtp.us-east-1.amazonses.com.` / `v=spf1 include:amazonses.com ~all` | Resend sending. **Do not touch.** |
| `resend._domainkey` | TXT | DKIM key | Resend. **Do not touch.** |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:andre@zbestmedia.com` | **Do not touch.** |

On Vercel, which project serves a domain is set by which project the domain is **attached** to, not by the DNS record. Both projects sit behind the same Vercel edge IPs. So the ZBM cutover is mainly moving the domain between projects; the DNS change is small.

### 6b. Z Best Media cutover (founder does this in the Vercel dashboard and Namecheap)

The canonical host is **www.zbestmedia.com**, with the apex redirecting to it.

1. In the legacy `zbestmedia-ui` project (Settings → Domains): note its settings. **Remove** `www.zbestmedia.com` and `zbestmedia.com` from it. Leave the project and its deployments alone; they are the rollback.
   - This is the only change to the legacy project. Vercel lets a domain belong to one project at a time.
   - The site shows a Vercel 404 from here until step 2 finishes, usually under a minute. Do steps 1–2 back to back.
2. In `zbm-site-v2` (Settings → Domains):
   - Add `www.zbestmedia.com` and set it as the production domain.
   - Add `zbestmedia.com` and set it to **redirect (308) to www.zbestmedia.com**.
3. DNS at Namecheap (Advanced DNS). Vercel's recommended values for `zbm-site-v2`, as reported on 2026-11-07. Use whatever the Vercel Domains page shows on the day, if it differs:

   | Host | Type | Value | TTL |
   |---|---|---|---|
   | `@` | A | `216.198.79.1` | Automatic |
   | `@` | A | `64.29.17.1` | Automatic |
   | `www` | CNAME | `3defb72e18263dab.vercel-dns-017.com.` | Automatic |

   The apex `216.198.79.1` record is already correct; add the second A record. Change the `www` CNAME from the legacy value to the new one. Leave every MX and TXT record untouched.
4. Wait for Vercel to show both domains as "Valid Configuration" and issue the certificate (minutes).
5. Verify:

   ```bash
   curl -sI https://zbestmedia.com | head -3
   curl -s https://www.zbestmedia.com/api/health
   ```

   The first should show `308` to `https://www.zbestmedia.com/`; the second should return `200`. Then run §4 on www.zbestmedia.com.
6. Send one real email to `privacy@zbestmedia.com` from an outside address, to confirm mail still works.

### 6c. Z Best Clips (after B3: register zbestclips.com)

1. Register `zbestclips.com` (Namecheap, so both domains live in one place).
2. In `zbc-site-v1` (Settings → Domains): add `www.zbestclips.com` as the production domain. Add `zbestclips.com` set to redirect (308) to www.
3. DNS at Namecheap (Vercel's recommended values for `zbc-site-v1` on 2026-11-07; recheck on the day):

   | Host | Type | Value |
   |---|---|---|
   | `@` | A | `216.198.79.1` |
   | `@` | A | `64.29.17.1` |
   | `www` | CNAME | `a8c00fdecf82ed1a.vercel-dns-017.com.` |

4. Verify:

   ```bash
   curl -sI https://zbestclips.com
   curl -s https://www.zbestclips.com/api/health
   ```

   The first should show `308` to www; the second should return `200`. ZBC's `/api/lead` returns 410.

ZBC needs no MX records: it sends nothing and its notice points people to hello@zbestmedia.com.

---

## 7. Rollback plan

**When to roll back:**
- The site is down or shows a certificate error for more than 10 minutes after the cutover.
- §4 fails on the live domain and can't be fixed by a redeploy.
- Leads are not reaching the database or the inbox.

**Code problem, domain fine.** In `zbm-site-v2` → Deployments, pick the last good production deployment → **Instant Rollback**. Takes seconds and changes nothing in DNS.

Database migrations are additive (new columns and tables) and stay in place on rollback. The older code ignores them. Never run a "down" migration on production.

**Domain cutover problem (ZBM):**
1. In `zbm-site-v2` → Domains: remove `www.zbestmedia.com` and `zbestmedia.com`.
2. In legacy `zbestmedia-ui` → Domains: add `zbestmedia.com` and `www.zbestmedia.com` back, the way they were in 6a.
3. At Namecheap: set `www` CNAME back to `4e5e5c075b59248f.vercel-dns-017.com.`. The apex A `216.198.79.1` serves either project; the extra `64.29.17.1` record can stay.
4. Check that `https://www.zbestmedia.com` shows the old site. Note the time and what failed, then fix it on the `.vercel.app` URL before trying again.

**Leads during a rollback.** The old site has its own form handling. Any lead the new site accepted is already in the Neon database and is kept; nothing is lost by rolling back. Re-check `notify_status` for rows created during the incident.

**ZBC.** Remove the domains from `zbc-site-v1`. The domain then shows nothing, which is the same as before launch.

---

## 8. Day after launch

- [ ] `/api/health` is 200 on both sites after the first scheduled purge (09:17 UTC) and retry run (15:41 UTC ZBM, 16:11 UTC ZBC).
- [ ] Vercel → each project → Cron Jobs shows successful runs.
- [ ] Resend shows the test emails as delivered.
- [ ] Optional: add an SPF record for the apex (`v=spf1 include:_spf.google.com ~all`). The apex has no SPF today, which can hurt deliverability of Google Workspace mail. It is separate from the site and not required for launch.
