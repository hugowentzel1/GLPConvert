// Reset demo runs for testing
export function resetDemoRuns() {
  if (typeof window === "undefined") return;
  
  console.log("🔄 Starting demo runs reset...");
  
  // Clear ALL quota-related localStorage keys
  const quotaKeys = [
    "demo_quota_v5",           // Current quota system
    "demo_quota_v4",
    "demo_quota_v3", 
    "demo_quota_v2",
    "demo_quota_v1",
    "sunspire_demo_quota",
    "sunspire_demo_quota_v1",
    "demo_auto_open_v1"
  ];
  
  quotaKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared ${key}`);
  });
  
  // Safari-specific: Also clear sessionStorage
  sessionStorage.clear();
  console.log("🗑️ Cleared sessionStorage");
  
  // Re-set the brand takeover data with default 2 runs
  const brandData = {
    enabled: true,
    brand: "tesla",
    primary: "#CC0000",
    logo: null,
    domain: "tesla",
    city: null,
    rep: null,
    firstName: null,
    role: null,
    expireDays: 7,
    runs: 2, // Reset to default
    blur: true,
    pilot: false,
    isDemo: true,
    _timestamp: Date.now()
  };
  
  localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
  console.log("✅ Brand data reset with 2 runs");
  
  // Initialize the quota system with 2 runs for current URL
  const url = new URL(window.location.href);
  const essentialParams = ["company", "demo"];
  const normalizedUrl = new URL(url.origin + "/");
  essentialParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      normalizedUrl.searchParams.set(param, url.searchParams.get(param) || "");
    }
  });
  const quotaMap: Record<string, number> = {};
  quotaMap[normalizedUrl.toString()] = 2;
  localStorage.setItem("demo_quota_v5", JSON.stringify(quotaMap));
  console.log("✅ Demo quota reset to 2 runs for:", normalizedUrl.toString());
  
  console.log("✅ Demo runs completely reset - you now have 2 runs");
  
  // Safari-specific: Force a hard reload to ensure state is refreshed
  // Safari caches localStorage more aggressively than Chrome
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    console.log("🍎 Safari detected - forcing hard reload in 500ms...");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    console.log("💡 Tip: Refresh the page to see the changes");
  }
}

// Make resetDemoRuns available globally for easy access from browser console
if (typeof window !== "undefined") {
  (window as any).resetDemoRuns = resetDemoRuns;
  console.log("🛠️ Demo reset function available globally as window.resetDemoRuns()");
}
