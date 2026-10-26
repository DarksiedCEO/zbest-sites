import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Every lead form renders its submit button disabled, labelled "Loading…",
 * until React has hydrated, and marks itself `data-ready="true"` when it has
 * (AEGIS r5 N1). Helpers wait for that before pressing anything, so a test
 * never races hydration — and a test that DOES race it is testing the guard.
 */
export async function formReady(form: Locator, timeout = 15_000): Promise<Locator> {
  await expect(form).toHaveAttribute("data-ready", "true", { timeout });
  return form;
}

/** The first lead form on the page of the given name, once hydrated. */
export const readyLeadForm = (page: Page, name: string) => formReady(page.locator(`form[data-lead-form="${name}"]`));
