import { NextRequest, NextResponse } from "next/server";
import { upsertTenantByHandle } from "../../../../src/lib/storage";
import { logger } from "../../../../src/lib/logger";
import { nanoid } from "nanoid";
import { z } from "zod";
import { ENV } from "@/src/config/env";
import { timingSafeCompare } from "@/src/lib/timing-safe-compare";

const createTenantSchema = z.object({
  companyHandle: z.string().min(1, "Company handle is required"),
  plan: z.string().optional(),
  brandColors: z.string().optional(),
  logoURL: z.string().url().optional(),
  domainUrl: z.string().url().optional(),
});

async function handleCreateTenant(req: NextRequest): Promise<NextResponse> {
  try {
    // Check admin token (timing-safe comparison)
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || !ENV.ADMIN_TOKEN || !timingSafeCompare(adminToken, ENV.ADMIN_TOKEN)) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid admin token" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validatedData = createTenantSchema.parse(body);

    const { companyHandle, plan, brandColors, logoURL, domainUrl } =
      validatedData;

    logger.info("Admin tenant creation request:", {
      companyHandle,
      plan,
      hasBrandColors: !!brandColors,
      hasLogo: !!logoURL,
      hasDomain: !!domainUrl,
    });

    // Generate random 32+ char API key
    const apiKey = nanoid(32);

    // Determine capture URL
    let captureUrl: string;
    if (domainUrl) {
      captureUrl = `${domainUrl}/v1/ingest/lead`;
    } else {
      // Use your root domain
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      captureUrl = `${protocol}://${host}/v1/ingest/lead`;
    }

    // Prepare tenant data
    const tenantData = {
      "Company Handle": companyHandle,
      Plan: plan || "Basic",
      "Brand Colors": brandColors,
      "Logo URL": logoURL,
      "API Key": apiKey,
      "Capture URL": captureUrl,
    };

    // Create/update tenant
    const tenant = await upsertTenantByHandle(companyHandle, tenantData);

    logger.info("Tenant created successfully:", {
      companyHandle,
      tenantId: tenant.id,
      apiKey: apiKey.substring(0, 8) + "...", // Log partial key for security
    });

    return NextResponse.json({
      tenantId: tenant.id,
      apiKey,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://app.sunspire.com"}/${companyHandle}`,
      captureUrl,
    });
  } catch (error) {
    logger.error("Admin tenant creation error:", error);

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

export const POST = handleCreateTenant;
