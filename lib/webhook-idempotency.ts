/**
 * Webhook Idempotency Service
 * 
 * CRITICAL: Prevents duplicate webhook processing in serverless environments
 * Uses Vercel KV (Redis) for distributed state in production
 * Falls back to in-memory for local development
 */

import { kv } from '@vercel/kv';

const IDEMPOTENCY_TTL = 86400; // 24 hours in seconds

// Fallback for local development (when KV not available)
const inMemoryCache = new Map<string, number>();

// Check if KV is available
const isKVAvailable = () => {
  return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
};

/**
 * Check if webhook event has already been processed
 * @param eventId Stripe event ID
 * @returns true if already processed, false if new
 */
export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const key = `webhook:processed:${eventId}`;
  
  try {
    if (isKVAvailable()) {
      // Production: Use Vercel KV (Redis)
      const exists = await kv.get(key);
      return exists !== null;
    } else {
      // Local dev: Use in-memory cache
      console.warn('⚠️  KV not available, using in-memory fallback (not production-safe)');
      const exists = inMemoryCache.has(key);
      
      // Clean old entries (keep last 1000)
      if (inMemoryCache.size > 1000) {
        const entries = Array.from(inMemoryCache.entries());
        inMemoryCache.clear();
        entries.slice(-500).forEach(([k, v]) => inMemoryCache.set(k, v));
      }
      
      return exists;
    }
  } catch (error) {
    console.error('Error checking webhook idempotency:', error);
    // Fail open - better to process twice than never
    return false;
  }
}

/**
 * Mark webhook event as processed
 * @param eventId Stripe event ID
 */
export async function markWebhookProcessed(eventId: string): Promise<void> {
  const key = `webhook:processed:${eventId}`;
  const timestamp = Date.now();
  
  try {
    if (isKVAvailable()) {
      // Production: Use Vercel KV (Redis) with TTL
      await kv.set(key, timestamp, { ex: IDEMPOTENCY_TTL });
      console.log(`✅ Marked webhook ${eventId} as processed (KV)`);
    } else {
      // Local dev: Use in-memory
      inMemoryCache.set(key, timestamp);
      console.log(`✅ Marked webhook ${eventId} as processed (in-memory)`);
    }
  } catch (error) {
    console.error('Error marking webhook as processed:', error);
  }
}

/**
 * Process webhook with idempotency guarantee
 * @param eventId Stripe event ID
 * @param handler Function to execute if event hasn't been processed
 * @returns Result of handler or null if already processed
 */
export async function withIdempotency<T>(
  eventId: string,
  handler: () => Promise<T>
): Promise<T | null> {
  // Check if already processed
  const alreadyProcessed = await isWebhookProcessed(eventId);
  
  if (alreadyProcessed) {
    console.log(`⏭️  Webhook ${eventId} already processed, skipping`);
    return null;
  }
  
  // Mark as processing (to prevent race conditions)
  await markWebhookProcessed(eventId);
  
  // Execute handler
  try {
    const result = await handler();
    console.log(`✅ Webhook ${eventId} processed successfully`);
    return result;
  } catch (error) {
    console.error(`❌ Webhook ${eventId} processing failed:`, error);
    // Don't unmark - we don't want to retry failed webhooks automatically
    // Stripe will retry if we return 500
    throw error;
  }
}

