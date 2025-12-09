/**
 * Preferences Service Exports
 * 
 * Clean barrel export for easy imports
 */

export { preferencesService, default } from './preferences.service';
export type { IPreferencesService, AgentPreferences } from './preferences.interface';
export { MockPreferencesService } from './mock.preferences.service';
export { ApiPreferencesService } from './api.preferences.service';

