/**
 * Quick Reply Templates Component
 * Predefined message templates for quick responses
 */
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Plus, Edit2, Trash2, Search, X, Check } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'appointment' | 'product' | 'support' | 'closing' | 'custom';
  shortcut?: string;
}

interface QuickReplyTemplatesProps {
  onSelectTemplate: (content: string) => void;
}

const QuickReplyTemplates: React.FC<QuickReplyTemplatesProps> = ({ onSelectTemplate }) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultTemplates: Template[] = useMemo(() => [
    {
      id: '1',
      title: t('quickReply.greeting.title'),
      content: t('quickReply.greeting.content'),
      category: 'greeting',
      shortcut: '/hi',
    },
    {
      id: '2',
      title: t('quickReply.appointment.title'),
      content: t('quickReply.appointment.content'),
      category: 'appointment',
      shortcut: '/appointment',
    },
    {
      id: '3',
      title: t('quickReply.product.title'),
      content: t('quickReply.product.content'),
      category: 'product',
      shortcut: '/product',
    },
    {
      id: '4',
      title: t('quickReply.support.title'),
      content: t('quickReply.support.content'),
      category: 'support',
      shortcut: '/support',
    },
    {
      id: '5',
      title: t('quickReply.closing.title'),
      content: t('quickReply.closing.content'),
      category: 'closing',
      shortcut: '/bye',
    },
    {
      id: '6',
      title: t('quickReply.price.title'),
      content: t('quickReply.price.content'),
      category: 'product',
      shortcut: '/price',
    },
    {
      id: '7',
      title: t('quickReply.hours.title'),
      content: t('quickReply.hours.content'),
      category: 'support',
      shortcut: '/hours',
    },
    {
      id: '8',
      title: t('quickReply.address.title'),
      content: t('quickReply.address.content'),
      category: 'support',
      shortcut: '/address',
    },
  ], [t]);

  const categories = useMemo(() => [
    { value: 'all', label: t('quickReply.categories.all'), icon: MessageSquare },
    { value: 'greeting', label: t('quickReply.categories.greeting') },
    { value: 'appointment', label: t('quickReply.categories.appointment') },
    { value: 'product', label: t('quickReply.categories.product') },
    { value: 'support', label: t('quickReply.categories.support') },
    { value: 'closing', label: t('quickReply.categories.closing') },
  ], [t]);

  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.shortcut?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.content);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      greeting: 'bg-green-100 text-green-700',
      appointment: 'bg-blue-100 text-blue-700',
      product: 'bg-purple-100 text-purple-700',
      support: 'bg-orange-100 text-orange-700',
      closing: 'bg-gray-100 text-gray-700',
      custom: 'bg-pink-100 text-pink-700',
    };
    return colors[category];
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
        title={t('quickReply.title')}
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Templates Dropdown */}
      {isOpen && (
        <>
          <div className="absolute bottom-full right-0 mb-2 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  Hızlı Yanıt Şablonları
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('quickReply.searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-orange-500 dark:bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto">
              {filteredTemplates.length > 0 ? (
                <div className="p-2">
                  {filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {template.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          {categories.find(c => c.value === template.category)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {template.content}
                      </p>
                      {template.shortcut && (
                        <div className="flex items-center gap-1">
                          <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 text-xs rounded border border-gray-300 dark:border-slate-600 font-mono">
                            {template.shortcut}
                          </kbd>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">{t('templates.notFound')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {t('templates.tryDifferentSearch')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <button
                onClick={() => {
                  alert(t('quickReply.comingSoon'));
                }}
                className="w-full px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('quickReply.addNew')}
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default QuickReplyTemplates;

