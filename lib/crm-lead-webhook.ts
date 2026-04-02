/**
 * Fire-and-forget POST to tenant-configured CRM / Zapier / Make URL after a lead is stored.
 * Does not block the API response; failures are logged only.
 */
export async function postLeadToTenantCrmWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const url = webhookUrl.trim();
  if (!/^https:\/\//i.test(url)) return;
  const ms = Math.min(12_000, Math.max(2000, Number(process.env.CRM_WEBHOOK_TIMEOUT_MS ?? 8000)));
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(ms),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.warn("[crm-webhook] non-OK", res.status, t.slice(0, 200));
    }
  } catch (e) {
    console.warn("[crm-webhook] error (non-blocking)", e);
  }
}
