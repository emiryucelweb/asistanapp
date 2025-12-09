 

/**
 * API Types & Interfaces
 * Common types for API requests and responses
 */

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: PaginationMeta;
}

/**
 * API Error structure
 */
export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter params for lists
 */
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

/**
 * List request params
 */
export type ListParams = PaginationParams & FilterParams;

/**
 * File upload response
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

