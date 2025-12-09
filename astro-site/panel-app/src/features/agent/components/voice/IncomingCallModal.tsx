/**
 * Incoming Call Modal - Gelen Arama Ekranı
 * Tam ekran arama bildirimi
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, X, PhoneOff, User } from 'lucide-react';
import type { VoiceCall } from '@/types';

interface IncomingCallModalProps {
  call: VoiceCall;
  onAccept: () => void;
  onReject: () => void;
  onIgnore: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  onAccept,
  onReject,
  onIgnore,
}) => {
  const { t } = useTranslation('agent');
  const [ringDuration, setRingDuration] = useState(0);

  useEffect(() => {
    // Ring duration counter
    const interval = setInterval(() => {
      setRingDuration((prev) => prev + 1);
    }, 1000);

    // Auto-reject after 30 seconds
    const timeout = setTimeout(() => {
      onReject();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onReject]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="incoming-call-modal-title"
        className="relative z-10 text-center px-8 max-w-md w-full"
      >
        {/* Caller Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 -m-4 animate-ping">
              <div className="w-32 h-32 rounded-full bg-white/20" />
            </div>
            <div className="absolute inset-0 -m-2 animate-pulse">
              <div className="w-28 h-28 rounded-full bg-white/30" />
            </div>

            {/* Avatar */}
            {call.caller.avatar ? (
              <img
                src={call.caller.avatar}
                alt={call.caller.name}
                className="relative w-24 h-24 rounded-full border-4 border-white shadow-2xl"
              />
            ) : (
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white to-gray-100 border-4 border-white shadow-2xl flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            )}

            {/* Call Type Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-lg">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                {call.callType === 'internal' ? t('voice.internal') : t('voice.incomingCall')}
              </span>
            </div>
          </div>
        </div>

        {/* Caller Info */}
        <div className="mb-8">
          <h2 id="incoming-call-modal-title" className="text-3xl font-bold text-white mb-2">{call.caller.name}</h2>
          {call.caller.phoneNumber && (
            <p className="text-xl text-blue-100 mb-1">{call.caller.phoneNumber}</p>
          )}
          <p className="text-sm text-blue-200">{t('voice.ringing')}</p>
        </div>

        {/* Ring Duration */}
        <div className="mb-12">
          <p className="text-2xl font-mono text-white">{formatDuration(ringDuration)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="group relative"
            aria-label={t('voice.reject')}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl">
              <PhoneOff className="w-8 h-8 text-white" />
            </div>
            <p className="mt-3 text-sm font-medium text-white">{t('voice.reject')}</p>
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="group relative"
            aria-label={t('voice.answer')}
          >
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-sm font-medium text-white">{t('voice.answer')}</p>
          </button>

          {/* Ignore Button */}
          <button
            onClick={onIgnore}
            className="group relative"
            aria-label={t('voice.ignore')}
          >
            <div className="absolute inset-0 bg-gray-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-16 h-16 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl">
              <X className="w-8 h-8 text-white" />
            </div>
            <p className="mt-3 text-sm font-medium text-white">{t('voice.ignore')}</p>
          </button>
        </div>

        {/* Priority Badge */}
        {call.metadata?.priority && call.metadata.priority !== 'normal' && (
          <div className="mt-8">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                call.metadata.priority === 'urgent'
                  ? 'bg-red-500 text-white'
                  : call.metadata.priority === 'high'
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {call.metadata.priority === 'urgent' && `🚨 ${t('voice.priority.urgent')}`}
              {call.metadata.priority === 'high' && `⚡ ${t('voice.priority.high')}`}
              {call.metadata.priority === 'low' && `📌 ${t('voice.priority.normal')}`}
            </span>
          </div>
        )}

        {/* Notes */}
        {call.metadata?.notes && (
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-sm text-white">{call.metadata.notes}</p>
          </div>
        )}
      </div>

      {/* Close button (top right) */}
      <button
        onClick={onIgnore}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label={t('voice.close')}
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default IncomingCallModal;


