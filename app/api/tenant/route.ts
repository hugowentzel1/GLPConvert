/**
 * GET /api/tenant — Return tenant info (e.g. crmWebhookUrl) for the dashboard.
 * Auth: magic link token or Stripe session_id (post-checkout).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTenantByHandle, TENANT_FIELDS } from '@/src/lib/storage';
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const companyHandle = (searchParams.get('companyHandle') ?? searchParams.get('company') ?? '').trim();
    const token = searchParams.get('token') ?? '';
    const sessionId = searchParams.get('session_id') ?? searchParams.get('sessionId') ?? '';

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
    if (!allowed && process.env.NODE_ENV !== 'production') {
      allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await getTenantByHandle(handle);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const crmWebhookUrl = (tenant[TENANT_FIELDS.CRM_KEYS as keyof typeof tenant] as string | undefined) ?? '';
    return NextResponse.json({
      companyHandle: handle,
      crmWebhookUrl: crmWebhookUrl || undefined,
    });
  } catch (err) {
    console.error('GET /api/tenant error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load tenant' },
      { status: 500 }
    );
  }
}
