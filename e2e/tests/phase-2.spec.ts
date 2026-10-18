import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 2 gate (Brief §3.2). Under test: the design system — type scale,
 * spacing, motion primitives, and the reusable pieces — on the /dev/system
 * route.
 *
 * Navigation waits on `domcontentloaded`, not `networkidle`: Nav and Footer
 * link to pages Phase 4 has not built yet, so Next prefetches routes that 404
 * and the network never goes idle. Every assertion below waits on the element
 * it is about, which is the sturdier signal anyway.
 *
 * Assertions are written to be capable of failing. The Phase 1 audits were
 * emphatic that a check which cannot fail is not a check, so the accordion is
 * operated rather than merely located, the counter is read after its tick, and
 * reduced-motion is asserted to change the observed behaviour.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-2");

const APPS = [
  {
    slug: "zbm",
    name: "Z Best Media",
    baseUrl: ZBM_BASE_URL,
    base: "rgb(14, 15, 18)", // #0E0F12
    accent: "rgb(201, 154, 75)", // #C99A4B
    headlineFamily: "Fraunces",
  },
  {
    slug: "zbc",
    name: "Z Best Clips",
    baseUrl: ZBC_BASE_URL,
    base: "rgb(11, 13, 16)", // #0B0D10
    accent: "rgb(255, 107, 91)", // #FF6B5B — Entertainment is the page default
    headlineFamily: "Bricolage Grotesque",
  },
] as const;

for (const app of APPS) {
  test.describe(`${app.name} — design system`, () => {
    test("renders every Phase 2 piece", async ({ page }, testInfo) => {
      await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });

      await expect(
        page.getByRole("heading", { level: 1, name: app.name }),
      ).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-brand", app.slug);
      await expect(page.locator("body")).toHaveCSS("background-color", app.base);

      // Every §3.2 piece is actually on the page.
      for (const id of [
        "color",
        "type",
        "numerals",
        "ledger-rule",
        "stat-block",
        "counter",
        "card",
        "faq",
      ]) {
        await expect(page.locator(`#${id}`)).toBeVisible();
      }
      await expect(page.getByRole("banner")).toBeVisible(); // Nav
      await expect(page.getByRole("contentinfo")).toBeVisible(); // Footer

      // The headline face is the brand's, and the type scale gives real
      // contrast — display must be substantially larger than title, or the
      // "real scale contrast" requirement (§A1) is not met.
      const display = page.locator(".type-display").first();
      await expect(display).toHaveCSS("font-family", new RegExp(app.headlineFamily, "i"));
      const sizes = await page.evaluate(() => {
        const px = (sel: string) =>
          parseFloat(getComputedStyle(document.querySelector(sel)!).fontSize);
        return { display: px(".type-display"), title: px(".type-title") };
      });
      expect(sizes.display / sizes.title).toBeGreaterThan(2);

      // Tabular numerals are required for ledger alignment (§A1).
      await expect(page.locator(".type-stat").first()).toHaveCSS(
        "font-variant-numeric",
        /tabular-nums/,
      );

      // Button-styled controls must render on one line at their natural width.
      // An earlier revision passed every assertion while the ZBC nav CTA was
      // squeezed to a 40px box with its text stacked vertically — a flex item
      // blockifies `inline-block` and will happily be crushed. A gate that
      // cannot see that is not checking the thing anyone looks at.
      //
      // Scoped to filled controls, identified by having a background. The
      // IllustrativeBadge is a long disclosure that SHOULD wrap inside a narrow
      // card; forcing it onto one line would overflow the card instead.
      const crushed = await page.evaluate(() => {
        const bad: Record<string, unknown>[] = [];
        for (const el of document.querySelectorAll<HTMLElement>(".type-label")) {
          const cs = getComputedStyle(el);
          const filled =
            cs.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            cs.backgroundColor !== "transparent";
          if (!filled || el.offsetParent === null) continue;
          const lineHeight = parseFloat(cs.lineHeight) || 16;
          const rect = el.getBoundingClientRect();
          const text = el.textContent?.trim() ?? "";
          // Height catches wrapping; width catches the opposite failure, where
          // the box is too narrow and the text simply overflows it. A spacing
          // token named `block` once emitted `.inline-block{inline-size:2.5rem}`,
          // shadowing the display utility — every CTA became a 40px box with its
          // label spilling out, and a height-only check called that a pass.
          if (rect.height > lineHeight * 2.4) {
            bad.push({ text, reason: "wrapped", height: rect.height, lineHeight });
          }
          if (el.scrollWidth > Math.ceil(rect.width) + 1) {
            bad.push({
              text,
              reason: "overflows its box",
              width: rect.width,
              scrollWidth: el.scrollWidth,
            });
          }
        }
        return bad;
      });
      expect(
        crushed,
        `filled controls wrapped instead of sizing to their text: ${JSON.stringify(crushed)}`,
      ).toEqual([]);

      // IllustrativeBadge is present wherever an unverified number is (§9).
      await expect(
        page.getByText("Illustrative example — not a client result").first(),
      ).toBeVisible();

      await mkdir(SNAPSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(
          SNAPSHOT_DIR,
          `${app.slug}-dev-system-${testInfo.project.name}.png`,
        ),
        fullPage: true,
      });
    });

    test("FAQ accordion is operable and announces state", async ({ page }) => {
      await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });

      const trigger = page.getByRole("button", {
        name: "Is this accordion keyboard operable?",
      });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      const panelId = await trigger.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toBeHidden();

      // Operated by keyboard, not just clicked — §3.6 puts a11y on the gate.
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();

      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
    });

    test("cookie consent can reject non-essential and stays dismissed", async ({
      page,
    }) => {
      await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });

      const dialog = page.getByRole("dialog", { name: "Cookies on this site" });
      await expect(dialog).toBeVisible();

      // Rejection is a first-class button, not buried behind preferences
      // (Legal Brief Part One §C, CCPA/CPRA posture).
      const reject = dialog.getByRole("button", { name: "Reject non-essential" });
      await expect(reject).toBeVisible();
      await reject.click();
      await expect(dialog).toBeHidden();

      const stored = await page.evaluate(() =>
        window.localStorage.getItem("zbest-cookie-consent"),
      );
      expect(stored).toContain("rejected-non-essential");

      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(dialog).toBeHidden();
    });

    test("counter ticks once, and prefers-reduced-motion disables the tick", async ({
      page,
    }) => {
      // Reduced motion is the project default for captures, so assert the
      // motion path explicitly rather than assuming it.
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });

      const counter = page.locator("#counter .type-stat").first();
      await counter.scrollIntoViewIfNeeded();

      // It animates to the final value and settles there.
      await expect(counter).toHaveText("1,240,000", { timeout: 5000 });
      const settled = await counter.textContent();

      // Scrolling away and back must NOT restart it — once, not on every entry.
      await page.locator("#color").scrollIntoViewIfNeeded();
      await counter.scrollIntoViewIfNeeded();
      expect(await counter.textContent()).toBe(settled);

      // With motion off the final value is present immediately (§9: content
      // fully readable with motion off).
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });
      const reduced = page.locator("#counter .type-stat").first();
      expect(await reduced.textContent()).toBe("1,240,000");

      // aria-label sits on the Counter's own element, not the type wrapper:
      // assistive tech must never be read a number mid-count, so the final
      // value is exposed there while the animating text is aria-hidden.
      await expect(
        page.locator("#counter .type-stat span[aria-label]").first(),
      ).toHaveAttribute("aria-label", "1,240,000");
    });

    // The reduced-motion read above used to race hydration: the server
    // rendered "0" and only the client effect swapped in the final value, so a
    // read before hydration saw "0" (the Sep 18 flake), and with JavaScript off
    // the number never appeared at all. §9: content fully readable with motion
    // off — so the served HTML itself must carry the final value.
    test("counter's served HTML carries the final value, before any script runs", async ({ browser }) => {
      for (const reducedMotion of ["reduce", "no-preference"] as const) {
        const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion });
        const page = await context.newPage();
        await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });
        expect(
          await page.locator("#counter .type-stat").first().textContent(),
          `no-JS, reducedMotion=${reducedMotion}`,
        ).toBe("1,240,000");
        await context.close();
      }
    });
  });
}
