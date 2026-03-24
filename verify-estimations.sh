#!/bin/bash

echo "==============================================="
echo "COMPLETE VERIFICATION - Demo & Paid, Local & Live"
echo "==============================================="
echo ""

echo "=== 1. LOCALHOST API TESTS ==="
echo ""
echo "California (should be ~12,286 kWh):"
curl -s "http://localhost:3000/api/estimate?address=Mountain+View+CA&lat=37.4220656&lng=-122.0840897&state=CA&systemKw=7.2" | jq -r '.estimate | "Production: \(.annualProductionKWh.estimate) kWh, Savings: $\(.year1Savings.estimate)"'

echo ""
echo "New York (should be ~9,382 kWh):"
curl -s "http://localhost:3000/api/estimate?address=New+York+NY&lat=40.7484&lng=-73.9857&state=NY&systemKw=7.2" | jq -r '.estimate | "Production: \(.annualProductionKWh.estimate) kWh, Savings: $\(.year1Savings.estimate)"'

echo ""
echo "=== 2. LIVE API TESTS ==="
echo ""
echo "California (should be ~12,286 kWh):"
curl -s "https://sunspire-web-app.vercel.app/api/estimate?address=Mountain+View+CA&lat=37.4220656&lng=-122.0840897&state=CA&systemKw=7.2&_=$(date +%s)" | jq -r '.estimate | "Production: \(.annualProductionKWh.estimate) kWh, Savings: $\(.year1Savings.estimate)"'

echo ""
echo "New York (should be ~9,382 kWh):"
curl -s "https://sunspire-web-app.vercel.app/api/estimate?address=New+York+NY&lat=40.7484&lng=-73.9857&state=NY&systemKw=7.2&_=$(date +%s)" | jq -r '.estimate | "Production: \(.annualProductionKWh.estimate) kWh, Savings: $\(.year1Savings.estimate)"'

echo ""
echo "=== 3. VERIFICATION SUMMARY ==="
echo ""
echo "✅ If CA shows ~12,286 kWh and NY shows ~9,382 kWh (DIFFERENT values)"
echo "✅ And neither shows 11,105 kWh (old fallback)"
echo "✅ Then estimations are 100% working with real, location-specific data!"
echo ""
echo "==============================================="

