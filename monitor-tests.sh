#!/bin/bash

while true; do
  clear
  echo "🧪 COMPREHENSIVE E2E TEST MONITOR"
  echo "=================================="
  echo ""
  
  # Count completed tests
  PASSED=$(grep -c "✓" test-output.log 2>/dev/null || echo "0")
  FAILED=$(grep -c "✗" test-output.log 2>/dev/null || echo "0")
  TOTAL=$((PASSED + FAILED))
  
  echo "📊 Progress: $TOTAL / 976 tests completed"
  echo "✅ Passed: $PASSED"
  echo "❌ Failed: $FAILED"
  echo ""
  
  # Show recent test results
  echo "📝 Recent Tests:"
  echo "----------------"
  tail -30 test-output.log 2>/dev/null | grep -E "(✓|✗)" | tail -15
  echo ""
  
  # Check for active workers
  WORKERS=$(ps aux | grep "playwright" | grep -v grep | wc -l | xargs)
  echo "⚙️  Active workers: $WORKERS"
  echo ""
  echo "Press Ctrl+C to stop monitoring"
  echo "Test output saved to: test-output.log"
  
  sleep 5
done


