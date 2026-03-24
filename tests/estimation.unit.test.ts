import { describe, it, expect } from "vitest";
import {
  annualSavingsUSD,
  simplePaybackYears,
  applyShadeLoss,
  calculateSystemSize,
  calculateGrossCost,
  calculateNetCost,
  calculateCO2Offset,
} from "../src/estimation/calculator";

describe("Solar Estimation Math Helpers", () => {
  describe("annualSavingsUSD", () => {
    it("computes annual savings from kWh and flat rate", () => {
      expect(
        annualSavingsUSD(10000, { currency: "USD", rate_cents_per_kwh: 25 })
      ).toBe(2500);
    });

    it("handles zero production", () => {
      expect(
        annualSavingsUSD(0, { currency: "USD", rate_cents_per_kwh: 25 })
      ).toBe(0);
    });

    it("handles negative production gracefully", () => {
      expect(
        annualSavingsUSD(-10, { currency: "USD", rate_cents_per_kwh: 25 })
      ).toBe(0);
    });

    it("handles high California rates", () => {
      expect(
        annualSavingsUSD(10450, { currency: "USD", rate_cents_per_kwh: 28.7 })
      ).toBe(2999);
    });
  });

  describe("simplePaybackYears", () => {
    it("computes simple payback with 1 decimal", () => {
      expect(simplePaybackYears(20000, 2500)).toBe(8.0);
    });

    it("returns Infinity for zero cost", () => {
      expect(simplePaybackYears(0, 2500)).toBe(Infinity);
    });

    it("returns Infinity for zero savings", () => {
      expect(simplePaybackYears(20000, 0)).toBe(Infinity);
    });

    it("handles negative values gracefully", () => {
      expect(simplePaybackYears(-20000, 2500)).toBe(Infinity);
      expect(simplePaybackYears(20000, -2500)).toBe(Infinity);
    });

    it("caps at 100 years maximum", () => {
      expect(simplePaybackYears(1000000, 100)).toBeGreaterThan(99);
      expect(simplePaybackYears(1000000, 100)).toBeLessThanOrEqual(100);
    });
  });

  describe("applyShadeLoss", () => {
    it("applies shade loss conservatively", () => {
      expect(applyShadeLoss(10000, 10)).toBe(9000);
    });

    it("handles zero shade (no loss)", () => {
      expect(applyShadeLoss(10000, 0)).toBe(10000);
    });

    it("caps shade loss at 90%", () => {
      expect(applyShadeLoss(10000, 95)).toBe(1000);
      expect(applyShadeLoss(10000, 100)).toBe(1000);
    });

    it("handles edge cases", () => {
      expect(applyShadeLoss(0, 10)).toBe(0);
      expect(applyShadeLoss(-100, 10)).toBe(0);
    });
  });

  describe("calculateSystemSize", () => {
    it("calculates system size for target production", () => {
      // 9600 kWh / (4.0 kWh/m²/day * 365 * 0.86) = ~7.7 kW
      const size = calculateSystemSize(9600, 4.0, 14);
      expect(size).toBeGreaterThan(7.5);
      expect(size).toBeLessThan(8.0);
    });

    it("returns 0 for invalid inputs", () => {
      expect(calculateSystemSize(0, 4.0, 14)).toBe(0);
      expect(calculateSystemSize(9600, 0, 14)).toBe(0);
      expect(calculateSystemSize(-100, 4.0, 14)).toBe(0);
    });
  });

  describe("calculateGrossCost", () => {
    it("calculates gross cost from system size and cost per watt", () => {
      // 7.5 kW * 1000 W/kW * $3/W = $22,500
      expect(calculateGrossCost(7.5, 3.0)).toBe(22500);
    });

    it("handles edge cases", () => {
      expect(calculateGrossCost(0, 3.0)).toBe(0);
      expect(calculateGrossCost(7.5, 0)).toBe(0);
      expect(calculateGrossCost(-5, 3.0)).toBe(0);
    });
  });

  describe("calculateNetCost", () => {
    it("calculates net cost after 30% ITC", () => {
      // $22,500 gross - $0 rebate = $22,500
      // ITC = 30% of $22,500 = $6,750
      // Net = $22,500 - $6,750 = $15,750
      expect(calculateNetCost(22500, 30, 0)).toBe(15750);
    });

    it("handles rebates before ITC", () => {
      // $22,500 gross - $1,000 rebate = $21,500
      // ITC = 30% of $21,500 = $6,450
      // Net = $22,500 - $1,000 - $6,450 = $15,050
      expect(calculateNetCost(22500, 30, 1000)).toBe(15050);
    });

    it("handles edge cases", () => {
      expect(calculateNetCost(0, 30, 0)).toBe(0);
      expect(calculateNetCost(-1000, 30, 0)).toBe(0);
    });
  });

  describe("calculateCO2Offset", () => {
    it("calculates CO2 offset using EPA factor", () => {
      // 10,000 kWh * 0.85 lbs/kWh = 8,500 lbs
      expect(calculateCO2Offset(10000)).toBe(8500);
    });

    it("handles edge cases", () => {
      expect(calculateCO2Offset(0)).toBe(0);
      expect(calculateCO2Offset(-100)).toBe(0);
    });
  });
});

