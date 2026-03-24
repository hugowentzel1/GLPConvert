export interface ShadingAnalysis {
  method: 'proxy' | 'satellite' | 'lidar' | 'usgs';
  accuracy: 'low' | 'medium' | 'high';
  shadingFactor: number; // 0-1, where 1 = no shading, 0 = complete shading
  confidence: number; // 0-1 confidence level
  dataSource: string;
  lastUpdated: string;
}

export interface ObstructionData {
  type: 'tree' | 'building' | 'mountain' | 'unknown';
  height: number; // meters
  distance: number; // meters
  azimuth: number; // degrees
  shadingImpact: number; // 0-1
}

/**
 * Enhanced shading analysis using USGS 3DEP elevation data
 * Falls back to proxy method if USGS API is unavailable
 */
export async function analyzeShading(
  lat: number, 
  lng: number, 
  roofTilt: number = 22, 
  roofAzimuth: number = 180
): Promise<ShadingAnalysis> {
  
  // Try USGS 3DEP elevation data first
  try {
    const { getElevation } = await import('./usgs-3dep');
    const elevationData = await getElevation(lat, lng);
    
    if (elevationData) {
      // Get surrounding elevation points (8 cardinal + intercardinal directions)
      const surroundingPoints = [
        { lat: lat + 0.001, lng: lng }, // North
        { lat: lat + 0.001, lng: lng + 0.001 }, // Northeast
        { lat: lat, lng: lng + 0.001 }, // East
        { lat: lat - 0.001, lng: lng + 0.001 }, // Southeast
        { lat: lat - 0.001, lng: lng }, // South
        { lat: lat - 0.001, lng: lng - 0.001 }, // Southwest
        { lat: lat, lng: lng - 0.001 }, // West
        { lat: lat + 0.001, lng: lng - 0.001 }, // Northwest
      ];
      
      const { getElevations, calculateTerrainShading } = await import('./usgs-3dep');
      const surroundingElevations = await getElevations(surroundingPoints);
      const validElevations = surroundingElevations
        .filter((e): e is NonNullable<typeof e> => e !== null)
        .map(e => e.elevation);
      
      if (validElevations.length > 0) {
        const terrainShading = calculateTerrainShading(
          elevationData.elevation,
          validElevations,
          roofTilt,
          roofAzimuth
        );
        
        // Combine terrain shading with orientation-based shading
        const orientationShading = calculateProxyShadingFactor(lat, lng, roofTilt, roofAzimuth);
        const combinedShading = (terrainShading * 0.6) + (orientationShading * 0.4);
        
        return {
          method: 'usgs',
          accuracy: 'high',
          shadingFactor: Math.max(0.7, Math.min(0.95, combinedShading)),
          confidence: 0.85,
          dataSource: 'USGS 3DEP Elevation Data',
          lastUpdated: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.warn('USGS 3DEP lookup failed, falling back to proxy:', error);
  }
  
  // Fallback to proxy method
  const shadingFactor = calculateProxyShadingFactor(lat, lng, roofTilt, roofAzimuth);
  
  return {
    method: 'proxy',
    accuracy: 'medium',
    shadingFactor,
    confidence: 0.7,
    dataSource: 'Geographic Proxy (USGS 3DEP unavailable)',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculate proxy shading factor based on geographic location and roof orientation
 * This simulates what real USGS analysis would provide
 */
function calculateProxyShadingFactor(
  lat: number, 
  lng: number, 
  roofTilt: number, 
  roofAzimuth: number
): number {
  
  // Base shading factor (0.8-0.95 range)
  let baseFactor = 0.9;
  
  // Adjust for latitude (more shading in northern latitudes due to lower sun angles)
  if (lat > 40) baseFactor -= 0.05;
  if (lat > 50) baseFactor -= 0.05;
  
  // Adjust for roof orientation
  // South-facing roofs (180°) get less shading
  const azimuthDiff = Math.abs(roofAzimuth - 180);
  if (azimuthDiff > 90) baseFactor -= 0.05; // East/West facing
  if (azimuthDiff > 135) baseFactor -= 0.05; // North facing
  
  // Adjust for roof tilt
  // Steeper roofs get slightly more shading
  if (roofTilt > 30) baseFactor -= 0.02;
  if (roofTilt > 45) baseFactor -= 0.03;
  
  // Add some regional variation based on longitude (simulating terrain)
  const regionFactor = Math.sin(lng * Math.PI / 180) * 0.02;
  baseFactor += regionFactor;
  
  // Ensure factor stays within reasonable bounds
  return Math.max(0.75, Math.min(0.95, baseFactor));
}

/**
 * Get hourly shading factors for a typical year
 * Uses NSRDB irradiance data if available for more accurate hourly shading
 */
export async function getHourlyShadingFactors(
  lat: number, 
  lng: number, 
  roofTilt: number = 22, 
  roofAzimuth: number = 180
): Promise<number[]> {
  
  // Try to use NSRDB data for more accurate hourly shading
  try {
    const { getNSRDBData } = await import('./nsrdb');
    const nsrdbData = await getNSRDBData(lat, lng);
    
    if (nsrdbData && nsrdbData.hourlyIrradiance.length === 8760) {
      // Use NSRDB irradiance patterns to calculate hourly shading
      // Lower irradiance = more shading impact
      const maxIrradiance = Math.max(...nsrdbData.hourlyIrradiance);
      const hourlyFactors = nsrdbData.hourlyIrradiance.map(irr => {
        // Normalize irradiance to shading factor (0.7-0.95 range)
        const normalized = irr / maxIrradiance;
        return 0.7 + (normalized * 0.25); // Scale to 0.7-0.95
      });
      
      return hourlyFactors;
    }
  } catch (error) {
    console.warn('NSRDB lookup failed, using proxy hourly factors:', error);
  }
  
  // Fallback to proxy method with seasonal/daily variation
  const baseFactor = calculateProxyShadingFactor(lat, lng, roofTilt, roofAzimuth);
  
  // Generate 8760 hourly factors with seasonal variation
  const hourlyFactors: number[] = [];
  
  for (let hour = 0; hour < 8760; hour++) {
    const dayOfYear = Math.floor(hour / 24);
    const hourOfDay = hour % 24;
    
    // Seasonal variation (more shading in winter due to lower sun angles)
    const seasonalFactor = 1 + 0.1 * Math.cos(2 * Math.PI * dayOfYear / 365);
    
    // Daily variation (more shading in early morning/late evening)
    const dailyFactor = 1 + 0.05 * Math.cos(2 * Math.PI * (hourOfDay - 12) / 24);
    
    const hourlyFactor = baseFactor * seasonalFactor * dailyFactor;
    hourlyFactors.push(Math.max(0.5, Math.min(1.0, hourlyFactor)));
  }
  
  return hourlyFactors;
}

/**
 * Calculate annual shading loss percentage
 */
export function calculateAnnualShadingLoss(shadingFactors: number[]): number {
  const averageFactor = shadingFactors.reduce((sum, factor) => sum + factor, 0) / shadingFactors.length;
  return Math.round((1 - averageFactor) * 100 * 10) / 10; // Round to 1 decimal place
}
