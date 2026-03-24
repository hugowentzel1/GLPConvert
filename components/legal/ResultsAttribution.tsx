import PVWattsBadge from "@/components/legal/PVWattsBadge";
import GoogleAttribution from "@/components/legal/GoogleAttribution";

export function ResultsAttribution() {
  return (
    <div className="mt-6 space-y-2 text-xs opacity-80">
      <PVWattsBadge />
      <GoogleAttribution />
    </div>
  );
}
