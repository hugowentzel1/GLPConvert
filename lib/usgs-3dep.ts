/**
 * USGS 3DEP Elevation API Integration
 * Free government API for elevation data used in shading analysis
 * https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer
 */

import { ENV } from '@/src/config/env';
import { logger } from '@/src/lib/logger';

export interface ElevationData {
  elevation: number; // meters
  lat: number;
  lng: number;
  resolution: number; // meters
  source: 'usgs-3dep';
  timestamp: string;
}

/**
 * Get elevation for a single point using USGS 3DEP
 * Free API, no authentication required
 */
export async function getElevation(
  lat: number,
  lng: number,
): Promise<ElevationData | null> {
  try {
    // USGS 3DEP ArcGIS REST API endpoint
    const url = new URL('https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify');
    url.searchParams.set('f', 'json');
    url.searchParams.set('geometry', JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }));
    url.searchParams.set('geometryType', 'esriGeometryPoint');
    url.searchParams.set('returnGeometry', 'false');
    url.searchParams.set('pixelSize', '10'); // 10m resolution

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`USGS 3DEP API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`USGS 3DEP API error: ${data.error.message || 'Unknown error'}`);
    }

    // Extract elevation value from response
    const elevation = data.value !== undefined ? data.value : null;

    if (elevation === null || !Number.isFinite(elevation)) {
      logger.warn(`USGS 3DEP: No elevation data for lat=${lat}, lng=${lng}`);
      return null;
    }

    return {
      elevation,
      lat,
      lng,
      resolution: 10, // 10m resolution
      source: 'usgs-3dep',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('USGS 3DEP elevation lookup failed:', error);
    return null;
  }
}

/**
 * Get elevation data for multiple points (batch)
 * USGS API supports up to 100 points per request
 */
export async function getElevations(
  points: Array<{ lat: number; lng: number }>,
): Promise<Array<ElevationData | null>> {
  // Process in batches of 50 to avoid overwhelming the API
  const batchSize = 50;
  const results: Array<ElevationData | null> = [];

  for (let i = 0; i < points.length; i += batchSize) {
    const batch = points.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((point) => getElevation(point.lat, point.lng)),
    );
    results.push(...batchResults);

    // Small delay between batches to be respectful
    if (i + batchSize < points.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Calculate terrain shading impact based on elevation data
 * Returns shading factor (0-1) where 1 = no shading, 0 = complete shading
 */
export function calculateTerrainShading(
  siteElevation: number,
  surroundingElevations: number[],
  roofTilt: number,
  roofAzimuth: number,
): number {
  if (surroundingElevations.length === 0) {
    return 0.9; // Default if no surrounding data
  }

  // Calculate average elevation difference
  const avgElevationDiff = surroundingElevations.reduce((sum, elev) => sum + (elev - siteElevation), 0) / surroundingElevations.length;

  // If site is lower than surroundings, there's potential shading
  if (avgElevationDiff > 0) {
    // More shading if site is significantly lower
    const shadingImpact = Math.min(0.3, avgElevationDiff / 100); // Max 30% shading impact
    return Math.max(0.7, 1 - shadingImpact);
  }

  // Site is at or above surrounding terrain - minimal shading
  return 0.95;
}
