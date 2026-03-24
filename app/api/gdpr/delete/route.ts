/**
 * GDPR Data Deletion Endpoint
 * Allows users to request deletion of all their personal data
 */

import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/src/config/env';
import { timingSafeCompare } from '@/src/lib/timing-safe-compare';
import { findLeadsByEmail, findUsersByEmail } from '@/src/lib/storage';
import { getSupabase } from '@/src/lib/supabase';
import { getStripe } from '@/src/lib/stripe';
import { invalidateCache, CACHE_KEYS } from '@/lib/cache';
import { getCorrelationId, addCorrelationHeaders } from '@/lib/request-tracing';

/**
 * Delete all data for a user (identified by email)
 * Requires admin token or user authentication
 * 
 * WARNING: This is a destructive operation. Data cannot be recovered.
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

    const { email, confirm } = await req.json();

    if (!email || typeof email !== 'string') {
      const response = NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    if (confirm !== 'DELETE') {
      const response = NextResponse.json(
        { error: 'Deletion must be confirmed with confirm: "DELETE"' },
        { status: 400 },
      );
      return addCorrelationHeaders(response, correlationId);
    }

    const deletionLog: string[] = [];
    let deletedCount = 0;

    // Delete leads (Supabase)
    try {
      const leads = await findLeadsByEmail(email);
      const leadIds = leads.map((l) => l.id).filter((id): id is string => !!id);
      if (leadIds.length > 0) {
        const { error } = await getSupabase().from('leads').delete().in('id', leadIds);
        if (error) throw error;
        leadIds.forEach((id) => deletionLog.push(`Deleted lead: ${id}`));
        deletedCount += leadIds.length;
      }
    } catch (err) {
      console.error(`[${correlationId}] [GDPR Delete] Error deleting leads:`, err);
      deletionLog.push(`Error deleting leads: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Delete users (Supabase; keep tenant records)
    try {
      const users = await findUsersByEmail(email);
      const userIds = users.map((u) => u.id).filter((id): id is string => !!id);
      if (userIds.length > 0) {
        const { error } = await getSupabase().from('users').delete().in('id', userIds);
        if (error) throw error;
        userIds.forEach((id) => deletionLog.push(`Deleted user: ${id}`));
        deletedCount += userIds.length;
      }
    } catch (err) {
      console.error(`[${correlationId}] [GDPR Delete] Error deleting users:`, err);
      deletionLog.push(`Error deleting users: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Anonymize Stripe customer (we can't delete, but we can remove PII)
    try {
      const stripe = getStripe();
      const customers = await stripe.customers.list({ email, limit: 100 });
      
      for (const customer of customers.data) {
        // Update customer to remove email and name
        await stripe.customers.update(customer.id, {
          email: `deleted-${customer.id}@deleted.local`,
          name: 'Deleted User',
          description: `GDPR deletion requested on ${new Date().toISOString()}`,
        });
        deletionLog.push(`Anonymized Stripe customer: ${customer.id}`);
      }
    } catch (err) {
      console.error(`[${correlationId}] [GDPR Delete] Error anonymizing Stripe:`, err);
      deletionLog.push(`Error anonymizing Stripe: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Invalidate cache
    try {
      await invalidateCache(CACHE_KEYS.tenant(email));
    } catch (err) {
      console.warn('[GDPR Delete] Error invalidating cache:', err);
    }

    const response = NextResponse.json({
      success: true,
      email,
      deletedAt: new Date().toISOString(),
      deletedCount,
      deletionLog,
      note: 'Tenant records were preserved. Stripe customers were anonymized (not deleted per Stripe policy).',
    });
    return addCorrelationHeaders(response, correlationId);
  } catch (error) {
    console.error(`[${correlationId}] [GDPR Delete] Error:`, error);
    const response = NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 },
    );
    return addCorrelationHeaders(response, correlationId);
  }
}
