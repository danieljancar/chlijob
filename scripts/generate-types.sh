#!/usr/bin/env bash
set -euo pipefail

OUTPUT="apps/web/src/app/core/database.types.ts"

echo "==> Generating TypeScript types from local Supabase schema..."
supabase gen types typescript --local > "$OUTPUT"

echo "✓ Types written to $OUTPUT"
