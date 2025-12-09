/**
 * Voice Call Service Tests
 * WebRTC voice calling functionality
 * 
 * @group services
 * @group voice
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VoiceCallService } from '../voice-call.service';
import { apiService } from '../api-service';
import { logger } from '@/shared/utils/logger';

// Mock dependencies
vi.mock('../api-service', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock WebRTC APIs
const mockMediaStream = {
  getTracks: vi.fn(() => [mockAudioTrack]),
  getAudioTracks: vi.fn(() => [mockAudioTrack]),
} as unknown as MediaStream;

const mockAudioTrack = {
  stop: vi.fn(),
  enabled: true,
} as unknown as MediaStreamTrack;

const mockPeerConnection = {
  addTrack: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  close: vi.fn(),
  getStats: vi.fn(),
  ontrack: null,
  onicecandidate: null,
} as unknown as RTCPeerConnection;

const mockRTCSessionDescription = class {
  constructor(public init: RTCSessionDescriptionInit) {}
} as unknown as typeof RTCSessionDescription;

describe('VoiceCallService', () => {
  let service: VoiceCallService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new VoiceCallService();

    // Mock global WebRTC APIs
    global.navigator = {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mockMediaStream),
      },
    } as any;

    global.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection) as any;
    global.RTCSessionDescription = mockRTCSessionDescription as any;

    // Reset mock implementations
    vi.mocked(mockMediaStream.getTracks).mockReturnValue([mockAudioTrack]);
    vi.mocked(mockMediaStream.getAudioTracks).mockReturnValue([mockAudioTrack]);
    mockAudioTrack.enabled = true;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initializeCall', () => {
    it('should initialize call with media stream and peer connection', async () => {
      // Act
      await service.initializeCall('call-123');

      // Assert
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      expect(global.RTCPeerConnection).toHaveBeenCalled();
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();
    });

    it('should handle getUserMedia errors', async () => {
      // Arrange
      const error = new Error('Permission denied');
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(service.initializeCall('call-456')).rejects.toThrow('Permission denied');
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to initialize call',
        error,
        { callId: 'call-456' }
      );
    });

    it('should configure ICE candidate handler', async () => {
      // Arrange
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.initializeCall('call-789');

      // Assert
      expect(mockPeerConnection.onicecandidate).toBeDefined();

      // Simulate ICE candidate event
      const mockCandidate = { candidate: 'ice-candidate-data' };
      await mockPeerConnection.onicecandidate!({ candidate: mockCandidate } as any);

      expect(apiService.post).toHaveBeenCalledWith(
        '/api/voice/calls/call-789/ice-candidate',
        { candidate: mockCandidate }
      );
    });

    it('should configure ontrack handler', async () => {
      // Act
      await service.initializeCall('call-xyz');

      // Assert
      expect(mockPeerConnection.ontrack).toBeDefined();
    });
  });

  describe('answerCall', () => {
    it('should answer incoming call successfully', async () => {
      // Arrange
      const mockOffer = { type: 'offer', sdp: 'offer-sdp' } as RTCSessionDescriptionInit;
      const mockAnswer = { type: 'answer', sdp: 'answer-sdp' } as RTCSessionDescriptionInit;

      vi.mocked(apiService.get).mockResolvedValueOnce({
        success: true,
        data: { offer: mockOffer },
      });
      vi.mocked(mockPeerConnection.createAnswer).mockResolvedValueOnce(mockAnswer as any);
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.answerCall('call-answer-123');

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/api/voice/calls/call-answer-123/offer');
      expect(mockPeerConnection.setRemoteDescription).toHaveBeenCalled();
      expect(mockPeerConnection.createAnswer).toHaveBeenCalled();
      expect(mockPeerConnection.setLocalDescription).toHaveBeenCalledWith(mockAnswer);
      expect(apiService.post).toHaveBeenCalledWith(
        '/api/voice/calls/call-answer-123/answer',
        { answer: mockAnswer }
      );
    });

    it('should handle answer call errors', async () => {
      // Arrange
      vi.mocked(apiService.get).mockRejectedValueOnce(new Error('Offer fetch failed'));

      // Act & Assert
      await expect(service.answerCall('call-error')).rejects.toThrow('Offer fetch failed');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('makeCall', () => {
    it('should make outbound call successfully', async () => {
      // Arrange
      const mockOffer = { type: 'offer', sdp: 'offer-sdp' } as RTCSessionDescriptionInit;

      vi.mocked(apiService.post)
        .mockResolvedValueOnce({ success: true, data: { callId: 'call-outbound-123' } })
        .mockResolvedValueOnce({ success: true, data: {} });

      vi.mocked(mockPeerConnection.createOffer).mockResolvedValueOnce(mockOffer as any);

      // Act
      const callId = await service.makeCall('+1234567890', { customerId: 'cust-1' });

      // Assert
      expect(callId).toBe('call-outbound-123');
      expect(apiService.post).toHaveBeenCalledWith('/api/voice/calls', {
        phoneNumber: '+1234567890',
        metadata: { customerId: 'cust-1' },
      });
      expect(mockPeerConnection.createOffer).toHaveBeenCalled();
      expect(apiService.post).toHaveBeenCalledWith(
        '/api/voice/calls/call-outbound-123/offer',
        { offer: mockOffer }
      );
    });

    it('should handle make call errors', async () => {
      // Arrange
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('Call creation failed'));

      // Act & Assert
      await expect(service.makeCall('+1234567890')).rejects.toThrow('Call creation failed');
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to make call',
        expect.any(Error),
        { phoneNumber: '+1234567890', metadata: undefined }
      );
    });
  });

  describe('endCall', () => {
    it('should end call and cleanup resources', async () => {
      // Arrange
      await service.initializeCall('call-end-123');
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.endCall('call-end-123');

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/api/voice/calls/call-end-123/end', {});
      expect(mockAudioTrack.stop).toHaveBeenCalled();
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should handle end call errors', async () => {
      // Arrange
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('End call failed'));

      // Act & Assert
      await expect(service.endCall('call-error')).rejects.toThrow('End call failed');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('toggleMute', () => {
    it('should mute audio when unmuted', async () => {
      // Arrange
      await service.initializeCall('call-mute-123');
      mockAudioTrack.enabled = true;

      // Act
      const isMuted = service.toggleMute();

      // Assert
      expect(isMuted).toBe(true);
      expect(mockAudioTrack.enabled).toBe(false);
    });

    it('should unmute audio when muted', async () => {
      // Arrange
      await service.initializeCall('call-unmute-123');
      mockAudioTrack.enabled = false;

      // Act
      const isMuted = service.toggleMute();

      // Assert
      expect(isMuted).toBe(false);
      expect(mockAudioTrack.enabled).toBe(true);
    });

    it('should return false when no stream available', () => {
      // Act (no initialization)
      const isMuted = service.toggleMute();

      // Assert
      expect(isMuted).toBe(false);
    });
  });

  describe('setVolume', () => {
    it('should set volume within valid range', () => {
      // Act
      service.setVolume(0.5);

      // Assert
      const state = service.getMediaState();
      expect(state.audio.volume).toBe(0.5);
    });

    it('should clamp volume to maximum 1', () => {
      // Act
      service.setVolume(1.5);

      // Assert
      const state = service.getMediaState();
      expect(state.audio.volume).toBe(1);
    });

    it('should clamp volume to minimum 0', () => {
      // Act
      service.setVolume(-0.5);

      // Assert
      const state = service.getMediaState();
      expect(state.audio.volume).toBe(0);
    });
  });

  describe('holdCall', () => {
    it('should hold call by disabling audio tracks', async () => {
      // Arrange
      await service.initializeCall('call-hold-123');
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.holdCall('call-hold-123');

      // Assert
      expect(mockAudioTrack.enabled).toBe(false);
      expect(apiService.post).toHaveBeenCalledWith('/api/voice/calls/call-hold-123/hold', {});
    });

    it('should handle hold errors', async () => {
      // Arrange
      await service.initializeCall('call-hold-error');
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('Hold failed'));

      // Act & Assert
      await expect(service.holdCall('call-hold-error')).rejects.toThrow('Hold failed');
    });
  });

  describe('resumeCall', () => {
    it('should resume call by enabling audio tracks', async () => {
      // Arrange
      await service.initializeCall('call-resume-123');
      mockAudioTrack.enabled = false;
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.resumeCall('call-resume-123');

      // Assert
      expect(mockAudioTrack.enabled).toBe(true);
      expect(apiService.post).toHaveBeenCalledWith('/api/voice/calls/call-resume-123/resume', {});
    });
  });

  describe('transferCall', () => {
    it('should transfer call to another agent (blind)', async () => {
      // Arrange
      await service.initializeCall('call-transfer-123');
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.transferCall('call-transfer-123', 'agent-5', 'blind', 'Customer needs sales');

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/api/voice/calls/call-transfer-123/transfer', {
        targetAgentId: 'agent-5',
        transferType: 'blind',
        notes: 'Customer needs sales',
      });
      expect(mockPeerConnection.close).toHaveBeenCalled(); // Cleanup on blind transfer
    });

    it('should not cleanup on attended transfer', async () => {
      // Arrange
      await service.initializeCall('call-attended-123');
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });
      vi.mocked(mockPeerConnection.close).mockClear();

      // Act
      await service.transferCall('call-attended-123', 'agent-6', 'attended');

      // Assert
      expect(mockPeerConnection.close).not.toHaveBeenCalled();
    });

    it('should handle transfer errors', async () => {
      // Arrange
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('Transfer failed'));

      // Act & Assert
      await expect(
        service.transferCall('call-error', 'agent-5', 'blind')
      ).rejects.toThrow('Transfer failed');
    });
  });

  describe('recording', () => {
    it('should start recording', async () => {
      // Arrange
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.startRecording('call-rec-123');

      // Assert
      const state = service.getMediaState();
      expect(state.recording.isRecording).toBe(true);
      expect(state.recording.startTime).toBeDefined();
      expect(apiService.post).toHaveBeenCalledWith(
        '/api/voice/calls/call-rec-123/recording/start',
        {}
      );
    });

    it('should stop recording', async () => {
      // Arrange
      await service.startRecording('call-rec-456');
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.stopRecording('call-rec-456');

      // Assert
      const state = service.getMediaState();
      expect(state.recording.isRecording).toBe(false);
      expect(state.recording.startTime).toBeUndefined();
    });

    it('should handle recording errors', async () => {
      // Arrange
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('Recording failed'));

      // Act & Assert
      await expect(service.startRecording('call-error')).rejects.toThrow('Recording failed');
    });
  });

  describe('getMediaState', () => {
    it('should return current media state', () => {
      // Act
      const state = service.getMediaState();

      // Assert
      expect(state).toBeDefined();
      expect(state.audio).toBeDefined();
      expect(state.recording).toBeDefined();
      expect(state.connection).toBeDefined();
    });

    it('should return copy of state', () => {
      // Act
      const state1 = service.getMediaState();
      const state2 = service.getMediaState();

      // Assert
      expect(state1).not.toBe(state2); // Different object references
      expect(state1.audio.muted).toBe(state2.audio.muted); // Same values
    });
  });

  describe('getCallHistory', () => {
    it('should fetch call history with filters', async () => {
      // Arrange
      const mockCalls = [
        { id: 'call-1', type: 'inbound', status: 'completed' },
        { id: 'call-2', type: 'outbound', status: 'completed' },
      ];
      vi.mocked(apiService.get).mockResolvedValueOnce({
        success: true,
        data: { calls: mockCalls },
      });

      // Act
      const result = await service.getCallHistory({
        type: 'inbound',
        status: 'ended',
        startDate: '2024-01-01',
      });

      // Assert
      expect(result).toEqual(mockCalls);
      expect(apiService.get).toHaveBeenCalledWith('/api/voice/calls/history', {
        params: {
          type: 'inbound',
          status: 'ended',
          startDate: '2024-01-01',
        },
      });
    });

    it('should return empty array on error', async () => {
      // Arrange
      vi.mocked(apiService.get).mockRejectedValueOnce(new Error('Fetch failed'));

      // Act
      const result = await service.getCallHistory();

      // Assert
      expect(result).toEqual([]);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getActiveCalls', () => {
    it('should fetch active calls', async () => {
      // Arrange
      const mockCalls = [
        { id: 'call-1', status: 'active' },
        { id: 'call-2', status: 'ringing' },
      ];
      vi.mocked(apiService.get).mockResolvedValueOnce({
        success: true,
        data: { calls: mockCalls },
      });

      // Act
      const result = await service.getActiveCalls();

      // Assert
      expect(result).toEqual(mockCalls);
      expect(apiService.get).toHaveBeenCalledWith('/api/voice/calls/active');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple toggleMute calls', async () => {
      // Arrange
      await service.initializeCall('call-multi-123');

      // Act
      const muted1 = service.toggleMute();
      const muted2 = service.toggleMute();
      const muted3 = service.toggleMute();

      // Assert
      expect(muted1).toBe(true);
      expect(muted2).toBe(false);
      expect(muted3).toBe(true);
    });

    it('should handle cleanup when no resources exist', async () => {
      // Arrange
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true, data: {} });

      // Act
      await service.endCall('no-init');

      // Assert - should complete without error
      expect(apiService.post).toHaveBeenCalled();
    });

    it('should handle missing ICE candidates gracefully', async () => {
      // Arrange
      await service.initializeCall('call-no-ice');

      // Act & Assert - should not throw when candidate is null
      await mockPeerConnection.onicecandidate!({ candidate: null } as any);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complete call lifecycle', async () => {
      // Arrange
      vi.mocked(apiService.post)
        .mockResolvedValueOnce({ success: true, data: { callId: 'lifecycle-call' } })
        .mockResolvedValueOnce({ success: true, data: {} })
        .mockResolvedValueOnce({ success: true, data: {} })
        .mockResolvedValueOnce({ success: true, data: {} })
        .mockResolvedValueOnce({ success: true, data: {} });

      vi.mocked(mockPeerConnection.createOffer).mockResolvedValueOnce({
        type: 'offer',
        sdp: 'sdp',
      } as any);

      // Act - Make call
      const callId = await service.makeCall('+1234567890');
      expect(callId).toBe('lifecycle-call');

      // Act - Mute
      service.toggleMute();
      expect(service.getMediaState().audio.muted).toBe(true);

      // Act - Unmute
      service.toggleMute();
      expect(service.getMediaState().audio.muted).toBe(false);

      // Act - Hold
      await service.holdCall(callId);

      // Act - Resume
      await service.resumeCall(callId);

      // Act - End
      await service.endCall(callId);

      // Assert
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });
});

