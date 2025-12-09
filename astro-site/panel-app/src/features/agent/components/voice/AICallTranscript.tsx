/**
 * AI Call Transcript - Transcript of AI Conversation
 * 
 * Shows AI conversation history when agent takes over the call
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, User, Clock } from 'lucide-react';
import type { AITranscript } from '@/types';
import { formatTime } from '@/features/agent/utils/locale';

interface AICallTranscriptProps {
  transcript: AITranscript[];
  isOpen: boolean;
  onClose: () => void;
}

const AICallTranscript: React.FC<AICallTranscriptProps> = ({ transcript, isOpen, onClose }) => {
  const { t, i18n } = useTranslation('agent');
  
  if (!isOpen) return null;

  const formatTimestamp = (timestamp: string) => {
    return formatTime(new Date(timestamp), i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'negative':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('voice.aiHandoff.transcript')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('voice.aiHandoff.transcriptCount', { count: transcript.length })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={t('common.close')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Transcript */}
        <div className="p-6 max-h-[calc(80vh-180px)] overflow-y-auto space-y-4">
          {transcript.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${getSentimentColor(item.sentiment)}`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.speaker === 'ai'
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {item.speaker === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.speaker === 'ai' ? t('voice.aiHandoff.aiAssistant') : t('voice.aiHandoff.customer')}
                    </span>
                    {item.intent && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                        {item.intent}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">{item.text}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.sentiment && (
                      <>
                        <span>•</span>
                        <span>
                          {item.sentiment === 'positive' 
                            ? `😊 ${t('voice.aiHandoff.sentiment.positive')}`
                            : item.sentiment === 'negative' 
                            ? `😟 ${t('voice.aiHandoff.sentiment.negative')}` 
                            : `😐 ${t('voice.aiHandoff.sentiment.neutral')}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {t('voice.aiHandoff.transcriptDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICallTranscript;


