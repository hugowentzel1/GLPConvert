/**
 * Pure calculation helpers for solar estimation
 * Extracted for testability and reusability
 */

export type PVWattsAnnual = { ac_annual_kwh: number };
export type Tariff = { currency: "USD"; rate_cents_per_kwh: number };

/**
 * Calculate annual savings in USD from kWh production and electricity rate
 */
export function annualSavingsUSD(kwh: number, rate: Tariff): number {
  if (!isFinite(kwh) || kwh < 0) return 0;
  const dollars = kwh * (rate.rate_cents_per_kwh / 100);
  return Math.max(0, Math.round(dollars));
}

/**
 * Calculate simple payback period in years
 */
export function simplePaybackYears(
  systemCostUSD: number,
  annualSavingsUSDValue: number
): number {
  if (!isFinite(systemCostUSD) || systemCostUSD <= 0) return Infinity;
  if (!isFinite(annualSavingsUSDValue) || annualSavingsUSDValue <= 0)
    return Infinity;
  // 1 decimal place, clamp high to avoid NaNs
  const years = systemCostUSD / annualSavingsUSDValue;
  return Math.min(100, Math.round(years * 10) / 10);
}

/**
 * Apply conservative shade loss to production
 */
export function applyShadeLoss(kwh: number, shadePct: number): number {
  if (!isFinite(kwh) || kwh < 0) return 0;
  if (!isFinite(shadePct) || shadePct <= 0) return kwh;
  const factor = Math.max(0, Math.min(0.9, shadePct / 100)); // cap 90%
  return Math.round(kwh * (1 - factor));
}

/**
 * Calculate system size in kW based on target production and solar irradiance
 */
export function calculateSystemSize(
  targetProductionKWh: number,
  solarIrradianceKWhM2Day: number,
  lossesPercentage: number
): number {
  if (!isFinite(targetProductionKWh) || targetProductionKWh <= 0) return 0;
  if (!isFinite(solarIrradianceKWhM2Day) || solarIrradianceKWhM2Day <= 0)
    return 0;

  const efficiencyFactor = (100 - lossesPercentage) / 100;
  const systemSizeKW =
    targetProductionKWh / (solarIrradianceKWhM2Day * 365 * efficiencyFactor);

  return Math.round(systemSizeKW * 10) / 10; // 1 decimal place
}

/**
 * Calculate gross system cost before incentives
 */
export function calculateGrossCost(systemKW: number, costPerWatt: number): number {
  if (!isFinite(systemKW) || systemKW <= 0) return 0;
  if (!isFinite(costPerWatt) || costPerWatt <= 0) return 0;

  return Math.round(systemKW * 1000 * costPerWatt);
}

/**
 * Calculate net cost after ITC and rebates
 */
export function calculateNetCost(
  grossCost: number,
  itcPercentage: number,
  rebateAmount: number
): number {
  if (!isFinite(grossCost) || grossCost <= 0) return 0;

  const itc = (itcPercentage / 100) * Math.max(0, grossCost - rebateAmount);
  const netCost = Math.max(0, grossCost - rebateAmount - itc);

  return Math.round(netCost);
}

/**
 * Calculate CO2 offset in lbs per year
 * EPA factor: ~0.85 lbs CO2 per kWh avoided
 */
export function calculateCO2Offset(annualKWh: number): number {
  if (!isFinite(annualKWh) || annualKWh <= 0) return 0;
  return Math.round(annualKWh * 0.85);
}

