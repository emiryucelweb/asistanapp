import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/stores': path.resolve(__dirname, './src/stores'),
            '@/assets': path.resolve(__dirname, './src/assets'),
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
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['@headlessui/react', '@heroicons/react', 'framer-motion'],
                    charts: ['recharts'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
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
            '@heroicons/react/24/outline',
            '@heroicons/react/24/solid',
            'framer-motion',
            'react-hot-toast',
            'socket.io-client',
            'zustand',
            'zod',
            '@hookform/resolvers/zod',
        ],
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
