 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * API Client - Axios Instance
 * Centralized HTTP client with interceptors and error handling
 * ✅ ENTERPRISE-READY: OpenTelemetry trace context propagation
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { setupMonitoringInterceptors } from './interceptors/monitoring-interceptor';
import { getOrCreateTraceId } from '@/shared/utils/tracing';
import { logger } from '@/shared/utils/logger';

// API Base URL (from environment variables)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Setup monitoring interceptors
setupMonitoringInterceptors(apiClient);

/**
 * Request Interceptor
 * Adds authentication token and trace context to requests
 * ✅ ENTERPRISE-READY: Distributed tracing support
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage or zustand store
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Add trace ID for distributed tracing (OpenTelemetry)
    try {
      const traceId = getOrCreateTraceId();
      if (traceId && config.headers) {
        config.headers['X-Trace-Id'] = traceId;
        config.headers['X-Request-Id'] = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    } catch (error) {
      // Silently fail if tracing not available
      logger.debug('Failed to add trace ID to request', { error });
    }

    // Log request with trace context
    logger.api(
      config.method?.toUpperCase() || 'GET',
      config.url || '',
      undefined,
      undefined
    );

    return config;
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles responses and errors globally
 * ✅ ENTERPRISE-READY: Structured error logging with trace context
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const config = response.config as any;
    const duration = config.metadata?.startTime 
      ? Date.now() - config.metadata.startTime 
      : undefined;

    // Log successful response
    logger.api(
      config.method?.toUpperCase() || 'GET',
      config.url || '',
      response.status,
      duration
    );

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const config = error.config as any;
    const duration = config?.metadata?.startTime 
      ? Date.now() - config.metadata.startTime 
      : undefined;

    // Log error with structured context
    logger.error('API Error', error, {
      method: config?.method?.toUpperCase(),
      url: config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      duration,
      responseData: error.response?.data,
    });

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // Try to refresh token
              const refreshToken = localStorage.getItem('refresh_token');
              if (refreshToken) {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                  refreshToken,
                });

                const { token } = response.data;
                localStorage.setItem('auth_token', token);

                // Retry original request with new token
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              // Refresh failed - redirect to login
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }

          // Redirect to login if refresh failed
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - No permission
          logger.error('Access denied. Insufficient permissions.');
          break;

        case 404:
          // Not Found
          logger.error('Resource not found.');
          break;

        case 429:
          // Too Many Requests - Rate limit
          logger.error('Too many requests. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server Error
          logger.error('Server error. Please try again later.');
          window.location.href = '/error/500';
          break;

        default:
          logger.error('An error occurred:', error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      logger.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      logger.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API Request Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

export default api;

