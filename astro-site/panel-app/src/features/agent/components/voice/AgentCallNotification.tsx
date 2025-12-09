/**
 * Agent Call Notification - Small Call Notification for Agents
 * 
 * Appears as top-right popup for normal calls
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, PhoneOff, User, Clock, X, Maximize2 } from 'lucide-react';
import type { VoiceCall } from '@/types';
import { logger } from '@/shared/utils/logger';
import { formatTime } from '@/features/agent/utils/locale';

interface AgentCallNotificationProps {
  call: VoiceCall;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;
  onExpand: () => void;
}

const AgentCallNotification: React.FC<AgentCallNotificationProps> = ({
  call,
  onAccept,
  onReject,
  onDismiss,
  onExpand,
}) => {
  const { t, i18n } = useTranslation('agent');
  const [ringDuration, setRingDuration] = useState(0);
  const [audio] = useState(() => new Audio('/sounds/incoming-call.mp3'));

  useEffect(() => {
    // Ring duration counter
    const interval = setInterval(() => {
      setRingDuration((prev) => prev + 1);
    }, 1000);

    // Auto-dismiss after 30 seconds
    const timeout = setTimeout(() => {
      onDismiss();
    }, 30000);

    // Play ring sound (loop)
    audio.loop = true;
    audio.play().catch((err) => logger.error('Failed to play ring sound', err));

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, onDismiss]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityBadge = () => {
    const priority = call.metadata?.priority;
    if (!priority || priority === 'normal') return null;

    const badges = {
      urgent: { emoji: '🚨', label: t('voice.priority.urgent'), color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
      high: { emoji: '⚡', label: t('voice.priority.high'), color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
      low: { emoji: '📱', label: t('voice.priority.low'), color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' },
    };

    const badge = badges[priority as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${badge.color}`}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
      <div className="relative bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-500 dark:border-blue-600 shadow-2xl p-4 w-96 max-w-[calc(100vw-2rem)]">
        {/* Ringing Indicator */}
        <div className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white dark:border-slate-800" />
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label={t('voice.close')}
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3 pr-6">
          <div className="relative flex-shrink-0">
            {call.caller.avatar ? (
              <img
                src={call.caller.avatar}
                alt={call.caller.name}
                className="w-14 h-14 rounded-full border-2 border-blue-500 dark:border-blue-600"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-slate-800" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">
              {call.caller.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {call.caller.phoneNumber || t('voice.internalCall')}
            </p>
          </div>
        </div>

        {/* Status & Duration */}
        <div className="flex items-center justify-between mb-3">
          {getPriorityBadge()}
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatDuration(ringDuration)}</span>
          </div>
        </div>

        {/* AI Reason (if exists) */}
        {call.aiHandling?.aiStuckReason && (
          <div className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
              🤖 {call.aiHandling.aiStuckReason}
            </p>
          </div>
        )}

        {/* Expand Button (Show Details) */}
        <button
          onClick={onExpand}
          className="w-full mb-2 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
        >
          <Maximize2 className="w-4 h-4" />
          <span>{t('voice.viewDetails')}</span>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Phone className="w-5 h-5" />
            <span>{t('voice.answer')}</span>
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            title={t('voice.reject')}
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Call Type & Time */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {call.callType === 'internal' ? `📞 ${t('voice.internal')}` : `📱 ${t('voice.externalCall')}`} •{' '}
            {formatTime(new Date(call.startedAt || Date.now()), i18n.language, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentCallNotification;

