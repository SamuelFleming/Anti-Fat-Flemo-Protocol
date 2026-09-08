import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts"],
    globalSetup: ["./tests/globalSetup.ts"],
    // A single shared in-memory MongoDB instance backs all test files; running
    // them sequentially avoids cross-file races on the shared mongoose connection.
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
