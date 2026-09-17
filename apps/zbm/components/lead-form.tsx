"use client";

import { LedgerRule } from "@zbest/ui";
import { useId, useRef, useState, type FormEvent } from "react";
import type { LeadForm as LeadFormName } from "@/lib/lead";
import { submitLead } from "@/lib/lead-adapter";

type Field = {
  name: string;
  label: string;
  multiline?: boolean;
  type?: "text" | "url";
  autoComplete?: string;
};

/** Labels are the §6.1 field names, verbatim. */
const FIELDS: Record<LeadFormName, Field[]> = {
  contact: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "problem", label: "What are you looking to solve?", multiline: true },
    { name: "reach", label: "Best way to reach you" },
  ],
  assessment: [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "business", label: "Business", autoComplete: "organization" },
    { name: "website", label: "Website", type: "url", autoComplete: "url" },
    { name: "reach", label: "Best way to reach you" },
  ],
};

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "invalid"; fields: Record<string, string> }
  | { kind: "failed" }
  | { kind: "accepted" };

/**
 * Lead form (Brief §6.1) posting through the typed adapter to /api/lead.
 *
 * THE ROUTE IS A STUB this phase: it validates and acknowledges, and nothing is
 * stored or sent. The form says that to the visitor both before and after
 * submitting, so no one believes a message reached a person.
 *
 * One submission_id per form instance, reused on retry, so the real handler's
 * upsert (§6.2) will treat a double-click or a retry as one lead. The button is
 * disabled while a request is in flight.
 */
export function LeadForm({ form, submitLabel }: { form: LeadFormName; submitLabel: string }) {
  const baseId = useId();
  const submissionId = useRef<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "submitting") return;
    submissionId.current ??= crypto.randomUUID();
    const data = new FormData(event.currentTarget);
    const fields = Object.fromEntries(
      FIELDS[form].map((f) => [f.name, String(data.get(f.name) ?? "")]),
    );
    setState({ kind: "submitting" });
    const result = await submitLead({
      form,
      submissionId: submissionId.current,
      fields,
      honeypot: String(data.get("company_url") ?? ""),
    });
    if (result.status === "accepted") setState({ kind: "accepted" });
    else if (result.status === "invalid") setState({ kind: "invalid", fields: result.fields });
    else setState({ kind: "failed" });
  };

  if (state.kind === "accepted") {
    return (
      <div role="status" data-lead-result="accepted" className="border border-accent bg-panel p-6">
        <p className="type-label text-accent">Stub — not delivered</p>
        <p className="type-title mt-3">Your details passed validation.</p>
        <p className="type-body mt-2 text-text-secondary">
          This form is not connected yet, so nothing was stored or sent and no one
          will contact you from it.
        </p>
      </div>
    );
  }

  const errors = state.kind === "invalid" ? state.fields : {};

  return (
    <form noValidate onSubmit={onSubmit} data-lead-form={form} aria-describedby={`${baseId}-stub`}>
      <p id={`${baseId}-stub`} className="type-small mb-5 flex items-start gap-2 text-text-secondary">
        <span aria-hidden="true" className="mt-[0.45em] inline-block size-1.5 shrink-0 bg-accent" />
        <span>
          Stub — this form validates what you enter but is not connected yet.
          Nothing is stored or sent.
        </span>
      </p>
      <LedgerRule />
      {FIELDS[form].map((field) => {
        const id = `${baseId}-${field.name}`;
        const error = errors[field.name];
        const common = {
          id,
          name: field.name,
          autoComplete: field.autoComplete,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
          className:
            "type-body mt-2 w-full border border-text-secondary/35 bg-base px-3.5 py-3 text-text-primary placeholder:text-text-secondary/60 aria-[invalid=true]:border-accent",
        } as const;
        return (
          <div key={field.name} className="py-ledger">
            <label htmlFor={id} className="type-label text-text-secondary">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea rows={5} {...common} />
            ) : (
              <input type={field.type ?? "text"} {...common} />
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
        <label htmlFor={`${baseId}-company_url`}>Leave this empty</label>
        <input id={`${baseId}-company_url`} name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      <LedgerRule emphasis />
      {state.kind === "failed" ? (
        <p role="alert" className="type-small mt-4 text-accent">
          That did not go through. Nothing was saved — please try again.
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
