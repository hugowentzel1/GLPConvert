# Sunspire Estimation: Industry Standards & Sources

This document verifies that Sunspire’s solar production and utility-rate logic aligns with **industry-standard** data sources and methodologies, and provides **known-value checks** for regression testing.

---

## How estimations are industry standard (by component)

Sunspire’s estimate is built from **four components**. Each uses an industry-standard source; together they form an industry-standard quote pipeline.

| Component | What it does | Industry-standard source | Why it’s standard |
|-----------|----------------|--------------------------|-------------------|
| **1. Solar production (kWh/year)** | Converts location + system size + tilt/azimuth into annual AC energy. | **NREL PVWatts v8** (same engine as the PVWatts Calculator and NREL’s System Advisor Model). | NREL is the U.S. national lab for renewable energy; PVWatts is the standard free tool for grid-connected PV. V8 uses 2020 TMY weather from the National Solar Radiation Database (NSRDB). *“PVWatts Calculator, web API, and implementation of PVWatts in SAM all use the same underlying model.”* — [NREL PVWatts V8](https://developer.nrel.gov/docs/solar/pvwatts/v8/) |
| **2. Weather / irradiance data** | Feeds PVWatts with location-specific solar resource. | **NSRDB** (via PVWatts). | NSRDB is NREL’s reference database for solar resource; PVWatts V8 uses 2020 TMY from NSRDB. |
| **3. Utility rate ($/kWh)** | Converts kWh savings into dollar savings by state. | **EIA API v2** – Electricity retail sales, residential sector, by state. | EIA is the U.S. government’s official energy statistics agency. Data comes from Forms EIA-826 and EIA-861. *“Electricity sales to ultimate customer by state and sector (… average price …).”* — [EIA Open Data](https://www.eia.gov/opendata/documentation.php) |
| **4. Shading (annual loss %)** | Adjusts production for obstructions (trees, terrain). | **USGS 3DEP** (elevation/LiDAR when available) + **precomputed/proxy** fallback. | USGS 3DEP is the national elevation program; LiDAR/elevation is the standard data type for terrain-based shading. Commercial tools (e.g. Aurora, OpenSolar) use similar data and are NREL-validated; Sunspire uses 3DEP where available and a transparent proxy/regional fallback otherwise. [USGS 3DEP](https://www.usgs.gov/3d-elevation-program/about-3dep-products-services) |

**Flow:** Address → **geocode** (Google Geocoding API) → **PVWatts** (production) + **EIA** (rate by state) + **shading** (3DEP or proxy) → **buildEstimate** (cost, savings, payback, NPV) → API response with `dataSource` and `shadingAnalysis`.

**Sources (summary):** NREL PVWatts V8 (production), NSRDB via PVWatts (irradiance), EIA v2 (rates), USGS 3DEP (shading when available). Full references are in Section 7 below.

---

## 1. Solar production: NREL PVWatts v8 (industry standard)

**Source:** NREL (National Renewable Energy Laboratory) PVWatts® Version 8 API.

- **API:** `GET https://developer.nrel.gov/api/pvwatts/v8.json`  
- **Docs:** [NREL Developer Network – PVWatts V8](https://developer.nrel.gov/docs/solar/pvwatts/v8/)  
- **Calculator:** [PVWatts Version 8](https://pvwatts.nrel.gov/version_8.php)

**Why it’s standard:** PVWatts V8 is the current NREL API for grid-connected PV energy estimation. It uses:

- 2020 TMY weather from the National Solar Radiation Database (NSRDB)
- Updated module, inverter, and thermal models
- Same underlying `pvwattsv8` module as the PVWatts Calculator and System Advisor Model (SAM)

*“PVWatts V8 replaces the pvwattsv5 compute module with pvwattsv8 so that the PVWatts Calculator, web API, and implementation of PVWatts in the System Advisor Model (SAM) all use the same underlying model.”* — [NREL PVWatts V8 docs](https://developer.nrel.gov/docs/solar/pvwatts/v8/)

**Sunspire usage:** `lib/pvwatts.ts` calls the v8 API with `system_capacity`, `lat`, `lon`, `tilt`, `azimuth`, `array_type=2` (Fixed – Roof Mounted), `module_type=1` (Premium), `losses`, `dc_ac_ratio=1.2`, `inv_eff=96`. Fallback when `NREL_API_KEY` is unset uses location-based irradiance patterns consistent with NREL regional data.

---

## 2. Utility rates: EIA electricity retail sales (industry standard)

**Source:** U.S. Energy Information Administration (EIA) – Electricity retail sales, average price by state/sector.

- **API:** `GET https://api.eia.gov/v2/electricity/retail-sales/data/`  
- **Docs:** [EIA Open Data – API Technical Documentation](https://www.eia.gov/opendata/documentation.php)  
- **Data:** Form EIA-826, EIA-861; sector `RES` = residential; units: cents per kilowatthour.

**Why it’s standard:** EIA is the U.S. government’s official source for energy statistics. Retail sales price by state and sector is the standard reference for average residential electricity rates.

**Sunspire usage:** `lib/rates.ts` calls EIA v2 with `facets[stateid][]=<state>`, `facets[sectorid][]=RES`, `data[]=price`, `frequency=annual`, `sort=period:desc`, `length=1`. Fallback uses a curated state-level table when EIA is unavailable or unconfigured.

---

## 3. Known-value checks (for tests and monitoring)

Use these to validate that the estimate pipeline (PVWatts + EIA or fallbacks) and response shape stay correct.

### 3.1 NREL PVWatts v8 – official example (Colorado)

**Inputs (from NREL docs):**

- `lat=40`, `lon=-105`  
- `system_capacity=4` kW  
- `tilt=10`, `azimuth=180`  
- `array_type=1`, `module_type=0`, `losses=14`, `dc_ac_ratio=1.2`, `inv_eff=96`

**Expected output (from NREL response):**

- `ac_annual`: **4131.35** kWh (round to 4131)  
- `solrad_annual`: **3.60** kWh/m²/day  

**Check:** For the same inputs, `/api/estimate` (or direct PVWatts call) should yield annual AC in the range **4000–4300 kWh** for 4 kW (exact value can vary slightly with dataset/radius). Our app uses `array_type=2` (roof mount) and `module_type=1` (premium), so numbers will be in the same ballpark but not identical to this NREL example.

### 3.2 Sunspire E2E locations (sanity bands)

| Location              | Address (example)        | State | 10 kW annual (kWh) sanity band | Notes                    |
|-----------------------|--------------------------|-------|---------------------------------|--------------------------|
| Mountain View, CA     | 1600 Amphitheatre Pkwy   | CA    | 12,000–18,000                   | High irradiance          |
| Phoenix, AZ           | 123 N Central Ave        | AZ    | 14,000–20,000                   | Very high irradiance     |
| Austin, TX            | 901 S Mopac Expy         | TX    | 12,000–18,000                   | High irradiance          |

**Check:** For 10 kW, tilt 22°, azimuth 180°, losses 14%, `GET /api/estimate?address=...&lat=...&lng=...&state=...&systemKw=10&tilt=22&azimuth=180&lossesPct=14` should return `estimate.annualProductionKWh.estimate` within the band and `dataSource` including `NREL` and, when EIA is used, `EIA`.

### 3.3 Response shape (schema)

- `estimate.annualProductionKWh.estimate`, `.low`, `.high` (numbers)  
- `estimate.year1Savings.estimate` (number)  
- `estimate.utilityRate` (number, $/kWh)  
- `estimate.dataSource` (string: “NREL PVWatts v8” or “NREL PVWatts v8 + EIA”)  
- `estimate.shadingAnalysis`: `method`, `accuracy`, `shadingFactor`, `annualShadingLoss`, `confidence`

---

## 4. Shading and attribution

- **Shading:** USGS 3DEP (async, when available) or precomputed/proxy via `lib/usgs-shading.ts`; result exposed as `shadingAnalysis` with method (e.g. remote/proxy), accuracy, and annual loss.  
- **Attribution:** `dataSource` is set to `"NREL PVWatts v8 + EIA"` when utility rate comes from EIA, otherwise `"NREL PVWatts v8"` (see `lib/estimate.ts`).

---

## 5. References (quoted)

1. **NREL PVWatts V8** – *“PVWatts® Version 8 is the current version of the PVWatts API. … This update provides production estimates based on the latest, state-of-the art models from NREL.”*  
   [https://developer.nrel.gov/docs/solar/pvwatts/v8/](https://developer.nrel.gov/docs/solar/pvwatts/v8/)

2. **PVWatts Version 8 (website)** – Technical description of V8 model and NSRDB 2020 TMY.  
   [https://pvwatts.nrel.gov/version_8.php](https://pvwatts.nrel.gov/version_8.php)

3. **EIA API v2** – *“Electricity sales to ultimate customer by state and sector (number of customers, average price, revenue, and megawatthours of sales). Sources: Forms EIA-826, EIA-861, EIA-861M.”*  
   [https://www.eia.gov/opendata/documentation.php](https://www.eia.gov/opendata/documentation.php)

4. **EIA Electricity Data** – Retail sales and average retail price.  
   [https://www.eia.gov/electricity/sales_revenue_price/](https://www.eia.gov/electricity/sales_revenue_price/)

---

## 6. Industry-standard assessment (honest summary)

### What Sunspire uses and how it compares

| Component | Sunspire | Industry standard? | Sources |
|-----------|----------|--------------------|--------|
| **Production** | NREL PVWatts v8 API | **Yes.** PVWatts is NREL’s primary free tool for grid-connected PV production; V8 uses 2020 TMY from NSRDB and the same underlying model as the PVWatts Calculator and SAM. | NREL Developer Network (PVWatts V8); pvwatts.nrel.gov; NREL Research Hub (“System Advisor Model (SAM) and PVWatts”). |
| **Weather / irradiance** | Via PVWatts (NSRDB) | **Yes.** PVWatts V8 uses NSRDB 2020 TMY; NSRDB is the standard reference for solar resource data. | NREL PVWatts V8 docs; NSRDB. |
| **Utility rates** | EIA API v2 (retail sales, residential, state) | **Yes.** EIA is the U.S. government’s official source; Forms EIA-826/861 are the standard for state/sector electricity prices. | EIA Open Data documentation; data.gov (Electricity Data – Average Retail Price API). |
| **Shading** | USGS 3DEP elevation (when available) + regional proxy / precomputed fallback | **Reasonable.** 3DEP LiDAR/elevation is the public-sector standard for terrain; commercial tools (e.g. Aurora, OpenSolar) add imagery/3D and are validated to ±2–5 pts vs on-site. Sunspire uses 3DEP where available and transparent proxy/regional fallback otherwise. | USGS 3DEP (“About 3DEP Products & Services”; “The 3D Elevation Program and Energy for the Nation”); NREL fact sheets (Aurora shade accuracy; OpenSolar remote shading comparison). |

### What you’re *not* using (and whether it matters)

- **SAM (System Advisor Model)** – NREL’s full techno-economic model. Used for detailed system design and financing. **Not required** for a lead-gen/quote tool; PVWatts is the standard for simple production estimates. *“For more sophisticated modeling of complex systems, SAM provides more precise capabilities.”* (pvwatts.nrel.gov)
- **Aurora/OpenSolar-level shading** – Commercial tools combine LiDAR with satellite/Street View and are NREL-validated to within a few percentage points. Sunspire uses **USGS 3DEP** (same family of data as LiDAR-based tools) plus explicit fallbacks and confidence/method in the API. You’re not missing a *data* standard; the gap is validation studies (typically done by vendors), not data sources.
- **Hourly or subhourly simulation** – PVWatts can output hourly; Sunspire uses monthly/annual. For quote/lead-gen, **monthly/annual is standard**; hourly is for design/optimization.

### Bottom line

- **Production:** Industry-standard (NREL PVWatts v8 + NSRDB).  
- **Rates:** Industry-standard (EIA retail, residential, by state).  
- **Shading:** Uses industry-standard elevation data (3DEP) with clear fallbacks; not NREL-validated like Aurora/OpenSolar but appropriate for a transparent, source-attributed quote tool.  

**Nothing critical is missing for an industry-standard *estimation stack* for solar quotes and lead generation.** For full design/permitting-level accuracy, installers would use SAM or commercial tools; your stack is sufficient and well-sourced for demos and paid quotes.

---

## 7. Quoted sources (multiple)

1. **NREL PVWatts V8** – *“PVWatts® Version 8 is the current version of the PVWatts API.”* Uses 2020 TMY from NSRDB; same underlying model as PVWatts Calculator and SAM.  
   https://developer.nrel.gov/docs/solar/pvwatts/v8/

2. **NREL – PVWatts Version 8** – Technical description; NSRDB 2020 TMY; module/inverter/thermal updates.  
   https://pvwatts.nrel.gov/version_8.php

3. **NREL Research Hub – System Advisor Model (SAM) and PVWatts** – PVWatts and SAM as primary NREL tools for PV production; PVWatts for simpler estimates.  
   https://research-hub.nrel.gov/en/publications/system-advisor-model-sam-and-pvwatts

4. **EIA Open Data – API Technical Documentation** – APIv2; electricity retail sales; average price by state/sector (EIA-826, EIA-861).  
   https://www.eia.gov/opendata/documentation.php

5. **data.gov – Electricity Data, Average Retail Price of Electricity API** – EIA as the source for average retail price API.  
   https://catalog.data.gov/dataset/electricity-data-average-retail-price-of-electricity-application-programming-interface-api

6. **USGS – About 3DEP Products & Services** – 3DEP as the national elevation program; LiDAR/DEMs for applications including energy.  
   https://www.usgs.gov/3d-elevation-program/about-3dep-products-services

7. **USGS – The 3D Elevation Program and Energy for the Nation** – 3DEP supporting renewable energy and infrastructure.  
   https://pubs.usgs.gov/fs/2019/3051/fs20193051.pdf

8. **NREL – Evaluation of the Aurora Application Shade Measurement Accuracy** – Aurora shading validated against on-site measurements (LiDAR + imagery).  
   https://docs.nrel.gov/docs/fy16osti/65558.pdf

9. **NREL/OSTI – Comparing the OpenSolar Remote Shading Tool to On-Site Measurements** – OpenSolar remote shading accuracy.  
   https://www.osti.gov/biblio/1837022
