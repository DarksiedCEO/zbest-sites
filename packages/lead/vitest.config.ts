import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // `server-only` throws outside a React Server environment by design; the
    // unit tests run in plain Node, so it resolves to an empty module here.
    alias: { "server-only": path.join(import.meta.dirname, "test", "server-only-stub.ts") },
  },
});
