/**
 * CallModal Component - Voice/Video Call Interface
 * 
 * Enterprise-grade real-time communication modal
 * Implements WebRTC-ready UI with full call controls
 * 
 * Features:
 * - Voice/Video call support
 * - Mic/Video/Speaker mute controls
 * - Call duration timer
 * - Connection status indication
 * - Accessibility compliant (WCAG 2.1 AA)
 * 
 * @see https://webrtc.org/
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
} from 'lucide-react';
import type { TeamChannel } from '@/types';

interface CallModalProps {
  /**
   * Call type: 'voice' or 'video'
   */
  callType: 'voice' | 'video';
  
  /**
   * Current call status
   */
  callStatus: 'calling' | 'connected' | 'ended';
  
  /**
   * Active channel for the call
   */
  selectedChannel: TeamChannel | null;
  
  /**
   * Call duration in seconds
   */
  callDuration: number;
  
  /**
   * Call control states
   */
  isMicMuted: boolean;
  isVideoOff: boolean;
  isSpeakerMuted: boolean;
  
  /**
   * State setters
   */
  setIsMicMuted: (muted: boolean) => void;
  setIsVideoOff: (off: boolean) => void;
  setIsSpeakerMuted: (muted: boolean) => void;
  setCallStatus: (status: 'calling' | 'connected' | 'ended') => void;
  setShowCallModal: (show: 'voice' | 'video' | null) => void;
}

/**
 * Format call duration to MM:SS format
 * 
 * @param seconds Total call duration in seconds
 * @returns Formatted string (e.g., "05:42")
 */
function formatCallDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * CallModal - Professional call interface with full controls
 */
export function CallModal(props: CallModalProps) {
  const { t } = useTranslation('admin');
  const {
    callType,
    callStatus,
    selectedChannel,
    callDuration,
    isMicMuted,
    isVideoOff,
    isSpeakerMuted,
    setIsMicMuted,
    setIsVideoOff,
    setIsSpeakerMuted,
    setCallStatus,
    setShowCallModal,
  } = props;

  /**
   * Handle call end
   * Implements graceful call termination with 1s delay for UX
   */
  const handleEndCall = () => {
    setCallStatus('ended');
    
    // Close modal after 1 second to show "ended" state
    setTimeout(() => {
      setShowCallModal(null);
    }, 1000);
  };

  /**
   * Get status text based on call status
   */
  const getStatusText = (): string => {
    switch (callStatus) {
      case 'calling':
        return t('team.modals.call.calling');
      case 'connected':
        return formatCallDuration(callDuration);
      case 'ended':
        return t('team.modals.call.callEnded');
      default:
        return '';
    }
  };

  /**
   * Get avatar background color based on status
   */
  const getAvatarColorClass = (): string => {
    switch (callStatus) {
      case 'calling':
        return 'bg-blue-500/30 animate-pulse';
      case 'connected':
        return 'bg-green-500/30';
      case 'ended':
        return 'bg-red-500/30';
      default:
        return 'bg-blue-500/30';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-blue-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-modal-title"
      aria-describedby="call-modal-description"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center">
          {/* Avatar/Icon Section */}
          <div className={`w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center relative ${getAvatarColorClass()}`}>
            {callType === 'voice' ? (
              <Phone 
                className="w-14 h-14 text-white" 
                aria-hidden="true"
              />
            ) : (
              <Video 
                className="w-14 h-14 text-white" 
                aria-hidden="true"
              />
            )}
            
            {/* Connected indicator */}
            {callStatus === 'connected' && (
              <div 
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white/10"
                aria-label={t('team.connected')}
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* Channel Name */}
          <h3 
            id="call-modal-title"
            className="text-2xl font-bold text-white mb-2"
          >
            {selectedChannel?.name || t('teamChat.modals.call.unknown')}
          </h3>

          {/* Call Status/Duration */}
          <p 
            id="call-modal-description"
            className="text-white/70 text-lg mb-8"
            aria-live="polite"
            aria-atomic="true"
          >
            {getStatusText()}
          </p>

          {/* Control Buttons */}
          {callStatus !== 'ended' && (
            <div 
              className="flex gap-4 justify-center mb-6"
              role="group"
              aria-label={t('team.callControls')}
            >
              {/* Microphone Toggle */}
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-4 rounded-full transition-all ${
                  isMicMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label={isMicMuted ? t('team.modals.call.micUnmute') : t('team.modals.call.micMute')}
                aria-pressed={isMicMuted}
                type="button"
              >
                {isMicMuted ? (
                  <MicOff className="w-6 h-6 text-white" aria-hidden="true" />
                ) : (
                  <Mic className="w-6 h-6 text-white" aria-hidden="true" />
                )}
              </button>

              {/* Video Toggle (only for video calls) */}
              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-full transition-all ${
                    isVideoOff
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  aria-label={isVideoOff ? t('team.modals.call.videoOn') : t('team.modals.call.videoOff')}
                  aria-pressed={isVideoOff}
                  type="button"
                >
                  {isVideoOff ? (
                    <VideoOff className="w-6 h-6 text-white" aria-hidden="true" />
                  ) : (
                    <Video className="w-6 h-6 text-white" aria-hidden="true" />
                  )}
                </button>
              )}

              {/* Speaker Toggle */}
              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className={`p-4 rounded-full transition-all ${
                  isSpeakerMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label={isSpeakerMuted ? t('team.modals.call.speakerUnmute') : t('team.modals.call.speakerMute')}
                aria-pressed={isSpeakerMuted}
                type="button"
              >
                {isSpeakerMuted ? (
                  <VolumeX className="w-6 h-6 text-white" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" aria-hidden="true" />
                )}
              </button>
            </div>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-full px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label={t('team.endCall')}
            type="button"
          >
            <PhoneOff className="w-6 h-6" aria-hidden="true" />
            {t('teamChat.modals.call.endCall')}
          </button>
        </div>
      </div>
    </div>
  );
}

