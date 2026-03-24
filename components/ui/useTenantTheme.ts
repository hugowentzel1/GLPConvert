import { useEffect } from "react";
import { useTenant } from "../TenantProvider";

export function useTenantTheme() {
  const { tenant } = useTenant();

  useEffect(() => {
    if (tenant?.colors) {
      // Set CSS variables for tenant colors
      document.documentElement.style.setProperty(
        "--brand",
        tenant.colors.primary || "#FF7A3D",
      );
      document.documentElement.style.setProperty(
        "--brand-2",
        tenant.colors.secondary || "#FF4D6D",
      );
    } else {
      // Reset to defaults
      document.documentElement.style.setProperty("--brand", "#FF7A3D");
      document.documentElement.style.setProperty("--brand-2", "#FF4D6D");
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.style.removeProperty("--brand");
      document.documentElement.style.removeProperty("--brand-2");
    };
  }, [tenant?.colors]);
}
