import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optional: Babel configuration for React
      babel: {
        plugins: [
          // Add any babel plugins here if needed
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './TFI_FIXED'),
    },
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Clean the output directory before building
    emptyOutDir: true,
    // Configure chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Minify output
    minify: 'terser',
    // Terser options
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements in production
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for production build (can be disabled for smaller files)
    sourcemap: false,
    // Enable/disable brotli compression
    brotliSize: false,
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Add additional chunks as needed
        },
      },
    },
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: true, // Open browser on server start
    cors: true, // Enable CORS
  },
  // Configure environment variables
  envPrefix: 'VITE_', // Only expose env variables starting with VITE_
});

