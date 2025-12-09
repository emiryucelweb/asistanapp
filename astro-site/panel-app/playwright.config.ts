/**
 * Playwright Configuration - E2E Testing
 * 
 * Enterprise-grade E2E testing setup with:
 * - Multi-browser support (Chromium, Firefox, WebKit)
 * - Parallel execution
 * - Auto-retry on failure
 * - Video/screenshot on failure
 * - HTML report generation
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from .env.test file (if exists)
 */
// require('dotenv').config({ path: '.env.test' });

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:5173';
const isCI = !!process.env.CI;

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Test match patterns
  testMatch: '**/*.spec.ts',
  
  // Timeout per test
  timeout: 30 * 1000, // 30 seconds
  
  // Expect timeout
  expect: {
    timeout: 5 * 1000, // 5 seconds
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,
  
  // Retry failed tests
  retries: isCI ? 2 : 0,
  
  // Number of parallel workers
  workers: isCI ? 2 : 4,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // Console output
  ],
  
  // Global setup (before all tests)
  // globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  
  // Global teardown (after all tests)
  // globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
  
  // Shared settings for all projects
  use: {
    // Base URL for page.goto()
    baseURL,
    
    // Collect trace on failure
    trace: 'retain-on-failure',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Emulate viewport size
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Context options
    contextOptions: {
      // Permissions
      permissions: ['notifications', 'geolocation'],
    },
  },
  
  // Configure projects for major browsers
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],
  
  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    port: 5173,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000, // 2 minutes
  },
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
});
