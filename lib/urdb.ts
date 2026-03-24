export async function getTariffMeta(lat: number, lng: number) {
  const key = process.env.OPENEI_API_KEY!;
  const url = `https://api.openei.org/utility_rates?version=latest&format=json&api_key=${key}&lat=${lat}&lon=${lng}`;
  
  try {
        const r = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24h - daily refresh
    const j = await r.json();
    const item = j.items?.[0];
    
    if (!item) return null;
    
    return {
      utility: item.utility || 'Unknown Utility',
      name: item.name || 'Standard Rate',
      rate: item.energyratestructure?.[0]?.[0]?.rate || 0.15, // $/kWh
      updated: item.startdate || new Date().toISOString().slice(0,10),
      fetched: new Date().toISOString().slice(0,10) // Add fetch date
    };
  } catch (error) {
    console.error('URDB fetch failed:', error);
    return null;
  }
}
