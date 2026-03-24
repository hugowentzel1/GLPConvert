export type Brand = { hex: string; from: string; to: string };

export const defaultBrand: Brand = {
  hex: "#FF7A00",
  from: "#FF7A00",
  to: "#FF3D81",
};

// Compute a softer second stop
const lighten = (hex: string, amt = 14) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const avg = Math.round((r + g + b) / 3);
  return `hsl(${avg}, 85%, ${60 + amt}%)`;
};

export function getBrandFromQuery(): Brand {
  // Safety check for server-side rendering
  if (typeof window === "undefined" || typeof window.location === "undefined") {
    return defaultBrand;
  }

  try {
    const p = new URLSearchParams(window.location.search);
    const c = (p.get("brandColor") || "").trim();

    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return defaultBrand;

    return {
      hex: c,
      from: c,
      to: lighten(c),
    };
  } catch (error) {
    console.warn("Failed to parse brand from query:", error);
    return defaultBrand;
  }
}
