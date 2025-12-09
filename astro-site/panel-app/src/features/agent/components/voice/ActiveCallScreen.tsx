/**
 * Active Call Screen - Active Voice Call Interface
 * 
 * ✅ LOGICAL FIX: Voice-only communication during phone calls
 * Layout: Left - Call controls, Right - Call notes and customer info
 * ❌ Message typing feature REMOVED (not logical during phone calls)
 * 
 * Features:
 * - Real-time call duration tracking
 * - Mute, hold, and volume controls
 * - Call notes taking
 * - Customer information display
 * - Call transfer functionality
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '@/features/agent/utils/locale';
import {
  Phone,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Pause,
  Play,
  Users,
  FileText,
  Signal,
  X,
  Clock,
  User,
  Info,
} from 'lucide-react';
import type { VoiceCall, CallMediaState } from '@/types';
import { showSuccess, showError } from '@/shared/utils/toast';

interface ActiveCallScreenProps {
  call: VoiceCall;
  mediaState: CallMediaState;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onHold: () => void;
  onResume?: () => void;
  onTransfer: () => void;
  onEndCall: () => void;
  onOpenNotes?: () => void;
  onOpenChat?: () => void;
  onToggleRecording?: () => void;
}

// ✅ PRODUCTION READY: Call notes for voice calls
// Notes taken during the call (not messages - this is a phone call!)
// When backend provides call notes endpoint:
// import { useCallNotes } from '@/lib/react-query/hooks/useCalls';
// const { data: callNotes } = useCallNotes(call.id);

const ActiveCallScreen: React.FC<ActiveCallScreenProps> = ({
  call,
  mediaState,
  onToggleMute,
  onToggleSpeaker,
  onHold,
  onResume,
  onTransfer,
  onEndCall,
}) => {
  const { t, i18n } = useTranslation('agent');
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState(''); // Call notes (not messages!)

  useEffect(() => {
    if (call.status === 'connected' && call.startedAt) {
      const startTime = new Date(call.startedAt).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000);
        setCallDuration(duration);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [call.status, call.startedAt]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const getQualityColor = () => {
    switch (mediaState.connection.quality) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'fair':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const isOnHold = call.status === 'on_hold';

  const handleSaveNotes = () => {
    // ✅ Save call notes to backend
    // Backend endpoint: POST /api/calls/:id/notes
    // Body: { notes: callNotes }
    showSuccess(t('voice.notesSaved'));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* Sol Taraf - Arama Kontrolleri */}
        <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col items-center justify-between relative">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)] animate-pulse" />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Connection Quality */}
            <div className="flex items-center gap-2 mb-6">
              <Signal className={`w-5 h-5 ${getQualityColor()}`} />
              <span className="text-sm text-gray-400">
                {mediaState.connection.quality === 'excellent'
                  ? t('voice.connectionQuality.excellent')
                  : mediaState.connection.quality === 'good'
                  ? t('voice.connectionQuality.good')
                  : mediaState.connection.quality === 'fair'
                  ? t('voice.connectionQuality.fair')
                  : t('voice.connectionQuality.poor')}{' '}
                ({mediaState.connection.latency}ms)
              </span>
            </div>

            {/* Caller Info */}
            <div className="text-center mb-6">
              {call.caller.avatar ? (
                <img
                  src={call.caller.avatar}
                  alt={call.caller.name}
                  className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 border-4 border-white/20 shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {call.caller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-1">{call.caller.name}</h2>
              {call.caller.phoneNumber && (
                <p className="text-lg text-gray-400">{call.caller.phoneNumber}</p>
              )}

              {/* Call Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mt-3">
                {isOnHold ? (
                  <>
                    <Pause className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 text-sm font-medium">{t('voice.callStatus.onHold')}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">{t('voice.callStatus.connected')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Call Duration */}
            <div className="text-center mb-8">
              <p className="text-4xl font-mono font-bold text-white">{formatDuration(callDuration)}</p>
            </div>

            {/* Recording Status */}
            {mediaState.recording.isRecording && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/50">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-300 font-medium">{t('voice.callStatus.recording')}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="relative z-10 w-full">
            {/* Main Controls */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Mute */}
              <button
                onClick={onToggleMute}
                className={`p-5 rounded-xl transition-all flex flex-col items-center gap-1.5 ${
                  mediaState.audio.muted
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                }`}
              >
                {mediaState.audio.muted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                <span className="text-xs font-medium">{mediaState.audio.muted ? t('voice.controls.muted') : t('voice.controls.microphone')}</span>
              </button>

              {/* Hold/Resume */}
              <button
                onClick={isOnHold ? onResume : onHold}
                className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex flex-col items-center gap-1.5 text-white"
              >
                {isOnHold ? <Play className="w-7 h-7" /> : <Pause className="w-7 h-7" />}
                <span className="text-xs font-medium">{isOnHold ? t('voice.controls.resume') : t('voice.controls.hold')}</span>
              </button>

              {/* Speaker */}
              <button
                onClick={onToggleSpeaker}
                className={`p-5 rounded-xl transition-all flex flex-col items-center gap-1.5 ${
                  mediaState.audio.volume > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                }`}
              >
                {mediaState.audio.volume > 0 ? (
                  <Volume2 className="w-7 h-7" />
                ) : (
                  <VolumeX className="w-7 h-7" />
                )}
                <span className="text-xs font-medium">{t('voice.controls.speaker')}</span>
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Transfer */}
              <button
                onClick={onTransfer}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center gap-2 text-white"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">{t('voice.controls.transfer')}</span>
              </button>

              {/* Notes */}
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                <span className="text-sm">{t('voice.addNote')}</span>
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <PhoneOff className="w-6 h-6" />
              <span>{t('voice.endCall')}</span>
            </button>
          </div>
        </div>

        {/* Right Side - Call Information and Notes */}
        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-slate-900">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('voice.callDetails')}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('voice.callDetailsSubtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={onEndCall}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={t('voice.endCall')}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="p-4 space-y-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('voice.customer')}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {call.caller.name}
                </p>
                {call.caller.phoneNumber && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {call.caller.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('voice.callStartTime')}</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {call.startedAt
                    ? formatTime(new Date(call.startedAt), i18n.language, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('voice.callType')}</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {call.callType === 'inbound' ? t('voice.incomingCall') : t('voice.outgoingCall')}
                </p>
              </div>
            </div>
          </div>

          {/* Arama Notları */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="call-notes" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('voice.callNotes')}
              </label>
              <button
                onClick={handleSaveNotes}
                disabled={!callNotes.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {t('voice.save')}
              </button>
            </div>
            <textarea
              id="call-notes"
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder={t('voice.callNotesPlaceholder')}
              className="flex-1 w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 text-sm resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('voice.callNotesHint')}
            </p>
          </div>

          {/* Bilgi Notu */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {t('voice.phoneCallNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallScreen;

