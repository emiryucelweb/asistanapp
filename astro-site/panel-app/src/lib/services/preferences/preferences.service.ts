/**
 * Preferences Service Factory
 * 
 * ⚡ THIS IS THE MAGIC FILE ⚡
 * 
 * MIGRATION STRATEGY:
 * 1. Development (no backend): USE_MOCK_PREFERENCES = true
 * 2. Production (with backend): USE_MOCK_PREFERENCES = false
 * 
 * THAT'S IT! No other code changes needed anywhere!
 * 
 * ENVIRONMENT VARIABLE:
 * Add to .env: VITE_USE_MOCK_PREFERENCES=true (for dev)
 * Add to .env: VITE_USE_MOCK_PREFERENCES=false (for prod)
 */

import { IPreferencesService } from './preferences.interface';
import { MockPreferencesService } from './mock.preferences.service';
import { ApiPreferencesService } from './api.preferences.service';
import { logger } from '@/shared/utils/logger';

/**
 * 🚀 MIGRATION FLAG - CHANGE THIS WHEN BACKEND IS READY
 * 
 * true = Uses localStorage (development)
 * false = Uses real API (production)
 */
const USE_MOCK_PREFERENCES = import.meta.env.VITE_USE_MOCK_PREFERENCES !== 'false';

/**
 * Preferences Service Instance
 * 
 * Components import this and use it.
 * The implementation is swapped automatically based on the flag.
 */
export const preferencesService: IPreferencesService = USE_MOCK_PREFERENCES
  ? new MockPreferencesService()
  : new ApiPreferencesService();

// Log which service is being used
logger.info(
  `[PreferencesService] Using ${USE_MOCK_PREFERENCES ? 'MOCK (localStorage)' : 'API (backend)'} implementation`
);

/**
 * USAGE IN COMPONENTS:
 * 
 * import { preferencesService } from '@/lib/services/preferences/preferences.service';
 * 
 * // Load preferences
 * const prefs = await preferencesService.getAll();
 * 
 * // Update single preference
 * await preferencesService.update('language', 'en');
 * 
 * // Update multiple preferences
 * await preferencesService.updateMultiple({ language: 'en', theme: 'dark' });
 * 
 * ZERO CHANGES NEEDED WHEN MIGRATING TO BACKEND!
 */

export default preferencesService;

