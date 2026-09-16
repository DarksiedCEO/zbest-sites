import { defineConfig, devices } from "@playwright/test";

/**
 * Phase gate harness (Brief §3, §9): every page is captured at desktop 1440 and
 * mobile 390 before a phase can be marked complete.
 *
 * The gate builds the apps itself and refuses to adopt a server it did not
 * start. An earlier revision did neither, and an audit demonstrated the
 * consequence: a hand-written static server on these ports passed all four
 * tests and overwrote the committed phase screenshots. A gate that can be
 * satisfied by something other than the build under test is not a gate.
 */
export const ZBM_BASE_URL = "http://127.0.0.1:3000";
export const ZBC_BASE_URL = "http://127.0.0.1:3001";

/**
 * Builds from the current source, then serves that build — never a stale .next.
 *
 * `--hostname 127.0.0.1` is load-bearing, not tidiness. next start defaults to
 * the wildcard address, which leaves the more specific 127.0.0.1:<port> socket
 * free; BSD longest-prefix matching then routes the gate's requests to any
 * process that binds it, at any time, even after the server is up and healthy.
 * An audit hijacked the gate exactly that way and got a green 4/4 against a
 * hand-written page. Binding the loopback address specifically makes that
 * second bind fail with EADDRINUSE.
 */
const serve = (pkg: string, port: number) =>
  `pnpm --filter ${pkg} exec next build && ` +
  `pnpm --filter ${pkg} exec next start --hostname 127.0.0.1 --port ${port}`;

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    trace: "retain-on-failure",
    // Deterministic captures: no counter ticks, no scroll-scrubbed hero
    // (Brief §9 — content must be fully readable with motion off).
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-390",
      use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      command: serve("@zbest/zbm", 3000),
      url: ZBM_BASE_URL,
      cwd: "../",
      // Never adopt a pre-existing server: it may be a stale build, another
      // branch, or not this project at all.
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: serve("@zbest/zbc", 3001),
      url: ZBC_BASE_URL,
      cwd: "../",
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
