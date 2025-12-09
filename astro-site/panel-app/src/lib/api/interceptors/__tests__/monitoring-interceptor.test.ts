/**
 * API Monitoring Interceptor Tests
 * Testing automatic API call monitoring and tracking
 * 
 * @group lib
 * @group interceptors
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import { setupMonitoringInterceptors } from '../monitoring-interceptor';
import { monitoring } from '@/shared/utils/monitoring';
import { advancedLogger } from '@/shared/utils/advanced-logger';

// Mock dependencies
vi.mock('@/shared/utils/monitoring', () => ({
  monitoring: {
    trackAPICall: vi.fn(),
  },
}));

vi.mock('@/shared/utils/advanced-logger', () => ({
  advancedLogger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Monitoring Interceptor', () => {
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance = axios.create();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Setup', () => {
    it('should setup interceptors on axios instance', () => {
      // Arrange - Access internal handlers via type assertion
      const requestInterceptors = (axiosInstance.interceptors.request as any).handlers;
      const responseInterceptors = (axiosInstance.interceptors.response as any).handlers;
      const initialRequestCount = requestInterceptors?.length ?? 0;
      const initialResponseCount = responseInterceptors?.length ?? 0;

      // Act
      setupMonitoringInterceptors(axiosInstance);

      // Assert
      expect((axiosInstance.interceptors.request as any).handlers?.length ?? 0).toBeGreaterThan(
        initialRequestCount
      );
      expect((axiosInstance.interceptors.response as any).handlers?.length ?? 0).toBeGreaterThan(
        initialResponseCount
      );
    });
  });

  describe('Request Interceptor', () => {
    beforeEach(() => {
      setupMonitoringInterceptors(axiosInstance);
    });

    it('should add start time metadata to request config', () => {
      // Arrange
      const config: any = {
        url: '/test',
        method: 'GET',
        headers: {},
      };

      // Act
      const interceptor = (axiosInstance.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result.metadata).toBeDefined();
        expect(result.metadata.startTime).toBeTypeOf('number');
        expect(result.metadata.startTime).toBeLessThanOrEqual(Date.now());
      }
    });

    it('should preserve existing config properties', () => {
      // Arrange
      const config: any = {
        url: '/test',
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
        data: { test: true },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result.url).toBe('/test');
        expect(result.method).toBe('POST');
        expect(result.headers.Authorization).toBe('Bearer token');
        expect(result.data).toEqual({ test: true });
      }
    });

    it('should handle request errors', async () => {
      // Arrange
      const error = new Error('Request setup failed');

      // Act
      const interceptor = (axiosInstance.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(advancedLogger.error).toHaveBeenCalledWith('API Request error', error);
      }
    });
  });

  describe('Response Interceptor', () => {
    beforeEach(() => {
      setupMonitoringInterceptors(axiosInstance);
    });

    it('should track successful API call', () => {
      // Arrange
      const startTime = Date.now() - 250; // 250ms ago
      const response: any = {
        status: 200,
        data: { success: true },
        config: {
          url: '/api/users',
          method: 'GET',
          metadata: { startTime },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            endpoint: '/api/users',
            method: 'GET',
            status: 200,
            success: true,
            duration: expect.any(Number),
          })
        );
      }
    });

    it('should log successful API call details', () => {
      // Arrange
      const response: any = {
        status: 201,
        config: {
          url: '/api/posts',
          method: 'post',
          metadata: { startTime: Date.now() - 100 },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(advancedLogger.debug).toHaveBeenCalledWith(
          'API call completed',
          expect.objectContaining({
            endpoint: '/api/posts',
            method: 'POST',
            status: 201,
          })
        );
      }
    });

    it('should track failed API call', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 500,
        },
        config: {
          url: '/api/error',
          method: 'GET',
          metadata: { startTime: Date.now() - 300 },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            endpoint: '/api/error',
            method: 'GET',
            status: 500,
            success: false,
          })
        );
      }
    });

    it('should log failed API call with error details', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 404,
        },
        config: {
          url: '/api/notfound',
          method: 'get',
          metadata: { startTime: Date.now() },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(advancedLogger.warn).toHaveBeenCalledWith(
          'API call failed',
          error,
          expect.objectContaining({
            endpoint: '/api/notfound',
            status: 404,
          })
        );

        expect(advancedLogger.error).toHaveBeenCalledWith(
          'API Response error',
          error,
          expect.any(Object)
        );
      }
    });

    it('should calculate correct duration', () => {
      // Arrange
      const startTime = Date.now() - 500; // 500ms ago
      const response: any = {
        status: 200,
        config: {
          url: '/api/test',
          method: 'GET',
          metadata: { startTime },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        const trackCallArgs = vi.mocked(monitoring.trackAPICall).mock.calls[0][0];
        expect(trackCallArgs.duration).toBeGreaterThanOrEqual(450);
        expect(trackCallArgs.duration).toBeLessThanOrEqual(600);
      }
    });

    it('should handle missing metadata gracefully', () => {
      // Arrange
      const response: any = {
        status: 200,
        config: {
          url: '/api/test',
          method: 'GET',
          // No metadata
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert - should not crash, but might not track
        expect(monitoring.trackAPICall).not.toHaveBeenCalled();
      }
    });

    it('should handle error without response', async () => {
      // Arrange
      const error: any = {
        config: {
          url: '/api/network-error',
          method: 'GET',
          metadata: { startTime: Date.now() },
        },
        // No response property
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 0,
            success: false,
          })
        );
      }
    });
  });

  describe('Multiple Requests', () => {
    beforeEach(() => {
      setupMonitoringInterceptors(axiosInstance);
    });

    it('should track multiple concurrent requests independently', () => {
      // Arrange
      const responses = [
        {
          status: 200,
          config: {
            url: '/api/users',
            method: 'GET',
            metadata: { startTime: Date.now() - 100 },
          },
        },
        {
          status: 201,
          config: {
            url: '/api/posts',
            method: 'POST',
            metadata: { startTime: Date.now() - 200 },
          },
        },
        {
          status: 200,
          config: {
            url: '/api/comments',
            method: 'GET',
            metadata: { startTime: Date.now() - 150 },
          },
        },
      ];

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        responses.forEach(response => interceptor.fulfilled(response as any));

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledTimes(3);
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({ endpoint: '/api/users' })
        );
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({ endpoint: '/api/posts' })
        );
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({ endpoint: '/api/comments' })
        );
      }
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      setupMonitoringInterceptors(axiosInstance);
    });

    it('should handle config without URL', () => {
      // Arrange
      const response: any = {
        status: 200,
        config: {
          method: 'GET',
          metadata: { startTime: Date.now() },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            endpoint: 'unknown',
          })
        );
      }
    });

    it('should handle config without method', () => {
      // Arrange
      const response: any = {
        status: 200,
        config: {
          url: '/api/test',
          metadata: { startTime: Date.now() },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET', // Default
          })
        );
      }
    });

    it('should handle lowercase method names', () => {
      // Arrange
      const response: any = {
        status: 200,
        config: {
          url: '/api/test',
          method: 'post',
          metadata: { startTime: Date.now() },
        },
      };

      // Act
      const interceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST', // Uppercased
          })
        );
      }
    });
  });

  describe('Real-world Scenarios', () => {
    beforeEach(() => {
      setupMonitoringInterceptors(axiosInstance);
    });

    it('should track complete request lifecycle', () => {
      // Arrange
      const config: any = {
        url: '/api/workflow',
        method: 'POST',
        headers: {},
      };

      // Act - Request
      const requestInterceptor = (axiosInstance.interceptors.request as any).handlers[0];
      let modifiedConfig: any;
      if (requestInterceptor && requestInterceptor.fulfilled) {
        modifiedConfig = requestInterceptor.fulfilled(config);
      }

      // Act - Response
      const response: any = {
        status: 201,
        config: modifiedConfig,
        data: { id: 'workflow-123' },
      };

      const responseInterceptor = (axiosInstance.interceptors.response as any).handlers[0];
      if (responseInterceptor && responseInterceptor.fulfilled) {
        responseInterceptor.fulfilled(response);

        // Assert
        expect(modifiedConfig.metadata.startTime).toBeDefined();
        expect(monitoring.trackAPICall).toHaveBeenCalledWith(
          expect.objectContaining({
            endpoint: '/api/workflow',
            method: 'POST',
            status: 201,
            success: true,
          })
        );
      }
    });
  });
});

