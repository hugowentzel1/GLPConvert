# 🎨 Cold Email Branding System - Complete Guide

## Overview

Sunspire has a **fully automated branding system** that extracts company colors and logos automatically for your cold email demos. Here's exactly how it works and what you need to do.

---

## 🚀 How It Works Right Now

### **Automatic Branding System**

When someone clicks your demo link, Sunspire automatically:

1. **Extracts the company name** from the URL parameter
2. **Looks up the brand color** from a built-in database
3. **Fetches the logo** from Clearbit's API
4. **Applies branding** across the entire demo

### **URL Structure for Cold Emails**

```
https://sunspire-web-app.vercel.app/?company=COMPANY_NAME&demo=1
```

That's it! Just the company name is enough.

---

## 📋 What You Need for Cold Emails

### **Option 1: Simplest (Recommended)**
Just use the company name - everything else is automatic:

```
https://sunspire-web-app.vercel.app/?company=Tesla&demo=1
```

**What happens automatically:**
- ✅ Company name: "Tesla"
- ✅ Brand color: #CC0000 (Tesla red) - **pulled from built-in database**
- ✅ Logo: **Auto-fetched from Clearbit** (`https://logo.clearbit.com/tesla.com`)
- ✅ Demo mode: Enabled (2 runs, blur effects)
- ✅ Expiration: 7 days

### **Option 2: Custom Color (If Not in Database)**
If the company isn't in the built-in database, you can specify a color:

```
https://sunspire-web-app.vercel.app/?company=AcmeSolar&demo=1&brandColor=%23FF6600
```

**What happens:**
- ✅ Company name: "AcmeSolar"
- ✅ Brand color: #FF6600 (your specified color)
- ✅ Logo: **Auto-fetched from Clearbit** (`https://logo.clearbit.com/acmesolar.com`)

### **Option 3: Full Custom (If Clearbit Doesn't Have Logo)**
For complete control:

```
https://sunspire-web-app.vercel.app/?company=AcmeSolar&demo=1&brandColor=%23FF6600&logo=https%3A%2F%2Facmesolar.com%2Flogo.png
```

**What happens:**
- ✅ Company name: "AcmeSolar"
- ✅ Brand color: #FF6600
- ✅ Logo: Your specified logo URL

---

## 🎨 Built-In Company Database

### **Currently Supported (Colors Auto-Applied)**

The system **already knows** these companies and their brand colors:

| Company | Color | Logo Source |
|---------|-------|-------------|
| **Meta/Facebook** | #1877F2 (blue) | Clearbit |
| **Apple** | #0071E3 (blue) | Clearbit |
| **Amazon** | #FF9900 (orange) | Clearbit |
| **Google** | #4285F4 (blue) | Clearbit |
| **Microsoft** | #00A4EF (blue) | Clearbit |
| **Netflix** | #E50914 (red) | Clearbit |
| **Spotify** | #1DB954 (green) | Clearbit |
| **Twitter** | #1DA1F2 (blue) | Clearbit |
| **LinkedIn** | #0A66C2 (blue) | Clearbit |
| **Tesla** | #CC0000 (red) | Clearbit |
| **Zillow** | #006AFF (blue) | Clearbit |
| **Redfin** | #D21F3C (red) | Clearbit |
| **Chase** | #117ACA (blue) | Clearbit |
| **Wells Fargo** | #D71E28 (red) | Clearbit |

**Plus ~80 more companies** including:
- Solar companies (SunPower, SunRun, Vivint Solar, etc.)
- Energy companies (BP, Shell, Chevron, etc.)
- Real estate (Home Depot, Realtor.com, etc.)
- Tech (Uber, Lyft, Slack, Discord, etc.)
- Food (Starbucks, McDonald's, Coca-Cola, etc.)
- Retail (Target, Best Buy, etc.)

### **Adding New Companies**

To add a new company to the database, edit `lib/brandTheme.ts`:

```typescript
const map: Record<string, string> = {
  // ... existing companies ...
  "acmesolar": "#FF6600",
  "sunshinehomes": "#FDB913",
  // Add more here
};
```

---

## 🖼️ Logo System

### **How Logos Are Fetched**

1. **Clearbit API (Primary)**: `https://logo.clearbit.com/DOMAIN.com`
   - Works for 95% of established companies
   - High-quality, professional logos
   - Automatically handles retina displays

2. **Custom URL (Fallback)**: Use `&logo=URL` parameter
   - For companies not in Clearbit
   - For specific logo variants

3. **Auto-Matching (Built-In)**: For major brands, the system knows their domains
   - "Google" → `google.com`
   - "Wells Fargo" → `wellsfargo.com`
   - "Bank of America" → `bankofamerica.com`

### **Logo Resolution Priority**

```
1. URL parameter (?logo=...) [HIGHEST]
2. Clearbit auto-fetch (logo.clearbit.com/COMPANY.com)
3. Built-in brand mapping (for known companies)
4. Fallback: Generic company icon [LOWEST]
```

---

## 📧 Cold Email URL Examples

### **Solar Companies**

```
SunPower: 
https://sunspire-web-app.vercel.app/?company=SunPower&demo=1

Vivint Solar:
https://sunspire-web-app.vercel.app/?company=Vivint&demo=1

Local Solar Co (custom):
https://sunspire-web-app.vercel.app/?company=LocalSolar&demo=1&brandColor=%23FF6600
```

### **Real Estate**

```
Zillow Agent:
https://sunspire-web-app.vercel.app/?company=Zillow&demo=1

Redfin Agent:
https://sunspire-web-app.vercel.app/?company=Redfin&demo=1

Local Realtor:
https://sunspire-web-app.vercel.app/?company=JohnDoeRealty&demo=1&brandColor=%234A90E2
```

### **Generic Solar Installer**

```
Small local company with no online presence:
https://sunspire-web-app.vercel.app/?company=AcmeSolar&demo=1&brandColor=%23FF6600&logo=https%3A%2F%2Facmesolar.com%2Flogo.png
```

---

## 🎯 Cold Email Best Practices

### **1. Use the Company Name**
```
Subject: [Their Company Name] - Solar Intelligence Platform Demo

Hi [Name],

I created a branded demo specifically for [Their Company]:
https://sunspire-web-app.vercel.app/?company=[TheirCompany]&demo=1
```

### **2. Pre-Check the Branding**
Before sending, visit the URL yourself to verify:
- ✅ Company name displays correctly
- ✅ Brand color looks right
- ✅ Logo appears (or add custom logo)

### **3. Personalization Tips**
Add optional parameters for extra personalization:

```
Add recipient's name:
?company=Tesla&demo=1&firstName=John

Add city/location:
?company=Tesla&demo=1&city=Austin

Add rep name:
?company=Tesla&demo=1&rep=Sarah

Full example:
https://sunspire-web-app.vercel.app/?company=Tesla&demo=1&firstName=John&city=Austin&rep=Sarah
```

---

## 🔧 Technical Details

### **URL Parameter Reference**

| Parameter | Required | Example | Purpose |
|-----------|----------|---------|---------|
| `company` | ✅ YES | `Tesla` | Company name (triggers branding) |
| `demo` | ✅ YES | `1` | Enables demo mode (2 runs, blur) |
| `brandColor` | ⚪ Optional | `%23FF6600` | Custom brand color (URL-encoded hex) |
| `logo` | ⚪ Optional | `https%3A%2F%2F...` | Custom logo URL (URL-encoded) |
| `firstName` | ⚪ Optional | `John` | Recipient first name |
| `city` | ⚪ Optional | `Austin` | City/location |
| `rep` | ⚪ Optional | `Sarah` | Sales rep name |
| `expire` | ⚪ Optional | `7` | Days until demo expires (default: 7) |

### **Color Format**
- Use hex colors: `#FF6600`
- **Must be URL-encoded**: `%23FF6600` (# becomes %23)
- Can also use `primary` instead of `brandColor`

### **Logo Format**
- Must be URL-encoded: `https://...` → `https%3A%2F%2F...`
- Supports: PNG, JPG, SVG
- Recommended: Square format, min 200x200px

---

## 🎨 Branding Files Location

### **To Modify Branding System:**

1. **Add/edit company colors**: `lib/brandTheme.ts`
   ```typescript
   const map: Record<string, string> = {
     "newcompany": "#FF6600",
   };
   ```

2. **Add logo mapping**: `app/report/page.tsx` (line ~336)
   ```typescript
   if (brandLower.includes('newcompany')) 
     return 'https://logo.clearbit.com/newcompany.com';
   ```

3. **Brand detection logic**: `src/brand/useBrandTakeover.ts` (line ~66)

4. **CSS injection**: `components/BrandCSSInjector.tsx`

---

## ✅ Quick Start Checklist

### **For Each Cold Email:**

1. [ ] Get company name (e.g., "Tesla")
2. [ ] Create URL: `?company=Tesla&demo=1`
3. [ ] Test URL in browser
4. [ ] Check if brand color looks right
   - ✅ If yes → send!
   - ❌ If no → add `&brandColor=%23HEXCODE`
5. [ ] Check if logo appears
   - ✅ If yes → send!
   - ❌ If no → add `&logo=URL`
6. [ ] Copy URL into email
7. [ ] Send! 🚀

---

## 📊 Success Metrics

The system tracks:
- ✅ Demo runs used (out of 2)
- ✅ Time until expiration
- ✅ Lock overlay triggers
- ✅ Conversion to paid

All visible in the demo UI to drive urgency!

---

## 🎯 Examples That Work Right Now

```
✅ WORKS PERFECTLY (built-in color + Clearbit logo):
https://sunspire-web-app.vercel.app/?company=Tesla&demo=1
https://sunspire-web-app.vercel.app/?company=Google&demo=1
https://sunspire-web-app.vercel.app/?company=Zillow&demo=1

✅ WORKS WITH CUSTOM COLOR:
https://sunspire-web-app.vercel.app/?company=LocalSolar&demo=1&brandColor=%23FF6600

✅ WORKS WITH EVERYTHING CUSTOM:
https://sunspire-web-app.vercel.app/?company=AcmeCo&demo=1&brandColor=%234A90E2&logo=https%3A%2F%2Facme.com%2Flogo.png
```

---

## 🚀 You're Ready!

**The system is fully built and production-ready.** Just:

1. Get the company name
2. Add `?company=NAME&demo=1` to the URL
3. Send the email!

The branding happens **automatically**. No manual configuration needed for most companies! 🎉

