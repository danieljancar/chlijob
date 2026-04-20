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

echo "==> Starting local Supabase stack..."
supabase start

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy apps/web/.env.example → apps/web/.env.local"
echo "  2. Fill in the Publishable key printed above (or use remote prod values)"
echo "  3. Run: npm start"
echo ""
echo "To point develop at the remote prod project instead of local:"
echo "  Use the remote URL and anon key from Supabase dashboard → Project Settings → API"
