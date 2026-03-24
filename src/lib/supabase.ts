import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/src/config/env";

let client: SupabaseClient | null = null;

/** Avoid Vercel FUNCTION_INVOCATION_TIMEOUT when Supabase TLS/connect stalls (unbounded fetch). */
function supabaseFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const ms = Number(process.env.SUPABASE_FETCH_TIMEOUT_MS ?? 12_000);
  const outer = init?.signal;
  if (outer?.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }
  const timeout = AbortSignal.timeout(ms);
  const signal =
    typeof AbortSignal.any === "function"
      ? AbortSignal.any(outer ? [timeout, outer] : [timeout])
      : timeout;
  return fetch(input, { ...init, signal });
}

function getSupabaseConfig(): { url: string; key: string } {
  const isProd = process.env.VERCEL_ENV === "production";
  const url =
    ENV.SUPABASE_URL ??
    (isProd ? ENV.SUPABASE_URL_PROD : ENV.SUPABASE_URL_STAGING);
  const key =
    ENV.SUPABASE_SERVICE_ROLE_KEY ??
    (isProd ? ENV.SUPABASE_SERVICE_ROLE_KEY_PROD : ENV.SUPABASE_SERVICE_ROLE_KEY_STAGING);
  if (!url || !key) {
    throw new Error(
      "Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or SUPABASE_URL_STAGING/PROD + SUPABASE_SERVICE_ROLE_KEY_STAGING/PROD"
    );
  }
  return { url, key };
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    const { url, key } = getSupabaseConfig();
    client = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: supabaseFetch },
    });
  }
  return client;
}
