import { describe, expect, it } from "vitest";
import {
  buildAppHomeHref,
  buildBrandedDemoReturnHref,
  buildIntakePricingHref,
  buildIntakeSelfHref,
  buildIntakeSupportHref,
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

  it("buildBrandedDemoReturnHref sends branded query back to /intake", () => {
    const branded = new URLSearchParams("company=Acme%20Clinic&demo=1");
    expect(buildBrandedDemoReturnHref(branded)).toBe(`/intake?${branded.toString()}`);
    const companyOnly = new URLSearchParams("company=Sunspire");
    expect(buildBrandedDemoReturnHref(companyOnly)).toBe("/intake?company=Sunspire");
  });

  it("buildBrandedDemoReturnHref paid-style falls back to buildAppHomeHref", () => {
    expect(buildBrandedDemoReturnHref(new URLSearchParams("handle=tenant&token=1"))).toBe(
      "/paid?handle=tenant&token=1",
    );
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

  it("buildIntakeSupportHref preserves attribution and sets company", () => {
    const sp = new URLSearchParams("demo=1&utm_source=cold-email&handle=glp");
    const href = buildIntakeSupportHref(sp, "Sunspire Weight Clinic");
    expect(href.startsWith("/support?")).toBe(true);
    const q = new URLSearchParams(href.slice("/support?".length));
    expect(q.get("company")).toBe("Sunspire Weight Clinic");
    expect(q.get("demo")).toBe("1");
    expect(q.get("utm_source")).toBe("cold-email");
    expect(q.get("handle")).toBe("glp");
  });

  it("buildIntakeSupportHref falls back to 'Your clinic' when company is empty", () => {
    expect(buildIntakeSupportHref(new URLSearchParams(), "  ")).toBe("/support?company=Your+clinic");
  });

  it("buildMarketingPathHref appends current query to path", () => {
    const sp = new URLSearchParams("demo=1&brand=abc");
    expect(buildMarketingPathHref(sp, "/partners")).toBe("/partners?demo=1&brand=abc");
    expect(buildMarketingPathHref(null, "/privacy")).toBe("/privacy");
  });
});
