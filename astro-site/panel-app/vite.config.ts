import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10kb
      deleteOriginFile: false,
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE === 'true' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/shared/stores'),
      '@/ui': path.resolve(__dirname, './src/shared/ui'),
      '@/config': path.resolve(__dirname, './src/shared/config'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/test': path.resolve(__dirname, './test'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'react-router';
          }
          
          // React Query
          if (id.includes('node_modules/react-query') || id.includes('node_modules/@tanstack/react-query')) {
            return 'react-query';
          }
          
          // UI Libraries
          if (
            id.includes('node_modules/lucide-react') ||
            id.includes('node_modules/@headlessui') ||
            id.includes('node_modules/@heroicons') ||
            id.includes('node_modules/framer-motion')
          ) {
            return 'ui-libs';
          }
          
          // Charts
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Forms
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('node_modules/zod')
          ) {
            return 'forms';
          }
          
          // i18n
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          
          // Utils
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/date-fns') ||
            id.includes('node_modules/lodash')
          ) {
            return 'utils';
          }
          
          // Toast & Notifications
          if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/sonner')) {
            return 'notifications';
          }
          
          // WebSocket
          if (id.includes('node_modules/socket.io-client')) {
            return 'websocket';
          }
          
          // State Management
          if (id.includes('node_modules/zustand') || id.includes('node_modules/jotai')) {
            return 'state';
          }
          
          // Virtual Scrolling
          if (id.includes('node_modules/react-window') || id.includes('node_modules/react-virtualized')) {
            return 'virtualization';
          }
          
          // Feature-based chunks
          if (id.includes('/features/agent/')) {
            return 'feature-agent';
          }
          if (id.includes('/features/admin/')) {
            return 'feature-admin';
          }
          if (id.includes('/features/super-admin/')) {
            return 'feature-super-admin';
          }
          
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            extType = 'images';
          } else if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            extType = 'fonts';
          }
          
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // Entry file names
        entryFileNames: 'assets/js/[name]-[hash].js',
        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000, // 1MB
    cssCodeSplit: true, // Split CSS into separate files
    assetsInlineLimit: 4096, // 4kb - inline assets smaller than this
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-query',
      'axios',
      'react-hook-form',
      'react-i18next',
      'i18next',
      'recharts',
      '@headlessui/react',
      'lucide-react',
      'framer-motion',
      'react-hot-toast',
      'socket.io-client',
      'zustand',
      'zod',
      '@hookform/resolvers/zod',
      'react-window',
      'react-virtualized-auto-sizer',
      'isomorphic-dompurify',
    ],
    // Force optimize these packages even if they're found in node_modules
    force: true,
  },
  define: {
    global: 'globalThis',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
