import { describe, expect, it } from "vitest";
import {
  buildAppHomeHref,
  buildIntakePricingHref,
  buildIntakeSelfHref,
  buildMarketingHomeHref,
  buildMarketingPathHref,
} from "@/lib/glp-intake-nav-href";

describe("glp-intake-nav-href", () => {
  it("buildMarketingHomeHref preserves full query", () => {
    const sp = new URLSearchParams("demo=1&utm=email");
    expect(buildMarketingHomeHref(sp)).toBe("/?demo=1&utm=email");
  });

  it("buildAppHomeHref routes demo traffic to / and other traffic to /paid", () => {
    expect(buildAppHomeHref(new URLSearchParams("demo=1&x=2"))).toBe("/?demo=1&x=2");
    expect(buildAppHomeHref(new URLSearchParams("token=ab"))).toBe("/paid?token=ab");
    expect(buildAppHomeHref(new URLSearchParams())).toBe("/paid");
  });

  it("buildIntakePricingHref sets company and keeps params", () => {
    const sp = new URLSearchParams("demo=1&handle=glp");
    const href = buildIntakePricingHref(sp, "Acme");
    expect(href.startsWith("/pricing?")).toBe(true);
    const q = new URLSearchParams(href.slice("/pricing?".length));
    expect(q.get("company")).toBe("Acme");
    expect(q.get("demo")).toBe("1");
    expect(q.get("handle")).toBe("glp");
  });

  it("buildIntakeSelfHref", () => {
    const sp = new URLSearchParams("a=1");
    expect(buildIntakeSelfHref(sp)).toBe("/intake?a=1");
    expect(buildIntakeSelfHref(null)).toBe("/intake");
  });

  it("buildMarketingPathHref appends current query to path", () => {
    const sp = new URLSearchParams("demo=1&brand=abc");
    expect(buildMarketingPathHref(sp, "/partners")).toBe("/partners?demo=1&brand=abc");
    expect(buildMarketingPathHref(null, "/privacy")).toBe("/privacy");
  });
});
