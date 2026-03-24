"use client";
import { useIsDemo } from "@/src/personalization/useDemoFlag";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";

export function DemoFooter() {
  const isDemo = useIsDemo();
  const { brand } = usePersonalizationCtx();

  if (!isDemo) return null;

  const handleDemoLink = (section: string) => {
    // In demo mode, route all internal links to contact form
    const params = new URLSearchParams({
      source: "demo",
      brand: brand || "Your Company",
      section,
    });
    window.location.href = `/?demo=1&${params.toString()}`;
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {brand ?? "Your Company"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Demo preview of a branded solar intelligence platform.
            </p>
            <div className="text-xs text-gray-500">
              <p>Demo data. Accuracy for illustration only.</p>
              <p>This is a preview, not a live service.</p>
            </div>
          </div>

          {/* Demo Actions */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Get Started</h4>
            <button
              onClick={() => handleDemoLink("demo_install")}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Install on Your Site
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Get your own branded version
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © 2024 {brand ?? "Your Company"}. Demo preview powered by Your
              Company.
            </p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <button
                onClick={() => handleDemoLink("privacy")}
                className="hover:text-gray-700 transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => handleDemoLink("terms")}
                className="hover:text-gray-700 transition-colors"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
