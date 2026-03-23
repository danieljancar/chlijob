#!/usr/bin/env bash
set -euo pipefail

echo "==> Resetting local database (applies all migrations + seed.sql)..."
supabase db reset

echo "==> Regenerating TypeScript types..."
bash scripts/generate-types.sh

echo "✓ Database reset complete."
