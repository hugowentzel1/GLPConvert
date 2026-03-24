/**
 * POST /api/tenant/crm-webhook — Set or clear the tenant’s CRM Webhook URL (Zapier/Make).
 * Auth: magic link token (query/body) or Stripe session_id (post-checkout).
 */
import { NextRequest, NextResponse } from 'next/server';
import { updateTenantCrmWebhook } from '@/src/lib/storage';
import { getStripe } from '@/src/lib/stripe';

function verifyMagicLinkToken(token: string, companyHandle: string): boolean {
  try {
    const decoded = JSON.parse(
      Buffer.from(token.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );
    const age = Date.now() - (decoded.timestamp ?? 0);
    if (age > 7 * 24 * 60 * 60 * 1000) return false;
    const expected = (companyHandle || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const actual = (decoded.company ?? '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return actual === expected;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const companyHandle = (body.companyHandle ?? body.company ?? '').trim();
    let crmWebhookUrl = (body.crmWebhookUrl ?? body.webhookUrl ?? '').trim();
    const token = body.token ?? req.nextUrl.searchParams.get('token') ?? '';
    const sessionId = body.sessionId ?? body.session_id ?? req.nextUrl.searchParams.get('session_id') ?? '';

    if (!companyHandle) {
      return NextResponse.json({ error: 'companyHandle is required' }, { status: 400 });
    }

    const handle = companyHandle.toLowerCase().replace(/[^a-z0-9]/g, '-');

    let allowed = false;
    if (token && verifyMagicLinkToken(token, companyHandle)) {
      allowed = true;
    }
    if (sessionId) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: [] });
        const meta = (session.metadata ?? {}) as Record<string, string>;
        const sessionHandle = (meta.tenant_handle ?? meta.company ?? '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (sessionHandle && sessionHandle === handle && session.payment_status === 'paid') {
          allowed = true;
        }
      } catch {
        // Stripe not configured or invalid session
      }
    }
    // Demo: allow without auth for development
    if (!allowed && process.env.NODE_ENV !== 'production') {
      allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: 'Unauthorized. Use a valid magic link token or checkout session_id.' }, { status: 401 });
    }

    if (crmWebhookUrl && !/^https?:\/\/[^\s]+$/i.test(crmWebhookUrl)) {
      return NextResponse.json({ error: 'crmWebhookUrl must be a valid https URL' }, { status: 400 });
    }

    await updateTenantCrmWebhook(handle, crmWebhookUrl || null);
    return NextResponse.json({ success: true, message: crmWebhookUrl ? 'CRM webhook saved. New leads will be sent to your URL.' : 'CRM webhook cleared.' });
  } catch (err) {
    console.error('CRM webhook update error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update CRM webhook' },
      { status: 500 }
    );
  }
}
