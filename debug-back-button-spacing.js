const { chromium } = require('playwright');

async function debugBackButtonSpacing() {
  console.log('🔍 Debugging back button spacing issue...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const debugInfo = await page.evaluate(() => {
      // Get back button and H1 elements
      const backButton = document.querySelector('[data-testid="back-home-link"]');
      const h1 = document.querySelector('[data-testid="hdr-h1"]');
      
      if (!backButton || !h1) {
        return { error: 'Elements not found' };
      }
      
      // Get the container hierarchy
      const backContainer = backButton.closest('div');
      const backContainerParent = backContainer?.parentElement;
      const backContainerGrandParent = backContainerParent?.parentElement;
      
      // Get H1 container hierarchy
      const h1Container = h1.closest('section');
      const h1ContainerParent = h1Container?.parentElement;
      const h1ContainerGrandParent = h1ContainerParent?.parentElement;
      
      // Get computed styles for the back button container
      const backContainerStyles = backContainer ? getComputedStyle(backContainer) : null;
      
      // Check for any elements between back button and H1
      const elementsBetween = [];
      let current = backButton;
      while (current && current !== h1) {
        current = current.nextElementSibling;
        if (current) {
          elementsBetween.push({
            tagName: current.tagName,
            className: current.className,
            id: current.id,
            textContent: current.textContent?.substring(0, 50)
          });
        }
      }
      
      return {
        backContainer: {
          className: backContainer?.className,
          id: backContainer?.id,
          marginBottom: backContainerStyles?.marginBottom,
          paddingBottom: backContainerStyles?.paddingBottom,
          height: backContainerStyles?.height
        },
        backContainerParent: {
          className: backContainerParent?.className,
          id: backContainerParent?.id
        },
        backContainerGrandParent: {
          className: backContainerGrandParent?.className,
          id: backContainerGrandParent?.id
        },
        h1Container: {
          className: h1Container?.className,
          id: h1Container?.id
        },
        h1ContainerParent: {
          className: h1ContainerParent?.className,
          id: h1ContainerParent?.id
        },
        elementsBetween: elementsBetween,
        // Check for any CSS that might be affecting spacing
        potentialSpacingSources: {
          backButtonMarginBottom: getComputedStyle(backButton).marginBottom,
          h1MarginTop: getComputedStyle(h1).marginTop,
          h1ContainerMarginTop: getComputedStyle(h1Container).marginTop,
          h1ContainerPaddingTop: getComputedStyle(h1Container).paddingTop
        }
      };
    });
    
    if (debugInfo.error) {
      console.log('❌ Error:', debugInfo.error);
      return;
    }
    
    console.log('🏗️  CONTAINER STRUCTURE:');
    console.log('========================');
    console.log('Back Button Container:');
    console.log(`  Class: ${debugInfo.backContainer.className}`);
    console.log(`  ID: ${debugInfo.backContainer.id}`);
    console.log(`  margin-bottom: ${debugInfo.backContainer.marginBottom}`);
    console.log(`  padding-bottom: ${debugInfo.backContainer.paddingBottom}`);
    console.log(`  height: ${debugInfo.backContainer.height}`);
    console.log('');
    
    console.log('Back Button Container Parent:');
    console.log(`  Class: ${debugInfo.backContainerParent.className}`);
    console.log(`  ID: ${debugInfo.backContainerParent.id}`);
    console.log('');
    
    console.log('Back Button Container Grandparent:');
    console.log(`  Class: ${debugInfo.backContainerGrandParent.className}`);
    console.log(`  ID: ${debugInfo.backContainerGrandParent.id}`);
    console.log('');
    
    console.log('H1 Container:');
    console.log(`  Class: ${debugInfo.h1Container.className}`);
    console.log(`  ID: ${debugInfo.h1Container.id}`);
    console.log('');
    
    console.log('H1 Container Parent:');
    console.log(`  Class: ${debugInfo.h1ContainerParent.className}`);
    console.log(`  ID: ${debugInfo.h1ContainerParent.id}`);
    console.log('');
    
    console.log('🎯 SPACING SOURCES:');
    console.log('===================');
    console.log(`Back button margin-bottom: ${debugInfo.potentialSpacingSources.backButtonMarginBottom}`);
    console.log(`H1 margin-top: ${debugInfo.potentialSpacingSources.h1MarginTop}`);
    console.log(`H1 container margin-top: ${debugInfo.potentialSpacingSources.h1ContainerMarginTop}`);
    console.log(`H1 container padding-top: ${debugInfo.potentialSpacingSources.h1ContainerPaddingTop}`);
    console.log('');
    
    console.log('📋 ELEMENTS BETWEEN BACK BUTTON AND H1:');
    console.log('=======================================');
    if (debugInfo.elementsBetween.length === 0) {
      console.log('No elements found between back button and H1');
    } else {
      debugInfo.elementsBetween.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - Class: "${el.className}" - ID: "${el.id}" - Text: "${el.textContent}..."`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugBackButtonSpacing();
