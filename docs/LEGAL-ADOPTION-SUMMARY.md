# What you're adopting: Z Best Media's website policies, in plain English

**For:** the founder, to read and approve before the "Draft — pending attorney review" line comes off the legal pages.
**Covers:** the five pages at zbestmedia.com/legal/… (Privacy, Terms, Cookies, Refunds, Accessibility), as they read once PRs #10 and #14 are merged. Z Best Clips' pages stay outlines saying it isn't accepting clients yet.
**Not legal advice.** This summary was written by an engineer, not a lawyer. It explains what the pages promise; attorney review comes later.

## By approving, you promise visitors that…

**What we collect.** Only what people type into the forms on /contact, /start and the free assessment: name, business, how to reach them, where the business is (US, DC or a US territory only; anyone else is turned away and nothing is saved), their message or answers, and the assessment result. We also keep the browser's user-agent string, the time, a random submission ID, and a campaign tag if they arrived from one of our links. **We never store their IP address** with a submission. A scrambled version of it is held for about 10 minutes to stop spam, then thrown away.

**No tracking.** No analytics, no ad pixels, no Google/Meta tags and no third-party scripts or fonts. The only thing stored in the visitor's browser is their answer to the cookie banner. We don't sell or share anyone's data.

**Who sees it.** Three companies, only to run the site:
- **Vercel** hosts the site and keeps short request logs.
- **Neon** is the database.
- **Resend** emails each lead to your inbox, and may re-send it if delivery fails.

Your Google mailbox holds those emails.

**How long we keep it.**
- Submissions are deleted automatically **24 months** after they're sent.
- User-agent strings are deleted after **90 days**.
- You must delete the lead *emails* in your inbox by hand on the same 24-month schedule.
- One exception: if you review an undelivered lead email, a record of that review (date and submission IDs, nothing the visitor typed) is kept.

**Rights.** Anyone, anywhere, can ask to see, correct or delete their data, or ask us to stop contacting them, by emailing **privacy@zbestmedia.com**. You must:
- confirm receipt within **10 business days**;
- answer within **30 days**;
- handle appeals within **45 days**.

You never treat someone worse for asking. Deletion steps: `packages/lead/scripts/delete-lead.mjs`, plus your inbox.

**Website terms.**
- The site and its free tools are "as is".
- Assessment results are estimates, not advice or a promise of results.
- Our liability for the free site is capped at **$100**.
- California law and Los Angeles County courts apply, or small claims.
- No forced arbitration and no class-action waiver.
- Paid work happens only under a written agreement you both sign.

**Refunds (for paid work).** This is the page that changed most. It no longer cites an MSA, SOWs, Stripe, or the "SEO Technical Audit / Revenue Recovery Analysis" packages, because none of those exist yet. It now promises, as a minimum for every client:
- no cancellation, termination, refund or late fees;
- nothing renews automatically;
- a full refund if they cancel before work starts;
- after work starts, they pay only for work done and get back any prepayment;
- either side can cancel with 15 days' written notice;
- a free fix of a defect reported within 30 days, or a refund for that part;
- refunds within 10 business days;
- billing questions to **billing@zbestmedia.com** within 15 days.

A signed client agreement can give clients *better* terms, never worse.

**Cookies.** The banner's "Accept all" and "Reject non-essential" buttons now look identical, as the policy says. With nothing optional on the site, both currently do the same thing. Global Privacy Control is honoured automatically.

**Accessibility.**
- We aim for WCAG 2.2 AA and say plainly that we only partly meet it today.
- The known gaps are listed, and screen-reader testing hasn't been done yet.
- Problems go to privacy@zbestmedia.com, with a reply within 2 business days.

## Before you approve, you must supply or confirm (the production build fails until the first three are filled)
1. **Legal entity name** (shown as the issuer on every page).
2. **Business mailing address** (for privacy requests and legal notices).
3. **Effective date.**
4. These mailboxes exist and someone reads them: **privacy@**, **legalnotice@**, **billing@zbestmedia.com**.
5. The Neon database is hosted in the **United States** (the policy says so). Check the region in the Neon console.
6. You accept the deadlines above (10/30/45 days, 2 business days, 10 business days for refunds) as promises you'll keep.

## To approve
Comment on PR #10: **"I have read docs/LEGAL-ADOPTION-SUMMARY.md and adopt these policies."** Then a builder sets `LEGAL_ADOPTED = true` (apps/zbm/lib/legal.ts and apps/zbc/lib/legal.ts, plus the mirror in e2e/tests/phase-3.spec.ts), and the draft line comes off.
