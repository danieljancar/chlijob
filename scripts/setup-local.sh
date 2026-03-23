#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking prerequisites..."
command -v node >/dev/null || { echo "ERROR: node not found"; exit 1; }
command -v npm >/dev/null || { echo "ERROR: npm not found"; exit 1; }
command -v supabase >/dev/null || { echo "ERROR: supabase CLI not found. Install: brew install supabase/tap/supabase"; exit 1; }
command -v docker >/dev/null || { echo "ERROR: Docker not found. Start Docker Desktop first."; exit 1; }

echo "==> Installing Angular app dependencies..."
npm ci --prefix apps/web
npm i

echo "==> Starting Supabase local stack..."
supabase start

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy the Publishable key printed above"
echo "  2. Paste it into apps/web/src/environments/environment.ts → supabasePublishableKey"
echo "  3. Run: npm start --prefix apps/web"
