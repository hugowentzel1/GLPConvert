/**
 * Demo detection utilities - single source of truth
 * Demo mode is ONLY active when demo=1 or demo=true in URL
 * Company parameter alone does NOT imply demo
 */

import { useSearchParams } from "next/navigation";

export const isDemoFromSearch = (sp: URLSearchParams): boolean =>
  sp.get("demo") === "1" || sp.get("demo") === "true";

export const isDemoFromURL = (url: URL | string): boolean => {
  const urlObj = new URL(url.toString(), "https://dummy");
  return isDemoFromSearch(urlObj.searchParams);
};

export const isDemoFromSearchParams = isDemoFromSearch;

export function useIsDemo(): boolean {
  const searchParams = useSearchParams();
  return isDemoFromSearch(searchParams || new URLSearchParams());
}
