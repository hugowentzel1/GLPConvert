import { NextRequest, NextResponse } from "next/server";

// Mock coordinates for different cities - in production, you'd use Google Geocoding API
const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "new york": { lat: 40.7128, lng: -74.006 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  houston: { lat: 29.7604, lng: -95.3698 },
  phoenix: { lat: 33.4484, lng: -112.074 },
  philadelphia: { lat: 39.9526, lng: -75.1652 },
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  dallas: { lat: 32.7767, lng: -96.797 },
  "san jose": { lat: 37.3382, lng: -121.8863 },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Try to find coordinates for the address
  const addressLower = address.toLowerCase();
  let coordinates = null;

  // Check if any city name is in the address
  for (const [city, coords] of Object.entries(mockCoordinates)) {
    if (addressLower.includes(city)) {
      coordinates = coords;
      break;
    }
  }

  // If no specific city found, return default coordinates (New York)
  if (!coordinates) {
    coordinates = { lat: 40.7128, lng: -74.006 };
  }

  return NextResponse.json({ coordinates });
}
