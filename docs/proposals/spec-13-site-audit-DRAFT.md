# §13 Live Site Audit — DRAFT for founder approval

Status: **DRAFT. Not approved. Nothing in this section may be built against until Andre approves it.**
Proposed addition to `docs/backend-interface-spec-v0.4.md` (would make it v0.5). Drafted by the build
session on 2026-11-07 at Andre's request; per standing practice the spec is Andre's to approve or rewrite.

Source of the idea: homepage Concept A ("The Inspection"), prototyped locally in
`~/WebstormProjects/zbm-wow-concepts/` (server: `server.mjs`). The prototype proves the interaction; it is
not production code and is not to be copied into this repo as-is.

---

## 13.1 What it is

A visitor types their website address on the ZBM homepage. ZBM loads that one public page in a headless
phone browser, takes a screenshot, and returns a short report. Every finding names one of the six leaks,
and carries a **priority** and a **confidence** label.

It is the outside view only. It never claims to see calls, follow-up, ad accounts, analytics or revenue.

## 13.2 How it relates to the free assessment ruling (decision 10, 2026-09-17)

Decision 10 says the free tier returns **one prioritized leak** and what fixing it looks like,
deterministic, no dollar figure, no founder in the loop. The live audit fits every one of those terms:
rule-based, no model, no currency field by construction.

**Open decision D13-1 (Andre):** is the live audit
- (a) a second free tool beside the existing form-based assessment, or
- (b) the free assessment itself, replacing the form-answer mapping, with the top finding as "the one
  prioritized leak"?

The draft below works for both. The homepage build waits on this answer.

## 13.3 Request

`POST /api/audit` (ZBM app only). Body: `{ "url": string }`.

- Accepts `example.com`, `https://example.com/path`. Adds `https://` when missing.
- Rejects: non-http(s) schemes, hosts without a dot, `.local`/`.internal`, and any host whose DNS
  resolves to a private, loopback, link-local, CGNAT or multicast address (IPv4 and IPv6). Checked
  before the browser opens the page, and again on every request the page makes (subresource SSRF guard).
- One page load per audit. No crawling, no following links, no form submission, no clicking.

## 13.4 Response: a server-sent event stream

Events in order. Every event is JSON.

| Event | Shape | Notes |
|---|---|---|
| `step` | `{ id: StepId, label: string, status: "run" \| "done", detail?: string, t: number }` | `t` = ms since start |
| `shot` | `{ data: string, w: 390, h: number, fold: 844, url: string }` | JPEG data URL, width 390 CSS px, height capped at 2200 |
| `finding` | `Finding` (13.5) | Sorted: High, Medium, Low, To test, Pass |
| `done` | `{ ms: number, url: string, at: string }` | `at` = ISO time |
| `fail` | `{ code: FailCode, message: string }` | Ends the stream. No findings are sent after a `fail`. |

`StepId = "connect" | "speed" | "shot" | "dom" | "tags"`.

`FailCode = "invalid_url" | "not_found" | "private_address" | "timeout" | "blocked" | "http_error" | "rate_limited" | "busy" | "internal"`.

Every `fail` message is plain English and says what the visitor can do next. A timeout is reported as
a timeout, never as a finding with an invented number.

## 13.5 Finding

```ts
type Leak =
  | "Missed calls" | "Broken mobile forms" | "No follow-up"
  | "Slow pages" | "Wrong landing page" | "No retargeting";   // the six leaks, site order

type Priority = "High" | "Medium" | "Low" | "To test" | "Pass";

type Confidence = "Measured" | "Detected" | "Not found" | "Needs the full audit";

type Finding = {
  leak: Leak;
  title: string;        // one sentence, plain English
  why: string;          // one or two sentences
  note?: string;        // the limit of the check, e.g. "One test load. Real visits vary."
  priority: Priority;
  confidence: Confidence;
  service: ServiceName; // one of the ten catalog names in content/services.ts
  pass?: true;
  outside?: true;       // true for checks only the paid audit can make
  box?: { x: number; y: number; w: number; h: number }; // CSS px on the screenshot
};
```

No field can hold a currency amount, a revenue estimate, or a conversion rate. That is deliberate.

### Confidence labels, in the words the page shows (the reviewer asked for these)

- **Measured**: we timed it on this one test load. Your real visitors' times will vary.
- **Detected**: we found it on the page.
- **Not found**: we looked for it on this page and did not find it. It may exist somewhere we could not see,
  such as another page or behind a click.
- **Needs the full audit**: it cannot be seen from outside. The paid audit tests it with real calls and
  inquiries.

### Priority labels

- **High**: likely losing customers now; fix first.
- **Medium**: costing some customers; fix soon.
- **Low**: worth fixing; small effect alone.
- **To test**: not checkable from outside.
- **Pass**: checked and fine.

## 13.6 The checks (all deterministic)

| Check | Leak | Rule | Confidence |
|---|---|---|---|
| Main content time (LCP, else load) | Slow pages | ≥ 4.0 s High; 2.5–4.0 s Medium; < 2.5 s Pass | Measured |
| Page weight | Slow pages | > 4 MB Medium | Measured |
| Not HTTPS | Slow pages | High | Detected |
| Tap-to-call link | Missed calls | none High; only below first screen Medium; on first screen Pass | Not found / Detected |
| Call tracking script | Missed calls | none Low | Not found |
| Largest visible form | Broken mobile forms | > 5 fields Medium; phone field not `type=tel` Low; ≤ 5 Pass | Detected |
| No form and no booking widget | Broken mobile forms | Medium | Not found |
| First-screen action button | Wrong landing page | none Medium; present Pass | Not found / Detected |
| Search description | Wrong landing page | missing Low | Not found |
| Retargeting tags (Meta, Google Ads, TikTok, LinkedIn) | No retargeting | none Medium; any Pass | Not found / Detected |
| Reply speed to a new inquiry | No follow-up | always sent | Needs the full audit |
| Phone answered after hours | Missed calls | always sent | Needs the full audit |

Every rule above must pass the accuracy test (13.10) before launch. A rule that misfires on more than
2 of the test sites is removed or rewritten, not shipped with a caveat.

## 13.7 What the audit may and may not say

May say: what it loaded, timed, found or did not find, on one load of one page, with the limit stated.

May not say: any dollar figure; any "you are losing X customers"; any comparison to competitors; any claim
about calls, inbox, CRM, ad accounts or analytics; anything about pages it did not load; "guaranteed",
"proven", "always", "never".

## 13.8 What happens to the address the visitor types

The homepage must say this under the address box, and the Privacy Policy must match it (attorney review):

- The address, the screenshot and the findings are **not stored**. They exist in memory for the length of
  the audit and are sent only to the visitor's browser.
- Server logs record the time, the result code and a **hash** of the hostname, kept 30 days, for abuse
  control only.
- Nothing is linked to a lead unless the visitor then chooses to submit a form. If they do, the form says
  the report will be attached, and they can untick it.
- The page load comes from ZBM's server, so the audited site sees a visit from ZBM, not from the visitor.

**Open decision D13-2 (Andre + attorney):** confirm "not stored" is the policy you want. Storing reports
would help sales follow-up but makes this a data-collection feature with a retention schedule.

## 13.9 Abuse and cost controls

- Rate limit: 5 audits per IP per hour, 50 per IP per day, keyed and enforced server-side (reuse the
  keyed limiter from PR #7 once merged). Over the limit returns `fail` `rate_limited`.
- Bot protection: Cloudflare Turnstile (or Vercel BotID) token required on the request. **Open decision
  D13-3:** which one.
- Concurrency: at most 3 browsers at once per region; extra requests get `busy`.
- Hard limits: 30 s page load, 45 s whole audit, 3 MB HTML, 2200 px screenshot height, no downloads,
  no permission prompts, no audio.
- Runtime: a serverless headless Chromium (e.g. `@sparticuz/chromium` on Vercel functions, 1 GB memory,
  60 s max). **Open decision D13-4:** budget ceiling per month, and what the page says when it is hit.

## 13.10 Accuracy test before launch

- 30 real public sites: 10 home services, 5 med spa, 5 legal, 5 auto, 5 restaurant; mix of fast, slow,
  bot-blocking and broken.
- For each, a person checks every finding by hand on a real phone. Record agree / disagree per finding.
- Launch bar: zero wrong High findings; at most 2 wrong findings overall per rule across the 30.
- Plus the hostile cases: typo'd address, private address, a redirect to a private address, a site that
  times out, a site that returns 403 to bots, a page that never stops loading, a 20 MB page. Each must end
  in a clear `fail` message, never a frozen spinner and never a fake result.
- The test sheet is committed with the build and re-run whenever a rule changes.

## 13.11 Frontend contract (§9 still governs)

- Behind a typed adapter (`lib/audit/`), fixtures-only until the endpoint is approved and certified.
- The fixture is a real recorded run against `example.com` (IANA-reserved), labeled "Example report" on
  the page.
- The visitor's screenshot is rendered through a new `AuditScreenshot` component inside
  `packages/ui/src/media/` so `check:media`'s "no raw <img> outside media" rule still holds. It is
  visitor-supplied data, not a manifest asset, and it is never cached or stored.

## 13.12 Open decisions, in one place

- **D13-1** Second free tool, or the free assessment itself?
- **D13-2** Not stored (proposed), or stored with a retention schedule?
- **D13-3** Turnstile or BotID?
- **D13-4** Monthly budget ceiling and the over-budget message.
