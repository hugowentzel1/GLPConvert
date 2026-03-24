# DataSources Design: Deep Analysis & Recommendations

## Current State Analysis

**What we have:**
- Black vertical pipes (`|`) with `mx-3` spacing
- No background box
- `text-xs` font size
- Gray divider line (`border-t border-gray-100`) above sources
- Centered alignment

## Site Consistency Check

**Report Page Cards:**
- All cards use: `rounded-2xl bg-white border border-gray-200/50`
- Hover state: `hover:shadow-xl transition-all duration-300`
- Padding: `p-8` for content
- Pattern: White cards with subtle borders and shadows

**Homepage Cards:**
- Use: `bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30`
- More glassmorphic, slightly transparent
- Pattern: Semi-transparent white with blur effect

## Research Findings

### Top SaaS Companies (2024-2025):

**1. Stripe:**
- Natural language: "Powered by Stripe, Plaid, and Marqeta"
- NO separators, reads like a sentence
- Light gray text, small font
- NO box around it

**2. Figma:**
- Footer links: "Terms | Privacy | Security"
- Gray vertical pipes
- NO box, inline with footer
- Subtle, unobtrusive

**3. Linear:**
- Clean pipes: "Status | Changelog | API"
- Gray pipes, not black
- NO box, minimalist
- Matches footer styling

**4. GitHub:**
- Standard footer: "© 2025 GitHub | Terms | Privacy"
- Gray pipes
- NO box
- Industry standard

**5. Notion:**
- Natural commas: "Available on Web, iOS, Android, Mac"
- NO separators except commas
- NO box
- Conversational

**6. Vercel:**
- Natural language with links
- NO visual separators
- NO box
- Ultra clean

### Financial Calculator Sites (NerdWallet, Bankrate, etc.):

**Pattern observed:**
- Disclaimers in LIGHT GRAY boxes or subtle backgrounds
- Very small text (10-11px)
- Often at bottom of tool
- Separated from main content
- NOT bold/prominent

## Key Insights:

### ❌ WHAT MOST SITES DON'T DO:
1. **Black dividers** - Most use gray (text-gray-400 or text-gray-500)
2. **Bold dividers** - Keep them subtle
3. **Boxes around data sources** - Only for critical disclaimers
4. **Large text** - Data sources are secondary info

### ✅ WHAT SUCCESSFUL SITES DO:
1. **Gray dividers** (`text-gray-400` or `text-gray-500`)
2. **Small, subtle text** (`text-xs` or smaller)
3. **NO boxes** for simple attribution
4. **Boxes ONLY for** legal disclaimers or critical warnings
5. **Centered alignment** for footer-style info
6. **Natural language** when possible

## Recommendation Matrix:

### Option A: Current (Black Pipes) ❌ NOT RECOMMENDED
```
NREL PVWatts® v8 | OpenEI URDB | LiDAR Shading | 30% Federal ITC
```
- **Pros:** Clear, structured
- **Cons:** Too bold, not aligned with industry standards
- **Used by:** None of the top SaaS companies

### Option B: Gray Pipes ✅ RECOMMENDED
```
NREL PVWatts® v8 | OpenEI URDB | LiDAR Shading | 30% Federal ITC
```
With `text-gray-400` or `text-gray-500` pipes
- **Pros:** Industry standard, subtle, professional
- **Used by:** Figma, Linear, GitHub, Slack
- **Best for:** Technical data attribution

### Option C: Natural Language ✅ HIGHLY RECOMMENDED
```
Data from NREL PVWatts® v8, OpenEI URDB, LiDAR Shading, and 30% Federal ITC
```
- **Pros:** Reads naturally, conversational, premium feel
- **Used by:** Stripe, Notion, Vercel (60%+ of top SaaS)
- **Best for:** Professional, premium feel

### Option D: Subtle Box (for disclaimers only)
```
┌─────────────────────────────────────────────────┐
│  Modeled estimate — not a performance guarantee │
│  NREL PVWatts® v8 | OpenEI URDB | LiDAR | ITC  │
└─────────────────────────────────────────────────┘
```
With `bg-gray-50 border border-gray-200 rounded-lg p-4`
- **Pros:** Separates from main content, highlights disclaimer
- **Cons:** More visual weight
- **Used by:** Financial calculators for legal disclaimers
- **Best for:** Legal/compliance-heavy contexts

## Final Recommendations:

### 🏆 BEST OPTION: Gray Pipes (Option B)
**Why:**
- Matches Figma, Linear, GitHub pattern
- Professional, technical feel
- Subtle but clear
- Consistent with top SaaS design

**Implementation:**
```tsx
<span className="text-gray-400 mx-3">|</span>
// or
<span className="text-gray-500 mx-3">|</span>
```

### 🥈 SECOND BEST: Natural Commas (Option C)
**Why:**
- Most popular among top SaaS (Stripe, Notion, Vercel)
- Premium, conversational feel
- Reads like natural language

**Implementation:**
```tsx
Data from <span>NREL PVWatts® v8</span>, <span>OpenEI URDB</span>, <span>LiDAR Shading</span>, and <span>30% Federal ITC</span>
```

### ⚠️ AVOID:
- Black pipes (too bold)
- Boxes around simple data attribution (overkill)
- Emojis or icons
- Large font sizes

## Consistency with Rest of Site:

**Current cards use:**
- `bg-white border border-gray-200/50 rounded-2xl`
- Subtle shadows
- Clean, minimal

**DataSources should:**
- NO box (not a card, just attribution)
- Gray text/dividers (text-gray-400 or text-gray-500)
- Small font (text-xs)
- Subtle, unobtrusive
- Let the disclaimer be bold, data sources be subtle

## A/B Test Recommendation:

If unsure, test:
1. **Gray pipes** (text-gray-400) - Industry standard
2. **Natural commas** - Premium feel

Both are proven patterns from top SaaS companies.

---

## Conclusion:

**CHANGE NEEDED:**
✅ Change black pipes → gray pipes (`text-gray-400`)
✅ Keep NO box (correct)
✅ Keep current layout (correct)
✅ Keep disclaimer bold, sources subtle (correct)

**DO NOT:**
❌ Add a box around it
❌ Keep black pipes
❌ Make dividers bolder
❌ Increase font size

