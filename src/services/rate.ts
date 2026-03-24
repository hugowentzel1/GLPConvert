import { ENV } from "../config/env";
import { logger } from "../lib/logger";
import { retry } from "../lib/retry";

export interface RateRequest {
  postalCode?: string;
  lat?: number;
  lng?: number;
}

export interface RateResponse {
  rate: number;
  source: "EIA" | "default";
  postalCode?: string;
  lat?: number;
  lng?: number;
}

export async function getRate(request: RateRequest): Promise<RateResponse> {
  try {
    // Try EIA API first
    if (request.postalCode || (request.lat && request.lng)) {
      const rate = await getRateFromEIA(request);
      return {
        rate,
        source: "EIA",
        postalCode: request.postalCode,
        lat: request.lat,
        lng: request.lng,
      };
    }
  } catch (error) {
    logger.warn("Failed to get rate from EIA API, using default:", error);
  }

  // Fallback to default rate
  return {
    rate: 0.18, // Default rate from ENV or hardcoded fallback
    source: "default",
    postalCode: request.postalCode,
    lat: request.lat,
    lng: request.lng,
  };
}

async function getRateFromEIA(request: RateRequest): Promise<number> {
  const { postalCode, lat, lng } = request;

  // Build EIA API URL based on available data
  let url: string;
  if (postalCode) {
    url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${ENV.EIA_API_KEY}&frequency=monthly&data[0]=price&facets[stateid][]=${postalCode.substring(0, 2)}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
  } else if (lat && lng) {
    // Use reverse geocoding to get state from coordinates
    // For now, fallback to default since we need state mapping
    throw new Error("Lat/Lng rate lookup not yet implemented");
  } else {
    throw new Error("Either postalCode or lat/lng required");
  }

  const response = await retry(async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`EIA API error: ${res.status} ${res.statusText}`);
    }
    return res;
  });

  const data = await response.json();

  // Extract rate from EIA response
  if (data.response?.data?.[0]?.price) {
    return data.response.data[0].price;
  }

  throw new Error("No rate data found in EIA response");
}
