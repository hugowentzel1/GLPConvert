"use client";

import { useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

// Helper function to generate brand color variations
function generateBrandColors(primaryColor: string) {
  // Convert hex to RGB
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Generate lighter variations
  const brand50 = `rgb(${Math.min(255, r + 200)}, ${Math.min(255, g + 200)}, ${Math.min(255, b + 200)})`;
  const brand100 = `rgb(${Math.min(255, r + 150)}, ${Math.min(255, g + 150)}, ${Math.min(255, b + 150)})`;
  const brand200 = `rgb(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)})`;
  const brand300 = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`;
  const brand400 = `rgb(${Math.min(255, r + 25)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 25)})`;
  
  // Base color
  const brand500 = primaryColor;
  const brand600 = primaryColor;
  const brand700 = primaryColor;
  const brand800 = primaryColor;
  const brand900 = primaryColor;

  return {
    brand50, brand100, brand200, brand300, brand400,
    brand500, brand600, brand700, brand800, brand900
  };
}

export default function BrandCSSInjector() {
  const { enabled, primary, brand } = useBrandTakeover();

  useEffect(() => {
    const root = document.documentElement;

    if (enabled && primary) {
      // Set the company's primary color and generate the full range
      root.style.setProperty("--brand", primary);
      root.style.setProperty("--brand-2", primary); // Use same color for consistency
      root.style.setProperty("--brand-primary", primary); // This is what the CSS actually uses
      
      // Generate proper brand color variations
      const colors = generateBrandColors(primary);
      root.style.setProperty("--brand-50", colors.brand50);
      root.style.setProperty("--brand-100", colors.brand100);
      root.style.setProperty("--brand-200", colors.brand200);
      root.style.setProperty("--brand-300", colors.brand300);
      root.style.setProperty("--brand-400", colors.brand400);
      root.style.setProperty("--brand-500", colors.brand500);
      root.style.setProperty("--brand-600", colors.brand600);
      root.style.setProperty("--brand-700", colors.brand700);
      root.style.setProperty("--brand-800", colors.brand800);
      root.style.setProperty("--brand-900", colors.brand900);

      // Also inject CSS rules for Tailwind compatibility
      const style = document.createElement('style');
      style.textContent = `
        .text-brand-600 { color: ${primary} !important; }
        .text-brand-primary { color: ${primary} !important; }
        .bg-brand-50 { background-color: ${colors.brand50} !important; }
        .border-brand-200 { border-color: ${colors.brand200} !important; }
        .text-brand-800 { color: ${colors.brand800} !important; }
      `;
      document.head.appendChild(style);

      console.log(`Brand CSS injected: ${brand} with color ${primary}`);
    } else {
      // Fallback to default brand
      root.style.setProperty("--brand", "#FF7A00");
      root.style.setProperty("--brand-2", "#FF3D81");
      root.style.setProperty("--brand-primary", "#FFA63D");
      
      // Set default brand range
      root.style.setProperty("--brand-50", "#fff7ed");
      root.style.setProperty("--brand-100", "#ffedd5");
      root.style.setProperty("--brand-200", "#fed7aa");
      root.style.setProperty("--brand-300", "#fdba74");
      root.style.setProperty("--brand-400", "#fb923c");
      root.style.setProperty("--brand-500", "#f97316");
      root.style.setProperty("--brand-600", "#ea580c");
      root.style.setProperty("--brand-700", "#c2410c");
      root.style.setProperty("--brand-800", "#9a3412");
      root.style.setProperty("--brand-900", "#7c2d12");
    }
  }, [enabled, primary, brand]);

  return null;
}
