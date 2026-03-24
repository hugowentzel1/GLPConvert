import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 4,
  reporter: 'list',
  timeout: 35000,
  use: {
    baseURL: process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.PLAYWRIGHT_VIDEO === '1' ? 'on' : 'off',
    actionTimeout: 15000,
    navigationTimeout: 20000,
    // Slight slow-mo so headed runs are easier to follow (set HEADED_SLOW_MO=150)
    // Headed “watch me work” runs: HEADED_SLOW_MO=500–2000 (ms between actions); capped so you can go very slow.
    launchOptions: process.env.HEADED_SLOW_MO
      ? { slowMo: Math.min(5000, Math.max(0, parseInt(process.env.HEADED_SLOW_MO, 10) || 0)) }
      : undefined,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.CI || process.env.BASE_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
