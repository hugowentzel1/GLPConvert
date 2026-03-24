interface TrackingEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

interface CompanyContext {
  companyHandle: string;
  companyName: string;
  companyDomain: string;
}

class EventTracker {
  private isEnabled: boolean = false;
  private companyContext: CompanyContext | null = null;
  private utmParams: Record<string, string> = {};

  constructor() {
    this.checkCookieConsent();
    this.captureUTMParams();
  }

  private checkCookieConsent(): void {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie-consent");
      this.isEnabled = consent === "accepted";
    }
  }

  private captureUTMParams(): void {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const utmKeys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ];

      utmKeys.forEach((key) => {
        const value = urlParams.get(key);
        if (value) {
          this.utmParams[key] = value;
        }
      });
    }
  }

  setCompanyContext(context: CompanyContext): void {
    this.companyContext = context;
  }

  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) {
      console.log(`[TRACKING DISABLED] ${event}:`, properties);
      return;
    }

    const trackingEvent: TrackingEvent = {
      event,
      properties: {
        ...properties,
        ...this.utmParams,
        companyHandle: this.companyContext?.companyHandle,
        companyName: this.companyContext?.companyName,
        companyDomain: this.companyContext?.companyDomain,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    // In production, this would send to your analytics service
    this.sendToAnalytics(trackingEvent);

    // Log for development
    console.log(`[TRACKING] ${event}:`, trackingEvent);
  }

  private sendToAnalytics(event: TrackingEvent): void {
    // Example: Send to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.event, event.properties);
    }

    // Example: Send to Mixpanel
    if (typeof window !== "undefined" && (window as any).mixpanel) {
      (window as any).mixpanel.track(event.event, event.properties);
    }

    // Example: Send to your own API
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(console.error);
  }

  // Convenience methods for common events
  pageView(page: string, properties?: Record<string, any>): void {
    this.track("page_view", { page, ...properties });
  }

  ctaClick(
    placement: string,
    ctaType: string,
    properties?: Record<string, any>,
  ): void {
    this.track("cta_click", { placement, ctaType, ...properties });
  }

  signupStart(properties?: Record<string, any>): void {
    this.track("signup_start", properties);
  }

  signupComplete(properties?: Record<string, any>): void {
    this.track("signup_complete", properties);
  }

  sampleRequested(properties?: Record<string, any>): void {
    this.track("sample_requested", properties);
  }

  demoStarted(properties?: Record<string, any>): void {
    this.track("demo_started", properties);
  }

  reportGenerated(properties?: Record<string, any>): void {
    this.track("report_generated", properties);
  }
}

// Create singleton instance
export const tracker = new EventTracker();

// Export convenience function
export const track = (event: string, properties?: Record<string, any>) => {
  tracker.track(event, properties);
};

// Export convenience methods
export const trackPageView = (
  page: string,
  properties?: Record<string, any>,
) => {
  tracker.pageView(page, properties);
};

export const trackCtaClick = (
  placement: string,
  ctaType: string,
  properties?: Record<string, any>,
) => {
  tracker.ctaClick(placement, ctaType, properties);
};

export const trackSignupStart = (properties?: Record<string, any>) => {
  tracker.signupStart(properties);
};

export const trackSignupComplete = (properties?: Record<string, any>) => {
  tracker.signupComplete(properties);
};

export const trackSampleRequested = (properties?: Record<string, any>) => {
  tracker.sampleRequested(properties);
};

export const trackDemoStarted = (properties?: Record<string, any>) => {
  tracker.demoStarted(properties);
};

export const trackReportGenerated = (properties?: Record<string, any>) => {
  tracker.reportGenerated(properties);
};

// Export tracker instance for advanced usage
export default tracker;
