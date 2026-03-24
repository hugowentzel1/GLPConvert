import { NextRequest, NextResponse } from "next/server";
import { findLinkByToken, markLinkClicked } from "@/src/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url), 302);
    }

    // Look up the token in Supabase (links table)
    const link = await findLinkByToken(token);

    if (!link) {
      // Token not found, redirect to home
      return NextResponse.redirect(new URL("/", request.url), 302);
    }

    // Mark the link as clicked
    await markLinkClicked(link.id);

    // Construct the target URL with query parameters
    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const target = new URL("/", base);

    // Add the target parameters from the link
    if (link.targetParams) {
      const searchParams = new URLSearchParams(link.targetParams);
      searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });
    }

    // Add the token for attribution
    target.searchParams.set("token", token);

    // Redirect to the target URL
    return NextResponse.redirect(target, 302);
  } catch (error) {
    console.error("Error processing redirect:", error);
    // On error, redirect to home
    return NextResponse.redirect(new URL("/", request.url), 302);
  }
}
