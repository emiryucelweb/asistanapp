// Mock Data Index - Central Export Point

// Admin Panel Mock Data
export * from './admin-dashboard.mock';
export * from './admin-conversations.mock';
export * from './admin-reports.mock';
export * from './admin-team.mock';
export * from './admin-settings.mock';

// Agent Panel Mock Data
export * from './agent-dashboard.mock';

// Super Admin Panel Mock Data
export * from './super-admin.mock';

// Shared Mock Data
export * from './customers.mock';

// Mock Data Configuration
export const MOCK_DATA_CONFIG = {
  enabled: true,
  apiDelay: 500, // Simulated API delay in ms
  errorRate: 0.01 // 1% error simulation
};

// Mock API Response Helper
export const mockApiResponse = <T>(data: T, delay = MOCK_DATA_CONFIG.apiDelay): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional errors
      if (Math.random() < MOCK_DATA_CONFIG.errorRate) {
        reject(new Error('Mock API Error'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// ============================================================================
// ULTRA-DETAILED MOCK DATA (NEW)
// ============================================================================

// Admin Panel - Detailed Mocks
export * from './admin-customers.mock';
export * from './admin-products.mock';
export * from './admin-orders.mock';

// Agent Panel - Detailed Mocks
export * from './agent-conversations.mock';
export * from './agent-quick-replies.mock';
export * from './agent-performance.mock';

// SuperAdmin Panel - Detailed Mocks
export * from './superadmin-tenants.mock';
export * from './superadmin-financial.mock';
export * from './superadmin-analytics.mock';
