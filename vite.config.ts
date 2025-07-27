import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
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
  
  // Base URL - importante si tu app no está en la raíz del dominio
  base: '/',
  
  // Variables de entorno
  define: {
    // Puedes definir variables globales aquí
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
 
    })
