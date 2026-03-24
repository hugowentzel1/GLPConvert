// app/api/cron/precompute-pvwatts/route.ts
import { NextResponse } from 'next/server';
import { pvwatts } from '@/lib/pvwatts';

// Precompute PVWatts data for common demo locations
const DEMO_LOCATIONS = [
  { lat: 40.7128, lng: -74.0060, address: 'New York, NY', state: 'NY' },
  { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA', state: 'CA' },
  { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA', state: 'CA' },
  { lat: 41.8781, lng: -87.6298, address: 'Chicago, IL', state: 'IL' },
  { lat: 29.7604, lng: -95.3698, address: 'Houston, TX', state: 'TX' },
  { lat: 33.4484, lng: -112.0740, address: 'Phoenix, AZ', state: 'AZ' },
  { lat: 25.7617, lng: -80.1918, address: 'Miami, FL', state: 'FL' },
  { lat: 47.6062, lng: -122.3321, address: 'Seattle, WA', state: 'WA' }
];

const COMMON_SYSTEM_SIZES = [5, 7.2, 10, 12, 15]; // kW

export async function GET() {
  try {
    const results = [];
    
    for (const location of DEMO_LOCATIONS) {
      for (const systemSize of COMMON_SYSTEM_SIZES) {
        try {
          const pvResult = await pvwatts({
            lat: location.lat,
            lon: location.lng,
            system_capacity_kw: systemSize,
            tilt_deg: 22, // Default residential tilt
            azimuth_deg: 180, // South-facing
            losses_pct: 14 // Standard losses
          });
          
          results.push({
            location,
            systemSize,
            annualProduction: pvResult.annual_kwh,
            monthlyProduction: pvResult.monthly_kwh,
            timestamp: new Date().toISOString()
          });
          
          // Small delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to precompute for ${location.address} ${systemSize}kW:`, error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      precomputed: results.length,
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error('Precompute PVWatts cron job failed:', error);
    return NextResponse.json(
      { error: 'Precompute failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
