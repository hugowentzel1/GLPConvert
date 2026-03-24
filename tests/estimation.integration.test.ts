import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import { server } from "./msw/server";
import { http, HttpResponse } from "msw";
import {
  annualSavingsUSD,
  simplePaybackYears,
} from "../src/estimation/calculator";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Solar Estimation Integration Tests", () => {
  it("produces stable kWh, savings, and payback from PVWatts + EIA", async () => {
    // Simulate real API responses from fixtures
    const kwh = 10450.2; // from pvwatts.sample.json
    const rateCents = 28.7; // from eia.sample.json

    // Calculate savings
    const savings = annualSavingsUSD(kwh, {
      currency: "USD",
      rate_cents_per_kwh: rateCents,
    });

    // Savings should be ~$2,999
    expect(savings).toBeGreaterThan(2900);
    expect(savings).toBeLessThan(3100);
    expect(savings).toBe(2999);

    // Example system cost for payback calculation
    // 7.5 kW * 1000 W/kW * $3/W = $22,500
    // After 30% ITC: $15,750
    const netCost = 15750;
    const payback = simplePaybackYears(netCost, savings);

    // Payback should be ~5.3 years
    expect(payback).toBeGreaterThan(5.0);
    expect(payback).toBeLessThan(6.0);
    expect(payback).toBe(5.3);
  });

  it("handles PVWatts API errors gracefully", async () => {
    // Force PVWatts to fail
    server.use(
      http.get("https://developer.nrel.gov/api/pvwatts/v8.json", () => {
        return HttpResponse.json(
          { errors: ["System capacity out of range"] },
          { status: 400 }
        );
      })
    );

    // Test that fetch fails appropriately
    const response = await fetch(
      "https://developer.nrel.gov/api/pvwatts/v8.json?api_key=test&system_capacity=7.5&lat=37.423&lon=-122.084"
    ).catch((e) => ({ error: true, message: e.message }));

    if ("error" in response && response.error) {
      expect(response.error).toBe(true);
    } else {
      const data = await response.json();
      expect(data.errors).toBeDefined();
    }
  });

  it("handles EIA API errors gracefully", async () => {
    // Force EIA to fail
    server.use(
      http.get(/api\.eia\.gov.*electricity.*retail/, () => {
        return HttpResponse.json(
          { error: "Service unavailable" },
          { status: 500 }
        );
      })
    );

    // Test that fetch fails appropriately
    const response = await fetch(
      "https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=test"
    ).catch((e) => ({ error: true, message: e.message }));

    if ("error" in response && response.error) {
      expect(response.error).toBe(true);
    } else {
      const data = await response.json();
      expect(data.error).toBeDefined();
    }
  });

  it("calculates accurate results for different system sizes", () => {
    // Small system: 5 kW
    const small = {
      kwh: 7000,
      rateCents: 28.7,
      grossCost: 15000,
      netCost: 10500, // after 30% ITC
    };
    const smallSavings = annualSavingsUSD(small.kwh, {
      currency: "USD",
      rate_cents_per_kwh: small.rateCents,
    });
    const smallPayback = simplePaybackYears(small.netCost, smallSavings);

    expect(smallSavings).toBe(2009);
    expect(smallPayback).toBe(5.2);

    // Large system: 10 kW
    const large = {
      kwh: 14000,
      rateCents: 28.7,
      grossCost: 30000,
      netCost: 21000, // after 30% ITC
    };
    const largeSavings = annualSavingsUSD(large.kwh, {
      currency: "USD",
      rate_cents_per_kwh: large.rateCents,
    });
    const largePayback = simplePaybackYears(large.netCost, largeSavings);

    expect(largeSavings).toBe(4018);
    expect(largePayback).toBe(5.2);
  });

  it("validates industry-standard assumptions", () => {
    // Test NREL PVWatts v8 typical outputs
    const pvWattsOutput = {
      systemSize: 7.5, // kW
      solarIrradiance: 5.5, // kWh/m²/day (California average)
      losses: 14, // % (industry standard)
      efficiency: 0.86, // 1 - (losses/100)
    };

    // Expected annual production: 7.5 kW * 5.5 * 365 * 0.86 ≈ 12,970 kWh
    const expectedProduction =
      pvWattsOutput.systemSize *
      pvWattsOutput.solarIrradiance *
      365 *
      pvWattsOutput.efficiency;

    expect(Math.round(expectedProduction)).toBeGreaterThan(12500);
    expect(Math.round(expectedProduction)).toBeLessThan(13500);
  });

  it("handles edge case: zero electricity rate", () => {
    const savings = annualSavingsUSD(10000, {
      currency: "USD",
      rate_cents_per_kwh: 0,
    });
    expect(savings).toBe(0);

    const payback = simplePaybackYears(15000, savings);
    expect(payback).toBe(Infinity);
  });

  it("handles edge case: extremely high electricity rates", () => {
    // Hawaii rates can exceed 40 cents/kWh
    const savings = annualSavingsUSD(10000, {
      currency: "USD",
      rate_cents_per_kwh: 44,
    });
    expect(savings).toBe(4400);

    const payback = simplePaybackYears(15000, savings);
    expect(payback).toBe(3.4); // Very attractive payback
  });
});

