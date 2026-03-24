import { getSupabase } from "@/src/lib/supabase";
import type { User } from "@/src/lib/storage-types";
import { USER_FIELDS } from "@/src/lib/storage-types";
import { logger } from "@/src/lib/logger";
import { findTenantById } from "@/src/lib/db-tenants";

type UserRow = {
  id: string;
  name?: string | null;
  email: string;
  role?: string | null;
  tenant_ids?: string[] | null;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    [USER_FIELDS.EMAIL]: row.email,
    [USER_FIELDS.ROLE]: row.role ?? "",
    [USER_FIELDS.TENANT]: row.tenant_ids ?? [],
  };
}

export async function findUsersByEmail(email: string): Promise<User[]> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("*")
    .eq("email", email);
  if (error) throw error;
  return (data ?? []).map((r) => rowToUser(r as UserRow));
}

export async function createOrLinkUserOwner(tenantId: string, email: string): Promise<string> {
  const existing = await getSupabase()
    .from("users")
    .select("id")
    .eq("email", email)
    .contains("tenant_ids", [tenantId])
    .limit(1)
    .maybeSingle();
  if (existing.data?.id) return existing.data.id as string;
  const { data, error } = await getSupabase()
    .from("users")
    .insert({ email, role: "Owner", tenant_ids: [tenantId] })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function findTenantByEmail(email: string) {
  const users = await findUsersByEmail(email);
  if (users.length === 0) return null;
  const tenantIds = users[0][USER_FIELDS.TENANT];
  if (!tenantIds?.length) return null;
  return findTenantById(tenantIds[0]);
}

export async function createUser(fields: Omit<User, "id">): Promise<User> {
  const tenantIds = fields[USER_FIELDS.TENANT] ?? [];
  const { data, error } = await getSupabase()
    .from("users")
    .insert({
      email: fields[USER_FIELDS.EMAIL],
      role: fields[USER_FIELDS.ROLE],
      tenant_ids: tenantIds,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToUser(data as UserRow);
}

export async function updateTenantEmailStatus(
  _tenantId: string,
  _email: string,
  _status: string,
  _reason?: string,
): Promise<void> {
  logger.info("Tenant email status update requested", {
    _tenantId,
    _email,
    _status,
  });
}
