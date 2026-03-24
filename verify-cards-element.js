const { chromium } = require('playwright');

async function verifyCardsElement() {
  console.log('🔍 Verifying which element we are measuring...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    const info = await page.evaluate(() => {
      // Get the cards element
      const cards = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      
      if (!cards) {
        return { error: 'Cards not found' };
      }
      
      // Get the first card to see what's inside
      const firstCard = cards.querySelector('div');
      const firstCardText = firstCard ? firstCard.textContent?.substring(0, 100) : 'No text';
      
      // Count how many cards
      const cardCount = cards.querySelectorAll(':scope > div').length;
      
      // Get the grid classes
      const gridClasses = cards.className;
      
      // Check if this contains "System Size"
      const containsSystemSize = cards.textContent?.includes('System Size');
      const containsAnnualProduction = cards.textContent?.includes('Annual Production');
      
      return {
        cardCount,
        gridClasses,
        firstCardText,
        containsSystemSize,
        containsAnnualProduction,
        fullText: cards.textContent?.substring(0, 200)
      };
    });
    
    console.log('📊 Element Information:');
    console.log('======================');
    console.log('Number of cards:', info.cardCount);
    console.log('Grid classes:', info.gridClasses);
    console.log('Contains "System Size":', info.containsSystemSize);
    console.log('Contains "Annual Production":', info.containsAnnualProduction);
    console.log('First card text:', info.firstCardText);
    console.log('Full text preview:', info.fullText);
    console.log('');
    
    if (info.containsSystemSize && info.containsAnnualProduction) {
      console.log('✅ YES - This is the correct element (the 4 metric tiles)');
    } else {
      console.log('❌ This might be the wrong element');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

verifyCardsElement();
