import { NextResponse } from "next/server";

/**
 * Safe debug: is GOOGLE_GEOCODING_API_KEY set, and does it work with Google?
 * GET /api/geo/status → { ok, set, keyPrefix, googleStatus, fix }
 */
export async function GET() {
  const serverKey =
    typeof process.env.GOOGLE_GEOCODING_API_KEY === "string"
      ? process.env.GOOGLE_GEOCODING_API_KEY.trim()
      : "";
  const set = serverKey.length > 0;
  const keyPrefix = set ? serverKey.slice(0, 4) : null;
  const formatOk = keyPrefix === "AIza";

  if (!set) {
    return NextResponse.json({
      ok: false,
      set: false,
      keyPrefix: null,
      googleStatus: null,
      fix: "Set GOOGLE_GEOCODING_API_KEY in Vercel (Project → Settings → Environment Variables → Production). Use a key with Application restriction = None. Redeploy.",
    });
  }
  if (!formatOk) {
    return NextResponse.json({
      ok: false,
      set: true,
      keyPrefix,
      googleStatus: null,
      fix: "Key should start with AIza (capital I). Fix typo in Vercel and redeploy.",
    });
  }

  // Actually call Google to see if the key works (no referrer = server call)
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent("1600 Amphitheatre Parkway, Mountain View, CA")}&key=${serverKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const status = data.status ?? "UNKNOWN";
    const ok = status === "OK";
    const fix =
      status === "REQUEST_DENIED"
        ? "Key is set but Google denied the request. Create a NEW key in Google Cloud: Application restriction = None, API restriction = Geocoding API only. Enable Billing. Set that key as GOOGLE_GEOCODING_API_KEY in Vercel. Do NOT use the same key as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY."
        : status !== "OK"
          ? (data.error_message || status)
          : null;
    return NextResponse.json({
      ok,
      set: true,
      keyPrefix,
      googleStatus: status,
      ...(fix && { fix }),
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      set: true,
      keyPrefix,
      googleStatus: "fetch_error",
      fix: (e instanceof Error ? e.message : String(e)) + " – check network.",
    });
  }
}
