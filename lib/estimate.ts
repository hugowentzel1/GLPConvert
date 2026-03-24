import 'server-only';
import incentives from "@/data/incentives.json";
import type { PvwattsOut } from "./pvwatts";
import type { RateResult } from "./rates";
import { analyzeShading as analyzeUSGSShading } from "./usgs-shading";

export interface SolarEstimate {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  date: string | Date;

  // system
  systemSizeKW: number;
  tilt: number;
  azimuth: number;
  losses: number;

  // production
  annualProductionKWh: {
    estimate: number;
    low: number;
    high: number;
  };
  monthlyProduction: number[];
  solarIrradiance: number;

  // finance
  grossCost: number;
  netCostAfterITC: number;
  year1Savings: {
    estimate: number;
    low: number;
    high: number;
  };
  paybackYear: number | null;
  npv25Year: number;

  // env
  co2OffsetPerYear: number;

  // utility
  utilityRate: number;
  utilityRateSource: string;
  tariff: string;
  dataSource: string;
  
  // shading analysis
  shadingAnalysis: {
    method: string;
    accuracy: string;
    shadingFactor: number;
    annualShadingLoss: number;
    confidence: number;
  };

  // assumptions shown in UI
  assumptions: {
    itcPercentage: number;
    costPerWatt: number;
    degradationRate: number;
    oandmPerKWYear: number;
    electricityRateIncrease: number;
    discountRate: number;
  };

  // for chart
  cashflowProjection: {
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }[];
}

/** Optional precomputed shading (e.g. from async USGS 3DEP in estimate route) */
export type ShadingOverride = {
  method: string;
  accuracy: string;
  shadingFactor: number;
  annualShadingLoss: number;
  confidence: number;
};

export type BuildInputs = {
  address: string;
  lat: number;
  lng: number;
  stateCode?: string;
  pv: PvwattsOut;
  rate: RateResult;
  systemKw: number;
  tilt: number;
  azimuth: number;
  lossesPct: number;
  /** When set, use this instead of sync usgs-shading (e.g. from lib/shading.ts USGS 3DEP) */
  shadingOverride?: ShadingOverride;
};

export function buildEstimate({
  address,
  lat,
  lng,
  stateCode,
  pv,
  rate,
  systemKw,
  tilt,
  azimuth,
  lossesPct,
  shadingOverride,
}: BuildInputs): SolarEstimate {
  const costPerWatt = num(process.env.DEFAULT_COST_PER_WATT, 3.0);
  const degr = num(process.env.DEFAULT_DEGRADATION_PCT, 0.5) / 100;
  const oandmPerKW = num(process.env.OANDM_PER_KW_YEAR, 22);
  const rateEsc = num(process.env.DEFAULT_RATE_ESCALATION, 0.025);
  const oandmEsc = num(process.env.DEFAULT_OANDM_ESCALATION, 0.02);
  const discount = num(process.env.DISCOUNT_RATE, 0.07);

  // Incentives (rebate BEFORE ITC)
  const itcPct = incentives["US"]?.itc_pct ?? 0.3;
  const stateReb = stateCode ? (incentives as any)[stateCode] : undefined;
  const rebatePerWatt = stateReb?.rebate_per_watt ?? 0;
  const rebateFlat = stateReb?.rebate_flat ?? 0;

  const capex = systemKw * 1000 * costPerWatt;
  const rebate = rebateFlat + rebatePerWatt * systemKw * 1000;
  const itc = itcPct * Math.max(0, capex - rebate);
  const netCost = Math.max(0, capex - rebate - itc);

  const annualKWh = pv.annual_kwh;
  const monthlyKWh = pv.monthly_kwh.map((n) => Math.round(n));

  // Shading: use override from async USGS 3DEP (estimate route) when provided; else sync usgs-shading (precomputed + proxy)
  const shadingResult = shadingOverride ?? (() => {
    const r = analyzeUSGSShading(lat, lng, tilt, azimuth);
    return { method: r.method, accuracy: r.accuracy, shadingFactor: r.shadingFactor, annualShadingLoss: r.annualShadingLoss, confidence: r.confidence };
  })();
  const shadingAnalysis = {
    method: shadingResult.method,
    accuracy: shadingResult.accuracy,
    shadingFactor: shadingResult.shadingFactor,
    annualShadingLoss: shadingResult.annualShadingLoss,
    confidence: shadingResult.confidence,
  };
  const annualShadingLoss = shadingResult.annualShadingLoss;

  // Uncertainty band from shading data quality: high (remote/LiDAR/3DEP) ±7.5%, medium/low (proxy) ±10%
  const uncertaintyBand = shadingResult.accuracy === 'high' ? 0.075 : 0.10;
  const productionLow = Math.round(annualKWh * (1 - uncertaintyBand));
  const productionHigh = Math.round(annualKWh * (1 + uncertaintyBand));

  // Cashflow 25 years
  const oandm0 = oandmPerKW * systemKw;
  let cumulative = -netCost;
  const cashflowProjection = [];
  let npv = -netCost;

  for (let y = 1; y <= 25; y++) {
    const prodY = annualKWh * Math.pow(1 - degr, y - 1);
    const rateY = rate.rate * Math.pow(1 + rateEsc, y - 1);
    const oandmY = oandm0 * Math.pow(1 + oandmEsc, y - 1);
    const savingsY = prodY * rateY;
    const netY = savingsY - oandmY;
    cumulative += netY;
    npv += netY / Math.pow(1 + discount, y);
    cashflowProjection.push({
      year: y,
      production: Math.round(prodY),
      savings: Math.round(savingsY),
      cumulativeSavings: Math.round(Math.max(0, cumulative + netCost)), // cumulative pre-capex if you need
      netCashflow: Math.round(cumulative),
    });
  }

  const paybackYear =
    cashflowProjection.find((p) => p.netCashflow >= 0)?.year ?? null;
  const co2Offset = Math.round(annualKWh * 0.85); // lbs CO2 avoided (Year 1)

  // California Net Billing (NEM 3.0) handling
  const isCalifornia = stateCode === 'CA';
  const nem3ExportRate = isCalifornia ? rate.rate * 0.25 : rate.rate; // Export credits at ~25% of retail
  
  // Calculate savings with proper export credits for CA
  const calculateYear1Savings = (production: number) => {
    if (isCalifornia) {
      // NEM 3.0: 70% self-consumption at retail, 30% export at avoided cost
      return Math.round(production * rate.rate * 0.7 + production * nem3ExportRate * 0.3 - oandm0);
    } else {
      // Standard net metering: 1:1 credit
      return Math.round(production * rate.rate - oandm0);
    }
  };

  return {
    id: Date.now().toString(),
    address,
    coordinates: { lat, lng },
    date: new Date().toISOString(),

    systemSizeKW: systemKw,
    tilt,
    azimuth,
    losses: lossesPct,

    annualProductionKWh: {
      estimate: Math.round(annualKWh),
      low: productionLow,
      high: productionHigh
    },
    monthlyProduction: monthlyKWh,
    solarIrradiance: round2(pv.solrad_kwh_m2_day), // kWh/m²/day

    grossCost: Math.round(capex),
    netCostAfterITC: Math.round(netCost),
    year1Savings: {
      estimate: calculateYear1Savings(annualKWh),
      low: calculateYear1Savings(productionLow),
      high: calculateYear1Savings(productionHigh)
    },
    paybackYear,
    npv25Year: Math.round(npv),

    co2OffsetPerYear: co2Offset,

    utilityRate: round3(rate.rate),
    utilityRateSource: rate.source,
    tariff: rate.source || 'Standard Rate',
    dataSource: rate.source === 'eia' ? 'NREL PVWatts v8 + EIA' : 'NREL PVWatts v8',
    
    shadingAnalysis: {
      method: shadingAnalysis.method,
      accuracy: shadingAnalysis.accuracy,
      shadingFactor: Math.round(shadingAnalysis.shadingFactor * 1000) / 1000,
      annualShadingLoss,
      confidence: Math.round(shadingAnalysis.confidence * 100) / 100
    },

    assumptions: {
      itcPercentage: itcPct,
      costPerWatt,
      degradationRate: degr,
      oandmPerKWYear: oandmPerKW,
      electricityRateIncrease: rateEsc,
      discountRate: discount,
    },

    cashflowProjection,
  };
}

function num(v: string | undefined, dflt: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : dflt;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}
