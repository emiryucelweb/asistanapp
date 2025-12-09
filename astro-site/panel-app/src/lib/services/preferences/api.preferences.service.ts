/**
 * API Preferences Service (Real Backend Integration)
 * 
 * FOR PRODUCTION: Uses real backend API
 * READY TO USE: Just enable USE_MOCK_PREFERENCES=false
 * 
 * This service integrates with the backend API:
 * - Real HTTP requests
 * - Proper error handling
 * - Same interface as MockPreferencesService
 */

import { IPreferencesService, AgentPreferences } from './preferences.interface';
import { api } from '@/lib/api/client';
import { logger } from '@/shared/utils/logger';

/**
 * API Response wrapper (matches backend contract)
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Agent Profile Response (includes preferences)
 */
interface AgentProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  preferences: AgentPreferences;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Preferences Service
 * Implements IPreferencesService using real backend API
 * 
 * BACKEND ENDPOINTS REQUIRED:
 * - GET /api/smart-assignment/agents/me -> returns AgentProfile with preferences
 * - PATCH /api/smart-assignment/agents/me -> updates agent profile & preferences
 */
export class ApiPreferencesService implements IPreferencesService {
  /**
   * Get all preferences from backend
   */
  async getAll(): Promise<AgentPreferences> {
    try {
      const response = await api.get<ApiResponse<AgentProfile>>(
        '/smart-assignment/agents/me'
      );

      logger.debug('[API] Preferences loaded from backend', response.data.data.preferences);
      return response.data.data.preferences;
    } catch (error) {
      logger.error('[API] Failed to load preferences', error as Error);
      throw new Error('Failed to load preferences from server');
    }
  }

  /**
   * Update a single preference
   */
  async update(key: keyof AgentPreferences, value: any): Promise<AgentPreferences> {
    try {
      const response = await api.patch<ApiResponse<AgentProfile>>(
        '/smart-assignment/agents/me',
        {
          preferences: { [key]: value },
        }
      );

      logger.debug('[API] Preference updated', { key, value });
      return response.data.data.preferences;
    } catch (error) {
      logger.error('[API] Failed to save preference', error as Error);
      throw new Error('Failed to save preference to server');
    }
  }

  /**
   * Update multiple preferences at once
   */
  async updateMultiple(preferences: Partial<AgentPreferences>): Promise<AgentPreferences> {
    try {
      const response = await api.patch<ApiResponse<AgentProfile>>(
        '/smart-assignment/agents/me',
        {
          preferences,
        }
      );

      logger.debug('[API] Preferences updated', { preferences });
      return response.data.data.preferences;
    } catch (error) {
      logger.error('[API] Failed to save preferences', error as Error);
      throw new Error('Failed to save preferences to server');
    }
  }

  /**
   * Reset all preferences to defaults
   * Backend should have a default preferences schema
   */
  async reset(): Promise<AgentPreferences> {
    try {
      // This assumes backend has a reset endpoint or accepts null/empty preferences
      const response = await api.patch<ApiResponse<AgentProfile>>(
        '/smart-assignment/agents/me',
        {
          resetPreferences: true,
        }
      );

      logger.debug('[API] Preferences reset to defaults');
      return response.data.data.preferences;
    } catch (error) {
      logger.error('[API] Failed to reset preferences', error as Error);
      throw new Error('Failed to reset preferences on server');
    }
  }
}

export default ApiPreferencesService;

