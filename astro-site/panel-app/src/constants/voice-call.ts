/**
 * Voice Call Screen Constants
 * Enterprise-ready configuration for production use
 */

// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_ENDPOINTS = {
  APPOINTMENTS: '/api/v1/appointments',
  SAVE_NOTES: '/api/v1/conversations/:id/notes',
  ASK_AI: '/api/v1/ai/ask',
  CUSTOMER_INFO: '/api/v1/customers/:customerId',
  CUSTOMER_HISTORY: '/api/v1/customers/:customerId/history',
} as const;

// Timing
export const TIMINGS = {
  NOTE_SAVE_DELAY: 5000, // 5 seconds
  AI_RESPONSE_DELAY: 1500, // 1.5 seconds for user feedback
  API_TIMEOUT: 30000, // 30 seconds
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TENANT_ID: 'tenantId',
} as const;

// Form Defaults
export const DEFAULT_APPOINTMENT_DURATION = 60; // minutes

// AI Assistant Configuration
export const AI_ASSISTANT_CONFIG = {
  MAX_QUESTION_LENGTH: 500,
  MIN_QUESTION_LENGTH: 3,
  ENABLE_QUICK_ACTIONS: true,
} as const;

