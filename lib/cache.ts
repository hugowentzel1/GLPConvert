interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry>();

  set(key: string, data: any, ttlMs: number = 24 * 60 * 60 * 1000) { // 24 hours default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

/** Key builders for cache invalidation (e.g. GDPR delete). */
export const CACHE_KEYS = {
  tenant: (email: string) => `tenant:${email}`,
};

/** Invalidate a specific cache key (used by GDPR delete). */
export async function invalidateCache(key: string): Promise<void> {
  cache.delete(key);
}

// Cleanup on-demand instead of setInterval (serverless compatible)
// setInterval is incompatible with Vercel's serverless functions
