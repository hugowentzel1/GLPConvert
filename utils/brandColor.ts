/**
 * Brand color utilities for ensuring WCAG contrast compliance
 */

/**
 * Ensures brand color meets minimum contrast ratio against white background
 * Automatically darkens too-light colors to maintain readability
 * @param hex - Brand color hex value (e.g., "#0EA5E9")
 * @param min - Minimum contrast ratio (default 4.5 for WCAG AA)
 * @returns Adjusted hex color that meets contrast requirements
 */
export function ensureReadableBrandInk(hex: string, min = 4.5): string {
  // lightweight WCAG contrast guard: if the brand color is too light against white,
  // progressively darken it toward #000 until contrast >= min
  const toRGB = (h: string) => {
    const n = h.replace('#', '');
    const i = n.length === 3 ? n.split('').map(c => c + c).join('') : n;
    return [0, 2, 4].map(k => parseInt(i.slice(k, k + 2), 16));
  };
  
  const relLum = (r: number, g: number, b: number) => {
    const f = (u: number) => {
      const s = u / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const [R, G, B] = [f(r), f(g), f(b)];
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const contrastWithWhite = (rgb: number[]) => {
    const L1 = 1; // white
    const L2 = relLum(rgb[0], rgb[1], rgb[2]);
    return (L1 + 0.05) / (L2 + 0.05);
  };
  
  const darken = (rgb: number[], t: number) =>
    rgb.map(v => Math.max(0, Math.round(v * (1 - t))));
  
  let rgb = toRGB(hex || '#2563EB');
  let t = 0;
  while (contrastWithWhite(rgb) < min && t < 0.6) {
    t += 0.05;
    rgb = darken(rgb, 0.05);
  }
  
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}
