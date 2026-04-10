import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.BASE_URL?.trim() ||
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  "http://localhost:3330";
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
        /** Dedicated port so we never attach to a stale `3000` from another dev instance. */
        command: "npx next dev -p 3330",
        url: "http://localhost:3330",
        reuseExistingServer: !!process.env.PW_REUSE_DEV,
        timeout: 180000,
        /** Enables `tid()` data-testid attributes in client components (e.g. demo-cta). */
        env: { ...process.env, NEXT_PUBLIC_E2E: "1" },
      },
});
