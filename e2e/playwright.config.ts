import { defineConfig, devices } from "@playwright/test";

/**
 * Phase gate harness (Brief §3, §9): every page is captured at desktop 1440 and
 * mobile 390 before a phase can be marked complete. Both apps are built and
 * served for the run so screenshots reflect production output, not dev overlays.
 */
export const ZBM_BASE_URL = "http://127.0.0.1:3000";
export const ZBC_BASE_URL = "http://127.0.0.1:3001";

export default defineConfig({
  testDir: "./tests",
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
      command: "pnpm --filter @zbest/zbm exec next start --port 3000",
      url: ZBM_BASE_URL,
      cwd: "../",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @zbest/zbc exec next start --port 3001",
      url: ZBC_BASE_URL,
      cwd: "../",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
