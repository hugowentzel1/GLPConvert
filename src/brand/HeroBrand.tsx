"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

interface HeroBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function HeroBrand({ size = "md", className = "" }: HeroBrandProps = {}) {
  const b = useBrandTakeover();
  const [imageError, setImageError] = useState(false);
  
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
      // Only proxy external HTTP/HTTPS URLs
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        // Always use proxy for external URLs
        const proxied = `/api/logo-proxy?url=${encodeURIComponent(url)}`;
        console.log('HeroBrand: Proxying logo URL:', url, '->', proxied);
        return proxied;
      }
      return url;
    } catch (e) {
      console.warn('HeroBrand: Failed to parse logo URL:', url, e);
      return url;
    }
  };
  
  const proxiedLogoUrl = logoUrl ? getProxiedLogoUrl(logoUrl) : null;
  const showImage = proxiedLogoUrl && !imageError;
  
  // ALL HOOKS MUST BE BEFORE ANY EARLY RETURNS
  // Debug logging
  useEffect(() => {
    console.log('HeroBrand render state:', {
      enabled: b.enabled,
      brand: b.brand,
      logo: b.logo,
      isDemo: b.isDemo
    });
  }, [b]);
  
  useEffect(() => {
    if (b.enabled || b.brand) {
      console.log('HeroBrand render:', {
        logoUrl,
        proxiedLogoUrl,
        showImage,
        imageError,
        brand: b.brand
      });
    }
  }, [logoUrl, proxiedLogoUrl, showImage, imageError, b.brand, b.enabled]);
  
  // Show in both demo and paid modes when brand is enabled
  // Also show if we have company branding even if not explicitly enabled
  // Early return AFTER all hooks
  if (!b.enabled && !b.brand) {
    console.warn('HeroBrand: Returning null - enabled:', b.enabled, 'brand:', b.brand);
    return null;
  }

  const sizeClasses = {
    sm: "w-16 h-16", // 64px
    md: "w-20 h-20", // 80px
    lg: "w-24 h-24", // 96px
  };

  const sizeValues = {
    sm: 48,
    md: 64,
    lg: 72,
  };

  const currentSize = sizeValues[size];
  const currentSizeClass = sizeClasses[size];

  return (
    <div
      className={`section-spacing ${className}`}
      style={{ display: "grid", placeItems: "center" }}
      data-hero-logo
    >
      {showImage ? (
        <Image
          src={proxiedLogoUrl}
          alt={`${b.brand} logo`}
          width={currentSize}
          height={currentSize}
          unoptimized
          onError={(e) => {
            console.warn('HeroBrand: Failed to load logo image:', proxiedLogoUrl);
            setImageError(true);
            // Hide broken image immediately
            if (e.target) {
              (e.target as HTMLImageElement).style.display = 'none';
            }
          }}
          onLoad={() => {
            console.log('HeroBrand: Logo image loaded successfully:', proxiedLogoUrl);
            setImageError(false);
          }}
          style={{
            objectFit: "contain",
            borderRadius: 8,
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            minWidth: `${currentSize}px`,
            minHeight: `${currentSize}px`,
            maxWidth: `${currentSize}px`,
            maxHeight: `${currentSize}px`,
            display: imageError ? 'none' : 'block',
          }}
        />
      ) : null}
      {(!showImage || imageError) && (
        <div
          className={currentSizeClass}
          style={{
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            background: b.primary,
            color: "#0D0D0D",
            fontWeight: 800,
            fontSize: size === "sm" ? 14 : size === "md" ? 16 : 18,
          }}
        >
          {initials(b.brand)}
        </div>
      )}
    </div>
  );
}
