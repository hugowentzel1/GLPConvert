"use client";

import Image from "next/image";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

interface HeroBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function HeroBrand({
  size = "md",
  className = "",
}: HeroBrandProps) {
  const b = useBrandTakeover();

  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();

    // Tech companies
    if (brandLower.includes("google"))
      return "https://logo.clearbit.com/google.com";
    if (brandLower.includes("microsoft"))
      return "https://logo.clearbit.com/microsoft.com";
    if (brandLower.includes("apple"))
      return "https://logo.clearbit.com/apple.com";
    if (brandLower.includes("amazon"))
      return "https://logo.clearbit.com/amazon.com";
    if (brandLower.includes("meta") || brandLower.includes("facebook"))
      return "https://logo.clearbit.com/facebook.com";
    if (brandLower.includes("netflix"))
      return "https://logo.clearbit.com/netflix.com";
    if (brandLower.includes("spotify"))
      return "https://logo.clearbit.com/spotify.com";
    if (brandLower.includes("twitter"))
      return "https://logo.clearbit.com/twitter.com";
    if (brandLower.includes("linkedin"))
      return "https://logo.clearbit.com/linkedin.com";
    if (brandLower.includes("instagram"))
      return "https://logo.clearbit.com/instagram.com";
    if (brandLower.includes("twitch"))
      return "https://logo.clearbit.com/twitch.tv";
    if (brandLower.includes("discord"))
      return "https://logo.clearbit.com/discord.com";
    if (brandLower.includes("slack"))
      return "https://logo.clearbit.com/slack.com";
    if (brandLower.includes("shopify"))
      return "https://logo.clearbit.com/shopify.com";
    if (brandLower.includes("uber"))
      return "https://logo.clearbit.com/uber.com";
    if (brandLower.includes("lyft"))
      return "https://logo.clearbit.com/lyft.com";

    // Solar companies
    if (brandLower.includes("tesla"))
      return "https://logo.clearbit.com/tesla.com";
    if (brandLower.includes("sunpower"))
      return "https://logo.clearbit.com/sunpower.com";
    if (brandLower.includes("solarcity"))
      return "https://logo.clearbit.com/solarcity.com";
    if (brandLower.includes("vivint"))
      return "https://logo.clearbit.com/vivint.com";
    if (brandLower.includes("sunrun"))
      return "https://logo.clearbit.com/sunrun.com";
    if (brandLower.includes("sunnova"))
      return "https://logo.clearbit.com/sunnova.com";
    if (brandLower.includes("tealenergy"))
      return "https://logo.clearbit.com/tealenergy.com";
    if (brandLower.includes("solarpro"))
      return "https://logo.clearbit.com/solarpro.com";
    if (brandLower.includes("ecosolar"))
      return "https://logo.clearbit.com/ecosolar.com";
    if (brandLower.includes("premiumsolar"))
      return "https://logo.clearbit.com/premiumsolar.com";
    if (brandLower.includes("acme"))
      return "https://logo.clearbit.com/acme.com";

    // Energy companies
    if (brandLower.includes("bp")) return "https://logo.clearbit.com/bp.com";
    if (brandLower.includes("shell"))
      return "https://logo.clearbit.com/shell.com";
    if (brandLower.includes("exxon"))
      return "https://logo.clearbit.com/exxonmobil.com";
    if (brandLower.includes("chevron"))
      return "https://logo.clearbit.com/chevron.com";

    // Real estate/home
    if (brandLower.includes("zillow"))
      return "https://logo.clearbit.com/zillow.com";
    if (brandLower.includes("redfin"))
      return "https://logo.clearbit.com/redfin.com";
    if (brandLower.includes("realtor"))
      return "https://logo.clearbit.com/realtor.com";
    if (brandLower.includes("homedepot"))
      return "https://logo.clearbit.com/homedepot.com";

    // Financial services
    if (brandLower.includes("chase"))
      return "https://logo.clearbit.com/chase.com";
    if (brandLower.includes("wellsfargo"))
      return "https://logo.clearbit.com/wellsfargo.com";
    if (brandLower.includes("bankofamerica"))
      return "https://logo.clearbit.com/bankofamerica.com";
    if (brandLower.includes("goldmansachs"))
      return "https://logo.clearbit.com/goldmansachs.com";

    // Other popular brands
    if (brandLower.includes("starbucks"))
      return "https://logo.clearbit.com/starbucks.com";
    if (brandLower.includes("mcdonalds"))
      return "https://logo.clearbit.com/mcdonalds.com";
    if (brandLower.includes("cocacola") || brandLower.includes("coca"))
      return "https://logo.clearbit.com/coca-cola.com";
    if (brandLower.includes("target"))
      return "https://logo.clearbit.com/target.com";
    if (brandLower.includes("bestbuy"))
      return "https://logo.clearbit.com/bestbuy.com";
    if (brandLower.includes("snapchat"))
      return "https://logo.clearbit.com/snapchat.com";
    if (brandLower.includes("whatsapp"))
      return "https://logo.clearbit.com/whatsapp.com";
    if (brandLower.includes("firefox"))
      return "https://logo.clearbit.com/mozilla.org";
    if (brandLower.includes("harleydavidson"))
      return "https://logo.clearbit.com/harley-davidson.com";

    return null;
  };

  const logoUrl = b.logo || getDefaultLogo(b.brand);
  
  // Use proxy endpoint for external logos to bypass CORS/403 issues
  const getProxiedLogoUrl = (url: string | null) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return `/api/logo-proxy?url=${encodeURIComponent(url)}`;
      }
      return url;
    } catch {
      return url;
    }
  };
  
  const proxiedLogoUrl = logoUrl ? getProxiedLogoUrl(logoUrl) : null;

  const sizeClasses = {
    sm: "w-16 h-16", // 64px mobile
    md: "w-20 h-20", // 80px desktop
    lg: "w-24 h-24", // 96px desktop
  };

  if (!proxiedLogoUrl) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-600)] flex items-center justify-center shadow-lg ${className}`}
        data-hero-logo
      >
        <span className="text-2xl">☀️</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-[var(--brand-100)] flex items-center justify-center shadow-lg p-3 ${className}`}
      data-hero-logo
    >
      <Image
        src={proxiedLogoUrl}
        alt={`${b.brand} logo`}
        width={size === "sm" ? 48 : size === "md" ? 64 : 72}
        height={size === "sm" ? 48 : size === "md" ? 64 : 72}
        unoptimized
        className="object-contain mix-blend-multiply"
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
}
