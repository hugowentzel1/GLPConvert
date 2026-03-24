/**
 * Visual Logo Verification Script
 * Opens browser windows to visually verify logos on demo and paid versions
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

async function showLogosVisually() {
  console.log('🎨 Opening browser to show logos visually...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser
    slowMo: 1000 // Slow down actions for visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  // Demo version with Apple logo
  console.log('📱 Opening DEMO version with Apple logo...');
  const demoPage = await context.newPage();
  await demoPage.goto(
    `${BASE_URL}/?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=1`,
    { waitUntil: 'networkidle' }
  );
  await demoPage.waitForTimeout(2000);
  console.log('✅ Demo page loaded - Check the browser window!\n');

  // Paid version with Apple logo
  console.log('💼 Opening PAID version with Apple logo...');
  const paidPage = await context.newPage();
  await paidPage.goto(
    `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`,
    { waitUntil: 'networkidle' }
  );
  await paidPage.waitForTimeout(2000);
  console.log('✅ Paid page loaded - Check the browser window!\n');

  // Demo version with Google logo
  console.log('📱 Opening DEMO version with Google logo...');
  const demoGooglePage = await context.newPage();
  await demoGooglePage.goto(
    `${BASE_URL}/?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com&demo=1`,
    { waitUntil: 'networkidle' }
  );
  await demoGooglePage.waitForTimeout(2000);
  console.log('✅ Demo Google page loaded - Check the browser window!\n');

  // Paid version with Google logo
  console.log('💼 Opening PAID version with Google logo...');
  const paidGooglePage = await context.newPage();
  await paidGooglePage.goto(
    `${BASE_URL}/paid?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com`,
    { waitUntil: 'networkidle' }
  );
  await paidGooglePage.waitForTimeout(2000);
  console.log('✅ Paid Google page loaded - Check the browser window!\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ All pages opened!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📋 Pages opened:');
  console.log('   1. Demo version - Apple (red branding)');
  console.log('   2. Paid version - Apple (red branding)');
  console.log('   3. Demo version - Google (blue branding)');
  console.log('   4. Paid version - Google (blue branding)');
  console.log('\n👀 Check the browser windows to verify logos are displaying correctly!');
  console.log('\n⏸️  Browser will stay open for 60 seconds...');
  console.log('   (Close manually or wait for auto-close)\n');

  // Keep browser open for 60 seconds so user can inspect
  await new Promise(resolve => setTimeout(resolve, 60000));

  await browser.close();
  console.log('✅ Browser closed. Visual verification complete!\n');
}

showLogosVisually().catch(console.error);

