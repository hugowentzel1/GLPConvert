export type AnalyticsClient = {
  init: () => Promise<void>;
  track: (event: string, props?: Record<string, any>) => void;
};

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let client: AnalyticsClient = {
  init: async () => {},
  track: () => {},
};

if (typeof window !== "undefined" && key) {
  // dynamic import guarded by key
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: "https://app.posthog.com",
        capture_pageview: false,
      });
      client = {
        init: async () => {},
        track: (event, props) => posthog.capture(event, props),
      };
    })
    .catch(() => {
      // stay no-op on failure
    });
}

export default client;
