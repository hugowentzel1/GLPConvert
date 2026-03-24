import { NextRequest, NextResponse } from "next/server";
import {
  withTenantScope,
  AuthenticatedRequest,
} from "../../../../src/server/auth/tenantScope";
import { upsertLeadByEmailAndTenant } from "../../../../src/lib/storage";
import { getRate } from "../../../../src/services/rate";
import { logger } from "../../../../src/lib/logger";
import { z } from "zod";

const ctaClickSchema = z.object({
  email: z.string().email().optional(),
  campaignId: z.string().optional(),
  address: z
    .object({
      formattedAddress: z.string(),
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      placeId: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      latLng: z.string().optional(),
    })
    .optional(),
});

async function handleCtaClick(
  req: AuthenticatedRequest,
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = ctaClickSchema.parse(body);

    const { email, campaignId, address } = validatedData;
    const { tenant } = req;

    logger.info("CTA click tracking request:", {
      tenant: tenant.handle,
      email,
      campaignId,
      hasAddress: !!address,
    });

    // If email provided, upsert lead with "Clicked Demo" status
    if (email) {
      const leadData: any = {
        Status: "Clicked Demo",
        "Last Activity": new Date().toISOString(),
      };

      if (campaignId) {
        leadData["Campaign ID"] = campaignId;
      }

      // If address provided, save components and compute utility rate
      if (address) {
        leadData["Formatted Address"] = address.formattedAddress;
        leadData["Street"] = address.street;
        leadData["City"] = address.city;
        leadData["State"] = address.state;
        leadData["Postal Code"] = address.postalCode;
        leadData["Country"] = address.country;
        leadData["Place ID"] = address.placeId;
        leadData["Latitude"] = address.lat;
        leadData["Longitude"] = address.lng;

        // Compute utility rate if we have location data
        if (address.postalCode || (address.lat && address.lng)) {
          try {
            const rateResponse = await getRate({
              postalCode: address.postalCode,
              lat: address.lat,
              lng: address.lng,
            });
            leadData["Utility Rate ($/kWh)"] = rateResponse.rate;
          } catch (error) {
            logger.warn("Failed to get utility rate:", error);
          }
        }
      }

      // Upsert lead
      await upsertLeadByEmailAndTenant(email, tenant.id, leadData);

      logger.info("Lead upserted for CTA click tracking:", {
        email,
        tenant: tenant.handle,
      });
    }

    return NextResponse.json({
      success: true,
      tenant: tenant.handle,
      tracked: !!email,
    });
  } catch (error) {
    logger.error("CTA click tracking error:", error);

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

export const POST = withTenantScope(handleCtaClick);
