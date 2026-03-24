import { useTenant } from "../TenantProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TenantPreview() {
  const { tenant } = useTenant();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyDemoLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToDefault = () => {
    router.push("/");
  };

  if (!tenant || tenant.slug === "default") {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] text-white p-3">
      <div className="container-premium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Previewing: {tenant.name}</span>
            <button
              onClick={resetToDefault}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Reset to Default
            </button>
          </div>
          <button
            onClick={copyDemoLink}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {copied ? "Copied!" : "Copy Demo Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
