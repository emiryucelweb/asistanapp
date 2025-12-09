/**
 * Vitest Global Setup - Panel
 * Enterprise-grade frontend test environment initialization
 * 
 * Runs ONCE before all test files
 */

export default async function globalSetup(): Promise<void> {
  // Ensure test environment
  process.env.NODE_ENV = 'test';
  
  // Log setup info
  console.info('[Panel Global Setup] Test environment initialized');
  console.info(`[Panel Global Setup] Node: ${process.version}`);
  console.info(`[Panel Global Setup] Memory: ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB heap`);
  
  // Store start time for teardown metrics
  (globalThis as Record<string, unknown>).__PANEL_TEST_START_TIME__ = Date.now();
}

