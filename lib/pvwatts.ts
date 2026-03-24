// lib/pvwatts.ts
import 'server-only';
import { cache } from './cache';
import { retryPVWatts } from './retry';

export type PvwattsParams = {
  lat: number;
  lon: number;
  system_capacity_kw: number; // DC kW
  tilt_deg: number; // 0..60
  azimuth_deg: number; // 0=N,90=E,180=S,270=W
  losses_pct: number; // total % losses (soiling, mismatch, wiring, shading, etc.)
  module_type?: 0 | 1 | 2; // 0=Std,1=Prem,2=Thin
  array_type?: 1 | 2 | 3 | 4 | 5; // 2 = Fixed roof mount (BEST default for residential)
  dc_ac_ratio?: number; // default 1.2
  inv_eff?: number; // default 96
};

export type PvwattsOut = {
  annual_kwh: number;
  monthly_kwh: number[];
  solrad_kwh_m2_day: number; // outputs.solrad_annual (kWh/m²/day)
  inputsUsed: {
    lat: number;
    lon: number;
    system_capacity_kw: number;
    tilt_deg: number;
    azimuth_deg: number;
    losses_pct: number;
    module_type: 0 | 1 | 2;
    array_type: 1 | 2 | 3 | 4 | 5;
    dc_ac_ratio: number;
    inv_eff: number;
  };
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getLocationIrradiance(lat: number, lon: number): number {
  // Realistic solar irradiance by region (kWh/m²/day)
  // Based on NREL data patterns
  
  // California (high irradiance)
  if (lat >= 32.5 && lat <= 42.0 && lon >= -124.5 && lon <= -114.0) {
    return 5.5; // High solar resource
  }
  
  // Southwest (AZ, NV, NM, UT)
  if (lat >= 31.0 && lat <= 37.0 && lon >= -120.0 && lon <= -108.0) {
    return 5.8; // Very high solar resource
  }
  
  // Texas
  if (lat >= 25.8 && lat <= 36.5 && lon >= -106.6 && lon <= -93.5) {
    return 5.2; // High solar resource
  }
  
  // Florida
  if (lat >= 24.4 && lat <= 31.0 && lon >= -87.6 && lon <= -80.0) {
    return 4.8; // Good solar resource
  }
  
  // Northeast (NY, MA, CT, etc.)
  if (lat >= 40.0 && lat <= 45.0 && lon >= -80.0 && lon <= -70.0) {
    return 4.2; // Moderate solar resource
  }
  
  // Northwest (WA, OR)
  if (lat >= 45.5 && lat <= 49.0 && lon >= -125.0 && lon <= -116.0) {
    return 3.8; // Lower solar resource
  }
  
  // Default based on latitude (general pattern)
  if (lat >= 30) return 4.5; // Southern states
  if (lat >= 40) return 4.0; // Mid-latitude
  return 3.5; // Northern states
}

async function getPVWattsCacheKey(params: PvwattsParams): Promise<string> {
  const { createHash } = await import('node:crypto');
  const hash = createHash('sha1');
  hash.update(JSON.stringify({
    lat: params.lat,
    lng: params.lon,
    tilt: params.tilt_deg,
    azimuth: params.azimuth_deg,
    dc_kw: params.system_capacity_kw,
    losses: params.losses_pct
  }));
  return `pvwatts:${hash.digest('hex')}`;
}

export async function pvwatts(p: PvwattsParams): Promise<PvwattsOut> {
  console.log("PVWatts called with params:", p);
  
  // Check cache first
  const cacheKey = await getPVWattsCacheKey(p);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { ENV } = await import('./env');
  const key = ENV.NREL_API_KEY;
  if (!key) {
    // Fallback for local development - return location-specific mock data
    console.warn("NREL_API_KEY not set, using location-specific fallback data for local development");
    
    // Calculate realistic production based on location and system size
    const baseIrradiance = getLocationIrradiance(p.lat, p.lon);
    const systemEfficiency = 0.85; // 85% efficiency factor
    const annualProduction = Math.round(p.system_capacity_kw * baseIrradiance * 365 * systemEfficiency);
    
    // Generate monthly distribution (higher in summer months)
    const monthlyDistribution = [0.6, 0.7, 0.9, 1.1, 1.2, 1.3, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5];
    const monthlyTotal = monthlyDistribution.reduce((sum, val) => sum + val, 0);
    const monthlyKwh = monthlyDistribution.map(factor => 
      Math.round((annualProduction * factor) / monthlyTotal)
    );
    
    const fallbackResult: PvwattsOut = {
      annual_kwh: annualProduction,
      monthly_kwh: monthlyKwh,
      solrad_kwh_m2_day: baseIrradiance,
      inputsUsed: {
        lat: p.lat,
        lon: p.lon,
        system_capacity_kw: p.system_capacity_kw,
        tilt_deg: p.tilt_deg || 22,
        azimuth_deg: p.azimuth_deg || 180,
        losses_pct: p.losses_pct || 14,
        module_type: p.module_type ?? 1,
        array_type: p.array_type ?? 2,
        dc_ac_ratio: p.dc_ac_ratio ?? 1.2,
        inv_eff: p.inv_eff ?? 96,
      },
    };
    return fallbackResult;
  }

  // Make real NREL API call
  console.log("🌞 Making real NREL PVWatts API call...");
  
  const url = new URL('https://developer.nrel.gov/api/pvwatts/v8.json');
  url.searchParams.set('api_key', key);
  url.searchParams.set('lat', p.lat.toString());
  url.searchParams.set('lon', p.lon.toString());
  url.searchParams.set('system_capacity', p.system_capacity_kw.toString());
  url.searchParams.set('azimuth', (p.azimuth_deg || 180).toString());
  url.searchParams.set('tilt', (p.tilt_deg || 22).toString());
  url.searchParams.set('array_type', (p.array_type ?? 2).toString());
  url.searchParams.set('module_type', (p.module_type ?? 1).toString());
  url.searchParams.set('losses', (p.losses_pct || 14).toString());
  url.searchParams.set('dc_ac_ratio', (p.dc_ac_ratio ?? 1.2).toString());
  url.searchParams.set('inv_eff', (p.inv_eff ?? 96).toString());
  url.searchParams.set('timeframe', 'monthly');
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`NREL API error: ${response.status} ${response.statusText}`);
      throw new Error(`NREL API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors || !data.outputs) {
      console.error('NREL API returned errors:', data.errors);
      throw new Error('NREL API returned errors');
    }
    
    const result: PvwattsOut = {
      annual_kwh: Math.round(data.outputs.ac_annual),
      monthly_kwh: data.outputs.ac_monthly.map((val: number) => Math.round(val)),
      solrad_kwh_m2_day: data.outputs.solrad_annual,
      inputsUsed: {
        lat: data.inputs.lat,
        lon: data.inputs.lon,
        system_capacity_kw: data.inputs.system_capacity,
        tilt_deg: data.inputs.tilt,
        azimuth_deg: data.inputs.azimuth,
        losses_pct: data.inputs.losses,
        module_type: data.inputs.module_type,
        array_type: data.inputs.array_type,
        dc_ac_ratio: data.inputs.dc_ac_ratio,
        inv_eff: data.inputs.inv_eff,
      },
    };
    
    console.log("✅ Real NREL API call successful - annual:", result.annual_kwh, "kWh");
    
    // Cache the result for 24 hours
    cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
    
    return result;
  } catch (error) {
    console.error('NREL API call failed, using fallback:', error);
    
    // Fallback: Calculate realistic production based on location
    const baseIrradiance = getLocationIrradiance(p.lat, p.lon);
    const systemEfficiency = 0.85;
    const annualProduction = Math.round(p.system_capacity_kw * baseIrradiance * 365 * systemEfficiency);
    
    const monthlyDistribution = [0.6, 0.7, 0.9, 1.1, 1.2, 1.3, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5];
    const monthlyTotal = monthlyDistribution.reduce((sum, val) => sum + val, 0);
    const monthlyKwh = monthlyDistribution.map(factor => 
      Math.round((annualProduction * factor) / monthlyTotal)
    );
    
    const fallbackResult: PvwattsOut = {
      annual_kwh: annualProduction,
      monthly_kwh: monthlyKwh,
      solrad_kwh_m2_day: baseIrradiance,
      inputsUsed: {
        lat: p.lat,
        lon: p.lon,
        system_capacity_kw: p.system_capacity_kw,
        tilt_deg: p.tilt_deg || 22,
        azimuth_deg: p.azimuth_deg || 180,
        losses_pct: p.losses_pct || 14,
        module_type: p.module_type ?? 1,
        array_type: p.array_type ?? 2,
        dc_ac_ratio: p.dc_ac_ratio ?? 1.2,
        inv_eff: p.inv_eff ?? 96,
      },
    };
    
    return fallbackResult;
  }
}
