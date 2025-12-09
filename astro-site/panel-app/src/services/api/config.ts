/**
 * API Configuration
 * Controls whether to use mock data or real backend
 */

export const API_CONFIG = {
  /**
   * Set to false when backend is ready
   * When true, all API calls return mock data
   */
  USE_MOCK_DATA: true,

  /**
   * Mock API delay (ms) - simulates network latency
   */
  MOCK_DELAY: 300,

  /**
   * Backend API base URL
   */
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',

  /**
   * Request timeout (ms)
   */
  TIMEOUT: 30000,
} as const;

/**
 * Helper to simulate API delay in mock mode
 */
export const mockDelay = (ms: number = API_CONFIG.MOCK_DELAY) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to check if we're in mock mode
 */
export const isMockMode = () => API_CONFIG.USE_MOCK_DATA;

