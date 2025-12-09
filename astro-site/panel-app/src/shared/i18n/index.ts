/**
 * i18n Module Exports
 * 
 * @module shared/i18n
 */

// Configuration
export * from './config';

// Hooks
export * from './hooks/useLanguage';

// Utils
export * from './utils/formatting';

// Re-export i18next types
export type { TFunction, i18n as I18nInstance } from 'i18next';
export { useTranslation } from 'react-i18next';

