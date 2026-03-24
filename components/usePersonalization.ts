"use client";

import { useEffect, useState } from "react";

export function usePersonalization() {
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      // Read company and domain parameters from URL
      const p = new URLSearchParams(window.location.search);
      const c = p.get("company")?.trim() || "";
      const d = p.get("domain")?.trim() || "";
      setCompany(c);
      setDomain(d);

      if (c) {
        // Personalization: Browser tab title for every page
        const originalTitle = document.title;
        const baseTitle = originalTitle.includes(" — ")
          ? originalTitle.split(" — ")[1]
          : originalTitle;
        document.title = `${c} — ${baseTitle}`;

        // Personalization: No-index tag for SEO protection
        if (!document.querySelector('meta[name="robots"]')) {
          const m = document.createElement("meta");
          m.name = "robots";
          m.content = "noindex,follow";
          document.head.appendChild(m);
        }
      }
    } catch (error) {
      console.warn("Personalization error:", error);
    }
  }, [mounted]);

  // Personalization: Deterministic gradient based on company
  const getCompanyGradient = (companyName: string) => {
    if (!companyName) return { from: "#f97316", to: "#ec4899" };

    let h = 0;
    for (let i = 0; i < companyName.length; i++) {
      h = (h * 31 + companyName.charCodeAt(i)) % 360;
    }
    const from = `hsl(${h}, 75%, 92%)`;
    const to = `hsl(${(h + 30) % 360}, 85%, 96%)`;
    return { from, to };
  };

  const { from, to } = getCompanyGradient(company);

  // Personalization: Auto-pull favicon from domain
  const getCompanyLogo = (domainName: string) => {
    if (!domainName) return "";
    return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domainName)}`;
  };

  return {
    company,
    domain,
    logoUrl: getCompanyLogo(domain),
    gradient: { from, to },
    isPersonalized: !!company,
    mounted,
  };
}
