# Disclaimer Formatting Research: Best Practices

## Research Summary

After analyzing top SaaS, calculator tools, and industry best practices, here are the findings:

### Common Patterns:

1. **Two-Line Format** - Most common for disclaimers
   - Line 1: Main disclaimer
   - Line 2: Data sources/attribution

2. **Bold Key Terms** - Strategic emphasis
   - "Estimate" or "Modeled"
   - "Not a guarantee"
   - Data source names (NREL, etc.)

3. **Visual Hierarchy**
   - Primary message (disclaimer) more prominent
   - Attribution/sources more subtle

### Examples from Similar Tools:

**Zillow/Redfin Style (Real Estate Calculators):**
```
Estimated value — not a professional appraisal. Actual value may vary.
Data sources: Zillow, public records, comparable sales.
```
- First line bold, second line regular
- Two distinct lines
- Clear separation

**NerdWallet Style (Financial Calculators):**
```
This calculator provides estimates only. Results will vary.
Powered by: Industry data, lender rates, and credit scoring models.
```
- Short, clear statements
- "Powered by" prefix for attribution
- Two lines, second slightly smaller/lighter

**Mortgage Calculator Style (Bank Sites):**
```
Estimated monthly payment — not a loan commitment.
Rates and data from: Federal Reserve, local lenders, credit bureaus.
```
- Bold disclaimer, regular attribution
- Two lines
- Clear "from" language

### Best Practice Recommendations:

1. **Two Lines:**
   - Line 1: Disclaimer (primary message)
   - Line 2: Data sources (secondary info)

2. **Bold Usage:**
   - Bold "Modeled estimate" at start
   - Bold "not a performance guarantee"
   - Regular text for the rest
   - Optional: Bold data source names

3. **Size/Color:**
   - Keep both lines same size (text-sm)
   - OR make line 2 slightly smaller (text-xs)
   - Line 1: text-gray-700 or text-gray-900
   - Line 2: text-gray-600 (slightly lighter)

4. **Spacing:**
   - Small gap between lines (mt-1 or mt-2)
   - Don't use divider line (too much)

## Recommended Formatting Options:

### Option A: Two Lines, Same Size, Strategic Bold
```
Line 1: [Bold]Modeled estimate[/Bold] — [Bold]not a performance guarantee.[/Bold] Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs.

Line 2: Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: Geographic proxy.
```

**Styling:**
- Both: text-sm text-gray-700
- Line 1: Bold key terms
- Line 2: Regular weight
- Gap: mt-2

### Option B: Two Lines, Different Sizes, Bold Disclaimer
```
Line 1: [Bold]Modeled estimate — not a performance guarantee.[/Bold] Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs.

Line 2: Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: Geographic proxy.
```

**Styling:**
- Line 1: text-sm text-gray-900 font-semibold (entire line)
- Line 2: text-xs text-gray-600 (lighter, smaller)
- Gap: mt-2

### Option C: Two Lines, Bold Disclaimer + Bold Sources (My Recommendation)
```
Line 1: [Bold]Modeled estimate — not a performance guarantee.[/Bold] Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs.

Line 2: Data from [Bold]NREL PVWatts® v8[/Bold] • [Bold]OpenEI URDB / EIA[/Bold] • [Bold]Geographic proxy[/Bold] for shading.
```

**Styling:**
- Line 1: text-sm text-gray-700, bold first sentence only
- Line 2: text-xs text-gray-600, bold source names
- Gap: mt-2

## Final Recommendation:

**Use Option B** - Clean, professional, matches financial calculator patterns:

**Line 1 (Disclaimer):**
- Entire line semibold
- text-sm text-gray-900
- "Modeled estimate — not a performance guarantee. Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs."

**Line 2 (Attribution):**
- Regular weight
- text-xs text-gray-600 (slightly smaller and lighter)
- "Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: Geographic proxy."

**Gap:** mt-2 between lines

This matches:
✅ Financial calculator patterns (Zillow, NerdWallet, Bankrate)
✅ Visual hierarchy (disclaimer prominent, attribution subtle)
✅ Professional, clean design
✅ Easy to scan

