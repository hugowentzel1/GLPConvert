import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.SYNTHETIC_APP_URL || process.env.SYNTHETIC_BASE_URL || process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

export default defineConfig({
  testDir: './tests/synthetics',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['json', { outputFile: 'test-results/synthetics-results.json' }]] : 'list',
  timeout: 120000,
  expect: { timeout: 15000 },

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 35000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
