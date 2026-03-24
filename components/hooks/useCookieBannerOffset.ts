import { useEffect, useState } from "react";

export function useCookieBannerOffset() {
  const [offsetBottomPx, setOffset] = useState(0);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-cookie-banner]");
    const calc = () => setOffset(el?.offsetHeight ?? 0);

    calc();
    const ro = el ? new ResizeObserver(calc) : null;
    const mo = new MutationObserver(calc);

    if (el && ro) ro.observe(el);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      ro?.disconnect();
      mo.disconnect();
    };
  }, []);

  return { offsetBottomPx };
}
