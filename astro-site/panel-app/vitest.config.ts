/**
 * Vitest Configuration
 * Enterprise-grade testing setup with coverage thresholds
 * 
 * Features:
 * - React Testing Library integration
 * - 85%+ statement coverage requirement
 * - V8 coverage provider (faster than Istanbul)
 * - DOM environment for React components
 * - Path aliases matching tsconfig
 * - Memory-optimized worker pool
 * 
 * Memory Optimization Strategy:
 * - Uses 'forks' pool for better memory isolation
 * - Limits heap size per worker
 * - Controlled parallelism based on available resources
 * - Lazy compilation for faster startup
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';

// Dynamic worker calculation based on available memory
const totalMemoryGB = os.totalmem() / (1024 ** 3);
const availableMemoryGB = os.freemem() / (1024 ** 3);
const cpuCount = os.cpus().length;

// Enterprise memory management: Use 50% of available memory, max 2GB per worker
const maxHeapPerWorkerMB = Math.min(2048, Math.floor((availableMemoryGB * 0.5 * 1024) / 2));
const optimalWorkers = Math.max(1, Math.min(Math.floor(cpuCount / 2), Math.floor(availableMemoryGB / 2)));

// CI/CD detection - Enterprise: Support all major CI platforms
const isCI = Boolean(
  process.env.CI === 'true' ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.GITLAB_CI === 'true' ||
  process.env.JENKINS_URL ||
  process.env.AZURE_PIPELINES === 'true' ||
  process.env.TF_BUILD === 'True' ||
  process.env.CIRCLECI === 'true' ||
  process.env.BUILDKITE === 'true' ||
  process.env.TRAVIS === 'true'
);

// Environment-based configuration
const isDebug = process.env.DEBUG_TESTS === 'true';
const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

// Log configuration in CI for debugging
if (isCI) {
  console.info(`[Vitest Config] Workers: ${optimalWorkers}, Heap: ${maxHeapPerWorkerMB}MB, RAM: ${availableMemoryGB.toFixed(1)}GB`);
}

export default defineConfig({
  plugins: [react()],
  
  // Optimized esbuild settings for memory efficiency
  esbuild: {
    target: 'es2020',
    // Reduce memory by not generating source maps in test mode
    sourcemap: false,
  },
  
  test: {
    // Environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      // Provider - V8 is more memory efficient than Istanbul
      provider: 'v8',
      
      // Reporters - Full set for enterprise compliance
      // Memory impact is minimal as reports are generated post-test
      reporter: isCI 
        ? ['text-summary', 'lcov', 'cobertura', 'json-summary'] // CI: Machine-readable formats
        : ['text', 'html'],  // Local: Developer-friendly formats
      
      // Coverage thresholds (ENTERPRISE-GRADE: 85%+)
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
      
      // Include patterns
      include: [
        'src/**/*.{ts,tsx}',
        'src/**/*.{js,jsx}',
      ],
      
      // Exclude patterns
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/types/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/shared/ui/index.tsx',
        '**/*.stories.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      
      // Report directory
      reportsDirectory: './coverage',
      
      // Clean coverage on each run
      clean: true,
      
      // Skip full coverage check
      skipFull: false,
      
      // Include all files (even untested)
      all: true,
      
      // Watermarks for coverage quality indicators
      watermarks: {
        statements: [80, 90],
        branches: [75, 85],
        functions: [80, 90],
        lines: [80, 90],
      },
    },
    
    // Test match patterns
    include: [
      '**/__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      '.{idea,git,cache,output,temp}',
      '**/*.config.{ts,js}',
      'tests/e2e/**',
    ],
    
    // Watch mode
    watch: false,
    
    // Reporter - simplified for less memory overhead
    reporters: isCI ? ['default', 'junit'] : ['default'],
    
    // Output file for CI
    outputFile: isCI ? './test-results/junit.xml' : undefined,
    
    // Timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Retry failed tests
    retry: isCI ? 2 : 0,
    
    // ============================================
    // MEMORY OPTIMIZATION: Enterprise Configuration
    // ============================================
    
    // Use 'forks' pool - each test file runs in isolated process
    // This prevents memory leaks from accumulating across tests
    pool: 'forks',
    
    poolOptions: {
      forks: {
        // Multiple forks for parallelism, but controlled
        singleFork: false,
        
        // Memory limits per worker process
        execArgv: [
          `--max-old-space-size=${maxHeapPerWorkerMB}`,
          '--expose-gc', // Enable manual GC if needed
          '--no-compilation-cache', // Reduce memory at cost of speed
        ],
        
        // Isolate each test file
        isolate: true,
      },
    },
    
    // Controlled parallelism
    maxConcurrency: optimalWorkers,
    minWorkers: 1,
    maxWorkers: optimalWorkers,
    
    // Disable file parallelism to reduce peak memory usage
    // Tests within a file still run in parallel
    fileParallelism: false,
    
    // Test isolation
    isolate: true,
    
    // Sequence configuration for predictable memory usage
    sequence: {
      // Shuffle tests to catch order-dependent bugs
      shuffle: false,
      // Run hooks in parallel where safe
      hooks: 'stack',
    },
    
    // Clear mocks between tests
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    
    // Disable unnecessary features to reduce memory
    passWithNoTests: false,
    allowOnly: !isCI,
    
    // Cache configuration
    cache: {
      dir: 'node_modules/.vitest',
    },
    
    // Deps optimization
    deps: {
      optimizer: {
        web: {
          // Exclude heavy dependencies from optimization
          exclude: ['@tanstack/react-query', 'zustand', 'react-router-dom'],
        },
      },
      // Inline smaller deps for faster resolution
      moduleDirectories: ['node_modules'],
    },
    
    // Snapshotting
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: false,
    },
    
    // ============================================
    // ENTERPRISE: Type Checking & Benchmarks
    // ============================================
    
    // Type checking during tests (optional, enable with --typecheck)
    typecheck: {
      enabled: false, // Enable via CLI: vitest --typecheck
      checker: 'tsc',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    },
    
    // Benchmark configuration
    benchmark: {
      include: ['**/*.bench.{ts,tsx}'],
      exclude: ['node_modules', 'dist'],
      reporters: ['default'],
    },
    
    // Bail on first failure in CI (fail fast)
    bail: isCI ? 1 : 0,
    
    // Graceful exit
    dangerouslyIgnoreUnhandledErrors: false,
    
    // Print console output
    printConsoleTrace: isDebug,
    
    // Slow test threshold (highlight slow tests)
    slowTestThreshold: 1000, // 1 second
    
    // OnConsoleLog handler for memory leak detection
    onConsoleLog(log) {
      // Filter out known noisy logs
      if (log.includes('Download the React DevTools')) return false;
      if (log.includes('Warning: ReactDOM.render')) return false;
      return true;
    },
    
    // Global setup/teardown for metrics and cleanup
    globalSetup: './tests/global-setup.ts',
    globalTeardown: './tests/global-teardown.ts',
  },
  
  // Resolve aliases (match tsconfig paths)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/stores': path.resolve(__dirname, './src/shared/stores'),
      '@/ui': path.resolve(__dirname, './src/shared/ui'),
      '@/config': path.resolve(__dirname, './src/shared/config'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  
  // Build optimization
  build: {
    // Reduce memory during build
    minify: false,
    sourcemap: false,
  },
});
