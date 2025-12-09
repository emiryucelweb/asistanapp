/**
 * Owner Call Notification - Call Notification for Business Owner
 * 
 * Displayed as header notification
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '@/features/agent/utils/locale';
import { Phone, User, Clock, X } from 'lucide-react';
import type { VoiceCall } from '@/types';

interface OwnerCallNotificationProps {
  call: VoiceCall;
  onView: () => void;
  onDismiss: () => void;
}

const OwnerCallNotification: React.FC<OwnerCallNotificationProps> = ({
  call,
  onView,
  onDismiss,
}) => {
  const { t, i18n } = useTranslation('agent');
  const getCallDuration = () => {
    if (call.startedAt) {
      const start = new Date(call.startedAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return '0:00';
  };

  const getStatusText = () => {
    switch (call.status) {
      case 'ringing':
        return t('voice.status.ringing');
      case 'connecting':
        return t('voice.status.connecting');
      case 'connected':
        return t('voice.status.connected');
      case 'on_hold':
        return t('voice.status.onHold');
      case 'transferring':
        return t('voice.status.transferring');
      default:
        return t('voice.call');
    }
  };

  const getStatusColor = () => {
    switch (call.status) {
      case 'ringing':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'connected':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'on_hold':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg p-4 animate-slide-in-right max-w-sm">
      {/* Close button */}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
        aria-label={t('common.close')}
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {call.caller.avatar ? (
            <img
              src={call.caller.avatar}
              alt={call.caller.name}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          {call.status === 'ringing' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {call.caller.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {call.caller.phoneNumber || t('voice.internalCall')}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor()}`}>
          {getStatusText()}
        </span>

        {call.status === 'connected' && (
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{getCallDuration()}</span>
          </div>
        )}
      </div>

      {/* Agent Info (if assigned) */}
      {call.callee && (
        <div className="p-2 bg-gray-50 dark:bg-slate-900/50 rounded text-sm mb-3">
          <p className="text-gray-600 dark:text-gray-400">
            {t('voice.speaking')}: <span className="font-medium text-gray-900 dark:text-white">{call.callee.name}</span>
          </p>
        </div>
      )}

      {/* Priority Badge */}
      {call.metadata?.priority && call.metadata.priority !== 'normal' && (
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${
              call.metadata.priority === 'urgent'
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
            }`}
          >
            {call.metadata.priority === 'urgent' ? '🚨' : '⚡'}
            {call.metadata.priority === 'urgent' ? t('voice.priority.urgent') : t('voice.priority.high')}
          </span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onView}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Phone className="w-4 h-4" />
        <span>{t('voice.viewDetails')}</span>
      </button>

      {/* Call Type Badge */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {call.callType === 'internal' ? `📞 ${t('voice.internalCall')}` : `📱 ${t('voice.externalCall')}`} •{' '}
          {formatTime(new Date(call.startedAt || Date.now()), i18n.language, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default OwnerCallNotification;


