import { getSupabase } from "@/src/lib/supabase";
import type { Lead } from "@/src/lib/storage-types";
import { LEAD_FIELDS } from "@/src/lib/storage-types";
import { logger } from "@/src/lib/logger";
import { findTenantByHandle } from "@/src/lib/db-tenants";

type LeadRow = {
  id: string;
  tenant_id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  status?: string | null;
  company?: string | null;
  demo_url?: string | null;
  campaign_id?: string | null;
  assignee?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  utility_rate?: number | null;
  token?: string | null;
  system_size_kw?: number | null;
  estimated_cost?: number | null;
  estimated_savings?: number | null;
  payback_period_years?: number | null;
  npv_25_year?: number | null;
  co2_offset_per_year?: number | null;
  last_activity?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function rowToLead(row: LeadRow): Lead {
  const lastActivity = row.last_activity ?? row.updated_at ?? row.created_at ?? new Date().toISOString();
  return {
    id: row.id,
    [LEAD_FIELDS.NAME]: row.name ?? "",
    [LEAD_FIELDS.EMAIL]: row.email,
    [LEAD_FIELDS.COMPANY]: row.company ?? undefined,
    [LEAD_FIELDS.TENANT]: [row.tenant_id],
    [LEAD_FIELDS.DEMO_URL]: row.demo_url ?? undefined,
    [LEAD_FIELDS.CAMPAIGN_ID]: row.campaign_id ?? undefined,
    [LEAD_FIELDS.STATUS]: row.status ?? "New",
    [LEAD_FIELDS.NOTES]: row.notes ?? undefined,
    [LEAD_FIELDS.LAST_ACTIVITY]: lastActivity,
    [LEAD_FIELDS.STREET]: row.street ?? undefined,
    [LEAD_FIELDS.CITY]: row.city ?? undefined,
    [LEAD_FIELDS.STATE]: row.state ?? undefined,
    [LEAD_FIELDS.POSTAL_CODE]: row.postal_code ?? undefined,
    [LEAD_FIELDS.COUNTRY]: row.country ?? undefined,
    [LEAD_FIELDS.FORMATTED_ADDRESS]: row.address ?? undefined,
    [LEAD_FIELDS.PLACE_ID]: row.place_id ?? undefined,
    [LEAD_FIELDS.LATITUDE]: row.latitude ?? undefined,
    [LEAD_FIELDS.LONGITUDE]: row.longitude ?? undefined,
    [LEAD_FIELDS.UTILITY_RATE]: row.utility_rate ?? undefined,
    [LEAD_FIELDS.TOKEN]: row.token ?? undefined,
  };
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

const leadFieldToCol: Record<string, string> = {
  [LEAD_FIELDS.NAME]: "name",
  [LEAD_FIELDS.EMAIL]: "email",
  [LEAD_FIELDS.FORMATTED_ADDRESS]: "address",
  [LEAD_FIELDS.NOTES]: "notes",
  [LEAD_FIELDS.STATUS]: "status",
  [LEAD_FIELDS.STREET]: "street",
  [LEAD_FIELDS.CITY]: "city",
  [LEAD_FIELDS.STATE]: "state",
  [LEAD_FIELDS.POSTAL_CODE]: "postal_code",
  [LEAD_FIELDS.COUNTRY]: "country",
  [LEAD_FIELDS.PLACE_ID]: "place_id",
  [LEAD_FIELDS.LATITUDE]: "latitude",
  [LEAD_FIELDS.LONGITUDE]: "longitude",
  [LEAD_FIELDS.UTILITY_RATE]: "utility_rate",
  [LEAD_FIELDS.TOKEN]: "token",
};
function leadFieldsToRow(fields: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const camelToSnake: Record<string, string> = {
    systemSizeKW: "system_size_kw",
    estimatedCost: "estimated_cost",
    estimatedSavings: "estimated_savings",
    paybackPeriodYears: "payback_period_years",
    npv25Year: "npv_25_year",
    co2OffsetPerYear: "co2_offset_per_year",
    phone: "phone",
  };
  for (const [k, v] of Object.entries(fields)) {
    const col =
      leadFieldToCol[k] ??
      camelToSnake[k] ??
      (k.includes(" ") ? undefined : k);
    if (col && v !== undefined && v !== null) row[col] = v;
  }
  return row;
}

export async function upsertLeadByEmailAndTenant(
  email: string,
  tenantId: string,
  fields: Record<string, unknown>,
): Promise<Lead> {
  const { data: existing } = await getSupabase()
    .from("leads")
    .select("id")
    .eq("email", email)
    .eq("tenant_id", tenantId)
    .limit(1)
    .maybeSingle();

  const ts = getCurrentTimestamp();
  const merged = {
    ...leadFieldsToRow(fields),
    email,
    tenant_id: tenantId,
    last_activity: ts,
    updated_at: ts,
  };

  if (existing?.id) {
    const { data: updated, error } = await getSupabase()
      .from("leads")
      .update(merged)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return rowToLead(updated as LeadRow);
  } else {
    const { data: inserted, error } = await getSupabase()
      .from("leads")
      .insert(merged)
      .select()
      .single();
    if (error) throw error;
    return rowToLead(inserted as LeadRow);
  }
}

export async function findLeadByEmailAndTenant(
  email: string,
  tenantId: string,
): Promise<Lead | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .eq("email", email)
    .eq("tenant_id", tenantId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToLead(data as LeadRow);
}

export async function findLeadsByEmail(email: string): Promise<Lead[]> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .eq("email", email);
  if (error) throw error;
  return (data ?? []).map((r) => rowToLead(r as LeadRow));
}

/** Extract consult-readiness chips from packed GLP_SIMULATION notes (best-effort). */
export function parseReadinessSummaryFromNotes(notes: string): string {
  const idx = notes.indexOf("GLP_SIMULATION=");
  if (idx < 0) return "—";
  const jsonStart = idx + "GLP_SIMULATION=".length;
  let depth = 0;
  let end = -1;
  for (let i = jsonStart; i < notes.length; i++) {
    const c = notes[i];
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) return "—";
  try {
    const j = JSON.parse(notes.slice(jsonStart, end)) as { readiness?: Record<string, string> };
    const r = j.readiness;
    if (!r || typeof r !== "object") return "—";
    const parts = [r.priceComfort, r.startTimeline, r.exploreIntent].filter(
      (x): x is string => typeof x === "string" && x.length > 0,
    );
    return parts.length ? parts.join(" · ") : "—";
  } catch {
    return "—";
  }
}

/** List leads for a tenant by handle (for GET /api/leads). */
export async function listLeadsForTenant(companyHandle: string): Promise<
  {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    notes: string;
    created: string;
    bookingStatus: string;
    recommendedPath: string;
    budgetBand: string;
    vertical: string;
    readinessSummary: string;
  }[]
> {
  const tenant = await findTenantByHandle(companyHandle);
  if (!tenant?.id) return [];
  const { data, error } = await getSupabase()
    .from("leads")
    .select(
      "id, name, email, address, phone, notes, created_at, booking_status, recommended_path, budget_band, vertical",
    )
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(
    (r: {
      id: string;
      name?: string | null;
      email: string;
      address?: string | null;
      phone?: string | null;
      notes?: string | null;
      created_at?: string | null;
      booking_status?: string | null;
      recommended_path?: string | null;
      budget_band?: string | null;
      vertical?: string | null;
    }) => {
      const notes = r.notes ?? "";
      return {
        id: r.id,
        name: r.name ?? "",
        email: r.email,
        address: r.address ?? "",
        phone: r.phone ?? "",
        notes,
        created: r.created_at ?? "",
        bookingStatus: r.booking_status ?? "—",
        recommendedPath: r.recommended_path ?? "—",
        budgetBand: r.budget_band ?? "—",
        vertical: r.vertical ?? "—",
        readinessSummary: parseReadinessSummaryFromNotes(notes),
      };
    },
  );
}

/** Last lead for tenant (for test/last-lead and server leads). */
export async function getLastLeadForTenant(companyHandle: string): Promise<{ id: string; fields: Record<string, unknown> } | null> {
  const tenant = await findTenantByHandle(companyHandle);
  if (!tenant?.id) return null;
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as LeadRow;
  return {
    id: row.id,
    fields: {
      [LEAD_FIELDS.NAME]: row.name,
      [LEAD_FIELDS.EMAIL]: row.email,
      [LEAD_FIELDS.FORMATTED_ADDRESS]: row.address,
      [LEAD_FIELDS.STATUS]: row.status,
      [LEAD_FIELDS.NOTES]: row.notes ?? undefined,
      Created: row.created_at,
    },
  };
}

export async function updateLead(recordId: string, fields: Partial<Lead>): Promise<Lead> {
  const update: Record<string, unknown> = {
    last_activity: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  };
  const fieldToCol: Record<string, string> = {
    [LEAD_FIELDS.NAME]: "name",
    [LEAD_FIELDS.EMAIL]: "email",
    [LEAD_FIELDS.NOTES]: "notes",
    [LEAD_FIELDS.STATUS]: "status",
    [LEAD_FIELDS.FORMATTED_ADDRESS]: "address",
    [LEAD_FIELDS.STREET]: "street",
    [LEAD_FIELDS.CITY]: "city",
    [LEAD_FIELDS.STATE]: "state",
    [LEAD_FIELDS.POSTAL_CODE]: "postal_code",
    [LEAD_FIELDS.COUNTRY]: "country",
  };
  for (const [k, v] of Object.entries(fields)) {
    const col = fieldToCol[k];
    if (col && v !== undefined) update[col] = v;
  }
  const { data, error } = await getSupabase()
    .from("leads")
    .update(update)
    .eq("id", recordId)
    .select()
    .single();
  if (error) throw error;
  return rowToLead(data as LeadRow);
}

export async function appendLeadNote(recordId: string, text: string): Promise<Lead> {
  const { data: existing, error: e1 } = await getSupabase()
    .from("leads")
    .select("notes")
    .eq("id", recordId)
    .single();
  if (e1 || !existing) throw new Error("Lead not found");
  const currentNotes = (existing as { notes?: string | null }).notes ?? "";
  const newNotes = currentNotes ? `${currentNotes}\n${text}` : text;
  const { data, error } = await getSupabase()
    .from("leads")
    .update({
      notes: newNotes,
      last_activity: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    })
    .eq("id", recordId)
    .select()
    .single();
  if (error) throw error;
  return rowToLead(data as LeadRow);
}

export async function upsertLeadSuppressionByEmail(email: string, source: string): Promise<void> {
  const { data: leads } = await getSupabase()
    .from("leads")
    .select("id, notes")
    .eq("email", email);
  const list = leads ?? [];
  const ts = getCurrentTimestamp();
  if (list.length === 0) {
    const tenant = await findTenantByHandle("glpconvert");
    const tenantId = tenant?.id;
    if (!tenantId) {
      logger.warn("No glpconvert tenant for suppression record");
      return;
    }
    await getSupabase().from("leads").insert({
      tenant_id: tenantId,
      email,
      status: "Suppression",
      last_activity: ts,
      notes: `Suppressed via ${source} on ${ts}`,
    });
    logger.info(`Created suppression record for email: ${email}`);
    return;
  }
  for (const lead of list) {
    const row = lead as { id: string; notes?: string | null };
    const currentNotes = row.notes ?? "";
    await getSupabase()
      .from("leads")
      .update({
        status: "Suppression",
        last_activity: ts,
        notes: `${currentNotes}\nSuppressed via ${source} on ${ts}`.trim(),
        updated_at: ts,
      })
      .eq("id", row.id);
  }
  logger.info(`Suppressed ${list.length} lead(s) for email: ${email} via ${source}`);
}

export async function upsertLead(leadData: {
  name: string;
  email: string;
  phone?: string;
  address: string;
  notes?: string;
  tenantSlug: string;
  systemSizeKW?: number;
  estimatedCost?: number;
  estimatedSavings?: number;
  paybackPeriodYears?: number;
  npv25Year?: number;
  co2OffsetPerYear?: number;
  token?: string;
  vertical?: string;
  simulation_input?: unknown;
  simulation_output?: unknown;
  simulation_version?: string;
  recommended_path?: string;
  estimated_timeline_weeks?: number;
  price_range_low?: number;
  price_range_high?: number;
  budget_band?: string;
  consent_terms?: boolean;
  consent_contact?: boolean;
  lead_capture_completed?: boolean;
  booking_status?: string;
  lead_source?: string;
  utm_source?: string;
  utm_campaign?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    /**
     * Cold-email demos arrive with `?company=Sunspire+Weight+Clinic` → tenantSlug
     * `sunspire-weight-clinic`, which usually has no provisioned row in the
     * tenants table yet (clinics are only inserted after a paid signup). Without
     * a fallback the lead save returns `{ success: false }` → the UI shows
     * "Could not save right now. Please try again." Fall back to the
     * platform-owned `glpconvert` tenant (always provisioned) so demo leads
     * still land in the GLPConvert workspace and we never lose the conversion.
     */
    let tenant = await findTenantByHandle(leadData.tenantSlug);
    if (!tenant?.id && (leadData.vertical ?? "glp") === "glp") {
      logger.info(
        `Lead tenant '${leadData.tenantSlug}' not provisioned — falling back to 'glpconvert' for GLP demo lead`,
      );
      tenant = await findTenantByHandle("glpconvert");
    }
    if (!tenant?.id) return { success: false, error: "Tenant not found" };
    const fields: Record<string, unknown> = {
      name: leadData.name,
      email: leadData.email,
      address: leadData.address,
      notes: leadData.notes ?? "",
      status: "New",
      last_activity: getCurrentTimestamp(),
      utility_rate: 0.12,
      token: leadData.token ?? "",
      system_size_kw: leadData.systemSizeKW,
      estimated_cost: leadData.estimatedCost,
      estimated_savings: leadData.estimatedSavings,
      payback_period_years: leadData.paybackPeriodYears,
      npv_25_year: leadData.npv25Year,
      co2_offset_per_year: leadData.co2OffsetPerYear,
      phone: leadData.phone,
      vertical: leadData.vertical,
      simulation_input: leadData.simulation_input,
      simulation_output: leadData.simulation_output,
      simulation_version: leadData.simulation_version,
      recommended_path: leadData.recommended_path,
      estimated_timeline_weeks: leadData.estimated_timeline_weeks,
      price_range_low: leadData.price_range_low,
      price_range_high: leadData.price_range_high,
      budget_band: leadData.budget_band,
      consent_terms: leadData.consent_terms,
      consent_contact: leadData.consent_contact,
      lead_capture_completed: leadData.lead_capture_completed,
      booking_status: leadData.booking_status,
      lead_source: leadData.lead_source,
      utm_source: leadData.utm_source,
      utm_campaign: leadData.utm_campaign,
    };
    await upsertLeadByEmailAndTenant(leadData.email, tenant.id, fields);
    return { success: true };
  } catch (error) {
    logger.error("Failed to upsert lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function storeLead(leadData: Parameters<typeof upsertLead>[0]): Promise<{ success: boolean; error?: string }> {
  return upsertLead(leadData);
}

export async function storeLeadFallback(leadData: Parameters<typeof upsertLead>[0]): Promise<{ success: boolean; error?: string }> {
  return upsertLead(leadData);
}
