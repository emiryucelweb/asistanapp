/**
 * In-Conversation Search Component
 * Search within a specific conversation
 */
import React, { useState, useMemo } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'ai';
  timestamp: string;
}

interface InConversationSearchProps {
  messages: Message[];
  onNavigateToMessage?: (messageId: string) => void;
}

const InConversationSearch: React.FC<InConversationSearchProps> = ({
  messages,
  onNavigateToMessage,
}) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Find matching messages
  const matchingMessages = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return messages.filter(message =>
      message.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setCurrentMatchIndex(0);
  };

  const handlePrevious = () => {
    if (matchingMessages.length === 0) return;
    const newIndex = currentMatchIndex > 0 ? currentMatchIndex - 1 : matchingMessages.length - 1;
    setCurrentMatchIndex(newIndex);
    onNavigateToMessage?.(matchingMessages[newIndex].id);
  };

  const handleNext = () => {
    if (matchingMessages.length === 0) return;
    const newIndex = currentMatchIndex < matchingMessages.length - 1 ? currentMatchIndex + 1 : 0;
    setCurrentMatchIndex(newIndex);
    onNavigateToMessage?.(matchingMessages[newIndex].id);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentMatchIndex(0);
          }}
          placeholder="Bu konuşmada ara..."
          className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Counter & Navigation */}
      {searchQuery && matchingMessages.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {currentMatchIndex + 1} / {matchingMessages.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={t('previous')}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={t('next')}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && matchingMessages.length === 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Sonuç yok
        </span>
      )}
    </div>
  );
};

export default InConversationSearch;

