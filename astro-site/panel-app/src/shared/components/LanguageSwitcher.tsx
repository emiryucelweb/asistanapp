/**
 * Language Switcher Component
 * 
 * Dropdown component for changing application language
 * Supports keyboard navigation and accessibility
 * 
 * @module shared/components/LanguageSwitcher
 */

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { LanguageIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/shared/i18n/hooks/useLanguage';
import { logger } from '@/shared/utils/logger';
import toast from 'react-hot-toast';

export interface LanguageSwitcherProps {
  /** Show language name instead of icon */
  showLabel?: boolean;
  /** Compact mode (smaller) */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Language Switcher Component
 * 
 * @example
 * ```tsx
 * // Icon only
 * <LanguageSwitcher />
 * 
 * // With label
 * <LanguageSwitcher showLabel />
 * 
 * // Compact mode
 * <LanguageSwitcher compact />
 * ```
 */
export function LanguageSwitcher({
  showLabel = false,
  compact = false,
  className = '',
}: LanguageSwitcherProps) {
  const { language, languages, languageNames, changeLanguage: handleChangeLanguage } = useLanguage();

  const handleLanguageChange = async (newLanguage: typeof language) => {
    if (newLanguage === language) return;

    try {
      await handleChangeLanguage(newLanguage);
      toast.success(
        language === 'tr'
          ? `Dil ${languageNames[newLanguage]} olarak değiştirildi`
          : `Language changed to ${languageNames[newLanguage]}`
      );
    } catch (error) {
      logger.error('Failed to change language', error);
      toast.error(
        language === 'tr'
          ? 'Dil değiştirilemedi'
          : 'Failed to change language'
      );
    }
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button
          className={`
            inline-flex items-center gap-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            px-${compact ? '2' : '3'} py-${compact ? '1.5' : '2'}
            text-sm font-medium
            text-gray-700 dark:text-gray-200
            hover:bg-gray-50 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            dark:focus:ring-offset-gray-900
            transition-colors duration-200
          `}
          aria-label="Change language"
        >
          <LanguageIcon
            className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500 dark:text-gray-400`}
            aria-hidden="true"
          />
          {showLabel && (
            <span className="hidden sm:inline-block">{languageNames[language]}</span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="
            absolute right-0 z-50 mt-2 w-36
            origin-top-right rounded-lg
            bg-white dark:bg-gray-800
            shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none
          "
        >
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang}>
                {({ active }) => (
                  <button
                    onClick={() => handleLanguageChange(lang)}
                    className={`
                      ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                      ${language === lang ? 'font-semibold' : ''}
                      group flex w-full items-center justify-between
                      px-4 py-2 text-sm
                      text-gray-900 dark:text-gray-100
                      transition-colors duration-150
                    `}
                    role="menuitem"
                  >
                    <span>{languageNames[lang]}</span>
                    {language === lang && (
                      <CheckIcon
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default LanguageSwitcher;

