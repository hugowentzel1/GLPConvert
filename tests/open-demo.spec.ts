import { test } from '@playwright/test';

test('Open demo mode for manual testing', async ({ page, context }) => {
  // Navigate to demo mode with company parameter
  const demoUrl = 'http://localhost:3000/?company=google&demo=1';
  console.log(`Opening demo mode: ${demoUrl}`);
  
  await page.goto(demoUrl, { waitUntil: 'networkidle' });
  
  console.log('Demo mode opened! You can now interact with the app.');
  console.log('The browser will stay open. Press Ctrl+C to close.');
  
  // Keep the browser open - wait for user to close manually
  // This will keep the page open indefinitely
  await page.waitForTimeout(999999999);
});
