// Test script to verify the new APIs are working
import { getSolarIrradiance } from './lib/nsrdb';
import { getTariffMeta } from './lib/urdb';

async function testAPIs() {
  console.log('Testing NREL NSRDB API...');
  try {
    const solarData = await getSolarIrradiance(40.7128, -74.0060); // NYC coordinates
    console.log('✅ Solar Data:', solarData);
  } catch (error) {
    console.error('❌ Solar API Error:', error);
  }

  console.log('\nTesting OpenEI URDB API...');
  try {
    const tariff = await getTariffMeta(40.7128, -74.0060);
    console.log('✅ Tariff Data:', tariff);
  } catch (error) {
    console.error('❌ Tariff API Error:', error);
  }
}

testAPIs();
