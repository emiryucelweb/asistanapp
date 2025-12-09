 

/**
 * Voice Call Service - WebRTC Arama Servisi
 * Sunucu üzerinden geçen sesli arama yönetimi
 */
import { apiService } from './api-service';
import type { VoiceCall, CallStatus, CallMediaState } from '../types';
import { logger } from '@/shared/utils/logger';

export class VoiceCallService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private mediaState: CallMediaState = {
    audio: {
      muted: false,
      volume: 1,
    },
    recording: {
      isRecording: false,
    },
    connection: {
      quality: 'excellent',
      latency: 0,
      packetLoss: 0,
    },
  };

  /**
   * Initialize WebRTC connection
   */
  async initializeCall(callId: string): Promise<void> {
    try {
      // Get local media stream (audio only)
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // TODO: Add TURN server config from backend
        ],
      });

      // Add local stream to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      // Handle remote stream
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await apiService.post(`/api/voice/calls/${callId}/ice-candidate`, {
            candidate: event.candidate,
          });
        }
      };

      // Monitor connection quality
      this.monitorConnectionQuality();
    } catch (error) {
      logger.error('Failed to initialize call', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Answer incoming call
   */
  async answerCall(callId: string): Promise<void> {
    try {
      await this.initializeCall(callId);

      // Get offer from server
      const response = await apiService.get<{ offer: RTCSessionDescriptionInit }>(
        `/api/voice/calls/${callId}/offer`
      );

      await this.peerConnection!.setRemoteDescription(
        new RTCSessionDescription(response.data.offer)
      );

      // Create answer
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);

      // Send answer to server
      await apiService.post(`/api/voice/calls/${callId}/answer`, {
        answer,
      });
    } catch (error) {
      logger.error('Failed to answer call', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Make outbound call
   */
  async makeCall(phoneNumber: string, metadata?: Record<string, any>): Promise<string> {
    try {
      // Create call on server
      const response = await apiService.post<{ callId: string }>('/api/voice/calls', {
        phoneNumber,
        metadata,
      });

      const callId = response.data.callId;

      await this.initializeCall(callId);

      // Create offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      // Send offer to server
      await apiService.post(`/api/voice/calls/${callId}/offer`, {
        offer,
      });

      return callId;
    } catch (error) {
      logger.error('Failed to make call', error as Error, { phoneNumber, metadata });
      throw error;
    }
  }

  /**
   * End call
   */
  async endCall(callId: string): Promise<void> {
    try {
      // Notify server
      await apiService.post(`/api/voice/calls/${callId}/end`, {});

      // Close peer connection
      this.cleanup();
    } catch (error) {
      logger.error('Failed to end call', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.mediaState.audio.muted = !audioTrack.enabled;
        return this.mediaState.audio.muted;
      }
    }
    return false;
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.mediaState.audio.volume = Math.max(0, Math.min(1, volume));
    // TODO: Apply volume to remote audio element
  }

  /**
   * Put call on hold
   */
  async holdCall(callId: string): Promise<void> {
    try {
      // Mute local audio
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      await apiService.post(`/api/voice/calls/${callId}/hold`, {});
    } catch (error) {
      logger.error('Failed to hold call', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Resume call from hold
   */
  async resumeCall(callId: string): Promise<void> {
    try {
      // Unmute local audio
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }

      await apiService.post(`/api/voice/calls/${callId}/resume`, {});
    } catch (error) {
      logger.error('Failed to resume call', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Transfer call to another agent
   */
  async transferCall(
    callId: string,
    targetAgentId: string,
    transferType: 'blind' | 'attended',
    notes?: string
  ): Promise<void> {
    try {
      await apiService.post(`/api/voice/calls/${callId}/transfer`, {
        targetAgentId,
        transferType,
        notes,
      });

      // If blind transfer, cleanup immediately
      if (transferType === 'blind') {
        this.cleanup();
      }
    } catch (error) {
      logger.error('Failed to transfer call', error as Error, { callId, targetAgentId, transferType });
      throw error;
    }
  }

  /**
   * Start recording
   */
  async startRecording(callId: string): Promise<void> {
    try {
      await apiService.post(`/api/voice/calls/${callId}/recording/start`, {});
      this.mediaState.recording.isRecording = true;
      this.mediaState.recording.startTime = new Date().toISOString();
    } catch (error) {
      logger.error('Failed to start recording', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(callId: string): Promise<void> {
    try {
      await apiService.post(`/api/voice/calls/${callId}/recording/stop`, {});
      this.mediaState.recording.isRecording = false;
      this.mediaState.recording.startTime = undefined;
      this.mediaState.recording.duration = undefined;
    } catch (error) {
      logger.error('Failed to stop recording', error as Error, { callId });
      throw error;
    }
  }

  /**
   * Get media state
   */
  getMediaState(): CallMediaState {
    return { ...this.mediaState };
  }

  /**
   * Monitor connection quality
   */
  private monitorConnectionQuality(): void {
    if (!this.peerConnection) return;

    const interval = setInterval(async () => {
      if (!this.peerConnection) {
        clearInterval(interval);
        return;
      }

      const stats = await this.peerConnection.getStats();
      let totalPacketsLost = 0;
      let totalPackets = 0;
      let rtt = 0;

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' && report.kind === 'audio') {
          totalPacketsLost += report.packetsLost || 0;
          totalPackets += report.packetsReceived || 0;
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          rtt = report.currentRoundTripTime * 1000 || 0;
        }
      });

      const packetLossPercentage = totalPackets > 0 ? (totalPacketsLost / totalPackets) * 100 : 0;

      this.mediaState.connection.latency = Math.round(rtt);
      this.mediaState.connection.packetLoss = packetLossPercentage;

      // Determine quality
      if (rtt < 100 && packetLossPercentage < 1) {
        this.mediaState.connection.quality = 'excellent';
      } else if (rtt < 200 && packetLossPercentage < 3) {
        this.mediaState.connection.quality = 'good';
      } else if (rtt < 300 && packetLossPercentage < 5) {
        this.mediaState.connection.quality = 'fair';
      } else {
        this.mediaState.connection.quality = 'poor';
      }
    }, 1000);
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
  }

  /**
   * Get call history
   */
  async getCallHistory(filters?: {
    type?: 'inbound' | 'outbound' | 'internal';
    status?: CallStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<VoiceCall[]> {
    try {
      const response = await apiService.get<{ calls: VoiceCall[] }>('/api/voice/calls/history', {
        params: filters,
      });
      return response.data.calls;
    } catch (error) {
      logger.error('Failed to get call history', error as Error, { filters });
      return [];
    }
  }

  /**
   * Get active calls
   */
  async getActiveCalls(): Promise<VoiceCall[]> {
    try {
      const response = await apiService.get<{ calls: VoiceCall[] }>('/api/voice/calls/active');
      return response.data.calls;
    } catch (error) {
      logger.error('Failed to get active calls', error as Error);
      return [];
    }
  }
}

// Singleton instance
export const voiceCallService = new VoiceCallService();


