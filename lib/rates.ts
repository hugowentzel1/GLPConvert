import 'server-only';
import { cache } from './cache';
import { retryEIA } from './retry';

export type RateResult = {
  rate: number;
  source: "eia" | "state_fallback" | "generic";
  state?: string;
  zip?: string;
};

const STATE_FALLBACK: Record<string, number> = {
  AL: 0.14,
  AK: 0.24,
  AZ: 0.14,
  AR: 0.12,
  CA: 0.3,
  CO: 0.16,
  CT: 0.33,
  DC: 0.16,
  DE: 0.17,
  FL: 0.15,
  GA: 0.15,
  HI: 0.44,
  IA: 0.14,
  ID: 0.11,
  IL: 0.17,
  IN: 0.15,
  KS: 0.15,
  KY: 0.13,
  LA: 0.12,
  MA: 0.32,
  MD: 0.19,
  ME: 0.27,
  MI: 0.19,
  MN: 0.16,
  MO: 0.13,
  MS: 0.14,
  MT: 0.14,
  NC: 0.15,
  ND: 0.12,
  NE: 0.12,
  NH: 0.28,
  NJ: 0.2,
  NM: 0.15,
  NV: 0.16,
  NY: 0.25,
  OH: 0.15,
  OK: 0.12,
  OR: 0.15,
  PA: 0.17,
  RI: 0.3,
  SC: 0.15,
  SD: 0.14,
  TN: 0.13,
  TX: 0.16,
  UT: 0.12,
  VA: 0.15,
  VT: 0.26,
  WA: 0.12,
  WI: 0.18,
  WV: 0.14,
  WY: 0.12,
};

async function getEIACacheKey(state: string): Promise<string> {
  const { createHash } = await import('node:crypto');
  const hash = createHash('sha1');
  hash.update(state);
  return `eia:${hash.digest('hex')}`;
}

export async function getRate(state?: string): Promise<RateResult> {
  if (!state) return { rate: 0.18, source: "generic" };

  // Check cache first
  const cacheKey = await getEIACacheKey(state);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { ENV } = await import('./env');
  const key = ENV.EIA_API_KEY;
  if (key) {
    try {
      const result = await retryEIA(async () => {
        const u = new URL(
          "https://api.eia.gov/v2/electricity/retail-sales/data/",
        );
        // Annual average residential price by state, latest period
        u.searchParams.set("api_key", key);
        u.searchParams.set("frequency", "annual");
        u.searchParams.set("data", "price");
        u.searchParams.set("facets[stateid][]", state); // e.g., "CA"
        u.searchParams.set("facets[sectorid][]", "RES"); // residential
        u.searchParams.set("sort", "period:desc");
        u.searchParams.set("length", "1");
        const res = await fetch(u.toString(), { cache: "no-store" });
        const json = await res.json();
        const price = json?.response?.data?.[0]?.price;
        if (typeof price === "number" && price > 0.01 && price < 1) {
          return { rate: price, source: "eia" as const, state };
        }
        throw new Error('Invalid price data');
      });
      
      // Cache the result for 24 hours
      cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
      return result;
    } catch (e) {
      /* fall through */
    }
  }
  
  const fallbackResult = STATE_FALLBACK[state]
    ? { rate: STATE_FALLBACK[state], source: "state_fallback" as const, state }
    : { rate: 0.18, source: "generic" as const };
  
  // Cache fallback result too
  cache.set(cacheKey, fallbackResult, 24 * 60 * 60 * 1000);
  return fallbackResult;
}
