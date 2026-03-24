import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, address } = body;

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        { error: "Name, email, and address are required" },
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

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, you would:
    // 1. Save to your database (Supabase)
    // 2. Send notification emails
    // 3. Integrate with CRM systems
    // 4. Track analytics

    console.log("Lead submitted:", {
      name,
      email,
      address,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      leadId: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
