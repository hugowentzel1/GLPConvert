/**
 * Logo proxy utility - centralizes logo URL proxying logic
 */

export function getProxiedLogoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // Only proxy external HTTP/HTTPS URLs
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return `/api/logo-proxy?url=${encodeURIComponent(url)}`;
    }
    // Return data URLs and relative paths as-is
    return url;
  } catch {
    // If URL parsing fails, return as-is (might be a relative path)
    return url;
  }
}

