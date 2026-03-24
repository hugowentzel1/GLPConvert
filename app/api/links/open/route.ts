import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { slug, company } = await request.json();

    if (!slug || !company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get client info
    const userAgent = request.headers.get("user-agent") || "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Outreach link open logging (Supabase links table is for redirect tokens; optional: add link_opens table later)
    try {
      console.log("[Links] Open:", { slug, company, userAgent: userAgent?.slice(0, 50) });
    } catch {
      // no-op
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fail silently - don't break the redirect
    return NextResponse.json({ success: true });
  }
}
