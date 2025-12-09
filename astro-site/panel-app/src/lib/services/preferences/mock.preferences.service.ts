/**
 * Mock Preferences Service (localStorage-based)
 * 
 * FOR DEVELOPMENT: Works without backend
 * TEMPORARY: Will be replaced by ApiPreferencesService when backend is ready
 * 
 * This service simulates API behavior using localStorage:
 * - Async operations (simulates network delay)
 * - Error handling (simulates network errors)
 * - Type-safe interface
 */

import { IPreferencesService, AgentPreferences } from './preferences.interface';
import { logger } from '@/shared/utils/logger';

const STORAGE_KEY = 'agent_preferences';
const NETWORK_DELAY = 300; // ms - simulates API latency

/**
 * Default preferences (matches backend schema)
 */
const DEFAULT_PREFERENCES: AgentPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  desktopNotifications: true,
  soundEnabled: true,
  callSounds: true,
  chatSounds: true,
  language: 'tr',
  autoAssign: true,
  theme: 'light',
};

/**
 * Mock Preferences Service
 * Implements IPreferencesService using localStorage
 */
export class MockPreferencesService implements IPreferencesService {
  /**
   * Get all preferences from localStorage
   */
  async getAll(): Promise<AgentPreferences> {
    // Simulate network delay
    await this.simulateNetworkDelay();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        logger.debug('[MOCK] No preferences found, returning defaults');
        return { ...DEFAULT_PREFERENCES };
      }

      const parsed = JSON.parse(stored);
      logger.debug('[MOCK] Preferences loaded from localStorage', parsed);
      
      // Merge with defaults to handle new preference keys
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch (error) {
      logger.error('[MOCK] Failed to load preferences', error as Error);
      return { ...DEFAULT_PREFERENCES };
    }
  }

  /**
   * Update a single preference
   */
  async update(key: keyof AgentPreferences, value: any): Promise<AgentPreferences> {
    // Simulate network delay
    await this.simulateNetworkDelay();

    try {
      const current = await this.getAll();
      const updated = { ...current, [key]: value };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.debug('[MOCK] Preference updated', { key, value });

      return updated;
    } catch (error) {
      logger.error('[MOCK] Failed to save preference', error as Error);
      throw new Error('Failed to save preference');
    }
  }

  /**
   * Update multiple preferences at once
   */
  async updateMultiple(preferences: Partial<AgentPreferences>): Promise<AgentPreferences> {
    // Simulate network delay
    await this.simulateNetworkDelay();

    try {
      const current = await this.getAll();
      const updated = { ...current, ...preferences };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.debug('[MOCK] Preferences updated', { preferences });

      return updated;
    } catch (error) {
      logger.error('[MOCK] Failed to save preferences', error as Error);
      throw new Error('Failed to save preferences');
    }
  }

  /**
   * Reset all preferences to defaults
   */
  async reset(): Promise<AgentPreferences> {
    // Simulate network delay
    await this.simulateNetworkDelay();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      logger.debug('[MOCK] Preferences reset to defaults');

      return { ...DEFAULT_PREFERENCES };
    } catch (error) {
      logger.error('[MOCK] Failed to reset preferences', error as Error);
      throw new Error('Failed to reset preferences');
    }
  }

  /**
   * Simulate network delay for realistic UX testing
   */
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));
  }
}

export default MockPreferencesService;

