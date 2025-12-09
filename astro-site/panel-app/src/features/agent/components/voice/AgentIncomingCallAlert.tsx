/**
 * Agent Incoming Call Alert - URGENT Call Screen for Agents
 * 
 * Full-screen alert with AI conversation summary
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, PhoneOff, User, MessageSquare, Clock, AlertTriangle, Bot } from 'lucide-react';
import type { VoiceCall } from '@/types';
import { logger } from '@/shared/utils/logger';

interface AgentIncomingCallAlertProps {
  call: VoiceCall; // Includes AI handling info
  onAccept: () => void;
  onReject: () => void;
  takenByOtherAgent?: { name: string; timestamp: Date };
}

const AgentIncomingCallAlert: React.FC<AgentIncomingCallAlertProps> = ({
  call,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation('agent');
  const aiSummary = call.aiHandling?.aiSummary;
  const [ringDuration, setRingDuration] = useState(0);
  const [_isExpanded, _setIsExpanded] = useState(false);

  useEffect(() => {
    // Ring duration counter
    const interval = setInterval(() => {
      setRingDuration((prev) => prev + 1);
    }, 1000);

    // Auto-reject after 30 seconds
    const timeout = setTimeout(() => {
      onReject();
    }, 30000);

    // Play ring sound
    const audio = new Audio('/sounds/incoming-call.mp3');
    audio.loop = true;
    audio.play().catch((err) => logger.error('Failed to play ring sound', err));

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onReject]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'negative':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4">
      {/* Main Alert Card */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('voice.aiHandoff.title')}</h3>
                <p className="text-sm text-white/80">
                  {call.aiHandling?.aiStuckReason || t('voice.aiHandoff.defaultReason')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-white">{formatDuration(ringDuration)}</p>
              <p className="text-xs text-white/70">{t('voice.waiting')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Caller Info */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            {call.caller.avatar ? (
              <img
                src={call.caller.avatar}
                alt={call.caller.name}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-700 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{call.caller.name}</h4>
              {call.caller.phoneNumber && (
                <p className="text-lg text-gray-600 dark:text-gray-400">{call.caller.phoneNumber}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                  {call.callType === 'internal' ? `📞 ${t('voice.internalCall')}` : `📱 ${t('voice.externalCall')}`}
                </span>
                {call.metadata?.priority && call.metadata.priority !== 'normal' && (
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      call.metadata.priority === 'urgent'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}
                  >
                    {call.metadata.priority === 'urgent' ? `🚨 ${t('voice.priority.urgent')}` : `⚡ ${t('voice.priority.high')}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI conversation duration */}
          {call.aiHandling?.aiDuration && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 text-sm">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {t('voice.aiHandoff.talkedFor')} <strong className="text-purple-700 dark:text-purple-300">{Math.floor(call.aiHandling.aiDuration / 60)}:{(call.aiHandling.aiDuration % 60).toString().padStart(2, '0')}</strong>
                </span>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {aiSummary && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h5 className="font-semibold text-gray-900 dark:text-white">{t('voice.aiHandoff.summary')}</h5>
              </div>

              {/* AI conversation context */}
              {aiSummary.conversationContext && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💬 {t('voice.aiHandoff.whatDiscussed')}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white italic">
                    "{aiSummary.conversationContext}"
                  </p>
                </div>
              )}

              {/* Neden tıkandı */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                      {t('voice.aiHandoff.whyStuck')}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {aiSummary.stuckReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Intent */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('voice.aiHandoff.customerIntent')}
                    </p>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {aiSummary.customerIntent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentiment & Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${getSentimentColor(aiSummary.sentiment)}`}>
                  <p className="text-xs font-medium mb-1">{t('voice.aiHandoff.customerMood')}</p>
                  <p className="text-lg font-bold">
                    {getSentimentEmoji(aiSummary.sentiment)}{' '}
                    {aiSummary.sentiment === 'positive'
                      ? t('voice.aiHandoff.sentiment.positive')
                      : aiSummary.sentiment === 'negative'
                      ? t('voice.aiHandoff.sentiment.negative')
                      : t('voice.aiHandoff.sentiment.neutral')}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('voice.aiHandoff.previousInteractions')}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {aiSummary.previousInteractions}
                    </p>
                  </div>
                  {aiSummary.lastInteractionDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('voice.aiHandoff.last')}: {aiSummary.lastInteractionDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Notes */}
              {aiSummary.quickNotes && aiSummary.quickNotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    💡 {t('voice.aiHandoff.quickNotes')}
                  </p>
                  <div className="space-y-1">
                    {aiSummary.quickNotes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800"
                      >
                        <span className="text-yellow-600 dark:text-yellow-400">•</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Response */}
              {aiSummary.suggestedResponse && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ✨ {t('voice.aiHandoff.suggestedResponse')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{aiSummary.suggestedResponse}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Notes */}
          {call.metadata?.notes && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📝 {t('voice.aiHandoff.notes')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{call.metadata.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-4">
            {/* Reject Button */}
            <button
              onClick={onReject}
              className="flex-1 max-w-xs py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg"
            >
              <PhoneOff className="w-6 h-6" />
              <span>{t('voice.reject')}</span>
            </button>

            {/* Accept Button */}
            <button
              onClick={onAccept}
              className="flex-1 max-w-xs py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg animate-pulse"
            >
              <Phone className="w-6 h-6" />
              <span className="text-lg">{t('voice.answer').toUpperCase()}</span>
            </button>
          </div>

          {/* Auto-reject warning */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            ⏱️ {t('voice.aiHandoff.autoReject', { seconds: 30 - ringDuration })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentIncomingCallAlert;

