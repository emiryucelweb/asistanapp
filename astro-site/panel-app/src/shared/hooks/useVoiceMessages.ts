/* =========================================
   useVoiceMessages Hook
   Comprehensive voice message management
   Production-ready with robust error handling
========================================= */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  VoiceMessage, 
  TranscriptionResult,
  voiceTranscriptionService,
  TranscriptionOptions
} from '@/services/voice-transcription';

interface UseVoiceMessagesOptions {
  autoTranscribe?: boolean;
  transcriptionOptions?: TranscriptionOptions;
  maxConcurrentPlayers?: number;
  preloadAudio?: boolean;
  enableAnalytics?: boolean;
}

interface VoiceMessageState extends VoiceMessage {
  audioElement?: HTMLAudioElement;
  isLoading?: boolean;
  error?: string;
  downloadProgress?: number;
}

interface VoiceMessagesAnalytics {
  totalMessages: number;
  totalDuration: number;
  averageDuration: number;
  transcribedCount: number;
  transcriptionAccuracy: number;
  languageBreakdown: Record<string, number>;
  playbackStats: {
    totalPlays: number;
    averageListenTime: number;
    completionRate: number;
  };
}

export const useVoiceMessages = (options: UseVoiceMessagesOptions = {}) => {
  const {
    autoTranscribe = false,
    transcriptionOptions = {},
    maxConcurrentPlayers = 3,
    preloadAudio = false,
    enableAnalytics = true
  } = options;

  // State management
  const [voiceMessages, setVoiceMessages] = useState<Map<string, VoiceMessageState>>(new Map());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<VoiceMessagesAnalytics>({
    totalMessages: 0,
    totalDuration: 0,
    averageDuration: 0,
    transcribedCount: 0,
    transcriptionAccuracy: 0,
    languageBreakdown: {},
    playbackStats: {
      totalPlays: 0,
      averageListenTime: 0,
      completionRate: 0
    }
  });

  // Refs for cleanup
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const playbackDataRef = useRef<Map<string, { startTime: number; totalTime: number; completions: number }>>(new Map());

  // Initialize voice message
  const initializeVoiceMessage = useCallback((voiceMessage: VoiceMessage): VoiceMessageState => {
    const audio = new Audio(voiceMessage.audioUrl);
    audio.preload = preloadAudio ? 'auto' : 'metadata';
    
    audioElementsRef.current.set(voiceMessage.id, audio);
    
    const state: VoiceMessageState = {
      ...voiceMessage,
      audioElement: audio,
      isLoading: false,
      error: undefined,
      downloadProgress: 0
    };

    // Set up audio event listeners
    audio.addEventListener('loadstart', () => {
      updateVoiceMessage(voiceMessage.id, { isLoading: true, error: undefined });
    });

    audio.addEventListener('canplaythrough', () => {
      updateVoiceMessage(voiceMessage.id, { isLoading: false });
    });

    audio.addEventListener('error', () => {
      updateVoiceMessage(voiceMessage.id, { 
        isLoading: false, 
        error: 'Ses dosyası yüklenemedi' 
      });
    });

    audio.addEventListener('play', () => {
      setCurrentlyPlaying(prev => new Set([...prev, voiceMessage.id]));
      
      // Track playback start
      if (enableAnalytics) {
        playbackDataRef.current.set(voiceMessage.id, {
          startTime: Date.now(),
          totalTime: 0,
          completions: 0
        });
      }
    });

    audio.addEventListener('pause', () => {
      setCurrentlyPlaying(prev => {
        const newSet = new Set(prev);
        newSet.delete(voiceMessage.id);
        return newSet;
      });
    });

    audio.addEventListener('ended', () => {
      setCurrentlyPlaying(prev => {
        const newSet = new Set(prev);
        newSet.delete(voiceMessage.id);
        return newSet;
      });

      // Track completion
      if (enableAnalytics) {
        const playbackData = playbackDataRef.current.get(voiceMessage.id);
        if (playbackData) {
          playbackData.completions++;
          updateAnalytics();
        }
      }
    });

    audio.addEventListener('timeupdate', () => {
      // Track listening time
      if (enableAnalytics) {
        const playbackData = playbackDataRef.current.get(voiceMessage.id);
        if (playbackData) {
          playbackData.totalTime = Date.now() - playbackData.startTime;
        }
      }
    });

    return state;
     
    // TODO: Refactor - updateAnalytics and updateVoiceMessage create circular dependency
    // Consider using useRef or restructuring hook to avoid this
  }, [preloadAudio, enableAnalytics]);

  // Update voice message state
  const updateVoiceMessage = useCallback((id: string, updates: Partial<VoiceMessageState>) => {
    setVoiceMessages(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return newMap;
    });
  }, []);

  // Add voice message
  const addVoiceMessage = useCallback((voiceMessage: VoiceMessage) => {
    const state = initializeVoiceMessage(voiceMessage);
    setVoiceMessages(prev => new Map([...prev, [voiceMessage.id, state]]));

    // Auto transcribe if enabled
    if (autoTranscribe) {
      transcribeVoiceMessage(voiceMessage.id);
    }

    // Update analytics
     
    // TODO: Missing deps - transcribeVoiceMessage, updateAnalytics (circular dependency)
    if (enableAnalytics) {
      updateAnalytics();
    }
  }, [autoTranscribe, initializeVoiceMessage, enableAnalytics]);

  // Remove voice message
  const removeVoiceMessage = useCallback((id: string) => {
    const audioElement = audioElementsRef.current.get(id);
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      audioElementsRef.current.delete(id);
    }

    playbackDataRef.current.delete(id);
    
    setVoiceMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });

    setCurrentlyPlaying(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

     
    // TODO: Missing dep - updateAnalytics (defined later)
    if (enableAnalytics) {
      updateAnalytics();
    }
  }, [enableAnalytics]);

  // Play voice message
  const playVoiceMessage = useCallback(async (id: string) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return false;

    try {
      // Stop other players if at limit
      if (currentlyPlaying.size >= maxConcurrentPlayers) {
        const firstPlaying = Array.from(currentlyPlaying)[0];
        pauseVoiceMessage(firstPlaying);
      }

      await voiceMessage.audioElement.play();
      return true;
    } catch (err: unknown) {
     
    // TODO: Missing deps - pauseVoiceMessage, updateVoiceMessage (circular dependency)
      updateVoiceMessage(id, { error: 'Ses oynatılamadı' });
      return false;
    }
  }, [voiceMessages, currentlyPlaying, maxConcurrentPlayers]);

  // Pause voice message
  const pauseVoiceMessage = useCallback((id: string) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return;

    voiceMessage.audioElement.pause();
  }, [voiceMessages]);

  // Stop voice message
  const stopVoiceMessage = useCallback((id: string) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return;

    voiceMessage.audioElement.pause();
    voiceMessage.audioElement.currentTime = 0;
  }, [voiceMessages]);

  // Pause all voice messages
  const pauseAll = useCallback(() => {
    currentlyPlaying.forEach(id => {
      pauseVoiceMessage(id);
    });
  }, [currentlyPlaying, pauseVoiceMessage]);

  // Set volume for voice message
  const setVolume = useCallback((id: string, volume: number) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return;

    voiceMessage.audioElement.volume = Math.max(0, Math.min(1, volume));
  }, [voiceMessages]);

  // Set playback rate for voice message
  const setPlaybackRate = useCallback((id: string, rate: number) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return;

    voiceMessage.audioElement.playbackRate = Math.max(0.25, Math.min(4, rate));
  }, [voiceMessages]);

  // Seek to position
  const seekTo = useCallback((id: string, time: number) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage?.audioElement) return;

    const duration = voiceMessage.audioElement.duration || voiceMessage.duration;
    voiceMessage.audioElement.currentTime = Math.max(0, Math.min(time, duration));
  }, [voiceMessages]);

  // Transcribe voice message
  const transcribeVoiceMessage = useCallback(async (id: string): Promise<TranscriptionResult | null> => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage) return null;

    try {
      updateVoiceMessage(id, { isLoading: true });
      
      const result = await voiceTranscriptionService.transcribeAudio(
        voiceMessage.audioUrl,
        id,
        transcriptionOptions
      );

      updateVoiceMessage(id, { 
        transcription: result,
        isLoading: false 
      });

      if (enableAnalytics) {
        updateAnalytics();
      }

      return result;
    } catch (err: unknown) {
      updateVoiceMessage(id, { 
        error: 'Transkripsiyon başarısız oldu',
     
    // TODO: Missing deps - updateAnalytics, updateVoiceMessage (circular dependency)
        isLoading: false 
      });
      return null;
    }
  }, [voiceMessages, transcriptionOptions, enableAnalytics]);

  // Download voice message
  const downloadVoiceMessage = useCallback(async (id: string, filename?: string) => {
    const voiceMessage = voiceMessages.get(id);
    if (!voiceMessage) return false;

    try {
      updateVoiceMessage(id, { downloadProgress: 0 });

      const response = await fetch(voiceMessage.audioUrl);
      const reader = response.body?.getReader();
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      if (!reader) throw new Error('Failed to read response');

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

     
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const progress = contentLength > 0 ? (receivedLength / contentLength) * 100 : 0;
        updateVoiceMessage(id, { downloadProgress: progress });
      }

      const blob = new Blob(chunks as BlobPart[], { type: voiceMessage.mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `voice-message-${id}.${voiceMessage.mimeType.split('/')[1]}`;
      a.click();
      
      URL.revokeObjectURL(url);
      updateVoiceMessage(id, { downloadProgress: undefined });
      
      return true;
    } catch (err: unknown) {
      updateVoiceMessage(id, { 
     
    // TODO: Missing dep - updateVoiceMessage (circular dependency)
        error: 'İndirme başarısız oldu',
        downloadProgress: undefined 
      });
      return false;
    }
  }, [voiceMessages]);

  // Update analytics
  const updateAnalytics = useCallback(() => {
    if (!enableAnalytics) return;

    const messages = Array.from(voiceMessages.values());
    const playbackData = Array.from(playbackDataRef.current.values());
    
    const totalMessages = messages.length;
    const totalDuration = messages.reduce((sum, msg) => sum + msg.duration, 0);
    const averageDuration = totalMessages > 0 ? totalDuration / totalMessages : 0;
    
    const transcribedMessages = messages.filter(msg => msg.transcription?.status === 'completed');
    const transcribedCount = transcribedMessages.length;
    const transcriptionAccuracy = transcribedCount > 0 
      ? transcribedMessages.reduce((sum, msg) => sum + (msg.transcription?.confidence || 0), 0) / transcribedCount
      : 0;

    const languageBreakdown: Record<string, number> = {};
    transcribedMessages.forEach(msg => {
      const lang = msg.transcription?.language || 'unknown';
      languageBreakdown[lang] = (languageBreakdown[lang] || 0) + 1;
    });

    const totalPlays = playbackData.length;
    const averageListenTime = totalPlays > 0 
      ? playbackData.reduce((sum, data) => sum + data.totalTime, 0) / totalPlays / 1000
      : 0;
    const completionRate = totalPlays > 0
      ? playbackData.reduce((sum, data) => sum + data.completions, 0) / totalPlays
      : 0;

    setAnalytics({
      totalMessages,
      totalDuration,
      averageDuration,
      transcribedCount,
      transcriptionAccuracy,
      languageBreakdown,
      playbackStats: {
        totalPlays,
        averageListenTime,
        completionRate
      }
    });
  }, [enableAnalytics, voiceMessages]);

  // Batch operations
  const addMultipleVoiceMessages = useCallback((messages: VoiceMessage[]) => {
    messages.forEach(message => addVoiceMessage(message));
  }, [addVoiceMessage]);

  const removeMultipleVoiceMessages = useCallback((ids: string[]) => {
    ids.forEach(id => removeVoiceMessage(id));
  }, [removeVoiceMessage]);

  const transcribeAll = useCallback(async (): Promise<TranscriptionResult[]> => {
    const messages = Array.from(voiceMessages.values());
    const untranscribed = messages.filter(msg => !msg.transcription);
    
    const results = await Promise.allSettled(
      untranscribed.map(msg => transcribeVoiceMessage(msg.id))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<TranscriptionResult> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }, [voiceMessages, transcribeVoiceMessage]);

  // Search and filter
  const searchVoiceMessages = useCallback((query: string): VoiceMessageState[] => {
    const searchTerm = query.toLowerCase();
    return Array.from(voiceMessages.values()).filter(msg => 
      msg.transcription?.text.toLowerCase().includes(searchTerm)
    );
  }, [voiceMessages]);

  const filterByLanguage = useCallback((language: string): VoiceMessageState[] => {
    return Array.from(voiceMessages.values()).filter(msg => 
      msg.transcription?.language === language
    );
  }, [voiceMessages]);

  const filterByDuration = useCallback((minDuration: number, maxDuration: number): VoiceMessageState[] => {
     
    // Note: Refs are stable and don't need to be in dependencies
    return Array.from(voiceMessages.values()).filter(msg => 
      msg.duration >= minDuration && msg.duration <= maxDuration
    );
  }, [voiceMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup all audio elements
      audioElementsRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElementsRef.current.clear();
      playbackDataRef.current.clear();
    };
  }, []);

  // Update analytics when voice messages change
  useEffect(() => {
    if (enableAnalytics) {
      updateAnalytics();
    }
  }, [voiceMessages, enableAnalytics, updateAnalytics]);

  return {
    // State
    voiceMessages: Array.from(voiceMessages.values()),
    currentlyPlaying: Array.from(currentlyPlaying),
    isLoading,
    error,
    analytics,

    // Actions
    addVoiceMessage,
    removeVoiceMessage,
    playVoiceMessage,
    pauseVoiceMessage,
    stopVoiceMessage,
    pauseAll,
    setVolume,
    setPlaybackRate,
    seekTo,
    transcribeVoiceMessage,
    downloadVoiceMessage,

    // Batch operations
    addMultipleVoiceMessages,
    removeMultipleVoiceMessages,
    transcribeAll,

    // Search and filter
    searchVoiceMessages,
    filterByLanguage,
    filterByDuration,

    // Utilities
    getVoiceMessage: (id: string) => voiceMessages.get(id),
    isPlaying: (id: string) => currentlyPlaying.has(id),
    clearError: () => setError(null),
    updateAnalytics
  };
};
