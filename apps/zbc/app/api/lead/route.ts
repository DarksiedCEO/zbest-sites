/**
 * Lead route, Z Best Clips — CLOSED (red team 2026-10-30, RTS-1).
 *
 * ZBC has not launched and its Privacy Policy is not published, so it must
 * not collect personal data. Every request is refused with 410 Gone and
 * nothing is read, stored or sent; the pages show a not-accepting message and
 * an email address instead of forms (components/not-accepting.tsx).
 *
 * To reopen: publish ZBC's Privacy Policy with a notice at collection (18+),
 * restore the §6.1 forms and their zod contract (git history: lib/lead.ts,
 * components/lead-form.tsx), and route POST through @zbest/lead's handleLead
 * with app "zbc" again — the shared pipeline already supports it.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const gone = () =>
  Response.json({ ok: false, error: { code: "not_accepting" } }, { status: 410, headers: { "Cache-Control": "no-store" } });

export function POST() {
  return gone();
}

export function GET() {
  return gone();
}
