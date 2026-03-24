import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // Require minimum query length
    if (!query || query.length < 3) {
      return NextResponse.json({ predictions: [] });
    }

    // Since the API key has referer restrictions, we'll return a message
    // indicating that autocomplete should be handled client-side
    return NextResponse.json({
      predictions: [],
      message:
        "Autocomplete requires client-side implementation due to API key restrictions",
      clientSide: true,
    });
  } catch (error) {
    console.error("Address autocomplete error:", error);
    return NextResponse.json({ predictions: [] });
  }
}
