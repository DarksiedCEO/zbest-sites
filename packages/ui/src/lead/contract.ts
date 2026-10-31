import { FORM_TOKEN_HEADER, FORM_TOKEN_MAX_AGE_MS, FORM_TOKEN_MIN_AGE_MS } from "@zbest/lead/form-token-wire";
import { REGION_COPY } from "@zbest/lead/region";

/**
 * Lead route wire contract (Brief §6.2), shared by both apps' route handlers,
 * the typed adapters and the forms. Each app owns its own form names and zod
 * field schemas; only the envelope and the error codes are shared.
 *
 * The route is real now (docs/LEAD-ROUTE-DESIGN.md): a success means the lead
 * was stored. Every failure says nothing was saved, and says why in terms the
 * visitor can act on.
 */
export type LeadErrorBody =
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "bad_request" } }
  | { ok: false; error: { code: "unsupported_media_type" } }
  | { ok: false; error: { code: "forbidden_origin" } }
  | { ok: false; error: { code: "payload_too_large" } }
  | { ok: false; error: { code: "rate_limited"; retry_after_s: number } }
  | { ok: false; error: { code: "not_configured" } }
  | { ok: false; error: { code: "conflict" } }
  /** Outside the service area (50 US states, DC, and PR, GU, VI, AS, MP): nothing stored or sent. */
  | { ok: false; error: { code: "region_unavailable" } }
  /** The page's form token is missing, too new or too old (RTS-3): nothing stored. */
  | { ok: false; error: { code: "form_expired" } }
  /** The token is younger than the server's minimum (or that instance's clock is ahead): wait and resend (AEGIS F2). */
  | { ok: false; error: { code: "form_too_fast"; retry_after_s: number } }
  /** The site-wide cap on submissions per minute was reached (RTS-3): nothing stored. */
  | { ok: false; error: { code: "busy"; retry_after_s: number } }
  | { ok: false; error: { code: "unavailable" } };

export type LeadResponse = { ok: true; submission_id: string } | LeadErrorBody;

/** Why a submission was not saved, as the form tells the visitor. */
export type LeadFailure =
  | "failed"
  | "rate_limited"
  | "not_configured"
  | "unavailable"
  | "conflict"
  | "region_unavailable"
  | "form_expired"
  | "busy";

export type LeadResult =
  | { status: "accepted" }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: LeadFailure };

/**
 * One honest sentence per failure. Each claims only what is known: "nothing
 * was saved" only where the server said so; an unknown outcome says it is
 * unknown (AEGIS L3). A retry is always safe — it reuses the submission id.
 */
export const FAILURE_COPY: Record<LeadFailure, string> = {
  failed: "We couldn’t confirm that went through — please try again.",
  conflict:
    "We already have an earlier version of this from you. Send again to submit these changes as a new message.",
  unavailable: "We couldn’t save that just now, so nothing was sent. Please try again in a few minutes.",
  not_configured: "This form isn’t accepting submissions yet, so nothing was saved or sent.",
  rate_limited: "Too many attempts from your connection. Nothing was saved — please wait a few minutes and try again.",
  region_unavailable: REGION_COPY.refused,
  form_expired: "This form needs refreshing. Nothing was saved — reload the page and send it again.",
  busy: "We’re receiving an unusual number of messages right now. Nothing was saved — please try again in a minute.",
};

/**
 * Maps a non-validation error body (or garbage) to the failure the form shows.
 * 400/403/413/415 are not reachable from the real forms; they read as "failed".
 */
export function failureOf(body: unknown): LeadFailure {
  const code = (body as { error?: { code?: unknown } } | null)?.error?.code;
  return code === "rate_limited" ||
    code === "not_configured" ||
    code === "unavailable" ||
    code === "conflict" ||
    code === "region_unavailable" ||
    code === "form_expired" ||
    code === "busy"
    ? code
    : "failed";
}

/**
 * The honeypot's HTML input name (AEGIS L4). Deliberately non-semantic so no
 * browser or password manager has a reason to autofill it; it is sent to the
 * route under the wire key `company_url`, which the app contracts define.
 */
export const HONEYPOT_FIELD = "zbx_hp_7f3";

/**
 * Form token (RTS-3). Every page with a form fetches one from GET /api/lead
 * when it loads (primeFormToken), and every POST carries it in a header. The
 * server refuses a token younger than 3 s or older than 2 h, so:
 *   - a submit within 3 s of the token arriving waits out the remainder
 *     (a person never notices; a script has to);
 *   - a page left open refreshes its token after an hour;
 *   - a refusal ("form_expired") fetches a fresh token and sends once more,
 *     after the 3 s, with the same submission id (a retry is always safe).
 * The token carries no personal data. Module state: one per page load.
 */
let token: { value: string; receivedAt: number } | null = null;
let pending: Promise<void> | null = null;
const REFRESH_AFTER_MS = Math.min(60 * 60 * 1000, FORM_TOKEN_MAX_AGE_MS / 2);

async function fetchToken(): Promise<void> {
  try {
    const response = await fetch("/api/lead", { method: "GET", cache: "no-store", headers: { Accept: "application/json" } });
    const body = (await response.json()) as { ok?: boolean; token?: unknown };
    if (response.ok && body.ok === true && typeof body.token === "string") token = { value: body.token, receivedAt: Date.now() };
  } catch {
    /* No token: the POST is refused with form_expired and the form says so. */
  }
}

/** Fetch a token unless a fresh one is held or on its way. Safe to call often. */
export function primeFormToken(force = false): Promise<void> {
  if (!force && token && Date.now() - token.receivedAt < REFRESH_AFTER_MS) return Promise.resolve();
  pending ??= fetchToken().finally(() => {
    pending = null;
  });
  return pending;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A held token at least the server's minimum age (plus a margin), or "" if none could be had. */
async function readyToken(): Promise<string> {
  await primeFormToken();
  if (!token) return "";
  const wait = FORM_TOKEN_MIN_AGE_MS + 250 - (Date.now() - token.receivedAt);
  if (wait > 0) await sleep(wait);
  return token.value;
}

/**
 * POST a JSON body to /api/lead with the form token. The only way any form
 * on either site posts a lead (the §11/§12 adapters use it too).
 */
export async function postLead(body: unknown): Promise<Response> {
  const send = async () =>
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", [FORM_TOKEN_HEADER]: await readyToken() },
      body: JSON.stringify(body),
    });
  const errorOf = (r: Response) =>
    r
      .clone()
      .json()
      .then((b: { error?: { code?: unknown; retry_after_s?: unknown } }) => b?.error ?? {})
      .catch(() => ({}) as { code?: unknown; retry_after_s?: unknown });
  let response = await send();
  // AEGIS F2: "too fast" (often a few seconds of clock difference between
  // server instances) is waited out and sent again with the same token.
  if (response.status === 425) {
    const error = await errorOf(response);
    if (error.code === "form_too_fast") {
      const seconds = typeof error.retry_after_s === "number" ? Math.min(Math.max(error.retry_after_s, 1), 10) : 3;
      await sleep(seconds * 1000 + 250);
      response = await send();
    }
  }
  if (response.status !== 403 || (await errorOf(response)).code !== "form_expired") return response;
  await primeFormToken(true);
  return send();
}

/**
 * Typed adapter in front of /api/lead (Backend Spec §9: every API call behind
 * a typed adapter). The form calls this and never `fetch` directly.
 */
export async function submitLead(input: {
  form: string;
  submissionId: string;
  fields: Record<string, string>;
  honeypot: string;
}): Promise<LeadResult> {
  let response: Response;
  try {
    response = await postLead({
      form: input.form,
      submission_id: input.submissionId,
      fields: input.fields,
      ...(input.honeypot ? { company_url: input.honeypot } : {}),
    });
  } catch {
    return { status: "failed" };
  }

  let body: LeadResponse;
  try {
    body = (await response.json()) as LeadResponse;
  } catch {
    return { status: "failed" };
  }

  if (body.ok === true && response.ok) return { status: "accepted" };
  if (body.ok === false && body.error.code === "validation") return { status: "invalid", fields: body.error.fields };
  return { status: failureOf(body) };
}
