# Git / repo strategy

## Current state

- **GLPConvert** at `/Users/hugowentzel/GLPConvert` — new Git repo with migration baseline from `sunspire-clean` (not a fork of Sunspire’s remote).
- **sunspire-clean** — keep as **read-only archive** until GLP parity; do not delete.

## Branches

- `main` — production releases
- Optional `develop` — integration; feature branches → PR → `main`

## Protecting Sunspire IP

- No force-push over Sunspire customer history if Sunspire repo remains separate.
- GLPConvert repo contains a **snapshot** copy; future Sunspire fixes must be **cherry-picked** manually if still needed.

## CI

- Minimal: `npm ci` + `npm run build` on every PR (`.github/workflows/build.yml`).
