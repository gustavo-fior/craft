import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 3,
  reporter: "list",
  use: { baseURL: "http://localhost:3125", trace: "retain-on-failure", ...devices["Desktop Chrome"] },
  webServer: { command: "bun run start --port 3125", url: "http://localhost:3125", reuseExistingServer: !process.env.CI },
});
