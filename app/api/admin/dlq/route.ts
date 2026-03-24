/**
 * Admin-only endpoint to manage Dead Letter Queue (DLQ)
 * Lists, retrieves, and removes failed webhook events
 */

import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';
import { timingSafeCompare } from '@/src/lib/timing-safe-compare';
import { listFailedWebhooks, getFailedWebhook, removeFailedWebhook, getDLQStats } from '@/lib/dead-letter-queue';
import { getCorrelationId, addCorrelationHeaders } from '@/lib/request-tracing';

/**
 * GET /api/admin/dlq - List all failed webhook events
 */
export async function GET(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  
  try {
    // Check admin token
    const adminToken = req.headers.get('x-admin-token');
    if (!adminToken || !ENV.ADMIN_TOKEN || !timingSafeCompare(adminToken, ENV.ADMIN_TOKEN)) {
      const response = NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50', 10);
    const eventId = req.nextUrl.searchParams.get('eventId');

    if (eventId) {
      // Get specific event
      const event = await getFailedWebhook(eventId);
      if (!event) {
        const response = NextResponse.json(
          { error: 'Event not found' },
          { status: 404 },
        );
        return addCorrelationHeaders(response, correlationId);
      }
      const response = NextResponse.json({ event });
      return addCorrelationHeaders(response, correlationId);
    }

    // List all events
    const events = await listFailedWebhooks(limit);
    const stats = await getDLQStats();

    const response = NextResponse.json({
      events,
      stats,
      count: events.length,
    });
    return addCorrelationHeaders(response, correlationId);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[${correlationId}] [AdminDLQ] Error:`, errorMsg);
    const response = NextResponse.json(
      { error: errorMsg },
      { status: 500 },
    );
    return addCorrelationHeaders(response, correlationId);
  }
}

/**
 * DELETE /api/admin/dlq?eventId=xxx - Remove a failed webhook event
 */
export async function DELETE(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  
  try {
    // Check admin token
    const adminToken = req.headers.get('x-admin-token');
    if (!adminToken || !ENV.ADMIN_TOKEN || !timingSafeCompare(adminToken, ENV.ADMIN_TOKEN)) {
      const response = NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    const eventId = req.nextUrl.searchParams.get('eventId');
    if (!eventId) {
      const response = NextResponse.json(
        { error: 'eventId parameter required' },
        { status: 400 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    await removeFailedWebhook(eventId);

    const response = NextResponse.json({ success: true, message: `Event ${eventId} removed from DLQ` });
    return addCorrelationHeaders(response, correlationId);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[${correlationId}] [AdminDLQ] Error:`, errorMsg);
    const response = NextResponse.json(
      { error: errorMsg },
      { status: 500 },
    );
    return addCorrelationHeaders(response, correlationId);
  }
}
