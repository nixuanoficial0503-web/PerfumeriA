#!/bin/bash
# ═══════════════════════════════════════════════════════════
# NOIR·ESSENCE — Setup script
# Corre este script después de clonar el repo
# Usage: bash setup.sh
# ═══════════════════════════════════════════════════════════

set -e

echo ""
echo "🖤 NOIR·ESSENCE — Setup"
echo "─────────────────────────────────"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no encontrado. Instala Node.js 18+ desde nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js $NODE_VERSION detectado. Se requiere Node.js 18+"
  exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Install dependencies
echo ""
echo "📦 Instalando dependencias..."
npm install

# Copy env file
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "✅ .env.local creado — llena las variables antes de continuar"
else
  echo "ℹ️  .env.local ya existe"
fi

echo ""
echo "─────────────────────────────────"
echo "✅ Setup completo!"
echo ""
echo "Próximos pasos:"
echo "  1. Llena las variables en .env.local"
echo "  2. Corre el SQL en Supabase: supabase-MASTER.sql"
echo "  3. npm run dev"
echo ""
