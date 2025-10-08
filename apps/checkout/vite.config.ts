import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 * 
 * Why Vite:
 * - Native ESM for extremely fast HMR
 * - Optimized production builds with Rollup
 * - Simple configuration
 * - Better DX than CRA or manual Webpack setup
 */
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 3000,
    open: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    chunkSizeWarningLimit: 500,
    
    rollupOptions: {
      output: {
        /**
         * Manual Chunks Strategy
         * 
         * Separates code for:
         * - Better caching (vendor code changes less frequently)
         * - Parallel loading
         * - Lazy loading of routes
         * 
         * Generated chunks:
         * - vendor.js → React ecosystem (~150KB)
         * - ui.js → @inspire/core-components (~80KB)
         * - state.js → Zustand, Framer Motion (~50KB)
         * - CheckoutPage.[hash].js → Lazy loaded (~100KB)
         */
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            
            if (id.includes('zustand') || id.includes('framer-motion')) {
              return 'state';
            }
            
            if (id.includes('@inspire/core-components')) {
              return 'ui';
            }
            
            return 'vendor-other';
          }
        },
        
        chunkFileNames: 'chunks/[name].[hash].js',
        entryFileNames: '[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});

