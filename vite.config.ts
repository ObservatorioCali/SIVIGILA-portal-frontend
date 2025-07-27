import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración de resolución de paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Configuración del servidor de desarrollo
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 5173,
    strictPort: true, // Falla si el puerto no está disponible
  },
  
  // Configuración para preview (producción local)
  preview: {
    host: '0.0.0.0', // Crucial para GCP
    port: 8080, // Puerto estándar para GCP
    strictPort: true,
  },
  
  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactiva sourcemaps en producción para menor tamaño
    minify: 'terser',
    rollupOptions: {
      output: {
        // Optimización de chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  
  // Base URL - cambia según donde esté tu app
  // base: '/', // Para dominio raíz
  // base: '/mi-app/', // Para subdirectorio
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // Variables de entorno
  define: {
    // Variables globales
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://api.example.com'),
  },
  
  // Configuración de variables de entorno
  envPrefix: 'VITE_', // Solo variables que empiecen con VITE_ serán expuestas al cliente
    })