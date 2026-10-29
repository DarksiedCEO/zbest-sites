"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ButtonLink, LedgerRule } from "@zbest/ui";
import { FAILURE_COPY, HONEYPOT_FIELD, type LeadFailure } from "@zbest/ui/lead/contract";
import { SubmitStatus } from "@zbest/ui/lead/submit-status";
import { NOT_READY_LABEL, useHydrated } from "@zbest/ui/lead/use-hydrated";
import { submitAssessment } from "@/lib/assessment/contract";
import { ACTIVE_RULE_SET, QUESTIONS, SCALE, type AnswerValue } from "@/lib/assessment/rules";
import type { FreeAssessmentResult } from "@/lib/assessment/score";

/**
 * The free assessment — Backend Spec v0.3 §11, founder decision 10.
 *
 * Eight questions (§11.3), one scale, one prioritized leak back. The questions,
 * the scale and every string in the result come from the rule set, not from
 * this component (§9: never hard-coded). The only copy authored here is the
 * form chrome and the result view's fixed templates.
 *
 * The lead route stores the lead and notifies the founder before it returns
 * the result (Spec §11.3/§12.7: submitting records the lead exactly as the
 * lead route does). The result is scored on the FIXTURE rule set and says so
 * (§9); it is shown only after the lead was stored.
 */

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "invalid"; fields: Record<string, string> }
  | { kind: "superseded" }
  | { kind: "failed"; reason: LeadFailure }
  | { kind: "scored"; result: FreeAssessmentResult };

// .type-body sets max-width: 68ch, a paragraph measure. max-w-none keeps the
// font but lets the control fill its column; without it the input stops at
// ~653px and, in a wide column, sits beside its label instead of under it.
const CONTROL =
  "type-body mt-2 w-full max-w-none border border-text-secondary/35 bg-base px-3.5 py-3 text-text-primary placeholder:text-text-secondary/60 aria-[invalid=true]:border-accent";

const CONTACT = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "business", label: "Business", type: "text", autoComplete: "organization" },
  { name: "website", label: "Website", type: "url", autoComplete: "url" },
  { name: "reach", label: "Best way to reach you", type: "text", autoComplete: undefined },
] as const;

/** Where both outcomes route next (§11.5): the paid Audit, and a person. */
function NextSteps() {
  return (
    <div className="mt-stack flex flex-wrap gap-3">
      <ButtonLink href="/revenue-recovery#audit">See what the Audit covers</ButtonLink>
      <ButtonLink href="/contact" variant="secondary">
        Talk to Us
      </ButtonLink>
    </div>
  );
}

function Result({ result }: { result: FreeAssessmentResult }) {
  return (
    <div
      role="status"
      tabIndex={-1}
      data-lead-result="accepted"
      data-assessment-result={result.status}
      className="border border-accent bg-panel p-6"
    >
      <p className="type-label text-accent">Received</p>
      <p className="type-small mt-2 text-text-secondary">
        Scored against a fixed set of rules. A full audit goes deeper. We have your details, and a person will follow up using the
        contact you gave us.
      </p>
      <LedgerRule />

      {result.status === "leak_identified" ? (
        <div className="mt-6">
          <p className="type-label text-text-secondary">Your prioritized leak</p>
          <h3 className="type-title mt-2" data-assessment-category={result.category}>
            {ACTIVE_RULE_SET.copy[result.category].name}
          </h3>
          <p className="type-body mt-3 text-text-primary" data-assessment-rationale>
            {result.rationale}
          </p>

          <p className="type-label mt-6 text-text-secondary">Why this one</p>
          <p className="type-body mt-2 text-text-primary" data-assessment-because>
            Because you said this is {result.because.value_label.toLowerCase()} for you:
          </p>
          <blockquote className="type-body mt-2 border-l-2 border-accent pl-4 italic text-text-secondary">
            {result.because.statement}
          </blockquote>
          {result.tie_broken_by_priority ? (
            <p className="type-small mt-3 text-text-secondary" data-assessment-tie>
              Several leaks scored the same for you. This is the one we’d fix first.
            </p>
          ) : null}

          <p className="type-label mt-6 text-text-secondary">What fixing it looks like</p>
          <p className="type-body mt-2 text-text-primary" data-assessment-remediation>
            {result.remediation}
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="type-title">No prioritized leak from these answers.</h3>
          <p className="type-body mt-3 text-text-primary">
            None of these came up as true for your business, so there’s no leak to point to — and we
            won’t invent one.
          </p>
          <p className="type-body mt-3 text-text-secondary">
            If something still isn’t working, the Audit is the full diagnostic. Or just talk to us.
          </p>
        </div>
      )}

      <NextSteps />
    </div>
  );
}

export function AssessmentForm() {
  const baseId = useId();
  const submissionId = useRef<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const ready = useHydrated();

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
    const honeypot = text(HONEYPOT_FIELD);

    setState({ kind: "submitting" });
    const outcome = await submitAssessment({
      form: "assessment",
      submission_id: submissionId.current,
      rule_set_version: ACTIVE_RULE_SET.version,
      contact: { name: text("name"), business: text("business"), website: text("website"), reach: text("reach") },
      answers,
      ...(honeypot ? { company_url: honeypot } : {}),
    });
    if (outcome.status === "scored") setState({ kind: "scored", result: outcome.result });
    else if (outcome.status === "invalid") setState({ kind: "invalid", fields: outcome.fields });
    else if (outcome.status === "superseded") setState({ kind: "superseded" });
    else {
      if (outcome.reason === "conflict") submissionId.current = null;
      setState({ kind: "failed", reason: outcome.reason });
    }
  };

  if (state.kind === "scored") return <Result result={state.result} />;

  const errors = state.kind === "invalid" ? state.fields : {};

  return (
    <form
      noValidate
      method="post"
      onSubmit={onSubmit}
      data-lead-form="assessment"
      data-ready={ready ? "true" : undefined} aria-describedby={`${baseId}-note`}>
      <p id={`${baseId}-note`} className="type-small mb-5 flex items-start gap-2 text-text-secondary">
        <span aria-hidden="true" className="mt-[0.45em] inline-block size-1.5 shrink-0 bg-accent" />
        <span>This form scores your answers against a fixed set of rules.</span>
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
            data-assessment-question={question.id}
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
        <label htmlFor={`${baseId}-hp`}>Leave this empty</label>
        <input id={`${baseId}-hp`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
      </div>

      {state.kind === "failed" ? (
        <p role="alert" data-lead-failure={state.reason} className="type-small mt-4 text-accent">
          {FAILURE_COPY[state.reason]}
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
        disabled={!ready || state.kind === "submitting"}
        aria-busy={ready ? undefined : true}
        aria-describedby={ready ? undefined : `${baseId}-loading`}
        className="type-label mt-stack inline-flex items-center whitespace-nowrap bg-accent px-5 py-3.5 text-base disabled:opacity-60"
      >
        {!ready ? NOT_READY_LABEL : state.kind === "submitting" ? "Scoring…" : "Get an Assessment"}
      </button>
      <SubmitStatus id={`${baseId}-loading`} ready={ready} />
    </form>
  );
}
