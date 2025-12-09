/**
 * Multi-Select Filter Component
 * Checkbox-based multi-selection with search
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Search} from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder,
  searchable = true,
}) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(options.map(opt => opt.value));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {selected.length > 0 
            ? t('filters.selectedCount', { count: selected.length })
            : (placeholder || t('filters.selectPlaceholder'))
          }
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          {searchable && (
            <div className="p-3 border-b border-gray-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('search')}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={selectAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {t('filters.selectAll')}
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
            >
              {t('filters.clear')}
            </button>
          </div>

          {/* Options */}
          <div className="overflow-y-auto max-h-60" role="listbox">
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left"
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
            
            {filteredOptions.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('filters.noResults')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;


