export function ensureBlurSupport() {
  if (typeof window === "undefined") return;

  // Check if backdrop-filter is supported
  const supportsBackdropFilter =
    CSS.supports("backdrop-filter", "blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(1px)");

  if (!supportsBackdropFilter) {
    console.warn(
      "⚠️ Backdrop-filter not supported in this browser. Using CSS filter fallback for blur effects.",
    );

    // Add fallback class to all locked blur content
    const lockedBlurContent = document.querySelectorAll(
      ".locked-blur__content",
    );
    lockedBlurContent.forEach((content) => {
      content.classList.add("fallback-blur");
    });

    // Dispatch custom event for other components to handle
    document.dispatchEvent(
      new CustomEvent("blurFallbackMode", {
        detail: { supportsBackdropFilter: false },
      }),
    );
  } else {
    console.log(
      "✅ Backdrop-filter is supported. Using enhanced blur effects.",
    );

    // Remove fallback classes if they exist
    const fallbackElements = document.querySelectorAll(".fallback-blur");
    fallbackElements.forEach((element) => {
      element.classList.remove("fallback-blur");
    });
  }

  // Ensure blur is always visible in demo mode
  const demoElements = document.querySelectorAll('[data-demo="true"]');
  demoElements.forEach((element) => {
    const lockedBlur = element.querySelector(
      ".locked-blur__content",
    ) as HTMLElement;
    if (lockedBlur && lockedBlur.style) {
      lockedBlur.style.setProperty("--blur-visible", "1", "important");
    }
  });
}

// Enhanced blur detection with fallback
export function checkBlurSupport(): {
  supportsBackdropFilter: boolean;
  supportsCSSFilter: boolean;
  fallbackMode: boolean;
} {
  if (typeof window === "undefined") {
    return {
      supportsBackdropFilter: false,
      supportsCSSFilter: false,
      fallbackMode: true,
    };
  }

  const supportsBackdropFilter =
    CSS.supports("backdrop-filter", "blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(1px)");

  const supportsCSSFilter = CSS.supports("filter", "blur(1px)");

  return {
    supportsBackdropFilter,
    supportsCSSFilter,
    fallbackMode: !supportsBackdropFilter,
  };
}
