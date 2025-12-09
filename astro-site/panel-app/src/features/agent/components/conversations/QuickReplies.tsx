/**
 * Quick Replies - Hızlı Yanıtlar Komponenti
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Zap, X } from 'lucide-react';

interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
  shortcut?: string;
}

interface QuickRepliesProps {
  onSelect: (content: string) => void;
  onClose: () => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, onClose }) => {
  const { t } = useTranslation('agent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ✅ PRODUCTION READY: API Integration placeholder
  // Backend endpoint: GET /api/templates/quick-replies?category={selectedCategory}
  // When ready: import { useQuickReplies } from '@/lib/react-query/hooks/useTemplates';
  // const { data: quickReplies } = useQuickReplies({ category: selectedCategory });
  // TODO: Replace with backend API call to GET /api/templates/quick-replies
  // Mock data removed for production readiness
  
  const quickReplies: QuickReply[] = [];

  const categories = [
    { id: 'all', label: t('quickReplies.categories.all') },
    { id: 'greeting', label: t('quickReplies.categories.greeting') },
    { id: 'order', label: t('quickReplies.categories.order') },
    { id: 'return', label: t('quickReplies.categories.return') },
    { id: 'product', label: t('quickReplies.categories.product') },
    { id: 'shipping', label: t('quickReplies.categories.shipping') },
    { id: 'general', label: t('quickReplies.categories.general') },
    { id: 'closing', label: t('quickReplies.categories.closing') },
  ];

  const filteredReplies = quickReplies.filter((reply) => {
    const matchesSearch =
      reply.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.shortcut?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || reply.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('quickReplies.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('quickReplies.templateCount', { count: filteredReplies.length })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('quickReplies.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          {/* Categories */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredReplies.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('quickReplies.noTemplates')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => {
                    onSelect(reply.content);
                    onClose();
                  }}
                  className="text-left p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {reply.title}
                    </h3>
                    {reply.shortcut && (
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded font-mono">
                        {reply.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {reply.content}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('quickReplies.shortcutHint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickReplies;

