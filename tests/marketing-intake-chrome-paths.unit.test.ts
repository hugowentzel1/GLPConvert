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

  it("does not treat unrelated paths as marketing chrome", () => {
    expect(isMarketingIntakeChromePath("/")).toBe(false);
    expect(isMarketingIntakeChromePath("/report")).toBe(false);
  });

  it("only shows intake flow strip on /intake", () => {
    expect(isIntakeFlowPath("/intake")).toBe(true);
    expect(isIntakeFlowPath("/intake/foo")).toBe(true);
    expect(isIntakeFlowPath("/partners")).toBe(false);
  });
});
