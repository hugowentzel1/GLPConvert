/**
 * Generate a consistent color palette from a brand hex color
 * Ensures WCAG AA contrast compliance for text over brand colors
 */

export interface BrandPalette {
  brand: string;
  brand600: string;
  brand100: string;
  onBrand: string;
}

/**
 * Convert hex to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance for contrast checking
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Darken a hex color by a percentage
 */
function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const factor = 1 - percent / 100;

  return `#${Math.round(r * factor)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * factor)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * factor)
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * Lighten a hex color by a percentage
 */
function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const factor = percent / 100;

  return `#${Math.round(r + (255 - r) * factor)
    .toString(16)
    .padStart(2, "0")}${Math.round(g + (255 - g) * factor)
    .toString(16)
    .padStart(2, "0")}${Math.round(b + (255 - b) * factor)
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * Generate a brand palette from a hex color
 * Ensures WCAG AA contrast (4.5:1) for text over brand colors
 */
export function paletteFrom(hex: string): BrandPalette {
  // Clean the hex color
  const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;

  // Generate variants
  const brand = cleanHex;
  const brand600 = darken(cleanHex, 20); // Hover/pressed state
  const brand100 = lighten(cleanHex, 85); // Light tint for backgrounds

  // Determine text color for optimal contrast
  const whiteContrast = getContrastRatio(cleanHex, "#ffffff");
  const blackContrast = getContrastRatio(cleanHex, "#000000");

  // Use white if it has better contrast, otherwise black
  const onBrand = whiteContrast >= blackContrast ? "#ffffff" : "#000000";

  return {
    brand,
    brand600,
    brand100,
    onBrand,
  };
}

/**
 * Apply brand palette to CSS custom properties
 */
export function applyBrandPalette(palette: BrandPalette): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--brand", palette.brand);
  root.style.setProperty("--brand-600", palette.brand600);
  root.style.setProperty("--brand-100", palette.brand100);
  root.style.setProperty("--on-brand", palette.onBrand);
}
