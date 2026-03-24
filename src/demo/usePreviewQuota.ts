"use client";
const KEY = "demo_quota_v5"; // Bumped to reset all demos to 2 runs
const AUTO_OPEN_KEY = "demo_auto_open_v1";

export function usePreviewQuota(allowed: number = 2) {
  // Normalize URL to only include essential parameters for demo quota
  const getNormalizedUrl = () => {
    if (typeof window === "undefined") return "link";
    const url = new URL(window.location.href);
    // Only keep essential parameters for demo quota - use same key for entire demo session
    const essentialParams = ["company", "demo"];
    const newUrl = new URL(url.origin + "/"); // Use just the origin with root path
    essentialParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        newUrl.searchParams.set(param, url.searchParams.get(param) || "");
      }
    });
    return newUrl.toString();
  };

  const link = getNormalizedUrl();

  function read() {
    if (typeof window === "undefined") return allowed;
    const map = JSON.parse(localStorage.getItem(KEY) || "{}");
    
    // Initialize quota if not exists
    if (!(link in map)) {
      map[link] = allowed;
      localStorage.setItem(KEY, JSON.stringify(map));
    }
    
    return map[link];
  }

  function consume() {
    if (typeof window === "undefined") return;
    console.log("🔒 usePreviewQuota consume() called for link:", link);
    const map = JSON.parse(localStorage.getItem(KEY) || "{}");
    const currentRuns = map[link] ?? allowed;
    const newRuns = currentRuns - 1;
    console.log(
      "🔒 usePreviewQuota - currentRuns:",
      currentRuns,
      "newRuns:",
      newRuns,
    );
    map[link] = newRuns;
    localStorage.setItem(KEY, JSON.stringify(map));
    
    // Safari-specific: Force a read-back to ensure persistence
    // Safari sometimes doesn't immediately persist localStorage changes
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      const verification = localStorage.getItem(KEY);
      console.log("🍎 Safari verification - localStorage updated:", verification);
    }
    
    console.log("🔒 usePreviewQuota - updated map:", map);

    // Auto-open InstallSheet after first completed run
    if (currentRuns === allowed && newRuns < allowed) {
      const autoOpenMap = JSON.parse(
        sessionStorage.getItem(AUTO_OPEN_KEY) || "{}",
      );
      if (!autoOpenMap[link]) {
        autoOpenMap[link] = true;
        sessionStorage.setItem(AUTO_OPEN_KEY, JSON.stringify(autoOpenMap));

        // Small delay to ensure smooth UX
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent("openInstall"));
        }, 1000);
      }
    }
  }

  return { read, consume };
}
