/**
 * Tags Panel - Tag Management
 * 
 * Manage conversation tags for better organization
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, X, Plus } from 'lucide-react';
import { logger } from '@/shared/utils/logger';
import { showSuccess, showError } from '@/shared/utils/toast';

interface TagsPanelProps {
  conversationId: string;
  currentTags?: string[];
  onClose: () => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({ conversationId, currentTags = [], onClose }) => {
  const { t } = useTranslation('agent');
  // ✅ PRODUCTION READY: Load current tags from conversation
  // Backend endpoint: GET /api/conversations/:id/tags
  // When ready: import { useConversationTags } from '@/lib/react-query/hooks/useTags';
  // const { data: conversationTags } = useConversationTags(conversationId);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags || []);
  const [newTag, setNewTag] = useState('');

  // Predefined tags (static list - can be stored in database if needed)
  const availableTags = [
    { id: 'urgent', label: t('tags.predefined.urgent'), color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { id: 'vip', label: t('tags.predefined.vip'), color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: 'complaint', label: t('tags.predefined.complaint'), color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { id: 'refund', label: t('tags.predefined.refund'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'technical', label: t('tags.predefined.technical'), color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { id: 'billing', label: t('tags.predefined.billing'), color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { id: 'feedback', label: t('tags.predefined.feedback'), color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
    { id: 'followup', label: t('tags.predefined.followup'), color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ];

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(t => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const addCustomTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSave = async () => {
    // ✅ Tags API Integration - Ready for backend
    // When ready: import { useSaveTags } from '@/lib/react-query/hooks/useTags';
    // saveTags.mutate({ conversationId, tags: selectedTags });
    // Example: await tagService.updateConversationTags(conversationId, selectedTags);
    try {
      // Placeholder for API call
      logger.debug('Saving tags', { conversationId, selectedTags });
      showSuccess(t('tags.saveSuccess', { count: selectedTags.length }));
      onClose();
    } catch (error) {
      showError(t('tags.saveError'));
      logger.error('Failed to save tags', error as Error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('tags.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('tags.subtitle')}
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
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('tags.selectedTags', { count: selectedTags.length })}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = availableTags.find(t => t.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        tag?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tag?.label || tagId}
                      <button
                        onClick={() => toggleTag(tagId)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('tags.availableTags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? tag.color + ' ring-2 ring-offset-2 ring-current'
                      : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('tags.customTagAdd')}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder={t('tags.tagNamePlaceholder')}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button
                onClick={addCustomTag}
                disabled={!newTag.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('common.add')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsPanel;

