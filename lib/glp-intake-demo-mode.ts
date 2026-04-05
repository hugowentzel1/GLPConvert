/** True when the GLP intake should show demo affordances (preview URL modes + demo=1|true). */
export function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" ||
    sp.get("demo") === "true" ||
    sp.get("preview") === "1" ||
    sp.get("mode") === "demo"
  );
}
