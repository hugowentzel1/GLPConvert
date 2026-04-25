/**
 * WCAG-AA contrast guard for user-supplied brand colors that arrive via `?brand=` in cold-email
 * links. We compose the brand color against white text on primary CTAs (e.g. `bg-[brandFill]
 * text-white`); if the relative-luminance contrast ratio falls below 4.5:1 (WCAG 2.2 SC 1.4.3
 * "Contrast (Minimum)"), we darken the color toward `#0f172a` (slate-900) until the ratio passes
 * or we hit the floor.
 *
 * Refs:
 * - https://www.w3.org/TR/WCAG22/#contrast-minimum
 * - https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */

const SLATE_900 = "#0f172a";
const WHITE = "#ffffff";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string): [number, number, number] | null {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 1;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Walk the brand color toward `target` (default slate-900) in 12 small steps and return the first
 * variant that hits the requested ratio against white. If nothing passes, return `target`.
 */
export function darkenUntilContrastAA(
  hex: string,
  contrastTargetRatio = 4.5,
  background = WHITE,
  walkTarget = SLATE_900,
): string {
  const start = hexToRgb(hex);
  const end = hexToRgb(walkTarget);
  if (!start || !end) return walkTarget;
  for (let step = 0; step <= 12; step++) {
    const t = step / 12;
    const r = start[0] + (end[0] - start[0]) * t;
    const g = start[1] + (end[1] - start[1]) * t;
    const b = start[2] + (end[2] - start[2]) * t;
    const candidate = rgbToHex(r, g, b);
    if (contrastRatio(candidate, background) >= contrastTargetRatio) return candidate;
  }
  return walkTarget;
}

/**
 * Returns a brand fill that is safe to use as the background of a primary CTA with white text.
 * Pass-through when the supplied color already passes AA against white (4.5:1).
 */
export function getAccessibleBrandFill(brandHex: string | null | undefined): string {
  if (!brandHex) return SLATE_900;
  const normalized = /^#[0-9a-f]{6}$/i.test(brandHex) ? brandHex : SLATE_900;
  if (contrastRatio(normalized, WHITE) >= 4.5) return normalized;
  return darkenUntilContrastAA(normalized);
}
