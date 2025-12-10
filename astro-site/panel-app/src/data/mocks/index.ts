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
