import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  darkenUntilContrastAA,
  getAccessibleBrandFill,
} from "@/lib/glp-intake-brand-contrast";

describe("contrastRatio", () => {
  it("computes WCAG ratio symmetrically", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 0);
  });

  it("identical colors return 1", () => {
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("returns 1 on malformed hex (defensive)", () => {
    expect(contrastRatio("not-hex", "#ffffff")).toBe(1);
  });
});

describe("getAccessibleBrandFill", () => {
  it("falls back to slate-900 when input is missing", () => {
    expect(getAccessibleBrandFill(null)).toBe("#0f172a");
    expect(getAccessibleBrandFill(undefined)).toBe("#0f172a");
    expect(getAccessibleBrandFill("")).toBe("#0f172a");
  });

  it("passes through dark brand colors that already meet AA on white", () => {
    expect(getAccessibleBrandFill("#0f172a")).toBe("#0f172a");
    expect(getAccessibleBrandFill("#1d4ed8")).toBe("#1d4ed8"); // tailwind blue-700
  });

  it("darkens light brand colors that fail AA on white", () => {
    /** #ffd700 (gold) is the canonical AA-failing CTA color; the helper should darken it. */
    const out = getAccessibleBrandFill("#ffd700");
    expect(contrastRatio(out, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(out).not.toBe("#ffd700");
  });

  it("darkens neon greens to AA on white", () => {
    const out = getAccessibleBrandFill("#34d399"); // tailwind emerald-400
    expect(contrastRatio(out, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("normalizes invalid hex to slate-900", () => {
    expect(getAccessibleBrandFill("#xyzxyz")).toBe("#0f172a");
  });
});

describe("darkenUntilContrastAA", () => {
  it("returns the walkTarget when nothing along the walk passes (degenerate case)", () => {
    /** Walk from white toward white can't reach AA on white background. */
    expect(darkenUntilContrastAA("#ffffff", 4.5, "#ffffff", "#ffffff")).toBe("#ffffff");
  });
});
