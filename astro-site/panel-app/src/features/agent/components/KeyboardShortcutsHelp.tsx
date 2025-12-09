/**
 * Keyboard Shortcuts Help Modal
 * Displays all available keyboard shortcuts
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Keyboard, Command } from 'lucide-react';
import { getAgentKeyboardShortcuts } from '@/features/agent/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  const { t } = useTranslation('agent');
  const shortcuts = getAgentKeyboardShortcuts(t);

  const formatKey = (key: string) => {
    const parts = key.split('+');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="mx-1 text-gray-400">+</span>}
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
          {part}
        </kbd>
      </React.Fragment>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Keyboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('keyboard.help.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('keyboard.help.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full"></div>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {formatKey(shortcut.keys)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Command className="w-4 h-4" />
            <span>
              <strong>{t('keyboard.help.tipPrefix')}</strong> {t('keyboard.help.tipText')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;



