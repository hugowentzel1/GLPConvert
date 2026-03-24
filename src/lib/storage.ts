/**
 * Single entry point for all storage (Supabase). Re-exports types, constants, and DAL.
 * Import from @/src/lib/storage (Supabase-backed). Do not import Airtable.
 */

export {
  LEAD_FIELDS,
  TENANT_FIELDS,
  USER_FIELDS,
  LINK_FIELDS,
  type Lead,
  type Tenant,
  type User,
  type Link,
} from "@/src/lib/storage-types";

export {
  findTenantByHandle,
  findTenantByApiKey,
  findTenantBySubscriptionId,
  findTenantById,
  upsertTenantByHandle,
  getTenantByHandle,
  updateTenantDomain,
  setTenantDomainStatus,
  setRequestedDomain,
  updateTenantCrmWebhook,
  findOrCreateMasterTenant,
} from "@/src/lib/db-tenants";

export {
  findUsersByEmail,
  createOrLinkUserOwner,
  findTenantByEmail,
  updateTenantEmailStatus,
  createUser,
} from "@/src/lib/db-users";

export {
  upsertLeadByEmailAndTenant,
  findLeadByEmailAndTenant,
  findLeadsByEmail,
  listLeadsForTenant,
  getLastLeadForTenant,
  updateLead,
  appendLeadNote,
  upsertLeadSuppressionByEmail,
  upsertLead,
  storeLead,
  storeLeadFallback,
} from "@/src/lib/db-leads";

export { findLinkByToken, markLinkClicked } from "@/src/lib/db-links";

import { logger } from "@/src/lib/logger";

export async function logEvent(eventData: {
  type: string;
  tenantId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info("Event logged:", eventData);
    return { success: true };
  } catch (error) {
    logger.error("Failed to log event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function suppressByHash(hash: string): Promise<void> {
  logger.info(`Suppression requested for hash: ${hash}`);
}
