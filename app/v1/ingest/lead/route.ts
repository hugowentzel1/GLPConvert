import { NextRequest, NextResponse } from "next/server";
import {
  findTenantByApiKey,
  upsertLeadByEmailAndTenant,
} from "../../../../src/lib/storage";
import { getRate } from "../../../../src/services/rate";
import { logger } from "../../../../src/lib/logger";
import { z } from "zod";
import { corsPreflightOrHeaders } from "../../../../src/lib/cors";

// In-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const leadIngestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
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
    })
    .optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
});

// Rate limiting: 60 req/min per API key
function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const current = rateLimitMap.get(apiKey);

  if (!current || now > current.resetTime) {
    // Reset or create new window
    rateLimitMap.set(apiKey, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= 60) {
    return false; // Rate limit exceeded
  }

  current.count++;
  return true;
}

export async function OPTIONS(req: Request) {
  return corsPreflightOrHeaders(req) as any;
}

export const POST = async (req: NextRequest) => {
  const cors = corsPreflightOrHeaders(req);
  if (cors instanceof Response) return cors; // OPTIONS handled

  try {
    // Check API key in header
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401, headers: cors as Headers },
      );
    }

    // Find tenant by API key
    const tenant = await findTenantByApiKey(apiKey);
    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: cors as Headers },
      );
    }

    // Check rate limit
    if (!checkRateLimit(apiKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 60 requests per minute." },
        { status: 429, headers: cors as Headers },
      );
    }

    const body = await req.json();
    const validatedData = leadIngestSchema.parse(body);

    const { name, email, company, address, utm } = validatedData;

    logger.info("Lead ingest request:", {
      tenant: tenant["Company Handle"],
      email,
      name,
      company,
      hasAddress: !!address,
      hasUtm: !!utm,
    });

    // Prepare lead data
    const leadData: any = {
      Name: name,
      Email: email,
      Company: company,
      Status: "New",
      "Last Activity": new Date().toISOString(),
    };

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

    // Add UTM parameters if provided
    if (utm) {
      const utmString = Object.entries(utm)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      if (utmString) {
        leadData["Campaign ID"] = utmString;
      }
    }

    // Upsert lead
    const lead = await upsertLeadByEmailAndTenant(email, tenant.id!, leadData);

    logger.info("Lead ingested successfully:", {
      email,
      tenant: tenant["Company Handle"],
      leadId: lead.id,
    });

    return NextResponse.json(
      {
        ok: true,
        leadId: lead.id,
        tenant: tenant["Company Handle"],
      },
      { headers: cors as Headers },
    );
  } catch (error) {
    logger.error("Lead ingest error:", error);

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
};
