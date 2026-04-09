"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { hexToRgba } from "@/lib/intake-color-helpers";
import IntakePageFooter from "@/components/intake/IntakePageFooter";

function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" || sp.get("preview") === "1" || sp.get("mode") === "demo"
  );
}

function IntakePageFrameInner({
  demoServerHint,
  children,
}: {
  demoServerHint: boolean;
  children: React.ReactNode;
}) {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp) || demoServerHint;
  const { primaryHex } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  const accent = primaryHex || "#475569";

  const backgroundStyle = useMemo(() => {
    const wash = hexToRgba(accent, demo ? 0.08 : 0.05);
    const wash2 = hexToRgba(accent, 0.035);
    // Tighter ellipses so the brand wash reads as a subtle halo, not a giant “arc” across the viewport
    return {
      background: `radial-gradient(ellipse 65% 42% at 50% -8%, ${wash}, transparent 52%), radial-gradient(ellipse 55% 35% at 100% 85%, ${wash2}, transparent 48%), linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #f1f5f9 100%)`,
    };
  }, [accent, demo]);

  return (
    <main
      className={`min-h-screen px-4 pb-8 sm:px-6 md:px-8 md:pb-10 ${demo ? "pt-8 sm:pt-10 md:pt-12" : "py-8 md:py-10"}`}
      style={{ ...backgroundStyle, minHeight: "100vh" }}
      data-intake-mode={demo ? "demo" : "paid"}
    >
      <div className="mx-auto w-full max-w-2xl space-y-8 md:space-y-10">{children}</div>
      <IntakePageFooter />
    </main>
  );
}

export default function IntakePageFrame({
  demoServerHint,
  children,
}: {
  demoServerHint: boolean;
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8 sm:px-6 md:px-8 md:py-10"
          data-intake-mode={demoServerHint ? "demo" : "paid"}
        >
          <div className="mx-auto w-full max-w-2xl space-y-8 md:space-y-10">{children}</div>
        </main>
      }
    >
      <IntakePageFrameInner demoServerHint={demoServerHint}>{children}</IntakePageFrameInner>
    </Suspense>
  );
}
