 

/**
 * API Monitoring Interceptor
 * Automatic API call monitoring and tracking
 * 
 * @module lib/api/interceptors/monitoring-interceptor
 */

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { monitoring } from '@/shared/utils/monitoring';
import { advancedLogger } from '@/shared/utils/advanced-logger';

/**
 * Setup API monitoring interceptors
 */
export function setupMonitoringInterceptors(axiosInstance: AxiosInstance): void {
  // Request interceptor - start timing
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add start time to config
      (config as any).metadata = {
        startTime: Date.now(),
      };
      return config;
    },
    (error) => {
      advancedLogger.error('API Request error', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - track metrics
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      trackAPICall(response.config, response.status, true);
      return response;
    },
    (error) => {
      const status = error.response?.status || 0;
      trackAPICall(error.config, status, false, error);
      
      advancedLogger.error('API Response error', error, {
        endpoint: error.config?.url,
        method: error.config?.method,
        status,
      });

      return Promise.reject(error);
    }
  );
}

/**
 * Track API call
 */
function trackAPICall(
  config: any,
  status: number,
  success: boolean,
  error?: Error
): void {
  if (!config || !config.metadata) return;

  const duration = Date.now() - config.metadata.startTime;
  const endpoint = config.url || 'unknown';
  const method = (config.method || 'GET').toUpperCase();

  monitoring.trackAPICall({
    endpoint,
    method,
    duration,
    status,
    success,
  });

  // Log details
  if (success) {
    advancedLogger.debug('API call completed', {
      endpoint,
      method,
      duration,
      status,
    });
  } else {
    advancedLogger.warn('API call failed', error, {
      endpoint,
      method,
      duration,
      status,
    });
  }
}

export default setupMonitoringInterceptors;

