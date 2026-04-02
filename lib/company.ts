// /lib/company.ts
export function sanitizeCompany(raw: string | null): string {
  if (!raw) return "";
  return raw.trim().slice(0, 64).replace(/[<>]/g, "");
}

// Deterministic pastel gradient from the company string
export function brandGradient(company: string) {
  if (!company) return { from: "#eef2ff", to: "#f5f3ff" }; // soft default
  let h = 0;
  for (let i = 0; i < company.length; i++) {
    h = (h * 31 + company.charCodeAt(i)) % 360;
  }
  const from = `hsl(${h}, 75%, 92%)`;
  const to = `hsl(${(h + 30) % 360}, 85%, 96%)`;
  return { from, to };
}

export function logoUrlFromDomain(domain?: string) {
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}

export interface CompanyInfo {
  companyHandle: string;
  companyName: string;
  companyDomain: string;
}

export function parseCompany(
  host: string,
  search: URLSearchParams,
): CompanyInfo {
  const h = (host || "").toLowerCase();
  /** White-label tenant subdomain pattern (GLPConvert hosted clinics) */
  const fromHost = h.endsWith(".c.glpconvert.com")
    ? h.replace(".c.glpconvert.com", "")
    : "";
  const fromQuery = (search.get("company") || "").toLowerCase().trim();
  const handle = fromHost || fromQuery || "your-company";
  const name =
    search.get("name") ||
    handle.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  return {
    companyHandle: handle,
    companyName: name,
    companyDomain: `${handle}.c.glpconvert.com`,
  };
}

/** Display label for nav/hero when `company` is present in the query string (SSR-safe). */
export function companyLabelFromSearchParams(
  search: URLSearchParams | null | undefined,
): string | null {
  if (!search) return null;
  const raw = search.get("company")?.trim();
  if (!raw) return null;
  const named = search.get("name")?.trim();
  if (named) return sanitizeCompany(named) || null;
  const handle = raw.toLowerCase();
  const titleCased = handle
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
  return titleCased.slice(0, 64) || null;
}

export function getCompanyFromUrl(url: string): CompanyInfo {
  try {
    const urlObj = new URL(url);
    return parseCompany(urlObj.host, urlObj.searchParams);
  } catch {
    return {
      companyHandle: "your-company",
      companyName: "Your Company",
      companyDomain: "your-company.c.glpconvert.com",
    };
  }
}
