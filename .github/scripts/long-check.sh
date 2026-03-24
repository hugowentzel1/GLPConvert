#!/usr/bin/env bash
set -euo pipefail

# ===== Required env (configure in CI or export locally) =====
: "${VERCEL_TOKEN:?}"        # Vercel auth token
: "${VERCEL_ORG_ID:?}"       # Vercel org/scope
: "${VERCEL_PROJECT_ID:?}"   # Vercel project id

# ===== Inputs =====
DEFAULT_URL="https://sunspire-web-app.vercel.app/?company=Netflix&demo=1"
RAW_ARG_URL="${1:-}"
export CHECK_URL="${RAW_ARG_URL:-${CHECK_URL:-$DEFAULT_URL}}"

export GIT_SHA="${GIT_SHA:-$(git rev-parse HEAD)}"
export NEXT_PUBLIC_COMMIT_SHA="$GIT_SHA"

echo "🔧 LONG CHECK - Starting comprehensive step-by-step verification..."
echo "📋 This check will verify all recent changes and previous todo list items"
echo "📋 Breaking down into clear steps for visibility..."
echo ""
echo "🔧 Long Check for commit: $GIT_SHA"
echo "🔗 Target URL: $CHECK_URL"

# Validate URL (must parse; preserves exact casing of path/query)
node -e "try{new URL(process.env.CHECK_URL)}catch(e){process.exit(1)}" || { echo "❌ Invalid CHECK_URL"; exit 1; }

# Parse origin and path+query
read -r PROD_ORIGIN PROD_PATHQUERY <<< "$(
  node -e "const u=new URL(process.env.CHECK_URL);process.stdout.write(u.origin+' ');process.stdout.write(u.pathname+(u.search||''))"
)"

export APP_URL_PROD="${APP_URL_PROD:-$PROD_ORIGIN}"

echo "🔍 STEP 1: Installing dependencies and building..."
echo "   → Running: npm ci"
npm ci
echo "   → Running: npm run build"
npm run build
echo "✅ STEP 1 COMPLETE: Build successful"

echo ""
echo "🔍 STEP 2: Deploying Vercel Preview..."
echo "   → Deploying preview with commit SHA: $GIT_SHA"
PREVIEW_URL="$(npx vercel --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --confirm --prebuilt | tail -n1)"
echo "   → Preview URL: $PREVIEW_URL"
echo "✅ STEP 2 COMPLETE: Preview deployed"

# Construct preview target by swapping origin, keeping exact path+query
PREVIEW_TARGET="${PREVIEW_URL}${PROD_PATHQUERY}"

echo ""
echo "🔍 STEP 3: Testing Preview deployment..."
echo "   → Testing URL: $PREVIEW_TARGET"
echo "   → Verifying commit SHA matches: $GIT_SHA"
export TARGET_URL="$PREVIEW_TARGET"
export EXPECT_SHA="$GIT_SHA"
node fast-check.js
echo "✅ STEP 3 COMPLETE: Preview tests passed"

echo ""
echo "🔍 STEP 4: Promoting Preview to Production..."
echo "   → Promoting: $PREVIEW_URL → Production"
npx vercel promote "$PREVIEW_URL" --yes --token "$VERCEL_TOKEN"
echo "✅ STEP 4 COMPLETE: Production promotion initiated"

echo ""
echo "🔍 STEP 5: Verifying Production deployment..."
echo "   → Waiting for production to serve commit: $GIT_SHA"
for i in {1..30}; do
  HDR=$(curl -sI "$APP_URL_PROD" | awk -F': ' 'tolower($1)=="x-commit-sha"{print $2}' | tr -d '\r')
  if [ -z "$HDR" ]; then
    HDR=$(curl -s "$APP_URL_PROD/api/version" | sed -n 's/.*"sha":"\([^"]*\)".*/\1/p')
  fi
  echo "   → Production SHA: ${HDR:-<none>} (expecting: $GIT_SHA)"
  [ "$HDR" = "$GIT_SHA" ] && break || sleep 5
  [ $i -eq 30 ] && { echo "❌ Production never served expected commit"; exit 1; }
done
echo "✅ STEP 5 COMPLETE: Production serving correct commit"

echo ""
echo "🔍 STEP 6: Final Production verification..."
echo "   → Testing production URL: ${APP_URL_PROD}${PROD_PATHQUERY}"
echo "   → Running comprehensive checks..."
PROD_TARGET="${APP_URL_PROD}${PROD_PATHQUERY}"
export TARGET_URL="$PROD_TARGET"
export EXPECT_SHA="$GIT_SHA"
node fast-check.js
echo "✅ STEP 6 COMPLETE: Production verification successful"

echo ""
echo "🎉 LONG CHECK COMPLETE! All verification steps passed successfully."
echo "📋 VERIFIED FEATURES:"
echo "   → Build and deployment pipeline"
echo "   → Preview environment functionality"
echo "   → Production promotion process"
echo "   → Commit SHA verification"
echo "   → Live site functionality"
echo ""
echo "🚀 All changes are live and working on the production site!"
