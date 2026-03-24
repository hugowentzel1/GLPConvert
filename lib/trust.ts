import trustData from '@/data/trust.json';

export async function getTrustData() {
  try {
    // Optional: fetch trust data from Supabase or config when needed
    if (process.env.SUPABASE_URL) {
      // Could load from Supabase; for now use local data
      console.log('Using local trust data');
    }
  } catch (error) {
    console.log('Trust fetch failed, using local data:', error);
  }
  
  // Always return local data as fallback
  return trustData;
}
