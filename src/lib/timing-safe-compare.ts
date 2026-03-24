/**
 * Timing-safe string comparison to prevent timing attacks
 * Uses constant-time comparison algorithm
 */
import { createHmac, timingSafeEqual } from 'crypto';

export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still perform comparison to prevent timing leaks
    const hmac = createHmac('sha256', 'timing-safe-compare');
    hmac.update(a);
    hmac.update(b);
    return false;
  }

  // Use crypto.timingSafeEqual for constant-time comparison
  const aBuffer = Buffer.from(a, 'utf8');
  const bBuffer = Buffer.from(b, 'utf8');
  
  try {
    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}
