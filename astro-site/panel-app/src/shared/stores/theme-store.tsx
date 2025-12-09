import { create } from 'zustand';
import { logger } from '@/shared/utils/logger';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const updateThemeClass = (theme: Theme) => {
  // Remove existing theme class
  document.documentElement.classList.remove('dark');
  
  // Apply new theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'system') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }
  // 'light' theme: no dark class needed
  
  if (import.meta.env.DEV) {
    logger.debug('🎨 Theme class updated:', { theme });
  }
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme: Theme) => {
        set({ theme });
        updateThemeClass(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'asistanapp-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately after rehydration
        if (state) {
          updateThemeClass(state.theme);
        }
      },
    }
  )
);

export { useThemeStore };
