import { NextRequest, NextResponse } from "next/server";
import { upsertLead } from "@/src/lib/storage";
import { checkRateLimit } from "@/src/lib/ratelimit";

// Helper function to extract client IP
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(request);
  if (checkRateLimit(clientIP, "leads-upsert")) {
    console.warn(`Rate limited: ${clientIP} for leads-upsert`);
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();

    const {
      email,
      fullName,
      company,
      companyHandle,
      address,
      lat,
      lng,
      crm,
      source,
      campaignId,
    } = body;

    // Validate required fields
    if (!email || !companyHandle) {
      return NextResponse.json(
        { error: "Email and companyHandle are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    await upsertLead({
      name: fullName, // Map fullName to name
      email,
      address,
      tenantSlug: companyHandle, // Map companyHandle to tenantSlug
      notes: `Company: ${company}, CRM: ${crm}, Source: ${source}, Campaign: ${campaignId}, Lat: ${lat}, Lng: ${lng}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead upsert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
