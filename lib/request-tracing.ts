/**
 * Request Tracing with Correlation IDs
 * Adds correlation IDs to all requests for better observability
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const CORRELATION_ID_HEADER = 'x-correlation-id';
const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Generate a correlation ID for a request
 */
export function generateCorrelationId(): string {
  return nanoid(16);
}

/**
 * Get correlation ID from request headers, or generate a new one
 */
export function getCorrelationId(request: NextRequest): string {
  return (
    request.headers.get(CORRELATION_ID_HEADER) ||
    request.headers.get(REQUEST_ID_HEADER) ||
    generateCorrelationId()
  );
}

/**
 * Add correlation ID to response headers
 */
export function addCorrelationHeaders(
  response: NextResponse,
  correlationId: string,
): NextResponse {
  response.headers.set(CORRELATION_ID_HEADER, correlationId);
  response.headers.set(REQUEST_ID_HEADER, correlationId);
  return response;
}

/**
 * Middleware to add correlation IDs to all requests
 */
export function withCorrelationId(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const correlationId = getCorrelationId(req);
    
    // Add to request context for logging
    (req as any).correlationId = correlationId;
    
    // Log request with correlation ID
    console.log(`[${correlationId}] ${req.method} ${req.nextUrl.pathname}`);
    
    try {
      const response = await handler(req);
      return addCorrelationHeaders(response, correlationId);
    } catch (error) {
      console.error(`[${correlationId}] Error:`, error);
      const response = NextResponse.json(
        { error: 'Internal server error', correlationId },
        { status: 500 },
      );
      return addCorrelationHeaders(response, correlationId);
    }
  };
}

/**
 * Get correlation ID from current request context (for logging)
 */
export function getCurrentCorrelationId(): string | undefined {
  // This would be set by middleware or request context
  // In Next.js, we pass it through headers
  return undefined; // Will be set by middleware
}
