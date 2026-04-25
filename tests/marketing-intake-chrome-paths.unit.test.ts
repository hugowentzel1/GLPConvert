import { describe, expect, it } from "vitest";
import { isIntakeFlowPath, isMarketingIntakeChromePath } from "@/lib/marketing-intake-chrome-paths";

describe("marketing-intake-chrome-paths", () => {
  it("marks known marketing shell routes", () => {
    expect(isMarketingIntakeChromePath("/partners")).toBe(true);
    expect(isMarketingIntakeChromePath("/pricing")).toBe(true);
    expect(isMarketingIntakeChromePath("/legal/terms")).toBe(true);
    expect(isMarketingIntakeChromePath("/terms")).toBe(true);
    expect(isMarketingIntakeChromePath("/legal/privacy")).toBe(true);
    expect(isMarketingIntakeChromePath("/intake/extra")).toBe(true);
  });

  it("includes the additional info / legal / docs surface", () => {
    /** Every page the user can reach from a marketing/legal link should share intake chrome. */
    for (const p of [
      "/security",
      "/methodology",
      "/about",
      "/dpa",
      "/do-not-sell",
      "/accessibility",
      "/signup",
      "/legal/refund",
      "/legal/cookies",
      "/legal/accessibility",
      "/docs/setup",
      "/docs/api",
      "/docs/branding",
      "/docs/embed",
      "/docs/crm",
      "/docs/crm/hubspot",
    ]) {
      expect(isMarketingIntakeChromePath(p), `expected ${p} to use intake chrome`).toBe(true);
    }
  });

  it("does not treat unrelated paths as marketing chrome", () => {
    expect(isMarketingIntakeChromePath("/")).toBe(false);
    expect(isMarketingIntakeChromePath("/report")).toBe(false);
    /** Status is intentionally bare for SLA / monitoring; never gets branded chrome. */
    expect(isMarketingIntakeChromePath("/status")).toBe(false);
  });

  it("only shows intake flow strip on /intake", () => {
    expect(isIntakeFlowPath("/intake")).toBe(true);
    expect(isIntakeFlowPath("/intake/foo")).toBe(true);
    expect(isIntakeFlowPath("/partners")).toBe(false);
  });
});
