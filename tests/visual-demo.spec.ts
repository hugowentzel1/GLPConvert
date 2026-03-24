/**
 * VISUAL DEMONSTRATION
 * Creates screenshots of the complete system
 */

import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:3002';

test.describe('📸 VISUAL DEMONSTRATION', () => {
  
  test('Take Screenshots of Complete System', async ({ page }) => {
    console.log('');
    console.log('📸 Creating visual demonstration...');
    console.log('');
    
    // Screenshot 1: Homepage with Demo
    console.log('1️⃣  Screenshot: Homepage with demo...');
    await page.goto(`${BASE_URL}/?company=SolarCorp&demo=1`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'visual-demo/01-homepage-demo.png', 
      fullPage: true 
    });
    console.log('   ✅ Saved: visual-demo/01-homepage-demo.png');
    
    // Screenshot 2: Report page with branding
    console.log('2️⃣  Screenshot: Report page with company branding...');
    await page.goto(`${BASE_URL}/report?lat=33.4484&lng=-112.0740&address=Phoenix,%20AZ&company=SolarCorp&brandColor=%23F59E0B&demo=1`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ 
      path: 'visual-demo/02-report-branded.png', 
      fullPage: true 
    });
    console.log('   ✅ Saved: visual-demo/02-report-branded.png');
    
    // Screenshot 3: CTA button visible
    console.log('3️⃣  Screenshot: CTA button (Launch)...');
    const ctaButton = page.locator('button[data-cta="primary"]').first();
    if (await ctaButton.isVisible()) {
      await ctaButton.scrollIntoViewIfNeeded();
      await page.screenshot({ 
        path: 'visual-demo/03-cta-button.png'
      });
      console.log('   ✅ Saved: visual-demo/03-cta-button.png');
    }
    
    // Screenshot 4: Activate page
    console.log('4️⃣  Screenshot: Activate page (after payment)...');
    await page.goto(`${BASE_URL}/activate?session_id=cs_test_success&company=SolarCorp`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'visual-demo/04-activate-page.png', 
      fullPage: true 
    });
    console.log('   ✅ Saved: visual-demo/04-activate-page.png');
    
    // Screenshot 5: Customer Dashboard
    console.log('5️⃣  Screenshot: Customer dashboard...');
    await page.goto(`${BASE_URL}/c/SolarCorp`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'visual-demo/05-dashboard-full.png', 
      fullPage: true 
    });
    console.log('   ✅ Saved: visual-demo/05-dashboard-full.png');
    
    // Screenshot 6: Dashboard - Instant URL section
    console.log('6️⃣  Screenshot: Dashboard - Instant URL section...');
    const instantUrlSection = page.locator('text=Instant URL').first();
    if (await instantUrlSection.isVisible()) {
      await instantUrlSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'visual-demo/06-dashboard-instant-url.png'
      });
      console.log('   ✅ Saved: visual-demo/06-dashboard-instant-url.png');
    }
    
    // Screenshot 7: Dashboard - Embed Code section
    console.log('7️⃣  Screenshot: Dashboard - Embed Code section...');
    const embedSection = page.locator('text=Embed Code').first();
    if (await embedSection.isVisible()) {
      await embedSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'visual-demo/07-dashboard-embed-code.png'
      });
      console.log('   ✅ Saved: visual-demo/07-dashboard-embed-code.png');
    }
    
    // Screenshot 8: Dashboard - Custom Domain section
    console.log('8️⃣  Screenshot: Dashboard - Custom Domain section...');
    const domainSection = page.locator('text=Custom Domain').first();
    if (await domainSection.isVisible()) {
      await domainSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'visual-demo/08-dashboard-custom-domain.png'
      });
      console.log('   ✅ Saved: visual-demo/08-dashboard-custom-domain.png');
    }
    
    // Screenshot 9: Dashboard - API Key section
    console.log('9️⃣  Screenshot: Dashboard - API Key section...');
    const apiSection = page.locator('text=API Key').first();
    if (await apiSection.isVisible()) {
      await apiSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'visual-demo/09-dashboard-api-key.png'
      });
      console.log('   ✅ Saved: visual-demo/09-dashboard-api-key.png');
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ VISUAL DEMONSTRATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📁 All screenshots saved to: visual-demo/');
    console.log('');
    console.log('Screenshots created:');
    console.log('  1. Homepage with demo');
    console.log('  2. Report page with company branding');
    console.log('  3. CTA button (Launch)');
    console.log('  4. Activate page (after payment)');
    console.log('  5. Customer dashboard (full page)');
    console.log('  6. Dashboard - Instant URL section');
    console.log('  7. Dashboard - Embed Code section');
    console.log('  8. Dashboard - Custom Domain section');
    console.log('  9. Dashboard - API Key section');
    console.log('');
  });
});

