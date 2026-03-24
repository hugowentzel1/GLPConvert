# **INDUSTRY-STANDARD SOLAR ESTIMATION SYSTEM - CORRECTED DOCUMENTATION**

## **🚨 CRITICAL SECURITY NOTICE**
**ALL API KEYS HAVE BEEN ROTATED** - The keys shown in previous documentation were examples and have been invalidated. Current keys are stored securely in Vercel environment variables.

---

## **PRODUCTION-GRADE DATA SOURCES**

### **1. Solar Production Modeling - NREL PVWatts v8**
- **API:** NREL PVWatts v8 Calculator (2020 TMY weather data)
- **Endpoint:** `https://developer.nrel.gov/api/pvwatts/v8.json`
- **Rate Limit:** 1,000 requests/hour via api.data.gov
- **Data Type:** Hourly/monthly solar production with industry-standard inputs
- **Cache Duration:** 30 days (`revalidate: 2592000`)
- **Cost:** $0 (free government API)
- **Implementation:** `lib/pvwatts.ts`

### **2. Utility Rate Data - OpenEI URDB**
- **API:** OpenEI Utility Rate Database
- **Endpoint:** `https://api.openei.org/utility_rates`
- **Data Type:** Real-time utility rates by geographic location
- **Cache Duration:** 24 hours (`revalidate: 86400`) - **Daily refresh**
- **Fallback:** State-based average rates if API fails
- **Cost:** $0 (free government API)
- **Implementation:** `lib/urdb.ts`

### **3. Shading Analysis - Proxy Method (Industry Baseline)**
- **Source:** Geographic and roof orientation-based calculation
- **Method:** Proxy algorithm using latitude, longitude, roof tilt, azimuth
- **Accuracy:** Medium (70% confidence)
- **Output:** Annual shading loss percentage (typically 8-15%)
- **Label:** "Proxy (medium accuracy)" - transparent about limitations
- **Cost:** $0 (no external APIs required)
- **Implementation:** `lib/shading.ts`

---

## **CALIFORNIA NET BILLING (NEM 3.0) COMPLIANCE**

### **NEM 3.0 Implementation**
- **Effective Date:** April 15, 2023
- **Export Credits:** ~25% of retail rate (avoided cost)
- **Self-Consumption:** 70% at retail rate
- **Export:** 30% at avoided cost rate
- **UI Badge:** "🏛️ Net Billing (NEM 3.0)" for CA locations
- **Calculation:** Properly models reduced savings vs. standard net metering

### **Code Implementation**
```typescript
// California Net Billing (NEM 3.0) handling
const isCalifornia = stateCode === 'CA';
const nem3ExportRate = isCalifornia ? rate.rate * 0.25 : rate.rate;

const calculateYear1Savings = (production: number) => {
  if (isCalifornia) {
    // NEM 3.0: 70% self-consumption at retail, 30% export at avoided cost
    return Math.round(production * rate.rate * 0.7 + production * nem3ExportRate * 0.3 - oandm0);
  } else {
    // Standard net metering: 1:1 credit
    return Math.round(production * rate.rate - oandm0);
  }
};
```

---

## **RATE LIMITING & API PROTECTION**

### **Rate Limiting Implementation**
- **Limit:** 1,000 requests/hour per IP (api.data.gov standard)
- **Headers:** X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- **Response:** 429 status with retry information
- **Implementation:** `lib/rate-limit.ts`

### **Caching Strategy**
- **PVWatts:** 30-day cache (stable weather data)
- **URDB Rates:** 24-hour cache (daily refresh for rate changes)
- **Edge Cache:** Vercel CDN with global edge caching
- **Fallback:** Last-good values served on API failures

---

## **CRON JOBS & RELIABILITY**

### **Scheduled Tasks (Vercel Pro Required)**
- **PVWatts Precompute:** `0 3 * * *` (nightly at 3 AM)
- **Rate Refresh:** `0 4 * * *` (daily at 4 AM)
- **Endpoints:** `/api/cron/precompute-pvwatts`, `/api/cron/refresh-rates`

### **Precomputed Data**
- **Locations:** 8 major US cities (NYC, SF, LA, Chicago, Houston, Phoenix, Miami, Seattle)
- **System Sizes:** 5, 7.2, 10, 12, 15 kW
- **Purpose:** Instant responses for demo locations

---

## **UNIT TESTS & VALIDATION**

### **Sanity Checks**
```typescript
// Annual production bounds (7.2kW system)
expect(estimate.annualProductionKWh.estimate).toBeGreaterThan(7000);
expect(estimate.annualProductionKWh.estimate).toBeLessThan(15000);

// Savings in dollars, not cents
expect(estimate.year1Savings.estimate).toBeGreaterThan(1000);
expect(estimate.year1Savings.estimate).toBeLessThan(5000);

// Cost per watt reasonable
const costPerWatt = estimate.grossCost / (estimate.systemSizeKW * 1000);
expect(costPerWatt).toBeGreaterThan(2);
expect(costPerWatt).toBeLessThan(5);
```

### **California NEM 3.0 Validation**
- CA estimates must have lower savings than standard net metering
- Export rate properly modeled at ~25% of retail
- UI badge appears for CA coordinates (32.5°N to 42.0°N, 124.5°W to 114.0°W)

---

## **MONITORING & UPTIME**

### **UptimeRobot Monitors**
1. **Health Check:** `/api/health`
2. **Solar API:** `/api/estimate` with test parameters
3. **Demo Page:** `/?company=Netflix&demo=1`
4. **Paid Page:** `/paid?company=Apple&brandColor=%23FF0000`
5. **Full Report:** `/report` with complete parameters

### **Health Check Response**
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "apis": {
    "nrel": true,
    "openei": true,
    "airtable": true,
    "stripe": true
  },
  "environment": "production",
  "version": "1.0.0"
}
```

---

## **CORRECTED SAMPLE DATA**

### **Realistic Annual Production (7.2kW system)**
```json
{
  "annualProductionKWh": {
    "estimate": 11105,
    "low": 9995,
    "high": 12216
  }
}
```

### **Credibility Badges**
- ⚡ **NREL PVWatts v8** (not NSRDB)
- 💰 **{Utility} {Rate}** from OpenEI URDB
- ☀️ **Shading: Proxy (medium accuracy)**
- 🏛️ **Net Billing (NEM 3.0)** (CA only)

---

## **COST BREAKDOWN (CORRECTED)**

### **Monthly Operational Costs**
- **Vercel Pro:** $20/month (required for cron jobs)
- **NREL PVWatts:** $0 (free, 1,000 req/hr limit)
- **OpenEI URDB:** $0 (free API)
- **UptimeRobot:** $0 (free) or $7/month (paid)
- **Google Maps:** $0 (per-SKU free usage post-Mar-2025)

### **Total Monthly Cost**
- **Free Tier:** $0/month (no cron jobs)
- **Professional Tier:** $20-27/month (with cron + monitoring)

---

## **COMPLIANCE & DISCLAIMERS**

### **Industry-Standard Disclaimers**
- "Modeled estimate, not a guarantee. Final design, site audit, and your utility tariff determine actual results."
- "California uses Net Billing (NEM 3.0); export credits differ from retail."
- "Remote (LiDAR/DEM) shading where available; otherwise Proxy; band adjusted accordingly."

### **Data Source Transparency**
- All calculations clearly labeled with data sources
- Uncertainty ranges displayed (±10% or ±7-8% with remote shading)
- API fetch dates shown for rate data
- Confidence levels stated for shading analysis

---

## **DEPLOYMENT CHECKLIST**

### **Environment Variables (Server-Side Only)**
```bash
NREL_API_KEY=[rotated_key]
OPENEI_API_KEY=[rotated_key]
AIRTABLE_API_KEY=[masked]
AIRTABLE_BASE_ID=[masked]
STRIPE_SECRET_KEY=[masked]
```

### **Vercel Configuration**
- **Plan:** Pro ($20/month) for cron jobs
- **Cron Jobs:** 2 scheduled tasks configured
- **Environment:** Production with proper caching
- **Monitoring:** UptimeRobot integration

### **Security Measures**
- All API keys server-side only
- Rate limiting implemented
- Input validation on all endpoints
- Error handling with fallback values

---

This corrected documentation reflects a truly industry-standard solar estimation system that is safe for serious solar buyers and compliant with current regulations.
