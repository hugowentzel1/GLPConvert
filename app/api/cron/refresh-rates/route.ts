// app/api/cron/refresh-rates/route.ts
import { NextResponse } from 'next/server';
import { getTariffMeta } from '@/lib/urdb';

// Refresh utility rates for common demo locations
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

export async function GET() {
  try {
    const results = [];
    
    for (const location of DEMO_LOCATIONS) {
      try {
        const tariff = await getTariffMeta(location.lat, location.lng);
        
        results.push({
          location,
          tariff: tariff ? {
            utility: tariff.utility,
            name: tariff.name,
            rate: tariff.rate,
            updated: tariff.updated
          } : null,
          timestamp: new Date().toISOString()
        });
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to refresh rates for ${location.address}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      refreshed: results.length,
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error('Refresh rates cron job failed:', error);
    return NextResponse.json(
      { error: 'Rate refresh failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
