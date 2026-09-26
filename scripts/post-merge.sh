#!/usr/bin/env bash
set -euo pipefail

# Keep task merges non-interactive and compatible with the pnpm workspace.
if [[ -f pnpm-lock.yaml ]]; then
  pnpm install --frozen-lockfile=false
elif [[ -f package-lock.json ]]; then
  npm install --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi
