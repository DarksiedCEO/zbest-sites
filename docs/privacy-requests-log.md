# Privacy requests log (template)

The Privacy Policy (apps/zbm/lib/legal.ts, "How long we keep it") promises
records of privacy requests kept for 24 months. This file is the TEMPLATE for
that log. **Never record personal data in this repository** (it is public):
keep the filled-in log in Z Best Media's private business storage, with
access limited to the people who handle requests, and delete entries 24
months after the request closes.

## How a request is handled (summary of the policy's promises)

| Step | Deadline | Notes |
|---|---|---|
| Acknowledge receipt | 10 business days | Reply from privacy@zbestmedia.com |
| Verify the requester | before acting | Contact them at the email or phone in their submission; ask only for what verification needs |
| Respond | 30 days (extension only with a reason, within the law of the requester's state) | |
| Appeal answer | 45 days from the appeal | Appeals arrive with the subject "Privacy appeal", within 60 days of our answer |

Tools in this repo (ids only, never personal data on the command line):
- delete: `pnpm --filter @zbest/lead delete-lead` (dry run, then confirm)
- access / portable copy: prepared by hand from the database (a `SELECT` of the
  requester's rows, exported as JSON or CSV) and sent by email.

## Log columns (one row per request, in the PRIVATE copy)

| Column | Example (fictional) | Notes |
|---|---|---|
| Request ID | PR-2026-001 | Our own sequence; not a submission id |
| Received (UTC) | 2026-11-02 14:05 | |
| Channel | email / mail | |
| Type | access, portable copy, correction, deletion, stop contact, appeal | |
| Agent? | no / yes (authorization checked) | |
| Verified (date, method) | 2026-11-03, reply from submitted address | Do not store ID documents |
| Acknowledged (date) | 2026-11-03 | within 10 business days |
| Systems searched | leads DB (zbm), inbox, Resend | |
| Outcome | fulfilled / partly / declined (reason) | |
| Closed (date) | 2026-11-20 | within 30 days |
| Legal hold? | no | If yes: what is paused and why |
| Delete this entry after | 2028-11-20 | closed + 24 months |
