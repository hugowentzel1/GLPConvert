import { getSupabase } from "@/src/lib/supabase";
import type { Tenant } from "@/src/lib/storage-types";
import { TENANT_FIELDS } from "@/src/lib/storage-types";
import { logger } from "@/src/lib/logger";

type TenantRow = {
  id: string;
  handle: string;
  name?: string | null;
  plan?: string | null;
  domain_login_url?: string | null;
  brand_colors?: string | null;
  logo_url?: string | null;
  crm_keys?: string | null;
  api_key?: string | null;
  capture_url?: string | null;
  users?: string[] | null;
  payment_status?: string | null;
  stripe_customer_id?: string | null;
  last_payment?: string | null;
  subscription_id?: string | null;
  current_period_end?: string | null;
  requested_domain?: string | null;
  domain_status?: string | null;
  domain?: string | null;
  notification_email?: string | null;
};

function rowToTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    [TENANT_FIELDS.COMPANY_HANDLE]: row.handle,
    [TENANT_FIELDS.PLAN]: row.plan ?? "",
    [TENANT_FIELDS.DOMAIN_LOGIN_URL]: row.domain_login_url ?? undefined,
    [TENANT_FIELDS.BRAND_COLORS]: row.brand_colors ?? undefined,
    [TENANT_FIELDS.LOGO_URL]: row.logo_url ?? undefined,
    [TENANT_FIELDS.CRM_KEYS]: row.crm_keys ?? undefined,
    [TENANT_FIELDS.API_KEY]: row.api_key ?? undefined,
    [TENANT_FIELDS.CAPTURE_URL]: row.capture_url ?? undefined,
    [TENANT_FIELDS.USERS]: row.users ?? undefined,
    [TENANT_FIELDS.PAYMENT_STATUS]: row.payment_status ?? undefined,
    [TENANT_FIELDS.STRIPE_CUSTOMER_ID]: row.stripe_customer_id ?? undefined,
    [TENANT_FIELDS.LAST_PAYMENT]: row.last_payment ?? undefined,
    [TENANT_FIELDS.SUBSCRIPTION_ID]: row.subscription_id ?? undefined,
    [TENANT_FIELDS.CURRENT_PERIOD_END]: row.current_period_end ?? undefined,
    [TENANT_FIELDS.REQUESTED_DOMAIN]: row.requested_domain ?? undefined,
    [TENANT_FIELDS.DOMAIN_STATUS]: row.domain_status ?? undefined,
    [TENANT_FIELDS.DOMAIN]: row.domain ?? undefined,
    [TENANT_FIELDS.NOTIFICATION_EMAIL]: row.notification_email ?? undefined,
  };
}

function fieldsToRow(fields: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    [TENANT_FIELDS.COMPANY_HANDLE]: "handle",
    [TENANT_FIELDS.PLAN]: "plan",
    [TENANT_FIELDS.DOMAIN_LOGIN_URL]: "domain_login_url",
    [TENANT_FIELDS.BRAND_COLORS]: "brand_colors",
    [TENANT_FIELDS.LOGO_URL]: "logo_url",
    [TENANT_FIELDS.CRM_KEYS]: "crm_keys",
    [TENANT_FIELDS.API_KEY]: "api_key",
    [TENANT_FIELDS.CAPTURE_URL]: "capture_url",
    [TENANT_FIELDS.USERS]: "users",
    [TENANT_FIELDS.PAYMENT_STATUS]: "payment_status",
    [TENANT_FIELDS.STRIPE_CUSTOMER_ID]: "stripe_customer_id",
    [TENANT_FIELDS.LAST_PAYMENT]: "last_payment",
    [TENANT_FIELDS.SUBSCRIPTION_ID]: "subscription_id",
    [TENANT_FIELDS.CURRENT_PERIOD_END]: "current_period_end",
    [TENANT_FIELDS.REQUESTED_DOMAIN]: "requested_domain",
    [TENANT_FIELDS.DOMAIN_STATUS]: "domain_status",
    [TENANT_FIELDS.DOMAIN]: "domain",
    [TENANT_FIELDS.NOTIFICATION_EMAIL]: "notification_email",
  };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(fields)) {
    const col = map[k] ?? k;
    if (v !== undefined && v !== null) row[col] = v;
  }
  return row;
}

export async function findTenantByHandle(handle: string): Promise<Tenant | null> {
  try {
    const { data, error } = await getSupabase()
      .from("tenants")
      .select("*")
      .eq("handle", handle)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToTenant(data as TenantRow);
  } catch (error) {
    logger.error("Error finding tenant by handle:", error);
    throw error;
  }
}

export async function findTenantByApiKey(key: string): Promise<Tenant | null> {
  try {
    const { data, error } = await getSupabase()
      .from("tenants")
      .select("*")
      .eq("api_key", key)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToTenant(data as TenantRow);
  } catch (error) {
    logger.error("Error finding tenant by API key:", error);
    throw error;
  }
}

export async function findTenantBySubscriptionId(subscriptionId: string): Promise<Tenant | null> {
  try {
    const { data, error } = await getSupabase()
      .from("tenants")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToTenant(data as TenantRow);
  } catch (error) {
    logger.error("Error finding tenant by subscription ID:", error);
    throw error;
  }
}

export async function upsertTenantByHandle(
  handle: string,
  fields: Record<string, unknown>,
) {
  try {
    const existing = await findTenantByHandle(handle);
    const row = fieldsToRow(fields);
    if (existing?.id) {
      const { data, error } = await getSupabase()
        .from("tenants")
        .update(row)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return { id: (data as TenantRow).id, ...row };
    } else {
      const { data, error } = await getSupabase()
        .from("tenants")
        .insert({ ...row, handle })
        .select()
        .single();
      if (error) throw error;
      return { id: (data as TenantRow).id, ...row };
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[Supabase] Error upserting tenant "${handle}": ${msg}`);
    logger.error("Error upserting tenant:", error);
    throw error;
  }
}

export async function getTenantByHandle(handle: string): Promise<Tenant | null> {
  return findTenantByHandle(handle);
}

export async function findTenantById(id: string): Promise<Tenant | null> {
  const { data, error } = await getSupabase()
    .from("tenants")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToTenant(data as TenantRow);
}

export async function updateTenantDomain(handle: string, domain: string): Promise<void> {
  const tenant = await findTenantByHandle(handle);
  if (!tenant?.id) throw new Error("Tenant not found");
  const { error } = await getSupabase()
    .from("tenants")
    .update({ domain, updated_at: new Date().toISOString() })
    .eq("id", tenant.id);
  if (error) throw error;
  logger.info(`Updated domain for tenant ${handle}: ${domain}`);
}

export async function setTenantDomainStatus(handle: string, status: string): Promise<void> {
  const tenant = await findTenantByHandle(handle);
  if (!tenant?.id) throw new Error("Tenant not found");
  const { error } = await getSupabase()
    .from("tenants")
    .update({ domain_status: status, updated_at: new Date().toISOString() })
    .eq("id", tenant.id);
  if (error) throw error;
  logger.info(`Updated domain status for tenant ${handle}: ${status}`);
}

export async function setRequestedDomain(handle: string, domain: string): Promise<void> {
  const tenant = await findTenantByHandle(handle);
  if (!tenant?.id) throw new Error("Tenant not found");
  const { error } = await getSupabase()
    .from("tenants")
    .update({ requested_domain: domain, updated_at: new Date().toISOString() })
    .eq("id", tenant.id);
  if (error) throw error;
  logger.info(`Set requested domain for tenant ${handle}: ${domain}`);
}

export async function updateTenantCrmWebhook(
  handle: string,
  crmWebhookUrl: string | null,
): Promise<void> {
  const tenant = await findTenantByHandle(handle);
  if (!tenant?.id) throw new Error("Tenant not found");
  const { error } = await getSupabase()
    .from("tenants")
    .update({ capture_url: crmWebhookUrl ?? "", updated_at: new Date().toISOString() })
    .eq("id", tenant.id);
  if (error) throw error;
  logger.info(`Updated CRM webhook for tenant ${handle}: ${crmWebhookUrl ? "set" : "cleared"}`);
}

export async function findOrCreateMasterTenant(): Promise<Tenant> {
  const existing = await findTenantByHandle("sunspire");
  if (existing) return existing;
  const { data, error } = await getSupabase()
    .from("tenants")
    .insert({
      handle: "sunspire",
      plan: "Custom",
      api_key: "master-key-" + Math.random().toString(36).substring(2, 15),
    })
    .select()
    .single();
  if (error) throw error;
  return rowToTenant(data as TenantRow);
}
