import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'sivigila-portal-frontend-1081794814967.southamerica-east1.run.app'
    ],
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: true,
    allowedHosts: [
      'sivigila-portal-frontend-1081794814967.southamerica-east1.run.app'
    ]
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
