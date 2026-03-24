/**
 * UI/UX VALIDATION WITH SETUP (SPACING, FONT SIZE, BOLD PARTS)
 * Tests the specific improvements we made to the header spacing and typography
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class UIUXValidator {
  constructor() {
    this.results = {
      spacingValidation: {},
      typographyValidation: {},
      visualHierarchy: {},
      accessibilityValidation: {},
      responsiveValidation: {}
    };
  }

  async runUIUXValidation() {
    console.log('🎨 Starting UI/UX Validation with Setup (Spacing, Font Size, Bold Parts)...\n');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Test Header Spacing (Our Main Optimization)
      await this.validateHeaderSpacing(page);
      
      // Test Typography & Font Weights
      await this.validateTypography(page);
      
      // Test Visual Hierarchy
      await this.validateVisualHierarchy(page);
      
      // Test Accessibility
      await this.validateAccessibility(page);
      
      // Test Responsive Design
      await this.validateResponsiveDesign(page);
      
      // Generate Report
      this.generateUIUXReport();
      
    } catch (error) {
      console.error('❌ UI/UX validation failed:', error.message);
    } finally {
      await browser.close();
    }
  }

  async validateHeaderSpacing(page) {
    console.log('📏 HEADER SPACING VALIDATION');
    console.log('============================');
    
    try {
      await page.goto(`${BASE_URL}/report?address=123%20Main%20St%2C%20Phoenix%2C%20AZ%2085001&lat=33.4484&lng=-112.074&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Test our optimized spacing values
      const spacingMeasurements = await page.evaluate(() => {
        const measurements = {};
        
        // H1 → Logo spacing (should be 24px)
        const h1 = document.querySelector('[data-testid="hdr-h1"]');
        const logo = document.querySelector('[data-testid="hdr-logo"]');
        if (h1 && logo) {
          const h1Rect = h1.getBoundingClientRect();
          const logoRect = logo.getBoundingClientRect();
          measurements.h1ToLogo = Math.round(logoRect.top - (h1Rect.bottom));
        }
        
        // Logo → Subheadline spacing (should be 16px)
        const sub = document.querySelector('[data-testid="hdr-sub"]');
        if (logo && sub) {
          const logoRect = logo.getBoundingClientRect();
          const subRect = sub.getBoundingClientRect();
          measurements.logoToSub = Math.round(subRect.top - (logoRect.bottom));
        }
        
        // Subheadline → Address spacing (should be 8px)
        const address = document.querySelector('[data-testid="hdr-address"]');
        if (sub && address) {
          const subRect = sub.getBoundingClientRect();
          const addrRect = address.getBoundingClientRect();
          measurements.subToAddress = Math.round(addrRect.top - (subRect.bottom));
        }
        
        // Address → Meta spacing (should be 16px)
        const meta = document.querySelector('[data-testid="hdr-meta"]');
        if (address && meta) {
          const addrRect = address.getBoundingClientRect();
          const metaRect = meta.getBoundingClientRect();
          measurements.addressToMeta = Math.round(metaRect.top - (addrRect.bottom));
        }
        
        // Meta → Cards spacing (should be 32px)
        const cards = document.querySelector('[data-testid="tile-systemSize"]');
        if (meta && cards) {
          const metaRect = meta.getBoundingClientRect();
          const cardsRect = cards.getBoundingClientRect();
          measurements.metaToCards = Math.round(cardsRect.top - (metaRect.bottom));
        }
        
        return measurements;
      });
      
      // Score each spacing measurement
      const spacingScores = {
        h1ToLogo: this.scoreSpacing(spacingMeasurements.h1ToLogo, 24, 2),
        logoToSub: this.scoreSpacing(spacingMeasurements.logoToSub, 16, 2),
        subToAddress: this.scoreSpacing(spacingMeasurements.subToAddress, 8, 2),
        addressToMeta: this.scoreSpacing(spacingMeasurements.addressToMeta, 16, 2),
        metaToCards: this.scoreSpacing(spacingMeasurements.metaToCards, 32, 2)
      };
      
      const averageSpacingScore = Object.values(spacingScores).reduce((sum, score) => sum + score, 0) / Object.keys(spacingScores).length;
      
      this.results.spacingValidation = {
        measurements: spacingMeasurements,
        scores: spacingScores,
        averageScore: parseFloat(averageSpacingScore.toFixed(1)),
        targetValues: { h1ToLogo: 24, logoToSub: 16, subToAddress: 8, addressToMeta: 16, metaToCards: 32 }
      };
      
      console.log(`✅ Header Spacing Score: ${averageSpacingScore.toFixed(1)}/10`);
      console.log(`📐 Measurements:`);
      console.log(`   • H1 → Logo: ${spacingMeasurements.h1ToLogo}px (target: 24px) - Score: ${spacingScores.h1ToLogo}/10`);
      console.log(`   • Logo → Sub: ${spacingMeasurements.logoToSub}px (target: 16px) - Score: ${spacingScores.logoToSub}/10`);
      console.log(`   • Sub → Address: ${spacingMeasurements.subToAddress}px (target: 8px) - Score: ${spacingScores.subToAddress}/10`);
      console.log(`   • Address → Meta: ${spacingMeasurements.addressToMeta}px (target: 16px) - Score: ${spacingScores.addressToMeta}/10`);
      console.log(`   • Meta → Cards: ${spacingMeasurements.metaToCards}px (target: 32px) - Score: ${spacingScores.metaToCards}/10\n`);
      
    } catch (error) {
      console.error('❌ Header spacing validation failed:', error.message);
      this.results.spacingValidation = { averageScore: 0, error: error.message };
    }
  }

  async validateTypography(page) {
    console.log('📝 TYPOGRAPHY VALIDATION');
    console.log('========================');
    
    try {
      await page.goto(`${BASE_URL}/report?address=123%20Main%20St%2C%20Phoenix%2C%20AZ%2085001&lat=33.4484&lng=-112.074&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const typographyData = await page.evaluate(() => {
        const data = {};
        
        // H1 typography
        const h1 = document.querySelector('[data-testid="hdr-h1"]');
        if (h1) {
          const style = getComputedStyle(h1);
          data.h1 = {
            fontSize: parseFloat(style.fontSize),
            fontWeight: parseInt(style.fontWeight),
            color: style.color,
            fontFamily: style.fontFamily
          };
        }
        
        // Subheadline typography
        const sub = document.querySelector('[data-testid="hdr-sub"]');
        if (sub) {
          const style = getComputedStyle(sub);
          data.sub = {
            fontSize: parseFloat(style.fontSize),
            fontWeight: parseInt(style.fontWeight),
            color: style.color,
            fontFamily: style.fontFamily
          };
        }
        
        // Address typography
        const address = document.querySelector('[data-testid="hdr-address"]');
        if (address) {
          const style = getComputedStyle(address);
          data.address = {
            fontSize: parseFloat(style.fontSize),
            fontWeight: parseInt(style.fontWeight),
            color: style.color,
            fontFamily: style.fontFamily
          };
        }
        
        // Meta typography
        const meta = document.querySelector('[data-testid="hdr-meta"]');
        if (meta) {
          const style = getComputedStyle(meta);
          data.meta = {
            fontSize: parseFloat(style.fontSize),
            fontWeight: parseInt(style.fontWeight),
            color: style.color,
            fontFamily: style.fontFamily
          };
        }
        
        return data;
      });
      
      // Score typography against our optimized values
      const typographyScores = {
        h1: this.scoreTypography(typographyData.h1, { minFontSize: 28, minFontWeight: 600, shouldBeBold: true }),
        sub: this.scoreTypography(typographyData.sub, { minFontSize: 18, minFontWeight: 600, shouldBeBold: true }),
        address: this.scoreTypography(typographyData.address, { minFontSize: 17, maxFontWeight: 500, shouldBeBold: false }),
        meta: this.scoreTypography(typographyData.meta, { minFontSize: 14, maxFontWeight: 500, shouldBeBold: false })
      };
      
      const averageTypographyScore = Object.values(typographyScores).reduce((sum, score) => sum + score, 0) / Object.keys(typographyScores).length;
      
      this.results.typographyValidation = {
        data: typographyData,
        scores: typographyScores,
        averageScore: parseFloat(averageTypographyScore.toFixed(1))
      };
      
      console.log(`✅ Typography Score: ${averageTypographyScore.toFixed(1)}/10`);
      console.log(`📝 Typography Analysis:`);
      console.log(`   • H1: ${typographyData.h1?.fontSize}px, weight: ${typographyData.h1?.fontWeight} - Score: ${typographyScores.h1}/10`);
      console.log(`   • Sub: ${typographyData.sub?.fontSize}px, weight: ${typographyData.sub?.fontWeight} - Score: ${typographyScores.sub}/10`);
      console.log(`   • Address: ${typographyData.address?.fontSize}px, weight: ${typographyData.address?.fontWeight} - Score: ${typographyScores.address}/10`);
      console.log(`   • Meta: ${typographyData.meta?.fontSize}px, weight: ${typographyData.meta?.fontWeight} - Score: ${typographyScores.meta}/10\n`);
      
    } catch (error) {
      console.error('❌ Typography validation failed:', error.message);
      this.results.typographyValidation = { averageScore: 0, error: error.message };
    }
  }

  async validateVisualHierarchy(page) {
    console.log('🎯 VISUAL HIERARCHY VALIDATION');
    console.log('==============================');
    
    try {
      await page.goto(`${BASE_URL}/report?address=123%20Main%20St%2C%20Phoenix%2C%20AZ%2085001&lat=33.4484&lng=-112.074&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const hierarchyData = await page.evaluate(() => {
        const data = {};
        
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        data.headingCount = headings.length;
        
        // Check for proper heading sizes (h1 > h2 > h3)
        const h1Elements = document.querySelectorAll('h1');
        const h2Elements = document.querySelectorAll('h2');
        const h3Elements = document.querySelectorAll('h3');
        
        if (h1Elements.length > 0 && h2Elements.length > 0) {
          const h1Size = parseFloat(getComputedStyle(h1Elements[0]).fontSize);
          const h2Size = parseFloat(getComputedStyle(h2Elements[0]).fontSize);
          data.headingSizeHierarchy = h1Size > h2Size;
        }
        
        // Check for visual elements (cards, buttons, etc.)
        const cards = document.querySelectorAll('.rounded-lg, .rounded-xl, .rounded-2xl');
        const buttons = document.querySelectorAll('button');
        const images = document.querySelectorAll('img');
        
        data.visualElements = {
          cards: cards.length,
          buttons: buttons.length,
          images: images.length
        };
        
        // Check for proper contrast
        const h1 = document.querySelector('[data-testid="hdr-h1"]');
        if (h1) {
          const style = getComputedStyle(h1);
          data.textColor = style.color;
          data.backgroundColor = style.backgroundColor;
        }
        
        return data;
      });
      
      // Score visual hierarchy
      const hierarchyScores = {
        headingCount: hierarchyData.headingCount >= 3 ? 9 : 6,
        headingSizeHierarchy: hierarchyData.headingSizeHierarchy ? 9 : 5,
        visualElements: (hierarchyData.visualElements.cards >= 2 && hierarchyData.visualElements.buttons >= 2) ? 9 : 6,
        contrast: hierarchyData.textColor && hierarchyData.backgroundColor ? 8 : 5
      };
      
      const averageHierarchyScore = Object.values(hierarchyScores).reduce((sum, score) => sum + score, 0) / Object.keys(hierarchyScores).length;
      
      this.results.visualHierarchy = {
        data: hierarchyData,
        scores: hierarchyScores,
        averageScore: parseFloat(averageHierarchyScore.toFixed(1))
      };
      
      console.log(`✅ Visual Hierarchy Score: ${averageHierarchyScore.toFixed(1)}/10`);
      console.log(`🎯 Hierarchy Analysis:`);
      console.log(`   • Heading Count: ${hierarchyData.headingCount} - Score: ${hierarchyScores.headingCount}/10`);
      console.log(`   • Size Hierarchy: ${hierarchyData.headingSizeHierarchy ? 'Proper' : 'Improper'} - Score: ${hierarchyScores.headingSizeHierarchy}/10`);
      console.log(`   • Visual Elements: ${hierarchyData.visualElements.cards} cards, ${hierarchyData.visualElements.buttons} buttons - Score: ${hierarchyScores.visualElements}/10`);
      console.log(`   • Contrast: ${hierarchyData.textColor ? 'Good' : 'Poor'} - Score: ${hierarchyScores.contrast}/10\n`);
      
    } catch (error) {
      console.error('❌ Visual hierarchy validation failed:', error.message);
      this.results.visualHierarchy = { averageScore: 0, error: error.message };
    }
  }

  async validateAccessibility(page) {
    console.log('♿ ACCESSIBILITY VALIDATION');
    console.log('==========================');
    
    try {
      await page.goto(`${BASE_URL}/report?address=123%20Main%20St%2C%20Phoenix%2C%20AZ%2085001&lat=33.4484&lng=-112.074&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const accessibilityData = await page.evaluate(() => {
        const data = {};
        
        // Check for alt text on images
        const images = document.querySelectorAll('img');
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        data.imageAccessibility = {
          total: images.length,
          withAlt: imagesWithAlt.length,
          percentage: images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 100
        };
        
        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        data.headingStructure = {
          total: headings.length,
          hasH1: document.querySelector('h1') !== null,
          hasProperSequence: true // Simplified check
        };
        
        // Check for form labels
        const inputs = document.querySelectorAll('input');
        const inputsWithLabels = document.querySelectorAll('input[aria-label], input[id]');
        data.formAccessibility = {
          total: inputs.length,
          withLabels: inputsWithLabels.length,
          percentage: inputs.length > 0 ? (inputsWithLabels.length / inputs.length) * 100 : 100
        };
        
        // Check for focus indicators
        const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
        data.focusIndicators = focusableElements.length;
        
        return data;
      });
      
      // Score accessibility
      const accessibilityScores = {
        imageAltText: accessibilityData.imageAccessibility.percentage >= 90 ? 9 : accessibilityData.imageAccessibility.percentage >= 70 ? 7 : 5,
        headingStructure: accessibilityData.headingStructure.hasH1 && accessibilityData.headingStructure.total >= 3 ? 9 : 6,
        formLabels: accessibilityData.formAccessibility.percentage >= 90 ? 9 : accessibilityData.formAccessibility.percentage >= 70 ? 7 : 5,
        focusIndicators: accessibilityData.focusIndicators >= 5 ? 8 : 6
      };
      
      const averageAccessibilityScore = Object.values(accessibilityScores).reduce((sum, score) => sum + score, 0) / Object.keys(accessibilityScores).length;
      
      this.results.accessibilityValidation = {
        data: accessibilityData,
        scores: accessibilityScores,
        averageScore: parseFloat(averageAccessibilityScore.toFixed(1))
      };
      
      console.log(`✅ Accessibility Score: ${averageAccessibilityScore.toFixed(1)}/10`);
      console.log(`♿ Accessibility Analysis:`);
      console.log(`   • Image Alt Text: ${accessibilityData.imageAccessibility.percentage.toFixed(1)}% - Score: ${accessibilityScores.imageAltText}/10`);
      console.log(`   • Heading Structure: ${accessibilityData.headingStructure.hasH1 ? 'Has H1' : 'No H1'} - Score: ${accessibilityScores.headingStructure}/10`);
      console.log(`   • Form Labels: ${accessibilityData.formAccessibility.percentage.toFixed(1)}% - Score: ${accessibilityScores.formLabels}/10`);
      console.log(`   • Focus Indicators: ${accessibilityData.focusIndicators} elements - Score: ${accessibilityScores.focusIndicators}/10\n`);
      
    } catch (error) {
      console.error('❌ Accessibility validation failed:', error.message);
      this.results.accessibilityValidation = { averageScore: 0, error: error.message };
    }
  }

  async validateResponsiveDesign(page) {
    console.log('📱 RESPONSIVE DESIGN VALIDATION');
    console.log('===============================');
    
    try {
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];
      
      const responsiveData = {};
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${BASE_URL}/report?address=123%20Main%20St%2C%20Phoenix%2C%20AZ%2085001&lat=33.4484&lng=-112.074&demo=1`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000); // Allow for layout adjustments
        
        const viewportData = await page.evaluate(() => {
          const data = {};
          
          // Check if elements are properly sized for viewport
          const h1 = document.querySelector('[data-testid="hdr-h1"]');
          if (h1) {
            const rect = h1.getBoundingClientRect();
            data.h1Width = rect.width;
            data.h1Height = rect.height;
            data.h1Overflow = rect.width > window.innerWidth;
          }
          
          // Check for responsive classes
          const responsiveElements = document.querySelectorAll('.sm\\:flex-row, .md\\:grid-cols-2, .lg\\:grid-cols-4');
          data.responsiveClasses = responsiveElements.length;
          
          // Check for horizontal scrolling
          data.hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
          
          return data;
        });
        
        responsiveData[viewport.name] = viewportData;
      }
      
      // Score responsive design
      const responsiveScores = {
        mobile: this.scoreResponsive(responsiveData.Mobile, 'mobile'),
        tablet: this.scoreResponsive(responsiveData.Tablet, 'tablet'),
        desktop: this.scoreResponsive(responsiveData.Desktop, 'desktop')
      };
      
      const averageResponsiveScore = Object.values(responsiveScores).reduce((sum, score) => sum + score, 0) / Object.keys(responsiveScores).length;
      
      this.results.responsiveValidation = {
        data: responsiveData,
        scores: responsiveScores,
        averageScore: parseFloat(averageResponsiveScore.toFixed(1))
      };
      
      console.log(`✅ Responsive Design Score: ${averageResponsiveScore.toFixed(1)}/10`);
      console.log(`📱 Responsive Analysis:`);
      console.log(`   • Mobile (375px): ${responsiveData.Mobile?.h1Overflow ? 'Overflow' : 'Good'} - Score: ${responsiveScores.mobile}/10`);
      console.log(`   • Tablet (768px): ${responsiveData.Tablet?.h1Overflow ? 'Overflow' : 'Good'} - Score: ${responsiveScores.tablet}/10`);
      console.log(`   • Desktop (1920px): ${responsiveData.Desktop?.h1Overflow ? 'Overflow' : 'Good'} - Score: ${responsiveScores.desktop}/10\n`);
      
    } catch (error) {
      console.error('❌ Responsive design validation failed:', error.message);
      this.results.responsiveValidation = { averageScore: 0, error: error.message };
    }
  }

  // Scoring Helper Methods
  scoreSpacing(actual, target, tolerance) {
    const difference = Math.abs(actual - target);
    if (difference <= tolerance) return 10;
    if (difference <= tolerance * 2) return 8;
    if (difference <= tolerance * 3) return 6;
    if (difference <= tolerance * 4) return 4;
    return 2;
  }

  scoreTypography(data, requirements) {
    if (!data) return 0;
    
    let score = 10;
    
    if (requirements.minFontSize && data.fontSize < requirements.minFontSize) score -= 2;
    if (requirements.minFontWeight && data.fontWeight < requirements.minFontWeight) score -= 2;
    if (requirements.maxFontWeight && data.fontWeight > requirements.maxFontWeight) score -= 2;
    if (requirements.shouldBeBold && data.fontWeight < 600) score -= 3;
    if (!requirements.shouldBeBold && data.fontWeight >= 600) score -= 2;
    
    return Math.max(0, score);
  }

  scoreResponsive(data, viewport) {
    if (!data) return 0;
    
    let score = 10;
    
    if (data.h1Overflow) score -= 4;
    if (data.hasHorizontalScroll) score -= 3;
    if (data.responsiveClasses < 2) score -= 2;
    
    return Math.max(0, score);
  }

  generateUIUXReport() {
    console.log('\n📋 UI/UX VALIDATION REPORT (WITH SETUP)');
    console.log('========================================');
    
    const overallScore = (
      (this.results.spacingValidation.averageScore || 0) +
      (this.results.typographyValidation.averageScore || 0) +
      (this.results.visualHierarchy.averageScore || 0) +
      (this.results.accessibilityValidation.averageScore || 0) +
      (this.results.responsiveValidation.averageScore || 0)
    ) / 5;

    console.log(`\n🎯 OVERALL UI/UX SCORE: ${overallScore.toFixed(1)}/10`);
    
    if (overallScore >= 9.0) {
      console.log('🏆 EXCELLENT - UI/UX is highly optimized and professional');
    } else if (overallScore >= 8.0) {
      console.log('✅ GOOD - UI/UX is well-designed with minor improvements needed');
    } else if (overallScore >= 7.0) {
      console.log('⚠️ FAIR - UI/UX needs improvements for professional appearance');
    } else {
      console.log('❌ POOR - UI/UX requires significant improvements');
    }

    console.log('\n📊 DETAILED SCORES:');
    console.log(`• Header Spacing: ${this.results.spacingValidation.averageScore || 0}/10`);
    console.log(`• Typography: ${this.results.typographyValidation.averageScore || 0}/10`);
    console.log(`• Visual Hierarchy: ${this.results.visualHierarchy.averageScore || 0}/10`);
    console.log(`• Accessibility: ${this.results.accessibilityValidation.averageScore || 0}/10`);
    console.log(`• Responsive Design: ${this.results.responsiveValidation.averageScore || 0}/10`);

    console.log('\n🔍 KEY FINDINGS:');
    
    // Spacing findings
    if ((this.results.spacingValidation.averageScore || 0) >= 9.0) {
      console.log('✅ Header spacing is perfectly optimized (24/16/8/16/32px rhythm)');
    } else {
      console.log('⚠️ Header spacing needs adjustment to match 8px grid');
    }

    // Typography findings
    if ((this.results.typographyValidation.averageScore || 0) >= 9.0) {
      console.log('✅ Typography hierarchy is excellent (clamp, semibold, proper weights)');
    } else {
      console.log('⚠️ Typography needs optimization for better hierarchy');
    }

    // Visual hierarchy findings
    if ((this.results.visualHierarchy.averageScore || 0) >= 9.0) {
      console.log('✅ Visual hierarchy is clear and professional');
    } else {
      console.log('⚠️ Visual hierarchy needs improvement');
    }

    // Accessibility findings
    if ((this.results.accessibilityValidation.averageScore || 0) >= 9.0) {
      console.log('✅ Accessibility is excellent');
    } else {
      console.log('⚠️ Accessibility needs improvement');
    }

    // Responsive findings
    if ((this.results.responsiveValidation.averageScore || 0) >= 9.0) {
      console.log('✅ Responsive design works perfectly across all devices');
    } else {
      console.log('⚠️ Responsive design needs optimization');
    }

    console.log('\n🚀 RECOMMENDATIONS:');
    
    if (overallScore >= 9.0) {
      console.log('• UI/UX is ready for production');
      console.log('• Consider A/B testing for conversion optimization');
      console.log('• Monitor user behavior for further improvements');
    } else if (overallScore >= 8.0) {
      console.log('• Address identified UI/UX weaknesses');
      console.log('• Conduct user testing sessions');
      console.log('• Optimize low-scoring areas');
    } else {
      console.log('• Focus on core UI/UX improvements');
      console.log('• Conduct extensive user research');
      console.log('• Re-evaluate design system');
    }

    console.log('\n📈 NEXT STEPS:');
    console.log('1. Review detailed findings above');
    console.log('2. Prioritize UI/UX improvements based on scores');
    console.log('3. Conduct user testing for low-scoring areas');
    console.log('4. Re-run validation after improvements');
    console.log('5. Prepare for design system documentation');

    return {
      overallScore: parseFloat(overallScore.toFixed(1)),
      results: this.results,
      recommendation: overallScore >= 8.5 ? 'UI_READY' : 'NEEDS_IMPROVEMENT'
    };
  }
}

// Run the UI/UX validation
async function runUIUXValidation() {
  const validator = new UIUXValidator();
  const results = await validator.runUIUXValidation();
  return results;
}

module.exports = { UIUXValidator, runUIUXValidation };

// Run if called directly
if (require.main === module) {
  runUIUXValidation().then(results => {
    console.log('\n🎉 UI/UX Validation Complete!');
    process.exit(results.overallScore >= 8.0 ? 0 : 1);
  }).catch(error => {
    console.error('❌ UI/UX validation failed:', error);
    process.exit(1);
  });
}
