import { NextRequest, NextResponse } from "next/server";

export interface NormalizedAddress {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

/**
 * Use ONLY the server-only key. Never fall back to NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
 * that key is referrer-restricted, so server-side calls from Vercel get REQUEST_DENIED.
 * Read at runtime from process.env only (do not use ENV from config - key is optional there).
 */
function getGeocodingApiKey(): string | undefined {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;
  const raw = typeof key === "string" ? key.trim() : "";
  return raw || undefined;
}

/** Google API keys start with AIza (capital I). Copy-paste often turns I into l. */
function validateKeyFormat(key: string): { ok: true } | { ok: false; error: string } {
  if (!key.startsWith("AIza")) {
    const start = key.slice(0, 4);
    return {
      ok: false,
      error: `API key should start with "AIza" (capital I), got "${start}". Fix typo in GOOGLE_GEOCODING_API_KEY.`,
    };
  }
  return { ok: true };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 },
    );
  }

  const apiKey = getGeocodingApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "GOOGLE_GEOCODING_API_KEY not set. Set it in Vercel (Project → Settings → Environment Variables) with an unrestricted key. Do not use NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for server (referrer restriction causes REQUEST_DENIED). Check /api/geo/status after setting.",
      },
      { status: 503 },
    );
  }

  const keyValidation = validateKeyFormat(apiKey);
  if (!keyValidation.ok) {
    return NextResponse.json(
      { error: keyValidation.error },
      { status: 400 },
    );
  }

  try {
    // Use Google Geocoding API (server key preferred so requests from Vercel are allowed)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      const message = data.error_message ?? data.status;
      const msg = typeof message === "string" ? message : String(message);
      const isRefererRestriction = /referer|referrer|restriction/i.test(msg);
      const isRequestDenied = data.status === "REQUEST_DENIED";
      const hint = isRefererRestriction || isRequestDenied
        ? "Create a NEW key in Google Cloud Console: APIs & Services → Credentials → Create Credentials → API key. Then: (1) Restrict key → Application restriction = None. (2) API restriction = Restrict key → enable only Geocoding API. (3) Enable Billing on the project. (4) Set that key as GOOGLE_GEOCODING_API_KEY in Vercel (Production) and redeploy. Do NOT use the same key as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (that one is referrer-restricted)."
        : undefined;
      return NextResponse.json(
        {
          error: `Geocoding failed: ${data.status}`,
          details: msg,
          googleErrorMessage: data.error_message ?? null,
          ...(hint && { fix: hint }),
        },
        { status: 400 },
      );
    }

    const result = data.results[0];
    const addressComponents = result.address_components || [];

    // Extract address components
    const extractComponent = (types: string[]) => {
      const component = addressComponents.find((comp: any) =>
        comp.types.some((type: string) => types.includes(type)),
      );
      return component ? component.long_name : "";
    };

    const streetNumber = extractComponent(["street_number"]);
    const route = extractComponent(["route"]);
    const street =
      streetNumber && route
        ? `${streetNumber} ${route}`
        : streetNumber || route;

    const normalizedAddress: NormalizedAddress = {
      formattedAddress: result.formatted_address || "",
      street,
      city: extractComponent(["locality"]),
      state: extractComponent(["administrative_area_level_1"]),
      postalCode: extractComponent(["postal_code"]),
      country: extractComponent(["country"]),
      lat: result.geometry?.location?.lat || 0,
      lng: result.geometry?.location?.lng || 0,
    };

    return NextResponse.json(normalizedAddress);
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
