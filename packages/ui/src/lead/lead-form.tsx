"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { LedgerRule } from "../components/ledger-rule";
import { FAILURE_COPY, HONEYPOT_FIELD, submitLead, type LeadFailure } from "./contract";

export type { LeadResponse } from "./contract";

/**
 * A field as the page declares it. Plain data, so a server component can pass
 * it — and so option lists come from the app's lead contract rather than being
 * hard-coded here (Backend Spec §9).
 */
export type LeadField = {
  name: string;
  label: string;
  /**
   * "checkboxes" posts every ticked value joined with "," (option values must
   * not contain one); "hidden" posts `defaultValue` and renders no control.
   */
  kind?: "text" | "email" | "url" | "textarea" | "select" | "checkboxes" | "hidden";
  options?: { value: string; label: string; hint?: string }[];
  optional?: boolean;
  autoComplete?: string;
  /** Initial value. For "checkboxes", the values ticked on first render. */
  defaultValue?: string | string[];
};

/** A field's posted value: checkbox groups join their ticked values. */
function valueOf(data: FormData, field: LeadField): string {
  if (field.kind === "checkboxes") return data.getAll(field.name).map(String).join(",");
  return String(data.get(field.name) ?? "");
}

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "invalid"; fields: Record<string, string> }
  | { kind: "failed"; reason: LeadFailure }
  | { kind: "accepted" };

const CONTROL =
  "type-body mt-2 w-full border border-text-secondary/35 bg-base px-3.5 py-3 text-text-primary placeholder:text-text-secondary/60 aria-[invalid=true]:border-accent";

/**
 * Lead form (Brief §6.1) posting through the typed adapter to /api/lead.
 *
 * The route stores the lead and notifies the founder (docs/LEAD-ROUTE-DESIGN.md).
 * "Received" is shown only when the route says the lead was stored; every
 * failure says nothing was saved and why (FAILURE_COPY).
 *
 * One submission_id per form instance, reused on retry, so the handler's
 * upsert (§6.2) treats a double-click or a retry as one lead. The button is
 * disabled while a request is in flight.
 */
export function LeadForm({
  form,
  fields,
  submitLabel,
}: {
  form: string;
  fields: LeadField[];
  submitLabel: string;
}) {
  const baseId = useId();
  const submissionId = useRef<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "submitting") return;
    submissionId.current ??= crypto.randomUUID();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((f) => [f.name, valueOf(data, f)]));
    setState({ kind: "submitting" });
    const result = await submitLead({
      form,
      submissionId: submissionId.current,
      fields: values,
      honeypot: String(data.get(HONEYPOT_FIELD) ?? ""),
    });
    if (result.status === "accepted") setState({ kind: "accepted" });
    else if (result.status === "invalid") setState({ kind: "invalid", fields: result.fields });
    else {
      // A changed resubmission under a stored id: the next send is a new lead.
      if (result.status === "conflict") submissionId.current = null;
      setState({ kind: "failed", reason: result.status });
    }
  };

  if (state.kind === "accepted") {
    return (
      <div role="status" data-lead-result="accepted" className="border border-accent bg-panel p-6">
        <p className="type-label text-accent">Received</p>
        <p className="type-title mt-3">Thanks — we have your details.</p>
        <p className="type-body mt-2 text-text-secondary">
          A person reads every submission and will reply using the contact you gave us.
        </p>
      </div>
    );
  }

  const errors = state.kind === "invalid" ? state.fields : {};

  return (
    // method="post": if someone submits before hydration, the browser's native
    // submit must never put what they typed into the URL (a GET would — and
    // URLs land in history and server logs). data-ready marks hydration.
    <form noValidate method="post" onSubmit={onSubmit} data-lead-form={form} data-ready={ready ? "true" : undefined}>
      <LedgerRule />
      {fields.map((field) => {
        const id = `${baseId}-${field.name}`;
        const error = errors[field.name];
        const initial = typeof field.defaultValue === "string" ? field.defaultValue : undefined;

        if (field.kind === "hidden") {
          return <input key={field.name} type="hidden" name={field.name} defaultValue={initial ?? ""} />;
        }

        if (field.kind === "checkboxes") {
          const ticked = new Set(Array.isArray(field.defaultValue) ? field.defaultValue : []);
          return (
            <fieldset
              key={field.name}
              className="py-ledger"
              aria-describedby={error ? `${id}-error` : undefined}
              data-field={field.name}
              data-invalid={error ? "true" : undefined}
            >
              <legend className="type-label text-text-secondary">
                {field.label}
                {field.optional ? <span className="normal-case tracking-normal"> (optional)</span> : null}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {field.options?.map((o) => {
                  const optionId = `${id}-${o.value}`;
                  // The hint is outside the <label> and tied by aria-describedby,
                  // so the accessible name stays the short service name.
                  return (
                    <div
                      key={o.value}
                      className="border border-text-secondary/35 bg-base px-3.5 py-3 has-[:checked]:border-accent"
                    >
                      <label htmlFor={optionId} className="flex cursor-pointer items-start gap-3">
                        <input
                          id={optionId}
                          type="checkbox"
                          name={field.name}
                          value={o.value}
                          defaultChecked={ticked.has(o.value)}
                          aria-invalid={error ? true : undefined}
                          aria-describedby={
                            [o.hint ? `${optionId}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") ||
                            undefined
                          }
                          className="mt-1 size-4 shrink-0 accent-accent"
                        />
                        <span className="type-body text-text-primary">{o.label}</span>
                      </label>
                      {o.hint ? (
                        <p id={`${optionId}-hint`} className="type-small mt-1 pl-7 text-text-secondary">
                          {o.hint}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {error ? (
                <p id={`${id}-error`} className="type-small mt-2 text-accent">
                  {error}
                </p>
              ) : null}
            </fieldset>
          );
        }

        const common = {
          id,
          name: field.name,
          autoComplete: field.autoComplete,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
          className: CONTROL,
        } as const;
        return (
          <div key={field.name} className="py-ledger">
            {/* block: an inline label lets a short one ("Name") sit beside its control. */}
            <label htmlFor={id} className="type-label block text-text-secondary">
              {field.label}
              {field.optional ? <span className="normal-case tracking-normal"> (optional)</span> : null}
            </label>
            {field.kind === "textarea" ? (
              <textarea rows={5} defaultValue={initial} {...common} />
            ) : field.kind === "select" ? (
              <select defaultValue={initial ?? ""} {...common}>
                <option value="">Choose one</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input type={field.kind ?? "text"} defaultValue={initial} {...common} />
            )}
            {error ? (
              <p id={`${id}-error`} className="type-small mt-2 text-accent">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot (§6.2): off-screen, unlabeled for sighted users, skipped by tab order. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-hp`}>Leave this empty</label>
        <input id={`${baseId}-hp`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
      </div>

      <LedgerRule emphasis />
      {state.kind === "failed" ? (
        <p role="alert" data-lead-failure={state.reason} className="type-small mt-4 text-accent">
          {FAILURE_COPY[state.reason]}
        </p>
      ) : null}
      {state.kind === "invalid" ? (
        <p role="alert" className="sr-only">
          Some fields need attention.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="type-label mt-stack inline-flex items-center whitespace-nowrap bg-accent px-5 py-3.5 text-base disabled:opacity-60"
      >
        {state.kind === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
