import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Enable the new JSX transform
      jsxImportSource: '@emotion/react',
      // Enable babel for better tree-shaking
      babel: {
        plugins: [
          'babel-plugin-macros',
          ['@emotion/babel-plugin', { sourceMap: mode === 'development' }],
        ],
      },
    }),
    tailwindcss(),
    
    // Bundle analyzer (only in report mode)
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    
    // PWA support with offline capabilities
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Toros Tournament Manager',
        short_name: 'Toros',
        description: 'Tournament management system',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    
    // Gzip and Brotli compression
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\\.(br)$/, /\\.(gz)$/],
    }),
  ].filter(Boolean),
  
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
    // Enable HMR over WebSocket
    hmr: {
      overlay: true,
    },
  },
  
  build: {
    // Enable minification
    minify: 'esbuild',
    // Disable source maps in production for smaller bundle size
    sourcemap: mode !== 'production',
    // Configure chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Output directory for the build
    outDir: 'dist',
    // Configure rollup options
    rollupOptions: {
      output: {
        // Split vendor and app code
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group vendor chunks by package
            const packageName = id.toString().split('node_modules/')[1].split('/')[0];
            return `vendor-${packageName.replace('@', '')}`;
          }
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Disable brotli size reporting for faster build
    reportCompressedSize: false,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Enable esbuild optimizations
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  // Environment variables
  define: {
    'process.env': {},
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}))
