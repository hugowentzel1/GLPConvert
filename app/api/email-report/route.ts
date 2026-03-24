import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, company, source } = body;

    // Log the email request for debugging
    console.log("Email report request:", { address, company, source });

    // TODO: Implement actual email sending logic here
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Report email sent successfully",
    });
  } catch (error) {
    console.error("Email report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
