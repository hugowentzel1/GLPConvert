/**
 * Dead Letter Queue (DLQ) for Failed Webhook Events
 * Stores failed webhook events for manual review and replay
 */

import { kv } from '@vercel/kv';
import { ENV } from '@/src/config/env';

const DLQ_TTL = 2592000; // 30 days in seconds
const DLQ_PREFIX = 'dlq:webhook:';
const DLQ_INDEX_KEY = 'dlq:index';

interface FailedWebhookEvent {
  eventId: string;
  eventType: string;
  livemode: boolean;
  timestamp: string;
  error: string;
  payload: any;
  retryCount: number;
}

interface DLQIndex {
  eventIds: string[];
  lastUpdated: string;
}

// Fallback for local development
const inMemoryDLQ: Map<string, FailedWebhookEvent> = new Map();
const inMemoryIndex: string[] = [];

const isKVAvailable = () => {
  return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
};

/**
 * Store a failed webhook event in DLQ
 */
export async function storeFailedWebhook(
  eventId: string,
  eventType: string,
  livemode: boolean,
  error: Error | string,
  payload: any,
  retryCount: number = 0,
): Promise<void> {
  const key = `${DLQ_PREFIX}${eventId}`;
  const failedEvent: FailedWebhookEvent = {
    eventId,
    eventType,
    livemode,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
    payload,
    retryCount,
  };

  try {
    if (isKVAvailable()) {
      await kv.set(key, JSON.stringify(failedEvent), { ex: DLQ_TTL });
      
      // Update index
      const indexData = await kv.get<DLQIndex>(DLQ_INDEX_KEY);
      const index: DLQIndex = indexData || { eventIds: [], lastUpdated: new Date().toISOString() };
      
      if (!index.eventIds.includes(eventId)) {
        index.eventIds.push(eventId);
        index.lastUpdated = new Date().toISOString();
        // Keep only last 1000 event IDs in index
        if (index.eventIds.length > 1000) {
          index.eventIds = index.eventIds.slice(-1000);
        }
        await kv.set(DLQ_INDEX_KEY, JSON.stringify(index), { ex: DLQ_TTL });
      }
      
      console.log(`[DLQ] Stored failed webhook: ${eventId} (${eventType})`);
    } else {
      inMemoryDLQ.set(key, failedEvent);
      if (!inMemoryIndex.includes(eventId)) {
        inMemoryIndex.push(eventId);
        if (inMemoryIndex.length > 1000) {
          inMemoryIndex.shift();
        }
      }
      console.warn(`[DLQ] Stored in memory (KV not available): ${eventId}`);
    }
  } catch (err) {
    console.error(`[DLQ] Failed to store event ${eventId}:`, err);
  }
}

/**
 * Retrieve a failed webhook event from DLQ
 */
export async function getFailedWebhook(eventId: string): Promise<FailedWebhookEvent | null> {
  const key = `${DLQ_PREFIX}${eventId}`;

  try {
    if (isKVAvailable()) {
      const data = await kv.get<string>(key);
      return data ? JSON.parse(data) : null;
    } else {
      return inMemoryDLQ.get(key) || null;
    }
  } catch (err) {
    console.error(`[DLQ] Failed to retrieve event ${eventId}:`, err);
    return null;
  }
}

/**
 * List all failed webhook events (for admin dashboard)
 */
export async function listFailedWebhooks(limit: number = 100): Promise<FailedWebhookEvent[]> {
  try {
    if (isKVAvailable()) {
      const indexData = await kv.get<DLQIndex>(DLQ_INDEX_KEY);
      if (!indexData || !indexData.eventIds.length) {
        return [];
      }
      
      // Get events in reverse chronological order (newest first)
      const eventIds = indexData.eventIds.slice(-limit).reverse();
      const events: FailedWebhookEvent[] = [];
      
      for (const eventId of eventIds) {
        const event = await getFailedWebhook(eventId);
        if (event) {
          events.push(event);
        }
      }
      
      // Sort by timestamp (newest first)
      return events.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, limit);
    } else {
      const events = Array.from(inMemoryDLQ.values());
      return events.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, limit);
    }
  } catch (err) {
    console.error('[DLQ] Failed to list events:', err);
    return [];
  }
}

/**
 * Remove a failed webhook event from DLQ (after successful replay)
 */
export async function removeFailedWebhook(eventId: string): Promise<void> {
  const key = `${DLQ_PREFIX}${eventId}`;

  try {
    if (isKVAvailable()) {
      await kv.del(key);
      
      // Update index
      const indexData = await kv.get<DLQIndex>(DLQ_INDEX_KEY);
      if (indexData) {
        indexData.eventIds = indexData.eventIds.filter(id => id !== eventId);
        indexData.lastUpdated = new Date().toISOString();
        await kv.set(DLQ_INDEX_KEY, JSON.stringify(indexData), { ex: DLQ_TTL });
      }
      
      console.log(`[DLQ] Removed event: ${eventId}`);
    } else {
      inMemoryDLQ.delete(key);
      const index = inMemoryIndex.indexOf(eventId);
      if (index > -1) {
        inMemoryIndex.splice(index, 1);
      }
    }
  } catch (err) {
    console.error(`[DLQ] Failed to remove event ${eventId}:`, err);
  }
}

/**
 * Get DLQ statistics
 */
export async function getDLQStats(): Promise<{ count: number; oldestEvent?: string; newestEvent?: string }> {
  try {
    if (isKVAvailable()) {
      const indexData = await kv.get<DLQIndex>(DLQ_INDEX_KEY);
      if (!indexData || !indexData.eventIds.length) {
        return { count: 0 };
      }
      
      const events = await listFailedWebhooks(1000);
      if (events.length === 0) {
        return { count: 0 };
      }
      
      const sorted = events.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      return {
        count: events.length,
        oldestEvent: sorted[0]?.timestamp,
        newestEvent: sorted[sorted.length - 1]?.timestamp,
      };
    } else {
      const events = Array.from(inMemoryDLQ.values());
      if (events.length === 0) {
        return { count: 0 };
      }
      
      const sorted = events.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      return {
        count: events.length,
        oldestEvent: sorted[0]?.timestamp,
        newestEvent: sorted[sorted.length - 1]?.timestamp,
      };
    }
  } catch (err) {
    console.error('[DLQ] Failed to get stats:', err);
    return { count: 0 };
  }
}
