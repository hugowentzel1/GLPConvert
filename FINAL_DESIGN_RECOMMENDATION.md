# Final Design Recommendation (Based on Site Consistency)

## What Your Site Already Uses

After checking the entire codebase, here's what I found:

### **Bullet Points (•) Are Used EVERYWHERE:**

1. **Homepage (app/page.tsx):**
   - `$99/mo + $399 setup • Live in 24 hours`
   - `• <24h setup • CRM integrations • Ongoing support`
   - `Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance`

2. **Components:**
   - **TrustRow:** `SOC 2 compliant • GDPR ready • NREL PVWatts® • 4.9/5 rating`
   - **ReportCTAFooter:** `$99/mo + $399 setup • Live in 24 hours`
   - **BottomCtaBand:** `$99/mo + $399 setup • Live in 24 hours`
   - **StickyCTA:** `SOC 2 • GDPR • NREL PVWatts®`
   - **Testimonials:** `Name • Company • Role`
   - **QuoteCard:** `Name • Location`
   - **SmartFooter:** Links separated by `•`
   - **PaidFooter:** Links separated by `•`

### **Pattern is CRYSTAL CLEAR:**

✅ **Bullet points (•)** are your **site-wide standard**
✅ Used for **pricing**, **features**, **trust badges**, **metadata**, **footers**
✅ Consistent across **every component**

## The Verdict

### 🏆 **USE BULLET POINTS (•) - ABSOLUTELY**

**Why:**
1. **Site consistency** - It's what you use EVERYWHERE else
2. **User expectation** - Users already see `•` throughout your site
3. **Visual harmony** - Matches your pricing, features, trust badges, footer
4. **Proven pattern** - Already working well across all pages

**Current inconsistency:**
- Rest of site: `•` (bullet points)
- DataSources: `|` (pipes) ← **This is the odd one out!**

## My Updated Recommendation

### Use **Bullet Points (•)** with black text to match site style

**Looking at your site patterns:**
- `TrustRow.tsx`: Uses `text-slate-300` for bullets (light gray)
- `PaidFooter.tsx`: Uses `text-slate-400` for bullets (light gray)
- `SmartFooter.tsx`: Uses `text-gray-300` for bullets (light gray)
- Homepage pricing: Uses plain `•` (inherits text color - likely black)

**Most common:** Light gray bullets (`text-gray-300` or `text-gray-400`)

### Final Implementation:

```tsx
<span className="text-gray-400 mx-3">•</span>
```

**Result:**
```
Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: Geographic proxy
```

**Why text-gray-400:**
- Matches `TrustRow` (`text-slate-300` ≈ `text-gray-300/400`)
- Matches `PaidFooter` (`text-slate-400` ≈ `text-gray-400`)
- Subtle but visible
- Consistent with the rest of the site

## Comparison with Current State

**What you have now (INCONSISTENT):**
```
Data & modeling: NREL PVWatts® v8 | Utility rates from OpenEI URDB / EIA | Shading: Geographic proxy
```
Using `|` pipes with `text-gray-900` - **NOT used anywhere else on site**

**What you should have (CONSISTENT):**
```
Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: Geographic proxy
```
Using `•` bullets with `text-gray-400` - **Matches entire site**

## Examples from Your Site for Reference

**TrustRow (components/trust/TrustRow.tsx):**
```tsx
<span className="text-slate-300">•</span>
<TrustBadge icon={<LockIcon />} text="SOC 2 compliant" />
<span className="text-slate-300">•</span>
<TrustBadge icon={<ShieldIcon />} text="GDPR ready" />
```

**Homepage (app/page.tsx):**
```tsx
Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance
```

**ReportCTAFooter:**
```tsx
$99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded.
```

## Conclusion

**CLEAR ANSWER: Use bullet points (•) with text-gray-400**

This is:
✅ Consistent with your entire site
✅ Matches TrustRow, pricing, features, footer
✅ What users already expect from your brand
✅ The right choice for visual harmony

**Stop using pipes (`|`) - they're the odd one out!**

