import { defineConfig, devices } from "@playwright/test";

// Tests run the app in "local mode" (data kept in the browser), so they
// don't need Supabase and never touch your real tasks.
const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        // Optional: point at an already-installed Chromium instead of downloading one.
        // Set here, not above, so WebKit doesn't try to start from it.
        launchOptions: process.env.PW_CHROMIUM_PATH
          ? { executablePath: process.env.PW_CHROMIUM_PATH }
          : {},
      },
    },
    // Safari on Masa's phone. Why these two: docs/adrs/0032-test-in-chrome-and-iphone-webkit.md
    { name: "iphone", use: { ...devices["iPhone SE (3rd gen)"] } },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_USE_LOCAL_STORE: "1",
      NEXT_DIST_DIR: ".next-test",
    },
  },
});
