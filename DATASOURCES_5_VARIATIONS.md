# 5 Best-Performing DataSources Variations for Conversions

All variations are **equally minimal** and **legally compliant**, but optimized for different conversion psychology principles.

---

## **OPTION 1: Authority-First (Current)**
**Psychology:** Lead with credibility, data sources above disclaimer

```tsx
<div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
  
  {/* Data sources FIRST - establishes credibility immediately */}
  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs mb-6">
    <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
    <span className="text-gray-300">•</span>
    <span className="font-semibold text-gray-900">OpenEI URDB</span>
    <span className="text-gray-300">•</span>
    <span className="font-semibold text-gray-900">Geographic Shading</span>
    <span className="text-gray-300">•</span>
    <span className="font-semibold text-gray-900">30% Federal ITC</span>
  </div>

  {/* Disclaimer SECOND */}
  <p className="text-center text-xs text-gray-600 pt-6 border-t border-gray-100">
    <span className="font-semibold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
    Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
  </p>
</div>
```

**Why it converts:**
✅ Builds trust FIRST (see credible sources → trust increases)
✅ Legal disclaimer buried at bottom (less friction)
✅ Small text for disclaimer (de-emphasizes concerns)

**Best for:** Warm leads who want validation

---

## **OPTION 2: Trust-Reassurance (Inverted)**
**Psychology:** Address concerns first, then validate with data

```tsx
<div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
  
  {/* Disclaimer FIRST - transparent, honest */}
  <p className="text-center text-sm text-gray-700 mb-6">
    <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
    Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
  </p>

  {/* Data sources SECOND - validates the disclaimer */}
  <div className="pt-6 border-t border-gray-100">
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
      <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">OpenEI URDB</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">Geographic Shading</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">30% Federal ITC</span>
    </div>
  </div>
</div>
```

**Why it converts:**
✅ Shows honesty upfront (builds deeper trust)
✅ Data sources validate credibility AFTER concern addressed
✅ Feels more transparent

**Best for:** Skeptical buyers, enterprise clients

---

## **OPTION 3: Single-Line Power**
**Psychology:** Maximum minimalism, everything on one line

```tsx
<div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-6">
  <p className="text-center text-xs text-gray-700 leading-relaxed">
    <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
    Actual results vary by conditions. 
    <span className="mx-2">|</span>
    <span className="font-semibold text-gray-900">Data:</span> NREL PVWatts® v8, OpenEI URDB, Geographic Shading, 30% Federal ITC
  </p>
</div>
```

**Why it converts:**
✅ Ultra-minimal (least visual friction)
✅ One-glance comprehension
✅ Tighter padding (p-6 instead of p-8)
✅ Feels like a simple footnote

**Best for:** Mobile users, impatient decision-makers

---

## **OPTION 4: Emphasis on Accuracy**
**Psychology:** Highlight data quality, minimize legal concern

```tsx
<div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
  
  {/* Emphasize data quality */}
  <div className="text-center mb-4">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      Industry-Standard Data
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
      <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">OpenEI URDB</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">Geographic Shading</span>
      <span className="text-gray-300">•</span>
      <span className="font-semibold text-gray-900">30% Federal ITC</span>
    </div>
  </div>

  {/* Subtle disclaimer */}
  <p className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
    Modeled estimate. Actual results may vary.
  </p>
</div>
```

**Why it converts:**
✅ "Industry-Standard Data" = credibility boost
✅ Disclaimer super minimal (just 5 words)
✅ Gray-500 makes disclaimer less alarming

**Best for:** B2B sales, installers who know the industry

---

## **OPTION 5: Badge Style (Visual Authority)**
**Psychology:** Small visual badges create premium perception

```tsx
<div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
  
  {/* Small badge-style pills */}
  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
    <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
      NREL PVWatts® v8
    </span>
    <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
      OpenEI URDB
    </span>
    <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
      Geographic Shading
    </span>
    <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
      30% Federal ITC
    </span>
  </div>

  {/* Disclaimer */}
  <p className="text-center text-xs text-gray-600 pt-6 border-t border-gray-100">
    <span className="font-semibold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
    Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
  </p>
</div>
```

**Why it converts:**
✅ Badges feel premium (subconscious quality signal)
✅ Visual separation makes data sources "pop"
✅ More expensive-looking without being cluttered
✅ Each badge = "certified" feeling

**Best for:** Premium pricing ($99/mo justified), enterprise sales

---

## **CONVERSION TESTING RECOMMENDATION:**

### **A/B Test Order:**

1. **Start with Option 2** (Trust-Reassurance) — Most balanced
2. **Test Option 5** (Badge Style) — Premium perception
3. **Test Option 3** (Single-Line) — Mobile optimization
4. **Keep Option 1 as control** (Current)

### **Expected Performance by Segment:**

| Segment | Best Option | Why |
|---------|-------------|-----|
| **Warm leads** | Option 1 (Authority-First) | Already interested, need validation |
| **Cold traffic** | Option 2 (Trust-Reassurance) | Need honesty first |
| **Mobile** | Option 3 (Single-Line) | Fastest comprehension |
| **Enterprise/B2B** | Option 5 (Badge Style) | Premium perception |
| **Price-sensitive** | Option 4 (Emphasis on Accuracy) | Data quality = value |

---

## **WINNER PREDICTION:**

**Option 5 (Badge Style)** will likely perform best for Sunspire because:
- ✅ Justifies $99/mo pricing (looks premium)
- ✅ Visual badges = "certified" feeling
- ✅ Still minimal (no clutter)
- ✅ Works on mobile (badges wrap nicely)
- ✅ Builds trust through visual authority

**Runner-up: Option 2** for long-term trust and enterprise clients.

