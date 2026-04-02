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
    const wash = hexToRgba(accent, demo ? 0.1 : 0.06);
    const wash2 = hexToRgba(accent, 0.04);
    return {
      background: `radial-gradient(ellipse 100% 58% at 50% -10%, ${wash}, transparent 50%), radial-gradient(ellipse 80% 40% at 100% 80%, ${wash2}, transparent 45%), linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #f1f5f9 100%)`,
    };
  }, [accent, demo]);

  return (
    <main
      className="min-h-screen px-4 py-10 md:py-16"
      style={backgroundStyle}
      data-intake-mode={demo ? "demo" : "paid"}
    >
      {children}
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
          className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 md:py-16"
          data-intake-mode={demoServerHint ? "demo" : "paid"}
        >
          {children}
        </main>
      }
    >
      <IntakePageFrameInner demoServerHint={demoServerHint}>{children}</IntakePageFrameInner>
    </Suspense>
  );
}
