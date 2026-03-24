import { chromium } from '@playwright/test';

async function openDemo() {
  // Launch browser in headed mode (visible)
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 // Slow down actions so you can see what's happening
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Navigate to demo mode with company parameter
  const demoUrl = 'http://localhost:3000/?company=google&demo=1';
  console.log(`Opening demo mode: ${demoUrl}`);
  
  await page.goto(demoUrl, { waitUntil: 'networkidle' });
  
  console.log('Demo mode opened! You can now interact with the app.');
  console.log('The browser will stay open. Close it when you\'re done testing.');
  
  // Keep the browser open - don't close it automatically
  // The user will manually close it when done
}

openDemo().catch(console.error);
