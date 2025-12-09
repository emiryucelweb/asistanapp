/**
 * Message Search Component
 * Global search for messages with debounce
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Search, X, Clock, User } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  id: string;
  conversationId: string;
  customerName: string;
  message: string;
  timestamp: string;
  channel: string;
}

interface MessageSearchProps {
  onSelectResult?: (result: SearchResult) => void;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onSelectResult }) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock search function - replace with real API call
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        conversationId: 'conv-1',
        customerName: 'Ahmet Yılmaz',
        message: `Merhaba, randevu almak istiyorum. ${query} hakkında bilgi alabilir miyim?`,
        timestamp: '10 dakika önce',
        channel: 'WhatsApp',
      },
      {
        id: '2',
        conversationId: 'conv-2',
        customerName: 'Ayşe Demir',
        message: `${query} ile ilgili sorularım var, yardımcı olur musunuz?`,
        timestamp: '1 saat önce',
        channel: 'Instagram',
      },
      {
        id: '3',
        conversationId: 'conv-3',
        customerName: 'Mehmet Kaya',
        message: `${query} konusunda detaylı bilgi istiyorum`,
        timestamp: '2 saat önce',
        channel: 'Web Widget',
      },
    ].filter(result => 
      result.message.toLowerCase().includes(query.toLowerCase()) ||
      result.customerName.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 500),
    [performSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(true);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSelectResult = (result: SearchResult) => {
    setShowResults(false);
    onSelectResult?.(result);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-500/30 text-gray-900 dark:text-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery && setShowResults(true)}
          placeholder={t('searchMessages')}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Aranıyor...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {searchResults.length} sonuç bulundu
                </p>
              </div>
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{result.customerName}</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {result.channel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
                    {highlightText(result.message, searchQuery)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {result.timestamp}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Sonuç bulunamadı</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Farklı kelimeler deneyin
              </p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {showResults && searchQuery && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default MessageSearch;

