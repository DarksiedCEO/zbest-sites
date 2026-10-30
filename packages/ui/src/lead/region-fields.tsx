"use client";

import { OUTSIDE, REGION_COPY, REGION_FIELD_NAME, SERVICE_AREAS } from "@zbest/lead/region";

/**
 * "State or territory" (founder decision 2026-10-30: the 50 US states, DC,
 * Puerto Rico and Guam). Options and copy come from @zbest/lead/region, the
 * same list the server validates against, so the two cannot drift.
 *
 * One native select with a visible label and a hint saying where we work, so
 * nobody fills the form to find out. "Outside these areas" is a real option:
 * the server answers it with a polite decline (role="alert" in the form) and
 * stores nothing. Uncontrolled, like every other field in these forms, so a
 * choice made before hydration survives it.
 */
export function RegionFields({
  idPrefix,
  errors,
  controlClassName,
  rowClassName = "py-ledger",
}: {
  idPrefix: string;
  errors: Record<string, string>;
  controlClassName: string;
  rowClassName?: string;
}) {
  const id = `${idPrefix}-${REGION_FIELD_NAME}`;
  const error = errors[REGION_FIELD_NAME];
  return (
    <div className={rowClassName} data-field={REGION_FIELD_NAME}>
      <label htmlFor={id} className="type-label block text-text-secondary">
        {REGION_COPY.label}
      </label>
      <select
        id={id}
        name={REGION_FIELD_NAME}
        autoComplete="address-level1"
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={[`${id}-hint`, error ? `${id}-error` : ""].filter(Boolean).join(" ")}
        className={controlClassName}
      >
        <option value="">Choose one</option>
        {SERVICE_AREAS.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
        <option value={OUTSIDE.value}>{OUTSIDE.label}</option>
      </select>
      <p id={`${id}-hint`} className="type-small mt-2 text-text-secondary">
        {REGION_COPY.hint}
      </p>
      {error ? (
        <p id={`${id}-error`} className="type-small mt-2 text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
