export function ensureBrandVar() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const primary = url.searchParams.get("primary");
  const clean = primary?.replace(/^%23/, "#");
  const hex =
    clean && /^#?[0-9A-Fa-f]{6}$/.test(clean)
      ? clean.startsWith("#")
        ? clean
        : "#" + clean
      : null;
  if (hex) document.documentElement.style.setProperty("--brand", hex);
}
