import { NextRequest, NextResponse } from "next/server";
import { listLeadsForTenant } from "@/src/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyHandle = searchParams.get("company");

    if (!companyHandle) {
      return NextResponse.json(
        { error: "Company handle required" },
        { status: 400 },
      );
    }

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }
    const { findTenantByApiKey } = await import("@/src/lib/storage");
    const tenant = await findTenantByApiKey(apiKey);
    if (!tenant || (tenant as { "Company Handle": string })["Company Handle"] !== companyHandle) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await listLeadsForTenant(companyHandle);
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
