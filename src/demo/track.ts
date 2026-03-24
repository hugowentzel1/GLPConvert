export type TrackEvent =
  | "view"
  | "view_result"
  | "cta_click"
  | "install_open"
  | "run_start"
  | "run_complete"
  | "limit_hit"
  | "checkout_success"
  | "sample_request"
  | "sample_success"
  | "unlock_clicked"
  | "drawer_open"
  | "checkout_start"
  | "session_company"
  | "address_entered"
  | "report_generated"
  | "cta_launch_clicked";

export type TrackPayload = {
  event: TrackEvent;
  brand?: string;
  domain?: string;
  variant?: "A" | "B";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  deadline?: string;
  runsUsed?: number;
  daysLeft?: number;
  referrer?: string;
  userAgent?: string;
  screenSize?: string;
  placement?: string;
  cta_type?: string;
  id?: string;
  [key: string]: any;
};

export function track(event: TrackEvent, payload: Partial<TrackPayload> = {}) {
  if (typeof window === "undefined") return;

  const fullPayload: TrackPayload = {
    event,
    brand:
      payload.brand ||
      new URLSearchParams(window.location.search).get("brand") ||
      undefined,
    domain:
      payload.domain ||
      new URLSearchParams(window.location.search).get("domain") ||
      undefined,
    variant: payload.variant,
    utm_source:
      payload.utm_source ||
      new URLSearchParams(window.location.search).get("utm_source") ||
      undefined,
    utm_medium:
      payload.utm_medium ||
      new URLSearchParams(window.location.search).get("utm_medium") ||
      undefined,
    utm_campaign:
      payload.utm_campaign ||
      new URLSearchParams(window.location.search).get("utm_campaign") ||
      undefined,
    deadline: payload.deadline,
    runsUsed: payload.runsUsed,
    daysLeft: payload.daysLeft,
    referrer: payload.referrer || document.referrer,
    userAgent: payload.userAgent || navigator.userAgent,
    screenSize:
      payload.screenSize || `${window.screen.width}x${window.screen.height}`,
    placement: payload.placement,
    cta_type: payload.cta_type,
    id: payload.id,
    ...payload,
  };

  // Non-blocking POST to analytics endpoint
  fetch("/api/demo-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fullPayload),
  }).catch(() => {
    // Silently fail - don't block user experience
  });

  // Also log to console for development
  console.log(`[Analytics] ${event}:`, fullPayload);
}

// Analytics bus function for global access
if (typeof window !== "undefined") {
  (window as any).sa = (name: string, payload: any = {}) => {
    track(name as TrackEvent, payload);
  };
}
