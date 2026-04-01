const STORAGE_KEY = "glpconvert_utm_v1";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type MergedUtm = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

/** Merge URL UTM params into sessionStorage so they survive in-flow navigation. */
export function persistUtmFromSearchParams(searchParams: URLSearchParams): void {
  if (typeof window === "undefined") return;
  const incoming: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = searchParams.get(k);
    if (v) incoming[k] = v;
  }
  if (Object.keys(incoming).length === 0) return;
  try {
    const prev = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...incoming }));
  } catch {
    /* ignore */
  }
}

export function getMergedUtm(searchParams: URLSearchParams | null): MergedUtm {
  let stored: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
    } catch {
      stored = {};
    }
  }
  const get = (k: (typeof UTM_KEYS)[number]) => searchParams?.get(k) || stored[k];
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
  };
}
