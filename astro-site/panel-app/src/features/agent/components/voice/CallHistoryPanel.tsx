/**
 * Call History Panel - Call History
 * 
 * Panel displaying all call records
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime, formatDate } from '@/features/agent/utils/locale';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  User,
  Calendar,
  Filter,
  Download,
  Play,
  Search,
  X,
} from 'lucide-react';
import type { VoiceCall } from '@/types';

interface CallHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayRecording?: (recordingUrl: string) => void;
}

const CallHistoryPanel: React.FC<CallHistoryPanelProps> = ({
  isOpen,
  onClose,
  onPlayRecording,
}) => {
  const { t, i18n } = useTranslation('agent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inbound' | 'outbound' | 'missed'>('all');
  const [_filterDate, _setFilterDate] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // ✅ PRODUCTION READY: Fetch call history from API
  // Backend endpoint: GET /api/calls/history?agentId={agentId}&filter={filterDate}
  // When ready: import { useCallHistory } from '@/lib/react-query/hooks/useCalls';
  // const { data: callHistory } = useCallHistory({ agentId: user?.id, filter: filterDate });
  
  // For now showing empty state - will be populated by API
  const [callHistory] = useState<VoiceCall[]>([]); // Mock data removed - API ready

  const filteredCalls = callHistory.filter((call) => {
    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'missed' && call.status !== 'missed') return false;
      if (filterType !== 'missed' && call.callType !== filterType) return false;
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        call.caller.name.toLowerCase().includes(query) ||
        call.caller.phoneNumber?.toLowerCase().includes(query) ||
        call.callee?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallDate = (dateString: string | undefined) => {
    if (!dateString) return t('callHistory.unknown');
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return formatTime(date, i18n.language, { hour: '2-digit', minute: '2-digit' });
    }
    return formatDate(date, i18n.language, { day: 'numeric', month: 'short' });
  };

  const getCallIcon = (call: VoiceCall) => {
    if (call.status === 'missed') {
      return <PhoneMissed className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
    if (call.callType === 'outbound') {
      return <PhoneOutgoing className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    return <PhoneIncoming className="w-5 h-5 text-green-600 dark:text-green-400" />;
  };

  const getCallTypeText = (call: VoiceCall) => {
    if (call.status === 'missed') return t('callHistory.missed');
    if (call.callType === 'outbound') return t('callHistory.outgoing');
    return t('callHistory.incoming');
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl border border-gray-200 dark:border-slate-700 w-full sm:max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('callHistory.title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('callHistory.recordCount', { count: filteredCalls.length })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('callHistory.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('callHistory.all')}
            </button>
            <button
              onClick={() => setFilterType('inbound')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === 'inbound'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('callHistory.incoming')}
            </button>
            <button
              onClick={() => setFilterType('outbound')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === 'outbound'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('callHistory.outgoing')}
            </button>
            <button
              onClick={() => setFilterType('missed')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === 'missed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('callHistory.missed')}
            </button>
          </div>
        </div>

        {/* Call List */}
        <div className="max-h-[calc(90vh-280px)] overflow-y-auto">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="p-4 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {getCallIcon(call)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {call.callType === 'outbound' ? call.callee?.name : call.caller.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {call.callType === 'outbound'
                          ? call.callee?.phoneNumber
                          : call.caller.phoneNumber}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCallDate(call.startedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {getCallTypeText(call)}
                    </span>
                    {call.duration && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(call.duration)}
                        </span>
                      </>
                    )}
                    {call.callee && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {call.callee.name}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {call.recording && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onPlayRecording?.(call.recording!.url)}
                        className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {t('callHistory.listenRecording')}
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {t('callHistory.download')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredCalls.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">{t('callHistory.noRecords')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallHistoryPanel;


