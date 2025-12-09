/**
 * Date Range Picker Component
 * Advanced date range selection with presets
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const displayLabel = label || t('dateRange.label');

  const presets: DateRange[] = [
    {
      start: subDays(new Date(), 1),
      end: new Date(),
      label: t('dateRange.presets.24h')
    },
    {
      start: subDays(new Date(), 7),
      end: new Date(),
      label: t('dateRange.presets.7d')
    },
    {
      start: subDays(new Date(), 30),
      end: new Date(),
      label: t('dateRange.presets.30d')
    },
    {
      start: subMonths(new Date(), 3),
      end: new Date(),
      label: t('dateRange.presets.3m')
    },
    {
      start: subYears(new Date(), 1),
      end: new Date(),
      label: t('dateRange.presets.1y')
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (preset: DateRange) => {
    onChange(preset);
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      
      onChange({
        start,
        end,
        label: `${format(start, 'dd MMM', { locale: tr })} - ${format(end, 'dd MMM', { locale: tr })}`
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {value.label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[300px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
          {/* Presets */}
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 py-1">
              {t('dateRange.quickSelect')}
            </p>
            <div className="space-y-1 mt-1">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    value.label === preset.label
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
              {t('dateRange.customRange')}
            </p>
            <div className="space-y-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                placeholder={t('dateRange.startDate')}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                placeholder={t('dateRange.endDate')}
              />
              <button
                onClick={handleCustomRange}
                disabled={!customStart || !customEnd}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;


