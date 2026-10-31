import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // `server-only` throws outside a React Server environment by design; the
    // unit tests run in plain Node, so it resolves to an empty module here.
    alias: { "server-only": path.join(import.meta.dirname, "test", "server-only-stub.ts") },
  },
  test: {
    // With a database, every integration file shares one `leads` table and
    // some hold table locks on purpose (CH-9, r2 L3, r3 L1): files run one at
    // a time so they cannot interfere (AEGIS r5 rerun: a lock held by one file
    // made another file's concurrent-cron test answer 503).
    fileParallelism: !process.env.LEAD_TEST_POSTGRES_URL,
  },
});
