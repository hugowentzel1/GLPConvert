import { NextRequest, NextResponse } from "next/server";
import {
  withTenantScope,
  AuthenticatedRequest,
} from "../../../../src/server/auth/tenantScope";
import {
  upsertLeadByEmailAndTenant,
  appendLeadNote,
} from "../../../../src/lib/storage";
import { getRate } from "../../../../src/services/rate";
import { logger } from "../../../../src/lib/logger";
import { z } from "zod";
import { corsPreflightOrHeaders } from "../../../../src/lib/cors";

const sampleRequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  company: z.string().optional(),
  companyHandle: z.string().optional(),
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

async function handleSampleRequest(
  req: AuthenticatedRequest,
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = sampleRequestSchema.parse(body);

    const { email, name, company, companyHandle, campaignId, address } =
      validatedData;
    const { tenant } = req;

    logger.info("Sample request webhook:", {
      tenant: tenant.handle,
      email,
      name,
      company,
      companyHandle,
      campaignId,
      hasAddress: !!address,
    });

    // Prepare lead data
    const leadData: any = {
      Name: name,
      Email: email,
      Company: company,
      Status: "Requested Sample",
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
    const lead = await upsertLeadByEmailAndTenant(email, tenant.id, leadData);

    // Append note about sample request
    if (lead.id) {
      await appendLeadNote(
        lead.id,
        `Sample requested on ${new Date().toLocaleDateString()}`,
      );
    }

    logger.info("Sample request processed:", {
      email,
      tenant: tenant.handle,
      leadId: lead.id,
    });

    return NextResponse.json({
      success: true,
      tenant: tenant.handle,
      leadId: lead.id,
      message: "Sample request processed successfully",
    });
  } catch (error) {
    logger.error("Sample request webhook error:", error);

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

export async function OPTIONS(req: Request) {
  return corsPreflightOrHeaders(req) as any;
}

export const POST = withTenantScope(async (req: AuthenticatedRequest) => {
  const cors = corsPreflightOrHeaders(req);
  if (cors instanceof Response) return cors; // OPTIONS handled

  try {
    const body = await req.json();
    const validatedData = sampleRequestSchema.parse(body);

    const { email, name, company, companyHandle, campaignId, address } =
      validatedData;
    const { tenant } = req;

    logger.info("Sample request webhook:", {
      tenant: tenant.handle,
      email,
      name,
      company,
      companyHandle,
      campaignId,
      hasAddress: !!address,
    });

    // Prepare lead data
    const leadData: any = {
      Name: name,
      Email: email,
      Company: company,
      Status: "Requested Sample",
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
    const lead = await upsertLeadByEmailAndTenant(email, tenant.id, leadData);

    // Append note about sample request
    if (lead.id) {
      await appendLeadNote(
        lead.id,
        `Sample requested on ${new Date().toLocaleDateString()}`,
      );
    }

    logger.info("Sample request processed:", {
      email,
      tenant: tenant.handle,
      leadId: lead.id,
    });

    return NextResponse.json(
      {
        success: true,
        tenant: tenant.handle,
        leadId: lead.id,
        message: "Sample request processed successfully",
      },
      { headers: cors as Headers },
    );
  } catch (error) {
    logger.error("Sample request webhook error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.format() },
        { status: 400, headers: cors as Headers },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: cors as Headers },
    );
  }
});
