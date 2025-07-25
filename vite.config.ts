import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: ['https://sivigila-portal-frontend-1081794814967.northamerica-south1.run.app'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
