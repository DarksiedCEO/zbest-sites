import { defineConfig, devices } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

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
 * Per-run secret proving the server answering a URL is the one this gate
 * spawned. Generated in the runner and inherited by workers and by the server
 * process, so it exists only in memory for the life of the run.
 *
 * This is the check that actually holds. Everything weaker was defeated: the
 * port can be taken before the gate starts (Playwright's reuse guard is a
 * single probe, and one dropped connection beats it), and any on-disk token can
 * be read and replayed by any local process.
 */
process.env.ZBEST_GATE_NONCE ??= randomUUID();
export const GATE_NONCE = process.env.ZBEST_GATE_NONCE;

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
/**
 * Lead route (docs/LEAD-ROUTE-DESIGN.md). The gate never delivers for real:
 * the main servers run the FAKE transport, which writes every row and email
 * to JSONL files in a per-run outbox the tests read back. Two more servers
 * reuse the ZBM build to prove the other modes:
 *   - ZBM_UNCONFIGURED_URL: no transport env at all → must fail closed (503);
 *   - ZBM_LIMITED_URL: fake transport with a tight rate limit → 429 path.
 * The main servers get a limit high enough that the rest of the suite, all
 * from 127.0.0.1, never trips it.
 */
export const ZBM_UNCONFIGURED_URL = "http://127.0.0.1:3002";
export const ZBM_LIMITED_URL = "http://127.0.0.1:3003";
export const LIMITED_RATE = { limit: 3, windowSec: 600 };
/** Port for the spawned misconfigured-URL server (phase-7, M1). */
export const ZBM_MALFORMED_PORT = 3004;
export const LEAD_OUTBOX = path.join(tmpdir(), `zbest-lead-outbox-${GATE_NONCE}`);
export const outboxFor = (server: "zbm" | "zbc" | "zbm-limited") => path.join(LEAD_OUTBOX, server);

/**
 * The fake transport's positive proof (AEGIS M2): the ack must equal this
 * run's nonce, and the outbox must sit under the OS temp directory.
 */
const fakeLeads = (
  server: "zbm" | "zbc" | "zbm-limited",
  rate: string,
  ipHeader: "x-forwarded-for" | "x-real-ip" = "x-forwarded-for",
) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: outboxFor(server),
  ZBEST_LEAD_FAKE_ACK: GATE_NONCE,
  LEAD_RATE_LIMIT: rate,
  // Off Vercel the route refuses to run without naming the ONE trusted
  // client-address header (AEGIS r2 N1, r3 F1). CAUTION (AEGIS r4 R1): this
  // is a TEST harness, not a deployment pattern. `next start` does NOT append
  // to x-forwarded-for — Next 16 only fills it from the socket when it is
  // ABSENT — so a client-sent value passes through untouched. That is fine
  // here only because these tests never send x-forwarded-for; never expose
  // `next start` directly with LEAD_TRUSTED_PROXY set. The rate-limit server
  // trusts x-real-ip, which its test sets per viewport so the two viewports
  // never share a bucket.
  LEAD_TRUSTED_PROXY: ipHeader,
});

/** Overrides anything the runner's own shell might carry, so "unconfigured" really is. */
const NO_LEAD_TRANSPORT = {
  ZBEST_LEAD_TRANSPORT: "",
  ZBEST_LEAD_FAKE_OUTBOX: "",
  ZBEST_LEAD_FAKE_ACK: "",
  LEAD_TRUSTED_PROXY: "",
  LEAD_TRUSTED_PROXY_HOPS: "",
  LEAD_ALLOWED_ORIGINS: "",
  POSTGRES_URL: "",
  LEAD_IP_HASH_SECRET: "",
  RESEND_API_KEY: "",
  LEAD_NOTIFY_FROM: "",
  LEAD_NOTIFY_TO: "",
  LEAD_NOTIFY: "",
  LEAD_RATE_LIMIT: "",
  KV_REST_API_URL: "",
  KV_REST_API_TOKEN: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
};

const serve = (pkg: string, port: number) =>
  `pnpm --filter ${pkg} exec next build && ` +
  `pnpm --filter ${pkg} exec next start --hostname 127.0.0.1 --port ${port}`;

export default defineConfig({
  testDir: "./tests",
  // The nightly accessibility extension runs only from a11y-nightly.yml.
  testIgnore: process.env.A11Y_NIGHTLY ? [] : ["**/*.nightly.spec.ts"],
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
    // Nightly only (a11y-nightly.yml): the accessibility specs on Firefox.
    ...(process.env.A11Y_NIGHTLY
      ? [
          {
            name: "firefox-1440",
            testMatch: /a11y(\.nightly)?\.spec\.ts$/,
            use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
  ],
  webServer: [
    {
      command: serve("@zbest/zbm", 3000),
      url: ZBM_BASE_URL,
      cwd: "../",
      // ZBEST_DEV_ROUTES: build /dev/system for the Phase 2 gate (excluded in production).
      env: { ZBEST_GATE_NONCE: GATE_NONCE, ZBEST_DEV_ROUTES: "1", ...NO_LEAD_TRANSPORT, ...fakeLeads("zbm", "100000/60") },
      // Never adopt a pre-existing server: it may be a stale build, another
      // branch, or not this project at all.
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: serve("@zbest/zbc", 3001),
      url: ZBC_BASE_URL,
      cwd: "../",
      // ZBEST_DEV_ROUTES: build /dev/system for the Phase 2 gate (excluded in production).
      env: { ZBEST_GATE_NONCE: GATE_NONCE, ZBEST_DEV_ROUTES: "1", ...NO_LEAD_TRANSPORT, ...fakeLeads("zbc", "100000/60") },
      reuseExistingServer: false,
      timeout: 180_000,
    },
    // Webservers start in order, so the ZBM build above exists before these
    // two start it again on other ports. They never build.
    {
      command: "pnpm --filter @zbest/zbm exec next start --hostname 127.0.0.1 --port 3002",
      url: ZBM_UNCONFIGURED_URL,
      cwd: "../",
      env: { ZBEST_GATE_NONCE: GATE_NONCE, ...NO_LEAD_TRANSPORT },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "pnpm --filter @zbest/zbm exec next start --hostname 127.0.0.1 --port 3003",
      url: ZBM_LIMITED_URL,
      cwd: "../",
      env: {
        ZBEST_GATE_NONCE: GATE_NONCE,
        ...NO_LEAD_TRANSPORT,
        ...fakeLeads("zbm-limited", `${LIMITED_RATE.limit}/${LIMITED_RATE.windowSec}`, "x-real-ip"),
      },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
