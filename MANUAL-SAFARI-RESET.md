# Manual Safari Demo Reset Instructions

If the automated reset doesn't work, here's how to manually reset demo runs in Safari:

## Method 1: Browser Console (Recommended)

1. **Open Safari**
2. **Go to:** `https://sunspire-web-app.vercel.app/?company=tesla&demo=1`
3. **Open Developer Tools:**
   - Press `Cmd + Option + I` (Mac)
   - Or go to Safari menu → Develop → Show Web Inspector
4. **Click on the "Console" tab**
5. **Copy and paste this code:**
   ```javascript
   // Clear all localStorage
   localStorage.clear();
   
   // Set unlimited demo data
   const brandData = {
     enabled: true,
     brand: "tesla",
     primary: "#CC0000",
     logo: null,
     domain: "tesla",
     city: null,
     rep: null,
     firstName: null,
     role: null,
     expireDays: 7,
     runs: 999, // Unlimited
     blur: true,
     pilot: false,
     isDemo: true,
     _timestamp: Date.now()
   };
   
   localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
   
   console.log("✅ Demo runs reset in Safari - unlimited access granted!");
   ```
6. **Press Enter**
7. **Refresh the page**
8. **Test the Report page** - it should now work without quota restrictions

## Method 2: Reset Tool Page

1. **Open Safari**
2. **Go to:** `https://sunspire-web-app.vercel.app/demo-reset.html`
3. **Click "🔄 Reset Demo Runs"**
4. **Click "🚀 Go to Tesla Demo"**
5. **Test the Report page**

## Method 3: Clear Safari Data

1. **Open Safari**
2. **Go to Safari menu → Preferences**
3. **Click "Privacy" tab**
4. **Click "Manage Website Data..."**
5. **Search for "sunspire-web-app.vercel.app"**
6. **Click "Remove"**
7. **Refresh the Tesla demo page**

## Verification

After resetting, you should see:
- ✅ No "Demo quota exceeded" messages
- ✅ Report page loads completely
- ✅ All demo features work
- ✅ Tesla red colors display correctly

## Why This Happens

- **localStorage is browser-specific** - each browser stores data separately
- **Safari has stricter privacy settings** that can affect localStorage
- **WebKit engine differences** can cause localStorage behavior variations

## Prevention

The new browser sync system should prevent this in the future by:
- Automatically syncing localStorage across browser tabs
- Providing universal reset functions
- Ensuring consistency across all browsers
