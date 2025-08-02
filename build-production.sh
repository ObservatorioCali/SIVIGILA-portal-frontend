#!/bin/bash
# Script para build de producción

echo "🚀 Iniciando build de producción del Frontend SIVIGILA..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Build para producción con variables de entorno
echo "🔨 Generando build de producción..."
npm run build

echo "✅ Build completado!"
echo "📁 Los archivos están en la carpeta 'dist/'"
echo "🌐 Backend configurado: https://sivigila-portal-backend-1081794814967.us-central1.run.app"
