import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",

  use: {
    baseURL:
      process.env.STAGING_URL ??
      "http://localhost:3000",

    headless: true,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "on-first-retry",
  },
})