#!/usr/bin/env bash
set -euo pipefail

# REQUIRED env secrets (in local shell or GitHub Actions):
: "${VERCEL_TOKEN:?}" ; : "${VERCEL_ORG_ID:?}" ; : "${VERCEL_PROJECT_ID:?}"

APP_ORIGIN_DEFAULT="https://sunspire-web-app.vercel.app"
APP_ORIGIN="${APP_ORIGIN:-$APP_ORIGIN_DEFAULT}"

echo "▶ Commit & push current changes"
git add -A
git commit -m "long-check: apply change + verify preview+prod"
git push

GIT_SHA="$(git rev-parse HEAD)"
export NEXT_PUBLIC_COMMIT_SHA="$GIT_SHA"

echo "▶ Install deps (use your package manager; pnpm is fastest if available)"
if [ -f pnpm-lock.yaml ]; then
  pnpm i --frozen-lockfile
  BUILD_CMD="pnpm build"
else
  npm ci
  BUILD_CMD="npm run build"
fi

echo "▶ Build (prebuilt for Vercel)"
$BUILD_CMD

echo "▶ Deploy PREVIEW (prebuilt; fastest path)"
PREVIEW_URL="$(npx vercel deploy --prebuilt --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --yes)"
echo "   Preview: $PREVIEW_URL"

# Derive route from Verifyfile (last block's route)
ROUTE="$(awk '/\[check/{c++} c==b{print}/route *=/{r=$0} END{gsub(/.*=/,"",r); print r}' b=1 Verifyfile | tail -n1)"
[ -z "$ROUTE" ] && ROUTE='/?company=Netflix&demo=1'
PREVIEW_TARGET="${PREVIEW_URL}${ROUTE}"
PROD_TARGET="${APP_ORIGIN}${ROUTE}"

echo "▶ Headed verify on PREVIEW: $PREVIEW_TARGET"
HEADS_UP=1 node scripts/run-verify.js "$PREVIEW_URL"

echo "▶ Promote PREVIEW → PRODUCTION"
npx vercel promote "$PREVIEW_URL" --yes --token "$VERCEL_TOKEN"

echo "▶ Wait until PRODUCTION serves commit $GIT_SHA"
for i in {1..30}; do
  HDR=$(curl -sI "$APP_ORIGIN" | awk -F': ' 'tolower($1)=="x-commit-sha"{print $2}' | tr -d '\r')
  if [ -z "$HDR" ]; then
    HDR=$(curl -s "$APP_ORIGIN/api/version" | sed -n 's/.*"sha":"\([^"]*\)".*/\1/p')
  fi
  echo "   Prod SHA: ${HDR:-<none>} want $GIT_SHA"
  [ "$HDR" = "$GIT_SHA" ] && break || sleep 3
  [ $i -eq 30 ] && { echo "❌ Prod never served expected commit"; exit 1; }
done

echo "▶ Headed verify on PRODUCTION: $PROD_TARGET"
HEADS_UP=1 node scripts/run-verify.js "$APP_ORIGIN"

echo "✅ LONG CHECK complete (preview + prod verified visually)"
