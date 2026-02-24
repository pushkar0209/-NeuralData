import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
  },
  resolve: {
    alias: {},
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  }
})
