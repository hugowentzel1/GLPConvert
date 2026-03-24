class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return true; // Rate limited
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return false; // Not rate limited
  }
}

export function checkDemoRateLimit(ip: string): boolean {
  const demoLimiter = new RateLimiter(5 * 60 * 1000, 10); // 10 requests per 5 minutes
  return demoLimiter.isRateLimited(`demo:${ip}`);
}

export function checkPaidRateLimit(tenant: string): boolean {
  const paidLimiter = new RateLimiter(5 * 60 * 1000, 100); // 100 requests per 5 minutes
  return paidLimiter.isRateLimited(`paid:${tenant}`);
}

// Legacy export for backward compatibility - accepts second parameter but ignores it
export function checkRateLimit(ip: string, _operation?: string): boolean {
  return checkDemoRateLimit(ip);
}