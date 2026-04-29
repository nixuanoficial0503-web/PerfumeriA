#!/bin/bash
# ═══════════════════════════════════════════
# NOIR·ESSENCE — Deploy a Vercel en 1 comando
# ═══════════════════════════════════════════

echo "🖤 NOIR·ESSENCE — Iniciando deploy..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Instalando Vercel CLI..."
  npm install -g vercel
fi

# Link to existing project (no prompts)
echo '{"projectId":"prj_lxlqVWh27yvnXNAThTj7PacBFQ1a","orgId":"team_OBjIsBPLal15YXjOcSJMSNGL"}' > .vercel/project.json

# Set environment variables and deploy to production
vercel deploy --prod \
  --env NEXT_PUBLIC_SUPABASE_URL="https://cxhujvhnwdniovtyltey.supabase.co" \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4aHVqdmhud2RuaW92dHlsdGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjg5NDMsImV4cCI6MjA5MTYwNDk0M30.Focm14AACmZGYuRRy1oLoUAN_EhdX5zvJRx4ooLYb64" \
  --env NEXT_PUBLIC_APP_URL="https://project-f1eh0.vercel.app" \
  --env NEXT_PUBLIC_APP_NAME="NOIR·ESSENCE" \
  --yes

echo "✅ Deploy completo!"
echo "🌐 Tu tienda: https://project-f1eh0.vercel.app"
