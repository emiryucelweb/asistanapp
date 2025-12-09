/**
 * Authentication API Service
 * Handles auth-related API calls
 */
import api from '../client';
import { ApiResponse } from '../types';

export interface PasswordResetRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const authService = {
  /**
   * Request password reset email
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { email }
    );
    return response.data;
  },

  /**
   * Change password (authenticated user)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      data
    );
    return response.data;
  },

  /**
   * Verify password reset token
   */
  verifyResetToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await api.get<ApiResponse<{ valid: boolean }>>(
      `/auth/verify-reset-token/${token}`
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password/confirm',
      { token, newPassword }
    );
    return response.data;
  },
};

export default authService;

