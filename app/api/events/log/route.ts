import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/src/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, companyHandle, type, metadata, campaignId } = body;

    // Validate required fields
    if (!companyHandle || !type) {
      return NextResponse.json(
        { error: "companyHandle and type are required" },
        { status: 400 },
      );
    }

    // Validate event type
    const validTypes = [
      "demo_open",
      "address_selected",
      "activation_clicked",
      "signup_complete",
      "report_generated",
      "lead_submitted",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid event type. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    await logEvent({
      tenantId: companyHandle, // Use companyHandle as tenantId for now
      type,
      metadata: {
        email,
        campaignId,
        ...metadata,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event logging error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
