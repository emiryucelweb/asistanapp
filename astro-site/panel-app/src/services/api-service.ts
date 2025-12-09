 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        const tenantId = localStorage.getItem('tenantId');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (tenantId) {
          config.headers['x-tenant-id'] = tenantId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
        
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Bir hata oluştu',
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          details: error.response?.data?.details
        };
        
        return Promise.reject(apiError);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string; rememberMe?: boolean }) {
    const response = await this.client.post<ApiResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout() {
    const response = await this.client.post<ApiResponse>('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.client.post<ApiResponse>('/auth/refresh', {
      refreshToken
    });
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get<ApiResponse>('/auth/profile');
    return response.data;
  }

  // Generic CRUD methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }

  // File upload
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onProgress(progress);
      } : undefined,
    });

    return response.data;
  }

  // Set auth token manually
  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}

const apiService = new ApiService();

// Named export for compatibility
export { apiService };

// Default export
export default apiService;
