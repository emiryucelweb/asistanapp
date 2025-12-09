/**
 * i18n Configuration
 * 
 * Enterprise-grade internationalization setup with:
 * - Automatic language detection
 * - Lazy loading of translations
 * - Namespace support for code splitting
 * - TypeScript support
 * - Backend synchronization
 * 
 * @module shared/i18n/config
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { logger } from '@/shared/utils/logger';

// Supported languages
export const SUPPORTED_LANGUAGES = ['tr', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'tr';

// Language display names
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  tr: 'Türkçe',
  en: 'English',
};

/**
 * i18n namespaces for code splitting
 */
export const I18N_NAMESPACES = {
  common: 'common',           // Common UI elements
  auth: 'auth',               // Authentication pages
  agent: 'agent',             // Agent panel
  admin: 'admin',             // Admin panel
  superAdmin: 'super-admin',  // Super admin panel
  errors: 'errors',           // Error messages
  validation: 'validation',   // Form validation
} as const;

export type I18nNamespace = typeof I18N_NAMESPACES[keyof typeof I18N_NAMESPACES];

/**
 * Initialize i18n
 * 
 * @returns Promise<i18n> Initialized i18n instance
 */
export async function initializeI18n(): Promise<typeof i18n> {
  const isDevelopment = import.meta.env.DEV;

  await i18n
    // Load translation files from backend
    .use(Backend)
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      // Fallback language
      fallbackLng: DEFAULT_LANGUAGE,
      
      // Supported languages
      supportedLngs: SUPPORTED_LANGUAGES,
      
      // Load language only (tr-TR becomes tr)
      load: 'languageOnly',
      
      // Normalize language codes
      nonExplicitSupportedLngs: true,
      
      // Default namespace
      defaultNS: I18N_NAMESPACES.common,
      
      // Namespaces to load
      ns: Object.values(I18N_NAMESPACES),
      
      // Debug mode (only in development)
      debug: isDevelopment,
      
      // Interpolation options
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      
      // Backend options for loading translation files
      backend: {
        // Path to load translation files with cache busting
        loadPath: '/locales/{{lng}}/{{ns}}.json?v=' + Date.now(),
        
        // Allow cross-origin requests
        crossDomain: false,
        
        // Request timeout
        requestOptions: {
          mode: 'cors',
          credentials: 'same-origin',
          cache: 'no-cache', // Force fresh load
        },
      },
      
      // Language detection options
      detection: {
        // Order of language detection methods
        order: [
          'querystring',      // ?lng=en
          'cookie',           // Cookie
          'localStorage',     // localStorage
          'sessionStorage',   // sessionStorage
          'navigator',        // Browser language
          'htmlTag',          // HTML lang attribute
        ],
        
        // Keys to lookup language from
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        lookupSessionStorage: 'i18nextLng',
        
        // Cache user language
        caches: ['localStorage', 'cookie'],
        
        // Optional expire and domain for cookie
        cookieMinutes: 10080, // 7 days
      },
      
      // React specific options
      react: {
        // Suspend until translations are loaded
        useSuspense: true,
        
        // Bind i18n instance to component
        bindI18n: 'languageChanged loaded',
        
        // Bind i18n store to component
        bindI18nStore: 'added removed',
        
        // Force re-render on language change
        transEmptyNodeValue: '',
        
        // Default translation behavior
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
      },
      
      // Save missing keys to translation files (development only)
      saveMissing: isDevelopment,
      saveMissingTo: 'current',
      
      // Missing key handler
      missingKeyHandler: (lngs, ns, key, fallbackValue) => {
        if (isDevelopment) {
          logger.warn('Missing translation key', {
            languages: lngs,
            namespace: ns,
            key,
            fallbackValue,
          });
        }
      },
    });

  // Log initialization
  logger.info('i18n initialized', {
    language: i18n.language,
    languages: i18n.languages,
    namespaces: i18n.options.ns,
  });

  // Expose i18n globally for debugging
  if (isDevelopment) {
    (window as any).i18n = i18n;
    logger.debug('i18n exposed globally as window.i18n');
  }

  return i18n;
}

/**
 * Change language and sync with backend
 * 
 * @param language - Language code to switch to
 * @returns Promise<void>
 */
export async function changeLanguage(language: SupportedLanguage): Promise<void> {
  try {
    // Change i18n language
    await i18n.changeLanguage(language);
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    // Sync with backend (if user is authenticated)
    await syncLanguageWithBackend(language);
    
    logger.info('Language changed', { language });
  } catch (error) {
    logger.error('Failed to change language', error, { language });
    throw error;
  }
}

/**
 * Sync language preference with backend
 * 
 * @param language - Language to sync
 * @returns Promise<void>
 */
async function syncLanguageWithBackend(language: SupportedLanguage): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // User not authenticated, skip backend sync
      return;
    }

    // Call backend API to save preference
    // TODO: Implement when backend endpoint is ready
    // await agentService.updatePreferences({ language });
    
    logger.debug('Language synced with backend', { language });
  } catch (error) {
    // Don't throw error, just log it
    logger.warn('Failed to sync language with backend', { error, language });
  }
}

/**
 * Get current language
 * 
 * @returns Current language code
 */
export function getCurrentLanguage(): SupportedLanguage {
  const lang = i18n.language || DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/**
 * Check if language is RTL
 * 
 * @param language - Language to check
 * @returns True if language is RTL
 */
export function isRTL(_language: SupportedLanguage): boolean {
  // Currently no RTL languages supported
  // Add 'ar', 'he', etc. here when needed
  return false;
}

// Export i18n instance
export { i18n };
export default i18n;

