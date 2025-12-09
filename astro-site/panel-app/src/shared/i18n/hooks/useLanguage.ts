/**
 * useLanguage Hook
 * 
 * Custom hook for language management
 * Provides easy access to language switching and current language state
 * 
 * @module shared/i18n/hooks/useLanguage
 */

import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import type { SupportedLanguage } from '../config';
import { changeLanguage, getCurrentLanguage, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../config';
import { logger } from '@/shared/utils/logger';

export interface UseLanguageReturn {
  /** Current language code */
  language: SupportedLanguage;
  
  /** All supported languages */
  languages: readonly SupportedLanguage[];
  
  /** Language display names */
  languageNames: Record<SupportedLanguage, string>;
  
  /** Change language function */
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  
  /** Is RTL language */
  isRTL: boolean;
  
  /** i18n ready state */
  ready: boolean;
}

/**
 * Hook for language management
 * 
 * @returns Language utilities and state
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { language, languages, changeLanguage } = useLanguage();
 *   
 *   return (
 *     <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
 *       {languages.map((lang) => (
 *         <option key={lang} value={lang}>
 *           {languageNames[lang]}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();

  const handleChangeLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      await changeLanguage(lang);
    } catch (error) {
      logger.error('Failed to change language', error, { language: lang });
      throw error;
    }
  }, []);

  return {
    language: getCurrentLanguage(),
    languages: SUPPORTED_LANGUAGES,
    languageNames: LANGUAGE_NAMES,
    changeLanguage: handleChangeLanguage,
    isRTL: i18n.dir() === 'rtl',
    ready: i18n.isInitialized,
  };
}

/**
 * Hook for accessing translation function with type safety
 * 
 * @param namespace - Optional namespace
 * @returns Translation function and i18n instance
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t } = useTranslate('agent');
 *   
 *   return <h1>{t('dashboard.title')}</h1>;
 * }
 * ```
 */
export function useTranslate(namespace?: string) {
  return useTranslation(namespace);
}

