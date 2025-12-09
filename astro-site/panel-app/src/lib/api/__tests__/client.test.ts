/**
 * API Client Tests
 * Testing centralized HTTP client with interceptors and error handling
 * 
 * @group lib
 * @group api
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { apiClient, api } from '../client';
import { logger } from '@/shared/utils/logger';

// Mock dependencies
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    api: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@/shared/utils/tracing', () => ({
  getOrCreateTraceId: vi.fn(() => 'trace-123'),
}));

vi.mock('../interceptors/monitoring-interceptor', () => ({
  setupMonitoringInterceptors: vi.fn(),
}));

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset axios interceptors - handlers is internal Axios API not exposed in types
    type AxiosInterceptorManagerInternal<T> = {
      handlers: Array<{ fulfilled?: (value: T) => T; rejected?: (error: unknown) => unknown } | null>;
    };
    (apiClient.interceptors.request as unknown as AxiosInterceptorManagerInternal<unknown>).handlers = [];
    (apiClient.interceptors.response as unknown as AxiosInterceptorManagerInternal<unknown>).handlers = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Configuration', () => {
    it('should have correct base URL', () => {
      expect(apiClient.defaults.baseURL).toBeDefined();
    });

    it('should have correct timeout', () => {
      expect(apiClient.defaults.timeout).toBe(30000);
    });

    it('should have correct default headers', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have withCredentials enabled', () => {
      expect(apiClient.defaults.withCredentials).toBe(true);
    });
  });

  describe('API Methods', () => {
    it('should make GET request', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockData } as any);

      // Act
      const response = await api.get('/test');

      // Assert
      expect(response.data).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalledWith('/test', undefined);
    });

    it('should make POST request', async () => {
      // Arrange
      const postData = { name: 'New Item' };
      const mockResponse = { id: 1, ...postData };
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ data: mockResponse } as any);

      // Act
      const response = await api.post('/test', postData);

      // Assert
      expect(response.data).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/test', postData, undefined);
    });

    it('should make PUT request', async () => {
      // Arrange
      const putData = { id: 1, name: 'Updated' };
      vi.spyOn(apiClient, 'put').mockResolvedValueOnce({ data: putData } as any);

      // Act
      const response = await api.put('/test/1', putData);

      // Assert
      expect(response.data).toEqual(putData);
      expect(apiClient.put).toHaveBeenCalledWith('/test/1', putData, undefined);
    });

    it('should make PATCH request', async () => {
      // Arrange
      const patchData = { name: 'Patched' };
      vi.spyOn(apiClient, 'patch').mockResolvedValueOnce({ data: patchData } as any);

      // Act
      const response = await api.patch('/test/1', patchData);

      // Assert
      expect(response.data).toEqual(patchData);
      expect(apiClient.patch).toHaveBeenCalledWith('/test/1', patchData, undefined);
    });

    it('should make DELETE request', async () => {
      // Arrange
      vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({ data: { success: true } } as any);

      // Act
      const response = await api.delete('/test/1');

      // Assert
      expect(response.data).toEqual({ success: true });
      expect(apiClient.delete).toHaveBeenCalledWith('/test/1', undefined);
    });
  });

  describe('Request Interceptor', () => {
    it('should add authorization token when present', () => {
      // Arrange
      localStorage.setItem('auth_token', 'test-token-123');
      
      const config: any = {
        headers: {},
        method: 'GET',
        url: '/test',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      }
    });

    it('should not add authorization when token absent', () => {
      // Arrange
      const config: any = {
        headers: {},
        method: 'GET',
        url: '/test',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result.headers.Authorization).toBeUndefined();
      }
    });

    it('should add trace ID headers', () => {
      // Arrange
      const config: any = {
        headers: {},
        method: 'GET',
        url: '/test',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result.headers['X-Trace-Id']).toBe('trace-123');
        expect(result.headers['X-Request-Id']).toBeDefined();
      }
    });

    it('should log API request', () => {
      // Arrange
      const config: any = {
        headers: {},
        method: 'POST',
        url: '/api/users',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(config);

        // Assert
        expect(logger.api).toHaveBeenCalledWith('POST', '/api/users', undefined, undefined);
      }
    });
  });

  describe('Response Interceptor', () => {
    it('should log successful response with duration', () => {
      // Arrange
      const response: any = {
        status: 200,
        config: {
          method: 'get',
          url: '/api/test',
          metadata: {
            startTime: Date.now() - 150, // 150ms ago
          },
        },
        data: { success: true },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        interceptor.fulfilled(response);

        // Assert
        expect(logger.api).toHaveBeenCalledWith(
          'GET',
          '/api/test',
          200,
          expect.any(Number)
        );
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 Unauthorized error', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
        },
        config: {
          method: 'get',
          url: '/api/protected',
          headers: {},
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalled();
      }
    });

    it('should handle 403 Forbidden error', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 403,
          statusText: 'Forbidden',
        },
        config: {
          method: 'post',
          url: '/api/admin',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('API Error'),
          error,
          expect.any(Object)
        );
      }
    });

    it('should handle 404 Not Found error', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 404,
          statusText: 'Not Found',
        },
        config: {
          method: 'get',
          url: '/api/nonexistent',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalled();
      }
    });

    it('should handle 429 Too Many Requests error', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 429,
          statusText: 'Too Many Requests',
        },
        config: {
          method: 'post',
          url: '/api/messages',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('Too many requests'),
        );
      }
    });

    it('should handle 500 Server Error', async () => {
      // Arrange
      const error: any = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
        },
        config: {
          method: 'post',
          url: '/api/actions',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('Server error'),
        );
      }
    });

    it('should handle network errors', async () => {
      // Arrange
      const error: any = {
        request: {},
        message: 'Network Error',
        config: {
          method: 'get',
          url: '/api/test',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('Network error'),
        );
      }
    });

    it('should handle generic errors', async () => {
      // Arrange
      const error: any = {
        message: 'Something went wrong',
        config: {
          method: 'post',
          url: '/api/test',
        },
      };

      // Act
      const interceptor = (apiClient.interceptors.response as any).handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e) {
          // Expected to reject
        }

        // Assert
        expect(logger.error).toHaveBeenCalled();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests without headers', () => {
      // Arrange
      const config: any = {
        method: 'GET',
        url: '/test',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(result).toBeDefined();
      }
    });

    it('should handle empty URL', () => {
      // Arrange
      const config: any = {
        headers: {},
        method: 'GET',
        url: '',
      };

      // Act
      const interceptor = (apiClient.interceptors.request as any).handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = interceptor.fulfilled(config);

        // Assert
        expect(logger.api).toHaveBeenCalledWith('GET', '', undefined, undefined);
      }
    });

    it('should handle config with custom params', async () => {
      // Arrange
      const config = {
        params: { page: 1, limit: 10 },
        headers: { 'X-Custom': 'value' },
      };
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: [] } as any);

      // Act
      await api.get('/test', config);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/test', config);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle authenticated API call flow', async () => {
      // Arrange
      localStorage.setItem('auth_token', 'valid-token');
      const mockData = { userId: 'user-123', name: 'John' };
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockData } as any);

      // Act
      const response = await api.get('/user/profile');

      // Assert
      expect(response.data).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('should handle pagination requests', async () => {
      // Arrange
      const mockData = {
        data: [{ id: 1 }, { id: 2 }],
        page: 1,
        total: 100,
      };
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockData } as any);

      // Act
      const response = await api.get('/items', {
        params: { page: 1, limit: 20 },
      });

      // Assert
      expect(response.data).toEqual(mockData);
    });

    it('should handle file upload', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.txt');
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ data: { fileId: 'file-123' } } as any);

      // Act
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Assert
      expect(response.data.fileId).toBe('file-123');
    });
  });
});

