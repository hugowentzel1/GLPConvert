import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  console.log('Navigating to http://localhost:3000/');
  await page.goto('http://localhost:3000/');
  
  console.log('Waiting for page to load...');
  await page.waitForLoadState('domcontentloaded');
  
  console.log('Checking for company name...');
  await expect(page.locator('h1').first()).toContainText('Your Company');
  
  console.log('Checking for address input...');
  await expect(page.getByPlaceholder(/Start typing/i)).toBeVisible();
  
  console.log('✅ Homepage loaded successfully!');
});
