import { NextRequest, NextResponse } from "next/server";
import {
  withTenantScope,
  AuthenticatedRequest,
} from "../../../../src/server/auth/tenantScope";
import { getProduction } from "../../../../src/services/pvwatts";
import { getRate } from "../../../../src/services/rate";
import { computeFinance } from "../../../../src/services/finance";
import { normalizeFromPlace } from "../../../../src/lib/addresses";
import { logger } from "../../../../src/lib/logger";
import { z } from "zod";

const quoteRequestSchema = z.object({
  address: z.string().optional(),
  placeId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  dc_kw: z.number().positive("System size must be positive"),
  tilt: z.number().min(0).max(90).default(20),
  azimuth: z.number().min(0).max(360).default(180),
  module_type: z.number().min(0).max(2).default(0),
  array_type: z.number().min(0).max(4).default(0),
  losses_pct: z.number().min(0).max(100).optional(),
  cost_per_watt: z
    .number()
    .positive("Cost per watt must be positive")
    .optional(),
});

async function handleQuoteCalculation(
  req: AuthenticatedRequest,
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = quoteRequestSchema.parse(body);

    const {
      address,
      placeId,
      lat,
      lng,
      dc_kw,
      tilt,
      azimuth,
      module_type,
      array_type,
      losses_pct,
      cost_per_watt,
    } = validatedData;

    const { tenant } = req;

    logger.info("Quote calculation request:", {
      tenant: tenant.handle,
      dc_kw,
      hasAddress: !!address,
      hasCoordinates: !!(lat && lng),
    });

    let finalLat = lat;
    let finalLng = lng;
    let utilityRate = 0.18; // Default rate

    // If address provided, geocode/normalize
    if (address && !lat && !lng) {
      // Note: In a real implementation, you'd call Google Geocoding API here
      // For now, we'll require coordinates or placeId
      return NextResponse.json(
        {
          error:
            "Address geocoding not yet implemented. Please provide lat/lng or placeId.",
        },
        { status: 400 },
      );
    }

    // If placeId provided, get coordinates
    if (placeId && !lat && !lng) {
      // Note: In a real implementation, you'd call Google Places API here
      // For now, we'll require coordinates
      return NextResponse.json(
        {
          error: "Place ID lookup not yet implemented. Please provide lat/lng.",
        },
        { status: 400 },
      );
    }

    // Validate we have coordinates
    if (!finalLat || !finalLng) {
      return NextResponse.json(
        {
          error:
            "Either lat/lng coordinates or address with geocoding required",
        },
        { status: 400 },
      );
    }

    // Get utility rate for the location
    try {
      const rateResponse = await getRate({ lat: finalLat, lng: finalLng });
      utilityRate = rateResponse.rate;
    } catch (error) {
      logger.warn("Failed to get utility rate, using default:", error);
    }

    // Get solar production via PVWatts
    const production = await getProduction({
      lat: finalLat,
      lng: finalLng,
      dc_kw,
      tilt,
      azimuth,
      module_type,
      array_type,
      losses: losses_pct,
    });

    // Compute financial metrics
    const finance = computeFinance({
      dc_kw,
      cost_per_watt: cost_per_watt || 3.5, // Default $3.50/W
      itc_pct: 30, // 30% ITC
      rate_start: utilityRate,
      rate_escalation: 0.025, // 2.5% default
      degradation: 0.005, // 0.5% default
      oandm_per_kw_year: 15, // $15/kW/year default
      discount_rate: 0.08, // 8% default
    });

    const result = {
      ac_annual: production.ac_annual,
      ac_monthly: production.ac_monthly,
      payback_year: finance.payback_year,
      savings_25yr: finance.savings_25yr,
      npv: finance.npv,
      irr: finance.irr,
      utility_rate: utilityRate,
      system_size_kw: dc_kw,
      location: {
        lat: finalLat,
        lng: finalLng,
      },
    };

    logger.info("Quote calculation completed:", {
      tenant: tenant.handle,
      dc_kw,
      payback_year: finance.payback_year,
      savings_25yr: finance.savings_25yr,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Quote calculation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.format() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withTenantScope(handleQuoteCalculation);
