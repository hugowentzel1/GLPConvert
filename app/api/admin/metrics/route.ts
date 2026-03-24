import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';
import { timingSafeCompare } from '@/src/lib/timing-safe-compare';
import { circuitBreakers } from '@/lib/circuit-breaker';

/**
 * Admin-only endpoint to get system metrics
 * Returns health status and circuit breaker states
 */
export async function GET(req: NextRequest) {
  try {
    // Check admin token (timing-safe comparison)
    const adminToken = req.headers.get('x-admin-token');
    if (!adminToken || !ENV.ADMIN_TOKEN || !timingSafeCompare(adminToken, ENV.ADMIN_TOKEN)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 },
      );
    }

    // Get health status
    const healthRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health`);
    const health = healthRes.ok ? await healthRes.json() : null;

    // Get circuit breaker states
    const circuitBreakerStates: Record<string, any> = {};
    for (const [service, breaker] of Object.entries(circuitBreakers)) {
      circuitBreakerStates[service] = breaker.getState();
    }

    return NextResponse.json({
      health,
      circuitBreakers: circuitBreakerStates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[AdminMetrics] Error:', errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 },
    );
  }
}
