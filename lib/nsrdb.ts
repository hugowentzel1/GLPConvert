/**
 * NREL NSRDB (National Solar Radiation Database) API Integration
 * Free government API for hourly solar irradiance data
 * https://developer.nrel.gov/docs/solar/nsrdb/
 */

import { ENV } from '@/src/config/env';
import { logger } from '@/src/lib/logger';

export interface NSRDBData {
  lat: number;
  lng: number;
  year: number;
  hourlyIrradiance: number[]; // W/m² for each hour of the year (8760 values)
  source: 'nsrdb';
  timestamp: string;
}

/**
 * Get hourly solar irradiance data from NREL NSRDB
 * Uses the Physical Solar Model (PSM) v3 dataset
 * Free API, requires NREL API key
 */
export async function getNSRDBData(
  lat: number,
  lng: number,
  year: number = 2020, // TMY (Typical Meteorological Year) data
): Promise<NSRDBData | null> {
  try {
    if (!ENV.NREL_API_KEY) {
      logger.warn('NREL_API_KEY not configured, skipping NSRDB lookup');
      return null;
    }

    // NREL NSRDB PSM v3 API endpoint
    const url = new URL('https://developer.nrel.gov/api/nsrdb/v2/solar/psm3-download.json');
    url.searchParams.set('api_key', ENV.NREL_API_KEY);
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lng.toString());
    url.searchParams.set('radius', '0'); // Single point
    url.searchParams.set('names', year.toString());
    url.searchParams.set('attributes', 'ghi,dni,dhi'); // Global, Direct, Diffuse Horizontal Irradiance
    url.searchParams.set('interval', '60'); // 60-minute intervals
    url.searchParams.set('utc', 'false'); // Local time
    url.searchParams.set('email', 'support@getsunspire.com'); // Required by API

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(30000), // 30s timeout (API can be slow)
    });

    if (!response.ok) {
      throw new Error(`NREL NSRDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`NREL NSRDB API errors: ${data.errors.join(', ')}`);
    }

    if (!data.outputs || !data.outputs.ghi) {
      throw new Error('No irradiance data in NSRDB response');
    }

    // Extract GHI (Global Horizontal Irradiance) values
    const hourlyIrradiance = data.outputs.ghi as number[];

    if (!Array.isArray(hourlyIrradiance) || hourlyIrradiance.length !== 8760) {
      logger.warn(`NSRDB: Expected 8760 hourly values, got ${hourlyIrradiance?.length || 0}`);
      return null;
    }

    return {
      lat,
      lng,
      year,
      hourlyIrradiance,
      source: 'nsrdb',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('NREL NSRDB irradiance lookup failed:', error);
    return null;
  }
}

/**
 * Calculate shading-adjusted irradiance using NSRDB data
 * Applies hourly shading factors to raw irradiance values
 */
export function applyShadingToIrradiance(
  hourlyIrradiance: number[],
  hourlyShadingFactors: number[],
): number[] {
  if (hourlyIrradiance.length !== hourlyShadingFactors.length) {
    logger.warn('Irradiance and shading factor arrays have different lengths');
    return hourlyIrradiance; // Return unadjusted if mismatch
  }

  return hourlyIrradiance.map((irr, i) => irr * hourlyShadingFactors[i]);
}

/**
 * Calculate annual production from hourly irradiance data
 * Uses system efficiency and shading factors
 */
export function calculateProductionFromIrradiance(
  hourlyIrradiance: number[],
  systemSizeKw: number,
  systemEfficiency: number = 0.85, // 85% system efficiency (inverter + losses)
  hourlyShadingFactors?: number[],
): number {
  // Apply shading if provided
  const adjustedIrradiance = hourlyShadingFactors
    ? applyShadingToIrradiance(hourlyIrradiance, hourlyShadingFactors)
    : hourlyIrradiance;

  // Calculate annual production
  // Formula: sum(hourly_irradiance * system_size * efficiency) / 1000 to convert to kWh
  const annualKwh = adjustedIrradiance.reduce((sum, irr) => {
    // Convert W/m² to kWh using system size and efficiency
    // Standard panel efficiency ~20%, so 1 kW system = ~5 m²
    const panelArea = systemSizeKw * 5; // m²
    const hourlyProduction = (irr * panelArea * systemEfficiency) / 1000; // kWh
    return sum + hourlyProduction;
  }, 0);

  return Math.round(annualKwh);
}
