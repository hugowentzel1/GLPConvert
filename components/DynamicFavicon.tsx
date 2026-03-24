"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Map company names to their logo URLs (using public CDN logos or emojis as fallback)
const COMPANY_FAVICONS: Record<string, string> = {
  tesla: "https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon-32x32.png",
  apple: "https://www.apple.com/favicon.ico",
  google: "https://www.google.com/favicon.ico",
  microsoft: "https://www.microsoft.com/favicon.ico",
  netflix: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico",
  meta: "https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/YZd-fHGY0fF.png",
  uber: "https://d1a3f4spazzrp4.cloudfront.net/uber-com/1.3.8/d1a3f4spazzrp4.cloudfront.net/favicon.ico",
};

export default function DynamicFavicon() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const company = searchParams?.get("company")?.toLowerCase();
    const demo = searchParams?.get("demo");
    
    // Only change favicon in demo mode
    if (!demo || !company) return;

    const faviconUrl = COMPANY_FAVICONS[company];
    if (!faviconUrl) return;

    // Remove existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = faviconUrl;
    document.head.appendChild(link);

    // Also add apple-touch-icon for better mobile support
    const appleTouchIcon = document.createElement("link");
    appleTouchIcon.rel = "apple-touch-icon";
    appleTouchIcon.href = faviconUrl;
    document.head.appendChild(appleTouchIcon);

    // Cleanup on unmount
    return () => {
      link.remove();
      appleTouchIcon.remove();
    };
  }, [searchParams]);

  return null;
}

