const { chromium } = require('playwright');

async function analyzeHeaderSpacing() {
  console.log('📏 Analyzing Report Page Header Spacing vs Site Standards...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const spacingAnalysis = await page.evaluate(() => {
      // Get all header elements
      const backButton = document.querySelector('[data-testid="back-home-link"]');
      const h1 = document.querySelector('[data-testid="hdr-h1"]');
      const logo = document.querySelector('[data-testid="hdr-logo"]');
      const sub = document.querySelector('[data-testid="hdr-sub"]');
      const address = document.querySelector('[data-testid="hdr-address"]');
      const meta = document.querySelector('[data-testid="hdr-meta"]');
      
      if (!backButton || !h1 || !logo || !sub || !address || !meta) {
        return { error: 'Missing elements' };
      }
      
      // Get bounding rectangles
      const backRect = backButton.getBoundingClientRect();
      const h1Rect = h1.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const subRect = sub.getBoundingClientRect();
      const addressRect = address.getBoundingClientRect();
      const metaRect = meta.getBoundingClientRect();
      
      // Calculate gaps
      const backToH1 = h1Rect.top - backRect.bottom;
      const h1ToLogo = logoRect.top - h1Rect.bottom;
      const logoToSub = subRect.top - logoRect.bottom;
      const subToAddress = addressRect.top - subRect.bottom;
      const addressToMeta = metaRect.top - addressRect.bottom;
      
      return {
        backToH1,
        h1ToLogo,
        logoToSub,
        subToAddress,
        addressToMeta,
        // Also get the CSS classes for reference
        cssClasses: {
          backButton: backButton.parentElement?.className,
          h1: h1.className,
          logo: logo.className,
          sub: sub.className,
          address: address.className,
          meta: meta.className
        }
      };
    });
    
    if (spacingAnalysis.error) {
      console.log('❌ Error:', spacingAnalysis.error);
      return;
    }
    
    console.log('📊 CURRENT REPORT PAGE HEADER SPACING:');
    console.log('=====================================');
    console.log(`Back Button → H1:     ${spacingAnalysis.backToH1.toFixed(1)}px`);
    console.log(`H1 → Logo:            ${spacingAnalysis.h1ToLogo.toFixed(1)}px`);
    console.log(`Logo → Subheadline:   ${spacingAnalysis.logoToSub.toFixed(1)}px`);
    console.log(`Subheadline → Address: ${spacingAnalysis.subToAddress.toFixed(1)}px`);
    console.log(`Address → Meta:       ${spacingAnalysis.addressToMeta.toFixed(1)}px`);
    console.log('');
    
    console.log('🎨 CSS CLASSES USED:');
    console.log('====================');
    console.log(`Back Button container: ${spacingAnalysis.cssClasses.backButton}`);
    console.log(`H1:                    ${spacingAnalysis.cssClasses.h1}`);
    console.log(`Logo container:        ${spacingAnalysis.cssClasses.logo}`);
    console.log(`Subheadline:           ${spacingAnalysis.cssClasses.sub}`);
    console.log(`Address:               ${spacingAnalysis.cssClasses.address}`);
    console.log(`Meta:                  ${spacingAnalysis.cssClasses.meta}`);
    console.log('');
    
    console.log('📏 SITE-WIDE SPACING STANDARDS:');
    console.log('===============================');
    console.log('Based on codebase analysis:');
    console.log('• space-y-6 = 24px (common for sections)');
    console.log('• space-y-4 = 16px (common for smaller groups)');
    console.log('• space-y-10 = 40px (large section spacing)');
    console.log('• mt-8 = 32px (medium spacing)');
    console.log('• mt-6 = 24px (standard spacing)');
    console.log('• mt-4 = 16px (small spacing)');
    console.log('• mt-3 = 12px (tight spacing)');
    console.log('');
    
    console.log('🔍 SPACING CONSISTENCY ANALYSIS:');
    console.log('================================');
    
    // Analyze consistency
    const spacings = [
      spacingAnalysis.backToH1,
      spacingAnalysis.h1ToLogo,
      spacingAnalysis.logoToSub,
      spacingAnalysis.subToAddress,
      spacingAnalysis.addressToMeta
    ];
    
    const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    const maxSpacing = Math.max(...spacings);
    const minSpacing = Math.min(...spacings);
    const spacingRange = maxSpacing - minSpacing;
    
    console.log(`Average spacing: ${avgSpacing.toFixed(1)}px`);
    console.log(`Spacing range: ${minSpacing.toFixed(1)}px - ${maxSpacing.toFixed(1)}px (${spacingRange.toFixed(1)}px difference)`);
    console.log('');
    
    // Check if spacings align with site standards
    const standardSpacings = [12, 16, 20, 24, 32, 40];
    console.log('Alignment with site standards:');
    spacings.forEach((spacing, index) => {
      const closestStandard = standardSpacings.reduce((prev, curr) => 
        Math.abs(curr - spacing) < Math.abs(prev - spacing) ? curr : prev
      );
      const deviation = Math.abs(spacing - closestStandard);
      const isConsistent = deviation <= 2; // Allow 2px tolerance
      
      const labels = ['Back→H1', 'H1→Logo', 'Logo→Sub', 'Sub→Address', 'Address→Meta'];
      console.log(`  ${labels[index]}: ${spacing.toFixed(1)}px (closest standard: ${closestStandard}px, ${isConsistent ? '✅' : '❌'} ${deviation.toFixed(1)}px deviation)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

analyzeHeaderSpacing();
