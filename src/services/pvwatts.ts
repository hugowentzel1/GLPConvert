import { ENV } from "../config/env";
import { logger } from "../lib/logger";
import { retry } from "../lib/retry";

export interface PVWattsRequest {
  lat: number;
  lng: number;
  dc_kw: number;
  tilt?: number;
  azimuth?: number;
  module_type?: number;
  array_type?: number;
  losses?: number;
}

export interface PVWattsResponse {
  ac_annual: number;
  ac_monthly: number[];
  dc_kw: number;
  lat: number;
  lng: number;
}

export async function getProduction(
  request: PVWattsRequest,
): Promise<PVWattsResponse & { degraded?: boolean }> {
  const {
    lat,
    lng,
    dc_kw,
    tilt = 20,
    azimuth = 180,
    module_type = 0,
    array_type = 0,
    losses = ENV.DEFAULT_LOSSES_PCT,
  } = request;

  if (!ENV.NREL_API_KEY) {
    throw new Error("NREL_API_KEY is not configured (optional for GLPConvert-only local dev)");
  }

  const url = new URL("https://developer.nrel.gov/api/pvwatts/v8.json");
  url.searchParams.set("api_key", ENV.NREL_API_KEY);
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lng.toString());
  url.searchParams.set("system_capacity", dc_kw.toString());
  url.searchParams.set("azimuth", azimuth.toString());
  url.searchParams.set("tilt", tilt.toString());
  url.searchParams.set("module_type", module_type.toString());
  url.searchParams.set("array_type", array_type.toString());
  url.searchParams.set("losses", losses.toString());
  url.searchParams.set("timeframe", "hourly");

  try {
    // Add Next.js caching with 14-day revalidation
    const response = await retryWithBackoff(async () => {
      const res = await fetch(url.toString(), {
        next: { revalidate: 60 * 60 * 24 * 14 }, // cache 14 days
      });
      if (!res.ok) {
        throw new Error(`PVWatts API error: ${res.status} ${res.statusText}`);
      }
      return res;
    });

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`PVWatts API errors: ${data.errors.join(", ")}`);
    }

    if (!data.outputs) {
      throw new Error("No outputs in PVWatts response");
    }

    return {
      ac_annual: data.outputs.ac_annual || 0,
      ac_monthly: data.outputs.ac_monthly || [],
      dc_kw,
      lat,
      lng,
    };
  } catch (error) {
    logger.error("PVWatts API call failed, using fallback:", error);

    // Graceful fallback using existing estimate heuristics
    const fallbackProduction = calculateFallbackProduction(request);
    return {
      ...fallbackProduction,
      degraded: true,
    };
  }
}

// Exponential backoff retry function
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 500,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (
        error instanceof Error &&
        error.message.includes("PVWatts API error:")
      ) {
        const statusMatch = error.message.match(/(\d{3})/);
        if (statusMatch) {
          const status = parseInt(statusMatch[1]);
          if (status >= 400 && status < 500 && status !== 429) {
            throw error; // Don't retry client errors except rate limits
          }
        }
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 500ms, 1s, 2s
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Fallback production calculation using heuristics
function calculateFallbackProduction(request: PVWattsRequest): PVWattsResponse {
  const {
    lat,
    lng,
    dc_kw,
    tilt = 20,
    azimuth = 180,
    losses = ENV.DEFAULT_LOSSES_PCT,
  } = request;

  // Simple solar production estimation based on location and system size
  // This is a rough approximation for when PVWatts is unavailable

  // Basic solar irradiance estimation (kWh/m²/day) based on latitude
  const latitudeFactor = Math.max(0.1, 1 - Math.abs(lat) / 90);
  const baseIrradiance = 4.5 * latitudeFactor; // Rough average

  // Tilt factor (optimal around 20-30 degrees)
  const tiltFactor = Math.cos(((tilt - 25) * Math.PI) / 180) * 0.1 + 0.9;

  // Azimuth factor (south-facing is optimal)
  const azimuthFactor = Math.cos(((azimuth - 180) * Math.PI) / 180) * 0.1 + 0.9;

  // System efficiency
  const systemEfficiency = (100 - losses) / 100;

  // Annual production calculation
  const dailyProduction =
    dc_kw * baseIrradiance * tiltFactor * azimuthFactor * systemEfficiency;
  const annualProduction = dailyProduction * 365;

  // Monthly distribution (rough approximation)
  const monthlyFactors = [
    0.6, 0.7, 0.9, 1.1, 1.2, 1.3, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5,
  ];
  const ac_monthly = monthlyFactors.map(
    (factor) => (annualProduction * factor) / 12,
  );

  return {
    ac_annual: annualProduction,
    ac_monthly,
    dc_kw,
    lat,
    lng,
  };
}
