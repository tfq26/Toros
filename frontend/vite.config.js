import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // map `@/` to your `src/` directory
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // This forwards any request starting with /api to your backend
      '/api': {
        target: 'http://localhost:8080', // Your Java backend URL
        changeOrigin: true, // Recommended for virtual-hosted sites
      },
    },
  },
})
// https://vitejs.dev/config/
