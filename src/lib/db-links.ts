import { getSupabase } from "@/src/lib/supabase";
import { logger } from "@/src/lib/logger";

export async function findLinkByToken(
  token: string,
): Promise<{ id: string; targetParams: string } | null> {
  try {
    const { data, error } = await getSupabase()
      .from("links")
      .select("id, target_params")
      .eq("token", token)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as { id: string; target_params: string | null };
    return {
      id: row.id,
      targetParams: row.target_params ?? "",
    };
  } catch (error) {
    logger.error("Error finding link by token:", error);
    return null;
  }
}

export async function markLinkClicked(id: string): Promise<void> {
  try {
    const { data: row, error: e1 } = await getSupabase()
      .from("links")
      .select("clicks")
      .eq("id", id)
      .single();
    if (e1 || !row) return;
    const currentClicks = (row as { clicks: number }).clicks ?? 0;
    const ts = new Date().toISOString();
    await getSupabase()
      .from("links")
      .update({ clicks: currentClicks + 1, last_clicked_at: ts, updated_at: ts })
      .eq("id", id);
  } catch (error) {
    logger.error("Error marking link clicked:", error);
  }
}
