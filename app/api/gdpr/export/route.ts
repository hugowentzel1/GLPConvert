/**
 * GDPR Data Export Endpoint
 * Allows users to export all their personal data
 */

import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';
import { timingSafeCompare } from '@/src/lib/timing-safe-compare';
import { findTenantByHandle, findLeadsByEmail, findUsersByEmail, USER_FIELDS, LEAD_FIELDS } from '@/src/lib/storage';
import { getStripe } from '@/src/lib/stripe';
import { getCorrelationId, addCorrelationHeaders } from '@/lib/request-tracing';

/**
 * Export all data for a user (identified by email)
 * Requires admin token or user authentication
 */
export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  
  try {
    // Check admin token
    const adminToken = req.headers.get('x-admin-token');
    const isAdmin = adminToken && ENV.ADMIN_TOKEN && timingSafeCompare(adminToken, ENV.ADMIN_TOKEN);

    if (!isAdmin) {
      const response = NextResponse.json(
        { error: 'Unauthorized - Admin token required' },
        { status: 401 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      const response = NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    // Collect all user data
    const exportData: any = {
      email,
      exportedAt: new Date().toISOString(),
      data: {
        tenants: [],
        leads: [],
        users: [],
        stripe: null,
      },
    };

    // Find all tenants associated with this email
    try {
      const users = await findUsersByEmail(email);
      for (const user of users) {
        const tenantField = (user as any)[USER_FIELDS.TENANT];
        if (tenantField) {
          const tenantIds = Array.isArray(tenantField)
            ? tenantField
            : [tenantField];
          
          for (const tenantId of tenantIds) {
            // Get tenant details (simplified - would need proper lookup)
            exportData.data.tenants.push({
              tenantId,
              role: (user as any)[USER_FIELDS.ROLE] || 'unknown',
            });
          }
        }
      }
    } catch (err) {
      console.error('[GDPR Export] Error fetching tenants:', err);
    }

    // Find all leads
    try {
      const leads = await findLeadsByEmail(email);
      exportData.data.leads = leads.map((lead) => ({
        id: lead.id,
        name: (lead as any)[LEAD_FIELDS.NAME],
        email: (lead as any)[LEAD_FIELDS.EMAIL],
        company: (lead as any)[LEAD_FIELDS.COMPANY],
        status: (lead as any)[LEAD_FIELDS.STATUS],
        lastActivity: (lead as any)[LEAD_FIELDS.LAST_ACTIVITY],
        address: {
          street: (lead as any)[LEAD_FIELDS.STREET],
          city: (lead as any)[LEAD_FIELDS.CITY],
          state: (lead as any)[LEAD_FIELDS.STATE],
          postalCode: (lead as any)[LEAD_FIELDS.POSTAL_CODE],
          country: (lead as any)[LEAD_FIELDS.COUNTRY],
        },
      }));
    } catch (err) {
      console.error('[GDPR Export] Error fetching leads:', err);
    }

    // Find Stripe customer data
    try {
      const stripe = getStripe();
      const customers = await stripe.customers.list({ email, limit: 100 });
      
      if (customers.data.length > 0) {
        const customer = customers.data[0];
        exportData.data.stripe = {
          customerId: customer.id,
          email: customer.email,
          created: customer.created,
          subscriptions: [],
        };

        // Get subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 100,
        });
        
        exportData.data.stripe.subscriptions = subscriptions.data.map((sub) => ({
          id: sub.id,
          status: sub.status,
          currentPeriodStart: (sub as any).current_period_start,
          currentPeriodEnd: (sub as any).current_period_end,
          cancelAtPeriodEnd: (sub as any).cancel_at_period_end,
        }));
      }
    } catch (err) {
      console.error(`[${correlationId}] [GDPR Export] Error fetching Stripe data:`, err);
    }

    const response = NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="gdpr-export-${email}-${Date.now()}.json"`,
      },
    });
    return addCorrelationHeaders(response, correlationId);
  } catch (error) {
    console.error(`[${correlationId}] [GDPR Export] Error:`, error);
    const response = NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 },
    );
    return addCorrelationHeaders(response, correlationId);
  }
}
