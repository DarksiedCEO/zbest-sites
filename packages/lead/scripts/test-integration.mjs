/* global process, console */
/**
 * The DATABASE-backed lead suite, as the Mac/CI gate must run it (AEGIS r6 O1).
 *
 * Requires both URLs and turns verify-full from "may skip" into "must run":
 *   LEAD_TEST_POSTGRES_URL       admin connection to a disposable database
 *   LEAD_TEST_POSTGRES_NEON_URL  TLS-only SCRAM role, Neon-shaped URL
 *   NODE_EXTRA_CA_CERTS          the test server's CA
 *   /etc/hosts                   127.0.0.1 lead-wrong-host.test
 * A missing URL is an error here (plain `pnpm test` is the no-database run).
 */
import { spawnSync } from "node:child_process";

const missing = ["LEAD_TEST_POSTGRES_URL", "LEAD_TEST_POSTGRES_NEON_URL"].filter((n) => !(process.env[n] ?? "").trim());
if (missing.length) {
  console.error(`test:integration needs ${missing.join(" and ")}. For the no-database run use \`pnpm test\`.`);
  process.exit(2);
}
const result = spawnSync("vitest", ["run"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, LEAD_TEST_EXPECT_VERIFY_FULL: "1" },
});
process.exit(result.status ?? 1);
