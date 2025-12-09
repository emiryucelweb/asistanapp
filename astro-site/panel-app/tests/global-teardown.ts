/**
 * Vitest Global Teardown - Panel
 * Enterprise-grade frontend test cleanup
 * 
 * Runs ONCE after all test files
 */

export default async function globalTeardown(): Promise<void> {
  // Calculate test duration
  const startTime = (globalThis as Record<string, unknown>).__PANEL_TEST_START_TIME__ as number;
  const duration = startTime ? ((Date.now() - startTime) / 1000).toFixed(2) : 'unknown';
  
  // Log memory usage
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  
  console.info('\n[Panel Global Teardown] Test run completed');
  console.info(`[Panel Global Teardown] Duration: ${duration}s`);
  console.info(`[Panel Global Teardown] Memory: ${heapUsedMB}MB used / ${heapTotalMB}MB total`);
  
  // Force garbage collection if available
  if (typeof global.gc === 'function') {
    global.gc();
    console.info('[Panel Global Teardown] Garbage collection triggered');
  }
  
  // Clean up global state
  delete (globalThis as Record<string, unknown>).__PANEL_TEST_START_TIME__;
}

