/**
 * Advanced Filters - Advanced Conversation Filtering
 * 
 * Multi-criteria filtering for conversation management
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Filter, Calendar, Tag, User } from 'lucide-react';

interface AdvancedFiltersProps {
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

export interface FilterValues {
  channels: string[];
  tags: string[];
  dateRange: { start: string; end: string } | null;
  assignedTo: string[];
  priority: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onClose, onApply }) => {
  const { t } = useTranslation('agent');
  const [filters, setFilters] = useState<FilterValues>({
    channels: [],
    tags: [],
    dateRange: null,
    assignedTo: [],
    priority: [],
  });

  const channels = ['whatsapp', 'instagram', 'telegram', 'web'];
  const tags = ['urgent', 'vip', 'complaint', 'refund', 'technical', 'billing'];
  // Fetch agents from API
  // ✅ useAgents hook will be imported when backend /agents endpoint is ready
  // Expected: const { data: agentsData } = useAgents();
  const agents: string[] = []; // Placeholder until API is ready
  const priorities = ['high', 'medium', 'low'];

  const toggleArrayFilter = (key: keyof FilterValues, value: string) => {
    const currentArray = filters[key] as string[];
    if (currentArray.includes(value)) {
      setFilters({ ...filters, [key]: currentArray.filter(v => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...currentArray, value] });
    }
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      channels: [],
      tags: [],
      dateRange: null,
      assignedTo: [],
      priority: [],
    });
  };

  const activeFilterCount = 
    filters.channels.length + 
    filters.tags.length + 
    filters.assignedTo.length + 
    filters.priority.length + 
    (filters.dateRange ? 1 : 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('conversations.filters.advancedFilters')}
                </h2>
                {activeFilterCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('conversations.filters.activeFiltersCount', { count: activeFilterCount })}
                  </p>
                )}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Channels */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-lg">📱</span>
              {t('conversations.filters.channels')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {channels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => toggleArrayFilter('channels', channel)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filters.channels.includes(channel)
                      ? 'bg-purple-500 text-white ring-2 ring-purple-500 ring-offset-2'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {t('conversations.filters.tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleArrayFilter('tags', tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filters.tags.includes(tag)
                      ? 'bg-purple-500 text-white ring-2 ring-purple-500 ring-offset-2'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              {t('conversations.filters.priority')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => toggleArrayFilter('priority', priority)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filters.priority.includes(priority)
                      ? 'bg-purple-500 text-white ring-2 ring-purple-500 ring-offset-2'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {priority === 'high' ? t('priority.high') : priority === 'medium' ? t('priority.normal') : t('priority.low')}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('conversations.filters.assignedTo')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {agents.map((agent: string) => (
                <button
                  key={agent}
                  onClick={() => toggleArrayFilter('assignedTo', agent)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.assignedTo.includes(agent)
                      ? 'bg-purple-500 text-white ring-2 ring-purple-500 ring-offset-2'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {agent}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('conversations.filters.dateRange')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date-start" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t('conversations.filters.startDate')}
                </label>
                <input
                  id="date-start"
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { start: e.target.value, end: filters.dateRange?.end || '' }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
              <div>
                <label htmlFor="date-end" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {t('conversations.filters.endDate')}
                </label>
                <input
                  id="date-end"
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { start: filters.dateRange?.start || '', end: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {t('common.reset')}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
            >
              {t('common.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;

