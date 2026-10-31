import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo } from "@playwright/test";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Shared helpers for the accessibility gate (e2e/tests/a11y.spec.ts, every PR)
 * and its nightly extension (e2e/tests/a11y.nightly.spec.ts). What each one
 * covers is listed in docs/accessibility.md.
 */

/** axe tags for WCAG 2.0, 2.1 and 2.2, levels A and AA. (axe has no "wcag22a" tag; 2.2's new A criteria are not automatable.) */
export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * axe "best-practice" rules that guard audit findings axe does not tag as WCAG.
 * Each one failed, or would have failed, on the Oct 30 audit:
 *   heading-order        — M1, section titles not marked up / h1 → h3 skips (1.3.1)
 *   page-has-heading-one — one <h1> per page
 *   landmark-one-main    — exactly one <main> (the skip link's target)
 *   skip-link            — the skip link's target exists (m1, 2.4.1)
 */
export const STRUCTURE_RULES = ["heading-order", "page-has-heading-one", "landmark-one-main", "skip-link"];

/**
 * axe color-contrast results it could not decide ("incomplete" / needs
 * review) that are reviewed and allowed. Anything else incomplete FAILS the
 * gate (AEGIS F5): an undecided contrast check is not a pass.
 *
 * Each entry is a decorative glyph: hidden from assistive technology, adds no
 * information the text beside it does not already give, and is incomplete
 * only because axe does not measure non-BMP / symbol characters.
 */
export const CONTRAST_REVIEW_ALLOWLIST: { name: string; reason: string; match: (n: IncompleteNode) => boolean }[] = [
  {
    name: "Arrow glyph after a link label (→)",
    reason:
      "aria-hidden decoration on ZBM service/CTA links; the link text names the destination. axe reports nonBmp (it does not measure symbol glyphs). Reviewed Oct 30 2026: same colour as the link text, which passes.",
    match: (n) => n.messageKey === "nonBmp" && n.ariaHidden && /^[\s\u00a0\u2190-\u21ff]+$/.test(n.text),
  },
  {
    name: "Dropdown caret in a nav menu button (▾)",
    reason:
      "aria-hidden decoration after the menu button's label ('Services', 'Focus Areas'); aria-expanded already states open/closed. axe reports nonBmp. Reviewed Oct 30 2026: same colour as the label, which passes.",
    match: (n) => n.messageKey === "nonBmp" && n.ariaHidden && /^[\s\u25b4-\u25bf]+$/.test(n.text),
  },
];

/**
 * The only axe reasons exemption (c) applies to: something overlapping the
 * text's box. `bgOverlap` — an element overlaps it; `elmPartiallyObscuring` —
 * an element under it covers only part of it (the translucent <hr> beneath
 * the fixed banner on /about); `elmPartiallyObscured` — the same seen from
 * the other side (a form field scrolled under the sticky header, ZBC
 * /become-a-clipper after the empty-submit focus scroll). Any other reason inside an overlay —
 * pseudoContent, bgImage, bgGradient, imgNode, … — stays undecided and fails.
 */
const OVERLAP_REASONS = ["bgOverlap", "elmPartiallyObscuring", "elmPartiallyObscured"];

export type IncompleteNode = {
  target: string;
  messageKey: string;
  text: string;
  ariaHidden: boolean;
  /** Page text under an open overlay (outside it). */
  overlapsOverlay: boolean;
  /** Text inside an overlay: its contrast against the overlay's own opaque panel. */
  inOverlay: null | { ratio: number; required: number };
};

export const ZBM_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/digital-advertising",
  "/tv-streaming",
  "/radio-audio",
  "/out-of-home",
  "/social-media",
  "/creative-production",
  "/influencer-marketing",
  "/websites",
  "/revenue-recovery",
  // Built but never linked (CLAUDE.md, Brief §A4) — still served, so still scanned.
  "/search-intelligence",
  "/start",
  "/faq",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/legal/refunds",
  "/legal/accessibility",
  "/this-page-does-not-exist",
];
export const ZBC_ROUTES = [
  "/",
  "/about",
  "/entertainment",
  "/brands",
  "/pricing",
  "/faq",
  "/media-kit",
  "/launch-a-campaign",
  "/become-a-clipper",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/this-page-does-not-exist",
];
export const SITES = [
  { site: "zbm", base: ZBM_BASE_URL, routes: ZBM_ROUTES },
  { site: "zbc", base: ZBC_BASE_URL, routes: ZBC_ROUTES },
] as const;

/** Every route with a lead, assessment or readiness form. */
export const FORM_ROUTES = [
  { base: ZBM_BASE_URL, route: "/contact" },
  { base: ZBM_BASE_URL, route: "/start" },
  { base: ZBM_BASE_URL, route: "/revenue-recovery" },
  { base: ZBM_BASE_URL, route: "/search-intelligence" },
  { base: ZBC_BASE_URL, route: "/launch-a-campaign" },
  { base: ZBC_BASE_URL, route: "/become-a-clipper" },
];

export const siteOf = (base: string) => (base === ZBM_BASE_URL ? "zbm" : "zbc");
export const isMobile = (info: TestInfo) => info.project.name.startsWith("mobile");

const CONSENT_KEY = "zbest-cookie-consent";
export async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

export const banner = (page: Page) => page.getByRole("dialog", { name: "Cookies on this site" });

// ---------------------------------------------------------------------------
// axe: one pass per page state (AEGIS F3).
// ---------------------------------------------------------------------------

/**
 * Runs axe ONCE (the WCAG A/AA tags plus the structure rules) and requires:
 *   - zero violations;
 *   - every structure rule actually ran (so the single pass cannot silently
 *     drop them);
 *   - no undecided color-contrast result, except:
 *       a. the decorative glyphs in CONTRAST_REVIEW_ALLOWLIST;
 *       b. page text an open OVERLAY covers (`bgOverlap`) — the consent banner,
 *          or a positioned menu panel opened by an aria-expanded button. The
 *          a11y spec also scans every route with no overlay open, where the
 *          same text is measured with nothing over it;
 *       c. text INSIDE an overlay that axe left undecided only because
 *          something overlaps its box (OVERLAP_REASONS): axe walks the page
 *          content under a positioned panel and gives up when, say, a
 *          semi-transparent <hr> there crosses the text's box — but nothing
 *          below the panel's opaque background can show through, so the text
 *          is composited over the overlay's own backgrounds and must reach
 *          4.5:1 (3:1 for large text). It stays undecided, and FAILS, if no
 *          opaque background is found inside the overlay, or if anything
 *          else paints near the text (a pseudo-element background, opacity,
 *          a filter, a blend mode, or another painted element in the overlay
 *          touching the text's box). The spec has a probe proving a
 *          pseudo-element background behind banner text fails the gate.
 *          The sticky site header counts as an overlay too, but its panel is
 *          translucent (bg-base/95): there the background is BOUNDED, with
 *          black and then white composited under the panel, and the text must
 *          clear the ratio against the whole range, or it stays undecided.
 */
export async function expectNoViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .options({ rules: Object.fromEntries(STRUCTURE_RULES.map((id) => [id, { enabled: true }])) })
    .analyze();

  const ran = new Set(
    [...results.passes, ...results.violations, ...results.incomplete, ...results.inapplicable].map((r) => r.id),
  );
  expect(STRUCTURE_RULES.filter((id) => !ran.has(id)), `structure rules that did not run — ${label}`).toEqual([]);

  const violations = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}) ${v.help}\n` +
      v.nodes
        .slice(0, 5)
        .map((n) => `    ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`)
        .join("\n"),
  );
  expect(violations, `axe violations — ${label}`).toEqual([]);

  const contrast = results.incomplete.find((r) => r.id === "color-contrast");
  const undecided: IncompleteNode[] = [];
  for (const n of contrast?.nodes ?? []) {
    const target = n.target.join(" ");
    const check = [...n.any, ...n.all, ...n.none].find((c) => (c.data as { messageKey?: string } | null)?.messageKey);
    const messageKey = (check?.data as { messageKey?: string } | undefined)?.messageKey ?? "unknown";
    const info = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      const overlays = [
        document.querySelector<HTMLElement>('[role="dialog"][aria-labelledby="cookie-consent-heading"]'),
        ...[...document.querySelectorAll('[aria-expanded="true"][aria-controls]')].map((b) =>
          document.getElementById(b.getAttribute("aria-controls")!),
        ),
        // The sticky site header: scrolled page content passes under it.
        document.querySelector<HTMLElement>("header:has(> nav[aria-label='Primary'])"),
      ].filter((o): o is HTMLElement => !!o && ["absolute", "fixed", "sticky"].includes(getComputedStyle(o).position));
      const dialog = overlays.find((o) => o.contains(el)) ?? null;
      let overlapsOverlay = false;
      let inOverlay: null | { ratio: number; required: number } = null;
      if (el && !dialog) {
        const a = el.getBoundingClientRect();
        overlapsOverlay = overlays.some((o) => {
          const b = o.getBoundingClientRect();
          return a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right;
        });
      }
      if (el && dialog) {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        type RGBA = [number, number, number, number];
        const rgba = (css: string): RGBA => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillStyle = css;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
        };
        const over = (t: RGBA, u: RGBA): RGBA => {
          const al = t[3] + u[3] * (1 - t[3]);
          const mix = (i: number) => (al ? (t[i]! * t[3] + u[i]! * u[3] * (1 - t[3])) / al : 0);
          return [mix(0), mix(1), mix(2), al];
        };
        // Anything axe would also have to give up on keeps the result
        // undecided (AEGIS r2 N1): a painted ::before/::after, opacity < 1, a
        // filter or a blend mode on the text or any ancestor up to the
        // overlay, or another painted element inside the overlay whose box
        // touches the text's box.
        const paints = (cs: CSSStyleDeclaration) => rgba(cs.backgroundColor)[3] > 0 || cs.backgroundImage !== "none";
        const pseudoPaints = (n: Element, which: "::before" | "::after") => {
          const ps = getComputedStyle(n, which);
          return ps.content !== "none" && ps.content !== "normal" && paints(ps);
        };
        let layered = false;
        for (let n2: HTMLElement | null = el; n2 && !layered; n2 = n2.parentElement) {
          const cs = getComputedStyle(n2);
          if (
            Number(cs.opacity) < 1 ||
            cs.filter !== "none" ||
            cs.mixBlendMode !== "normal" ||
            pseudoPaints(n2, "::before") ||
            pseudoPaints(n2, "::after")
          )
            layered = true;
          if (n2 === dialog) break;
        }
        const t = el.getBoundingClientRect();
        for (const other of dialog.querySelectorAll<HTMLElement>("*")) {
          if (layered) break;
          if (other === el || other.contains(el) || el.contains(other)) continue;
          const r = other.getBoundingClientRect();
          if (!(r.right > t.left && r.left < t.right && r.bottom > t.top && r.top < t.bottom)) continue;
          if (paints(getComputedStyle(other)) || pseudoPaints(other, "::before") || pseudoPaints(other, "::after")) layered = true;
        }
        const layers: RGBA[] = [];
        let opaque = false;
        for (let n2: HTMLElement | null = layered ? null : el; n2; n2 = n2.parentElement) {
          const cs = getComputedStyle(n2);
          if (cs.backgroundImage !== "none") {
            layered = true; // cannot compute: stays undecided
            break;
          }
          const c = rgba(cs.backgroundColor);
          if (c[3] > 0) layers.push(c);
          if (c[3] >= 1) {
            opaque = true;
            break;
          }
          if (n2 === dialog) break;
        }
        const lum = ([r, g, b2]: RGBA) => {
          const ch = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b2);
        };
        const cs = getComputedStyle(el);
        const px = parseFloat(cs.fontSize);
        const required = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5;
        const text = rgba(cs.color);
        if (opaque) {
          let bg: RGBA = [0, 0, 0, 0];
          for (const c of layers.reverse()) bg = over(c, bg);
          const fg = over(text, bg);
          const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
          inOverlay = { ratio: (hi! + 0.05) / (lo! + 0.05), required };
        } else if (!layered && layers.length && text[3] >= 1) {
          // A TRANSLUCENT overlay (the sticky header's bg-base/95): what shows
          // through is unknown, so bound it. Whatever is behind lies between
          // black and white; composite the overlay over both. The background's
          // luminance can be anything in that range, so the text passes only
          // if it is lighter (or darker) than the whole range by the required
          // ratio. Inside the range it stays undecided, and fails.
          const panel = (under: RGBA) => {
            let bg = under;
            for (const c of [...layers].reverse()) bg = over(c, bg);
            return bg;
          };
          const lo = lum(panel([0, 0, 0, 1]));
          const hi = lum(panel([255, 255, 255, 1]));
          const lf = lum(text);
          if (lf >= hi) inOverlay = { ratio: (lf + 0.05) / (hi + 0.05), required };
          else if (lf <= lo) inOverlay = { ratio: (lo + 0.05) / (lf + 0.05), required };
        }
      }
      return {
        text: (el?.textContent ?? "").trim().slice(0, 60),
        ariaHidden: !!el?.closest('[aria-hidden="true"]'),
        overlapsOverlay,
        inOverlay,
      };
    }, String(n.target[n.target.length - 1]));
    undecided.push({ target, messageKey, ...info });
  }
  const unreviewed = undecided
    .filter((n) => !(n.messageKey === "bgOverlap" && n.overlapsOverlay))
    .filter((n) => !(OVERLAP_REASONS.includes(n.messageKey) && n.inOverlay && n.inOverlay.ratio >= n.inOverlay.required))
    .filter((n) => !CONTRAST_REVIEW_ALLOWLIST.some((a) => a.match(n)))
    .map(
      (n) =>
        `${n.messageKey}: ${n.target} "${n.text}"` +
        (n.inOverlay ? ` (in overlay: ${n.inOverlay.ratio.toFixed(2)}:1, needs ${n.inOverlay.required}:1)` : ""),
    );
  expect(unreviewed, `axe color-contrast needs review (not allowlisted) — ${label}`).toEqual([]);
}

// ---------------------------------------------------------------------------
// WCAG 1.4.11 Non-text Contrast: form control boundaries (AEGIS F4).
// axe has no rule for this.
// ---------------------------------------------------------------------------

/**
 * Every visible form control's border must reach 3:1 against the background
 * just outside it. The border colour is composited the way the browser paints
 * it — over the control's own background, over whatever is behind — and every
 * colour is read through a canvas, so oklab()/color-mix() values work.
 *
 * Controls: text-like inputs, selects, textareas, and for radios/checkboxes
 * whatever draws the box — the input itself, or the bordered element in its
 * label when the native input is visually hidden. Native-appearance
 * radios/checkboxes are drawn by the browser and skipped.
 *
 * Returns one line per failure; [] means every control passed.
 */
export const controlBorderFailures = (page: Page) =>
  page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    type RGBA = [number, number, number, number];
    const rgba = (css: string): RGBA => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
    };
    const over = (top: RGBA, under: RGBA): RGBA => {
      const a = top[3] + under[3] * (1 - top[3]);
      if (a === 0) return [0, 0, 0, 0];
      const mix = (i: number) => (top[i]! * top[3] + under[i]! * under[3] * (1 - top[3])) / a;
      return [mix(0), mix(1), mix(2), a];
    };
    /** The opaque colour painted behind `el` (its ancestors' backgrounds, composited). */
    const behind = (el: Element | null): RGBA => {
      const layers: RGBA[] = [];
      for (let n = el; n; n = n.parentElement) {
        const c = rgba(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] >= 1) break;
      }
      let out: RGBA = [255, 255, 255, 1];
      for (const c of layers.reverse()) out = over(c, out);
      return out;
    };
    const lum = ([r, g, b]: RGBA) => {
      const ch = (v: number) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
    };
    const ratio = (a: RGBA, b: RGBA) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x! + 0.05) / (y! + 0.05);
    };
    const visible = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && !el.closest('[aria-hidden="true"], [hidden]') && getComputedStyle(el).visibility !== "hidden";
    };
    const bordered = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return (["Top", "Right", "Bottom", "Left"] as const).some(
        (s) => parseFloat(cs.getPropertyValue(`border-${s.toLowerCase()}-width`)) >= 1 && cs.getPropertyValue(`border-${s.toLowerCase()}-style`) !== "none",
      );
    };
    /** The weakest painted border side's contrast against the background outside the element. */
    const measure = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      const outside = behind(el.parentElement);
      const fill = over(rgba(cs.backgroundColor), outside);
      let worst = Infinity;
      for (const side of ["top", "right", "bottom", "left"]) {
        if (parseFloat(cs.getPropertyValue(`border-${side}-width`)) < 1 || cs.getPropertyValue(`border-${side}-style`) === "none") continue;
        worst = Math.min(worst, ratio(over(rgba(cs.getPropertyValue(`border-${side}-color`)), fill), outside));
      }
      return worst;
    };
    const describe = (el: HTMLElement) =>
      `${el.tagName.toLowerCase()}${el.getAttribute("name") ? `[name=${el.getAttribute("name")}]` : ""}${
        el.getAttribute("aria-invalid") === "true" ? "[invalid]" : ""
      } "${((el as HTMLInputElement).labels?.[0]?.textContent ?? el.getAttribute("aria-label") ?? "").trim().replace(/\s+/g, " ").slice(0, 30)}"`;

    const fails: string[] = [];
    const check = (el: HTMLElement, what: string) => {
      const r = measure(el);
      if (r < 3) fails.push(`${what} border ${r.toFixed(2)}:1 (needs 3:1)`);
    };
    for (const el of document.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), select, textarea',
    )) {
      if (!visible(el)) continue;
      if (!bordered(el)) {
        fails.push(`${describe(el)} has no border`);
        continue;
      }
      check(el, describe(el));
    }
    for (const input of document.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')) {
      if (input.closest('[aria-hidden="true"], [hidden]')) continue;
      // The option box: the bordered element that outlines the option — the
      // label itself, a bordered element inside it, or the nearest bordered
      // wrapper around it within its group. It is the option's visible
      // boundary whether or not the native input is also shown.
      const label = input.closest("label") ?? input.labels?.[0] ?? null;
      let box: HTMLElement | undefined;
      if (label && visible(label)) {
        box = [label, ...label.querySelectorAll<HTMLElement>("*")].find((e) => e !== input && visible(e) && bordered(e));
        for (let n = label.parentElement; !box && n && !n.matches("fieldset, form, [role=radiogroup], [role=group]"); n = n.parentElement) {
          if (visible(n) && bordered(n)) box = n;
        }
      }
      if (box) check(box, `${describe(input)} option box`);
      const custom = visible(input) && getComputedStyle(input).appearance === "none";
      if (custom) {
        if (bordered(input)) check(input, describe(input));
        else if (!box) fails.push(`${describe(input)} has no border`);
      } else if (!visible(input) && !box) {
        // Native input hidden and nothing drawn in its place.
        if (label && visible(label)) fails.push(`${describe(input)}: no visible bordered box`);
      }
      // A visible native input is drawn by the browser: not ours to measure.
    }
    return fails;
  });

export async function expectControlBorders(page: Page, label: string) {
  expect(await controlBorderFailures(page), `form control borders below 3:1 (WCAG 1.4.11) — ${label}`).toEqual([]);
}

// ---------------------------------------------------------------------------
// Keyboard: where focus is, and walking the tab order.
// ---------------------------------------------------------------------------

export type Focused = { name: string; hidden: boolean; body: boolean; key: string };

/**
 * Where focus is, and whether it is ENTIRELY hidden (WCAG 2.4.11): none of
 * five sample points on the focused element is both inside the viewport and
 * topmost there (its own label counts as itself).
 */
export const focused = (page: Page) =>
  page.evaluate((): Focused => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { name: "BODY", hidden: false, body: true, key: "" };
    const r = el.getBoundingClientRect();
    const pts: [number, number][] = [
      [r.left + r.width / 2, r.top + r.height / 2],
      [r.left + 2, r.top + 2],
      [r.right - 2, r.top + 2],
      [r.left + 2, r.bottom - 2],
      [r.right - 2, r.bottom - 2],
    ];
    const labels = [...((el as HTMLInputElement).labels ?? [])];
    const seen = pts.some(([x, y]) => {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
      const top = document.elementFromPoint(x, y);
      return !!top && (top === el || el.contains(top) || top.contains(el) || labels.some((l) => l.contains(top)));
    });
    const name = (el.getAttribute("aria-label") || el.innerText || (el as HTMLInputElement).name || el.tagName)
      .trim()
      .slice(0, 40);
    const path = (n: Element | null): string => (n && n.parentElement ? `${path(n.parentElement)}>${[...n.parentElement.children].indexOf(n)}` : "");
    return { name, hidden: !seen, body: false, key: path(el) };
  });

/** Tabs through the page in one direction; returns every stop where focus was entirely hidden. */
export async function walk(page: Page, key: "Tab" | "Shift+Tab", max = 160) {
  const hidden: string[] = [];
  let first = "";
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    const f = await focused(page);
    if (f.body && i > 1) break;
    if (f.body) continue;
    if (f.key === first) break; // wrapped around
    first ||= f.key;
    if (f.hidden) hidden.push(`#${i} ${f.name}`);
  }
  return hidden;
}

/** WCAG 2.4.11 on one route: banner open (Tab, Shift+Tab), then dismissed (Shift+Tab). */
export async function expectFocusNeverHidden(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await expect(banner(page)).toBeVisible();
  expect(await walk(page, "Tab"), "banner open, Tab").toEqual([]);
  await page.goto(url, { waitUntil: "networkidle" });
  expect(await walk(page, "Shift+Tab"), "banner open, Shift+Tab").toEqual([]);

  await presetConsent(page);
  await page.goto(url, { waitUntil: "networkidle" });
  await expect(banner(page)).toBeHidden();
  expect(await walk(page, "Shift+Tab"), "banner dismissed, Shift+Tab").toEqual([]);
}
