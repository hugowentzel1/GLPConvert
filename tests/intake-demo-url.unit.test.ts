import { describe, expect, it } from "vitest";
import {
  INTAKE_DEMO_EXAMPLE_HREF,
  isIntakeBrandedMarketingMode,
  isIntakeDemoMode,
  toUrlSearchParamsFromIntakePage,
} from "@/lib/glp-intake-demo-mode";

describe("intake demo URL", () => {
  it("INTAKE_DEMO_EXAMPLE_HREF is demo", () => {
    const { searchParams: q } = new URL(INTAKE_DEMO_EXAMPLE_HREF);
    expect(isIntakeDemoMode(q)).toBe(true);
    expect(isIntakeBrandedMarketingMode(q)).toBe(true);
  });

  it("searchParams record maps to same demo detection", () => {
    const fromUrl = new URL(INTAKE_DEMO_EXAMPLE_HREF);
    const record: Record<string, string> = {};
    for (const [k, v] of fromUrl.searchParams.entries()) {
      record[k] = v;
    }
    expect(isIntakeBrandedMarketingMode(toUrlSearchParamsFromIntakePage(record))).toBe(true);
  });
});
