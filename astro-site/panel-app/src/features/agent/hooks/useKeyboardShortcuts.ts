/**
 * Keyboard Shortcuts Hook
 * Provides global keyboard shortcuts for agent productivity
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

/**
 * Display keyboard shortcuts help modal
 * @param t - Translation function from useTranslation hook
 */
export interface ShortcutDisplayItem {
  keys: string;
  description: string;
  action?: () => void;
}

export interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutDisplayItem[];
}

export const getAgentKeyboardShortcuts = (t: (key: string) => string): ShortcutCategory[] => {
  
  return [
    {
      category: t('keyboard.categories.general'),
      shortcuts: [
        { keys: 'Ctrl+K', description: t('keyboard.focusSearch') },
        { keys: 'Esc', description: t('keyboard.closeModals') },
        { keys: '?', description: t('keyboard.showShortcuts') },
      ],
    },
    {
      category: t('keyboard.categories.conversations'),
      shortcuts: [
        { keys: 'Ctrl+Enter', description: t('keyboard.sendMessage') },
        { keys: 'Ctrl+N', description: t('keyboard.nextConversation') },
        { keys: 'Ctrl+P', description: t('keyboard.previousConversation') },
        { keys: 'Ctrl+R', description: t('keyboard.resolveConversation') },
        { keys: 'Ctrl+T', description: t('keyboard.transfer') },
      ],
    },
    {
      category: t('keyboard.categories.quickActions'),
      shortcuts: [
        { keys: '/', description: t('keyboard.quickReplies') },
        { keys: 'Ctrl+Shift+T', description: t('keyboard.addTags') },
      ],
    },
  ];
};
