import { ENV } from "../config/env";

export interface FinanceRequest {
  dc_kw: number;
  cost_per_watt: number;
  itc_pct: number;
  rate_start: number;
  rate_escalation?: number;
  degradation?: number;
  oandm_per_kw_year?: number;
  discount_rate?: number;
}

export interface FinanceResponse {
  payback_year: number;
  npv: number;
  irr: number;
  year1_savings: number;
  savings_25yr: number;
  total_cost: number;
  total_savings: number;
}

export function computeFinance(request: FinanceRequest): FinanceResponse {
  const {
    dc_kw,
    cost_per_watt,
    itc_pct,
    rate_start,
    rate_escalation = ENV.DEFAULT_RATE_ESCALATION,
    degradation = ENV.DEFAULT_DEGRADATION_PCT / 100,
    oandm_per_kw_year = ENV.OANDM_PER_KW_YEAR,
    discount_rate = ENV.DISCOUNT_RATE,
  } = request;

  // Calculate total system cost
  const total_cost = dc_kw * cost_per_watt;
  const itc_amount = total_cost * (itc_pct / 100);
  const net_cost = total_cost - itc_amount;

  // Calculate annual savings over 25 years
  const annual_savings: number[] = [];
  let cumulative_savings = 0;
  let payback_year = -1;

  for (let year = 1; year <= 25; year++) {
    // Annual production (degrading over time)
    const production_factor = Math.pow(1 - degradation, year - 1);
    const annual_production = dc_kw * 4.5 * 365 * production_factor; // 4.5 sun hours/day average

    // Electricity rate (escalating over time)
    const current_rate = rate_start * Math.pow(1 + rate_escalation, year - 1);

    // Annual savings
    const annual_saving = annual_production * current_rate;

    // Subtract O&M costs
    const annual_om = dc_kw * oandm_per_kw_year;
    const net_annual_saving = annual_saving - annual_om;

    annual_savings.push(net_annual_saving);
    cumulative_savings += net_annual_saving;

    // Check for payback
    if (payback_year === -1 && cumulative_savings >= net_cost) {
      payback_year = year;
    }
  }

  // Calculate NPV
  let npv = -net_cost;
  annual_savings.forEach((saving, index) => {
    const year = index + 1;
    npv += saving / Math.pow(1 + discount_rate, year);
  });

  // Calculate IRR (simplified - using trial and error)
  const irr = calculateIRR(net_cost, annual_savings);

  // Calculate total savings over 25 years
  const total_savings = cumulative_savings;

  return {
    payback_year: payback_year === -1 ? 999 : payback_year,
    npv,
    irr,
    year1_savings: annual_savings[0] || 0,
    savings_25yr: total_savings,
    total_cost: net_cost,
    total_savings,
  };
}

function calculateIRR(initialInvestment: number, cashFlows: number[]): number {
  // Simplified IRR calculation using trial and error
  // In production, you'd want a more sophisticated algorithm

  let rate = 0.1; // Start with 10%
  let npv = calculateNPV(initialInvestment, cashFlows, rate);

  // Simple binary search for IRR
  let low = -0.9;
  let high = 2.0;

  for (let i = 0; i < 100; i++) {
    rate = (low + high) / 2;
    npv = calculateNPV(initialInvestment, cashFlows, rate);

    if (Math.abs(npv) < 0.01) {
      break;
    }

    if (npv > 0) {
      low = rate;
    } else {
      high = rate;
    }
  }

  return rate;
}

function calculateNPV(
  initialInvestment: number,
  cashFlows: number[],
  rate: number,
): number {
  let npv = -initialInvestment;
  cashFlows.forEach((cashFlow, index) => {
    const year = index + 1;
    npv += cashFlow / Math.pow(1 + rate, year);
  });
  return npv;
}
