/**
 * Preferences Service Interface
 * 
 * ENTERPRISE PATTERN: Interface-based abstraction
 * 
 * WHY THIS APPROACH?
 * - Components depend on interface, not implementation
 * - Easy to switch between mock (localStorage) and real API
 * - Backend contract is defined upfront
 * - Zero code changes when backend is ready
 * 
 * MIGRATION: When backend is ready, just change the flag in preferences.service.ts
 */

export interface AgentPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  soundEnabled: boolean;
  callSounds: boolean;
  chatSounds: boolean;
  language: string;
  autoAssign: boolean;
  theme?: string;
}

/**
 * Preferences Service Interface
 * Both mock and real implementations must follow this contract
 */
export interface IPreferencesService {
  /**
   * Get all preferences
   */
  getAll(): Promise<AgentPreferences>;

  /**
   * Update a single preference
   */
  update(key: keyof AgentPreferences, value: any): Promise<AgentPreferences>;

  /**
   * Update multiple preferences at once
   */
  updateMultiple(preferences: Partial<AgentPreferences>): Promise<AgentPreferences>;

  /**
   * Reset to defaults
   */
  reset(): Promise<AgentPreferences>;
}

export default IPreferencesService;

