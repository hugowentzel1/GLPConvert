/**
 * Resend Webhook Endpoint
 * Handles email bounce and complaint events from Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleResendWebhook } from '@/lib/email-bounce-handler';
import { getCorrelationId, addCorrelationHeaders } from '@/lib/request-tracing';

export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  console.log(`[${correlationId}] [ResendWebhook] Received webhook event`);

  try {
    const response = await handleResendWebhook(req);
    return addCorrelationHeaders(NextResponse.json({ received: true }), correlationId);
  } catch (error) {
    console.error(`[${correlationId}] [ResendWebhook] Error:`, error);
    const response = NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
    return addCorrelationHeaders(response, correlationId);
  }
}
