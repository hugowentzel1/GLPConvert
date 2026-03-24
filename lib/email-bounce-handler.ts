/**
 * Email Bounce Handling
 * Detects and handles bounced emails from Resend webhooks
 */

import { NextRequest } from 'next/server';
import { findTenantByEmail, updateTenantEmailStatus } from '@/src/lib/storage';

export interface EmailBounceEvent {
  type: 'email.bounced' | 'email.complained' | 'email.delivered';
  data: {
    email: string;
    timestamp: string;
    reason?: string;
    bounceType?: 'hard' | 'soft';
  };
}

/**
 * Handle email bounce event from Resend webhook
 */
export async function handleEmailBounce(event: EmailBounceEvent): Promise<void> {
  const { email, reason, bounceType } = event.data;

  console.log(`[EmailBounce] Processing bounce for ${email}:`, {
    type: event.type,
    bounceType,
    reason,
  });

  try {
    // Find tenant by email
    const tenant = await findTenantByEmail(email);
    
    if (!tenant) {
      console.warn(`[EmailBounce] No tenant found for email: ${email}`);
      return;
    }

    // Update tenant email status in Supabase
    const status = bounceType === 'hard' ? 'bounced_hard' : 'bounced_soft';
    await updateTenantEmailStatus(tenant.id!, email, status, reason);

    console.log(`[EmailBounce] Updated tenant ${tenant.id} email status to ${status}`);
  } catch (error) {
    console.error(`[EmailBounce] Error handling bounce for ${email}:`, error);
    throw error;
  }
}

/**
 * Webhook endpoint handler for Resend email events
 */
export async function handleResendWebhook(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const eventType = body.type;

    if (eventType === 'email.bounced' || eventType === 'email.complained') {
      const bounceEvent: EmailBounceEvent = {
        type: eventType,
        data: {
          email: body.data?.email || body.data?.to || '',
          timestamp: body.created_at || new Date().toISOString(),
          reason: body.data?.bounce_type || body.data?.reason || 'Unknown',
          bounceType: body.data?.bounce_type === 'hard' ? 'hard' : 'soft',
        },
      };

      await handleEmailBounce(bounceEvent);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[EmailBounce] Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
