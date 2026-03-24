// Quick test to verify demo functionality
const puppeteer = require('puppeteer');

async function testDemo() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing demo: http://localhost:3000/?company=Apple&demo=1');
  await page.goto('http://localhost:3000/?company=Apple&demo=1');
  await page.waitForTimeout(2000);
  
  // Check for Apple branding
  const title = await page.title();
  console.log('Title:', title);
  
  // Check for demo quota display
  const quotaText = await page.evaluate(() => {
    const body = document.body.innerText;
    return body.includes('Preview:') && body.includes('run');
  });
  console.log('Demo quota displayed:', quotaText);
  
  // Check for address input
  const addressInput = await page.$('input[placeholder*="address"]');
  console.log('Address input found:', !!addressInput);
  
  // Check for CTA button
  const ctaButton = await page.$('[data-cta-button]');
  console.log('CTA button found:', !!ctaButton);
  
  await browser.close();
  console.log('Demo functionality test complete!');
}

testDemo().catch(console.error);
