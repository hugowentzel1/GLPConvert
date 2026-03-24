"use client";
import { useIsDemo } from "./useDemo";
import { useEffect } from "react";

export default function DemoNoIndex() {
  const isDemo = useIsDemo();

  useEffect(() => {
    if (!isDemo) return;
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex,nofollow";
    document.head.appendChild(m);
    return () => {
      if (document.head.contains(m)) {
        document.head.removeChild(m);
      }
    };
  }, [isDemo]);

  return null;
}
