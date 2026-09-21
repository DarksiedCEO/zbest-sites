"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ButtonLink, LedgerRule } from "@zbest/ui";
import { submitReadiness } from "@/lib/visibility/contract";
import { ACTIVE_RULE_SET, QUESTIONS, SCALE, type AnswerValue } from "@/lib/visibility/rules";
import type { VisibilityReadinessResult } from "@/lib/visibility/score";

/**
 * The AI Visibility Readiness Check — Backend Spec v0.4 §12, founder decision 11.
 *
 * Eight questions (§12.5), one scale, one prioritized visibility gap back. The
 * questions, the scale and every string in the result come from the rule set,
 * not from this component (§9: never hard-coded). The only copy authored here
 * is the form chrome and the result view's fixed templates.
 *
 * WHAT IT IS NOT (§12.1). No engine is queried and no model runs. The result
 * describes readiness signals the respondent reported; it never states what any
 * AI engine says, shows, cites or ranks for the business. No dollar figure.
 * Vocabulary is "gap", never "leak", and nothing here reads §11's rule set.
 *
 * THE ROUTE IS STILL THE NO-DELIVERY STUB. The result is computed for real on
 * the fixture rule set, but nothing is stored or sent, and the form says so
 * before and after submitting.
 */

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "invalid"; fields: Record<string, string> }
  | { kind: "superseded" }
  | { kind: "failed" }
  | { kind: "checked"; result: VisibilityReadinessResult };

// Matches the assessment form's control styling: .type-body caps at 68ch, and
// max-w-none lets the control fill its column instead of stopping mid-width.
const CONTROL =
  "type-body mt-2 w-full max-w-none border border-text-secondary/35 bg-base px-3.5 py-3 text-text-primary placeholder:text-text-secondary/60 aria-[invalid=true]:border-accent";

/** §12.7: the contact fields are §11.3's four, unchanged. */
const CONTACT = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "business", label: "Business", type: "text", autoComplete: "organization" },
  { name: "website", label: "Website", type: "url", autoComplete: "url" },
  { name: "reach", label: "Best way to reach you", type: "text", autoComplete: undefined },
] as const;

function Result({ result }: { result: VisibilityReadinessResult }) {
  return (
    <div
      role="status"
      tabIndex={-1}
      data-lead-result="accepted"
      data-readiness-result={result.status}
      className="border border-accent bg-panel p-6"
    >
      <p className="type-label text-accent">Stub — not delivered</p>
      <p className="type-small mt-2 text-text-secondary">
        Scored on fixture rules. This check is not connected yet, so nothing was stored or sent and
        no one will contact you from it.
      </p>
      <LedgerRule />

      {result.status === "gap_identified" ? (
        <div className="mt-6">
          <p className="type-label text-text-secondary">Your prioritized gap</p>
          <h3 className="type-title mt-2" data-readiness-category={result.category}>
            {ACTIVE_RULE_SET.copy[result.category].name}
          </h3>
          <p className="type-body mt-3 text-text-primary" data-readiness-rationale>
            {result.rationale}
          </p>

          <p className="type-label mt-6 text-text-secondary">Why this one</p>
          <p className="type-body mt-2 text-text-primary" data-readiness-because>
            Because you said this is {result.because.value_label.toLowerCase()} for you:
          </p>
          <blockquote className="type-body mt-2 border-l-2 border-accent pl-4 italic text-text-secondary">
            {result.because.statement}
          </blockquote>
          {result.tie_broken_by_priority ? (
            <p className="type-small mt-3 text-text-secondary" data-readiness-tie>
              Several gaps scored the same for you. This is the one we’d fix first.
            </p>
          ) : null}

          <p className="type-label mt-6 text-text-secondary">What fixing it looks like</p>
          <p className="type-body mt-2 text-text-primary" data-readiness-remediation>
            {result.remediation}
          </p>

          {/*
            §12.7 routing: a gap makes the paid product an honest next step, so
            this outcome routes to the page's pricing section AND to a person.
          */}
          <div className="mt-stack flex flex-wrap gap-3" data-readiness-next="gap_identified">
            <ButtonLink href="#pricing">See Pricing</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Talk to Us
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="type-title">No prioritized gap from these answers.</h3>
          <p className="type-body mt-3 text-text-primary">
            None of these came up as true for your business, so there’s no gap to point to — and we
            won’t invent one.
          </p>
          <p className="type-body mt-3 text-text-secondary">
            If something still isn’t working, talk to us and we’ll look at it with you.
          </p>

          {/*
            §12.7 routing: insufficient_signal goes to Talk to Us ONLY. Sending
            "we found no gap" to pricing would be pressure, not a next step.
          */}
          <div className="mt-stack flex flex-wrap gap-3" data-readiness-next="insufficient_signal">
            <ButtonLink href="/contact">Talk to Us</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReadinessCheck() {
  const baseId = useId();
  const submissionId = useRef<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "submitting") return;
    submissionId.current ??= crypto.randomUUID();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");

    // Only answered questions are sent; the shared schema names the rest.
    const answers = QUESTIONS.flatMap((q) => {
      const raw = data.get(`q-${q.id}`);
      return raw === null ? [] : [{ question_id: q.id, value: Number(raw) as AnswerValue }];
    });
    const honeypot = text("company_url");

    setState({ kind: "submitting" });
    const outcome = await submitReadiness({
      form: "readiness",
      submission_id: submissionId.current,
      rule_set_version: ACTIVE_RULE_SET.version,
      contact: { name: text("name"), business: text("business"), website: text("website"), reach: text("reach") },
      answers,
      ...(honeypot ? { company_url: honeypot } : {}),
    });
    if (outcome.status === "checked") setState({ kind: "checked", result: outcome.result });
    else if (outcome.status === "invalid") setState({ kind: "invalid", fields: outcome.fields });
    else if (outcome.status === "superseded") setState({ kind: "superseded" });
    else setState({ kind: "failed" });
  };

  if (state.kind === "checked") return <Result result={state.result} />;

  const errors = state.kind === "invalid" ? state.fields : {};

  return (
    <form noValidate onSubmit={onSubmit} data-lead-form="readiness" aria-describedby={`${baseId}-stub`}>
      <p id={`${baseId}-stub`} className="type-small mb-5 flex items-start gap-2 text-text-secondary">
        <span aria-hidden="true" className="mt-[0.45em] inline-block size-1.5 shrink-0 bg-accent" />
        <span>
          Stub — this check scores your answers on fixture rules but is not connected yet. Nothing
          is stored or sent.
        </span>
      </p>
      <LedgerRule />

      {CONTACT.map((field) => {
        const id = `${baseId}-${field.name}`;
        const error = errors[field.name];
        return (
          <div key={field.name} className="py-ledger">
            <label htmlFor={id} className="type-label block text-text-secondary">
              {field.label}
            </label>
            <input
              id={id}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className={CONTROL}
            />
            {error ? (
              <p id={`${id}-error`} className="type-small mt-2 text-accent">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <LedgerRule emphasis />
      <p className="type-label mt-stack text-text-secondary">How true is each of these for your business?</p>

      {QUESTIONS.map((question, index) => {
        const error = errors[`answers.${question.id}`];
        const errorId = `${baseId}-q-${question.id}-error`;
        return (
          <fieldset
            key={question.id}
            data-readiness-question={question.id}
            aria-describedby={error ? errorId : undefined}
            className="border-b border-text-secondary/20 py-ledger"
          >
            <legend className="type-body flex gap-3 text-text-primary">
              <span aria-hidden="true" className="type-mono text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{question.statement}</span>
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {SCALE.map((step) => (
                <label
                  key={step.value}
                  className="flex cursor-pointer items-center gap-3 border border-text-secondary/35 px-3.5 py-3 has-[:checked]:border-accent has-[:checked]:bg-panel"
                >
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={step.value}
                    className="accent-accent"
                  />
                  <span className="type-small text-text-primary">{step.label}</span>
                </label>
              ))}
            </div>
            {error ? (
              <p id={errorId} className="type-small mt-2 text-accent">
                {error}
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {/* Honeypot (§6.2): off-screen, unlabeled for sighted users, skipped by tab order. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-company_url`}>Leave this empty</label>
        <input id={`${baseId}-company_url`} name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      {state.kind === "failed" ? (
        <p role="alert" className="type-small mt-4 text-accent">
          That did not go through. Nothing was saved — please try again.
        </p>
      ) : null}
      {state.kind === "superseded" ? (
        <p role="alert" className="type-small mt-4 text-accent">
          These questions changed while you were answering. Reload the page to see the current
          ones — nothing was saved.
        </p>
      ) : null}
      {state.kind === "invalid" ? (
        <p role="alert" className="type-small mt-4 text-accent">
          Some answers need attention.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="type-label mt-stack inline-flex items-center whitespace-nowrap bg-accent px-5 py-3.5 text-base disabled:opacity-60"
      >
        {state.kind === "submitting" ? "Checking…" : "Get My Readiness Check"}
      </button>
    </form>
  );
}
