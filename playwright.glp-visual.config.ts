import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.BASE_URL?.trim() ||
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  "http://localhost:3000";
/** Remote prod/preview — no local webServer */
const isLive =
  !baseURL.includes("localhost") && !baseURL.includes("127.0.0.1");

/**
 * Visual E2E: always start `npm run dev` locally (even when CI=1) unless BASE_URL points at prod/preview.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/glp-branded-e2e-visual.spec.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: isLive ? 1 : 0,
  timeout: 120000,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report-glp-visual" }],
  ],
  use: {
    baseURL,
    trace: "on",
    screenshot: "on",
    video: process.env.PLAYWRIGHT_VIDEO === "1" ? "on" : "retain-on-failure",
    actionTimeout: 25000,
    navigationTimeout: 35000,
    launchOptions: process.env.HEADED_SLOW_MO
      ? {
          slowMo: Math.min(
            5000,
            Math.max(0, parseInt(process.env.HEADED_SLOW_MO, 10) || 0),
          ),
        }
      : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: isLive
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 180000,
      },
});
