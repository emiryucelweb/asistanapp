/**
 * Theme Switcher Component
 * Toggle between light and dark mode
 */
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/shared/stores/theme-store';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslation('common');
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
        isDark 
          ? 'bg-slate-700 text-yellow-300 hover:bg-slate-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      aria-pressed={isDark}
      role="switch"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - Visible in Light Mode */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        
        {/* Moon Icon - Visible in Dark Mode */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeSwitcher;

