import { parse } from "tldts";

export function getRootDomain(input: string): string | null {
  if (!input) return null;
  const url = input.includes("://") ? input : `https://${input}`;
  const p = parse(url);
  if (!p.domain || p.isIp) return null;
  return p.domain; // e.g., acme.com
}

export const buildQuoteFQDN = (root: string) => `quote.${root}`;
export const buildFixedQuoteDomain = buildQuoteFQDN; // Alias for backward compatibility

export function isValidSubdomain(hostname: string): boolean {
  if (!hostname) return false;
  const parts = hostname.split(".");
  return parts.length >= 3 && parts[0] !== "www";
}

export function extractCompanyWebsite(
  company: string | null | undefined,
): string | null {
  if (!company) return null;

  // If it looks like a URL, return it
  if (company.includes("://") || company.includes(".")) {
    return company.startsWith("http") ? company : `https://${company}`;
  }

  // Otherwise, assume it's a company name and return null
  return null;
}
