// tests/solar-estimation-validation.test.ts
import { describe, test, expect } from 'vitest';
import { buildEstimate } from '../lib/estimate';

describe('Solar Estimation Validation', () => {
  test('Annual production is within reasonable bounds', async () => {
    const estimate = await buildEstimate({
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'NY'
    });

    // Sanity check: 7.2kW system should produce 7,000-15,000 kWh/year
    expect(estimate.annualProductionKWh.estimate).toBeGreaterThan(7000);
    expect(estimate.annualProductionKWh.estimate).toBeLessThan(15000);
    
    // Check uncertainty ranges are reasonable
    expect(estimate.annualProductionKWh.low).toBeLessThan(estimate.annualProductionKWh.estimate);
    expect(estimate.annualProductionKWh.high).toBeGreaterThan(estimate.annualProductionKWh.estimate);
  });

  test('Year 1 savings are in dollars, not cents', async () => {
    const estimate = await buildEstimate({
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'NY'
    });

    // Savings should be in reasonable dollar range ($1000-$5000/year)
    expect(estimate.year1Savings.estimate).toBeGreaterThan(1000);
    expect(estimate.year1Savings.estimate).toBeLessThan(5000);
  });

  test('California NEM 3.0 calculations are lower than standard net metering', async () => {
    const caEstimate = await buildEstimate({
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Main St, San Francisco, CA',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'CA'
    });

    const nyEstimate = await buildEstimate({
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'NY'
    });

    // CA should have lower savings due to NEM 3.0 export rates
    expect(caEstimate.year1Savings.estimate).toBeLessThan(nyEstimate.year1Savings.estimate);
  });

  test('System cost is reasonable per watt', async () => {
    const estimate = await buildEstimate({
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'NY'
    });

    const costPerWatt = estimate.grossCost / (estimate.systemSizeKW * 1000);
    
    // Should be between $2-5 per watt
    expect(costPerWatt).toBeGreaterThan(2);
    expect(costPerWatt).toBeLessThan(5);
  });

  test('Payback period is reasonable', async () => {
    const estimate = await buildEstimate({
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY',
      systemKw: 7.2,
      tilt: 22,
      azimuth: 180,
      lossesPct: 14,
      stateCode: 'NY'
    });

    // Payback should be between 5-15 years
    expect(estimate.paybackYear).toBeGreaterThan(5);
    expect(estimate.paybackYear).toBeLessThan(15);
  });
});
