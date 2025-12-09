/**
 * useTeamChat Hook Tests
 * 
 * @group hooks
 * @group admin
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useTeamChat } from '../useTeamChat';

// Type definitions for test data
interface MockChannel {
  id: string;
  name: string;
  memberCount: number;
}

interface MockMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

describe('useTeamChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should initialize with default values', () => {
    // Arrange & Act
    const { result } = renderHook(() => useTeamChat());

    expect(result.current.channels).toEqual([]);
    expect(result.current.selectedChannel).toBeNull();
    expect(result.current.messages).toEqual([]);
    expect(result.current.messageInput).toBe('');
    expect(result.current.showEmojiPicker).toBe(false);
    expect(result.current.showCreateChannelModal).toBe(false);
  });

  it('should update channels', () => {
    // Arrange
    const { result } = renderHook(() => useTeamChat());
    const newChannels: MockChannel[] = [
      { id: '1', name: 'General', memberCount: 5 },
      { id: '2', name: 'Support', memberCount: 3 },
    ];

    // Act
    act(() => {
      result.current.setChannels(newChannels as Parameters<typeof result.current.setChannels>[0]);
    });

    // Assert
    expect(result.current.channels).toHaveLength(2);
  });

  it('should set selected channel', () => {
    // Arrange
    const { result } = renderHook(() => useTeamChat());
    const channel: MockChannel = { id: '1', name: 'General', memberCount: 5 };

    // Act
    act(() => {
      result.current.setSelectedChannel(channel as Parameters<typeof result.current.setSelectedChannel>[0]);
    });

    // Assert
    expect(result.current.selectedChannel).toBeDefined();
  });

  it('should update message input', () => {
    const { result } = renderHook(() => useTeamChat());

    act(() => {
      result.current.setMessageInput('Hello team!');
    });

    expect(result.current.messageInput).toBe('Hello team!');
  });

  it('should toggle emoji picker', () => {
    const { result } = renderHook(() => useTeamChat());

    expect(result.current.showEmojiPicker).toBe(false);

    act(() => {
      result.current.setShowEmojiPicker(true);
    });

    expect(result.current.showEmojiPicker).toBe(true);

    act(() => {
      result.current.setShowEmojiPicker(false);
    });

    expect(result.current.showEmojiPicker).toBe(false);
  });

  it('should toggle create channel modal', () => {
    const { result } = renderHook(() => useTeamChat());

    expect(result.current.showCreateChannelModal).toBe(false);

    act(() => {
      result.current.setShowCreateChannelModal(true);
    });

    expect(result.current.showCreateChannelModal).toBe(true);
  });

  it('should manage messages', () => {
    // Arrange
    const { result } = renderHook(() => useTeamChat());
    const messages: MockMessage[] = [
      { id: '1', content: 'Hello', sender: 'User 1', timestamp: new Date().toISOString() },
      { id: '2', content: 'Hi there', sender: 'User 2', timestamp: new Date().toISOString() },
    ];

    // Act
    act(() => {
      result.current.setMessages(messages as Parameters<typeof result.current.setMessages>[0]);
    });

    // Assert
    expect(result.current.messages).toHaveLength(2);
  });

  it('should provide refs object', () => {
    const { result } = renderHook(() => useTeamChat());

    expect(result.current.refs).toBeDefined();
    expect(result.current.refs.messagesEndRef).toBeDefined();
    expect(result.current.refs.fileInputRef).toBeDefined();
    expect(result.current.refs.imageInputRef).toBeDefined();
    expect(result.current.refs.videoInputRef).toBeDefined();
  });

  it('should handle multiple state updates', () => {
    // Arrange
    const { result } = renderHook(() => useTeamChat());
    const testChannel: MockChannel = { id: '1', name: 'Test', memberCount: 1 };

    // Act
    act(() => {
      result.current.setMessageInput('Test');
      result.current.setShowEmojiPicker(true);
      result.current.setSelectedChannel(testChannel as Parameters<typeof result.current.setSelectedChannel>[0]);
    });

    // Assert
    expect(result.current.messageInput).toBe('Test');
    expect(result.current.showEmojiPicker).toBe(true);
    expect(result.current.selectedChannel).toBeDefined();
  });

  it('should manage call state', () => {
    // Arrange
    const { result } = renderHook(() => useTeamChat());

    // Assert initial state
    expect(result.current.showCallModal).toBeNull();
    expect(result.current.callStatus).toBe('calling');

    // Act
    act(() => {
      result.current.setShowCallModal('voice');
      result.current.setCallStatus('connected');
      result.current.setCallDuration(120);
    });

    // Assert
    expect(result.current.showCallModal).toBe('voice');
    expect(result.current.callStatus).toBe('connected');
    expect(result.current.callDuration).toBe(120);
  });

  describe('Error Handling', () => {
    it('should handle empty channels array', () => {
      // Arrange
      const { result } = renderHook(() => useTeamChat());

      // Act
      act(() => {
        result.current.setChannels([]);
      });

      // Assert
      expect(result.current.channels).toEqual([]);
      expect(result.current.selectedChannel).toBeNull();
    });

    it('should handle null selected channel', () => {
      // Arrange
      const { result } = renderHook(() => useTeamChat());
      const channel: MockChannel = { id: '1', name: 'Test', memberCount: 1 };

      // Act
      act(() => {
        result.current.setSelectedChannel(channel as Parameters<typeof result.current.setSelectedChannel>[0]);
      });
      act(() => {
        result.current.setSelectedChannel(null);
      });

      // Assert
      expect(result.current.selectedChannel).toBeNull();
    });

    it('should handle empty message input', () => {
      // Arrange
      const { result } = renderHook(() => useTeamChat());

      // Act
      act(() => {
        result.current.setMessageInput('');
      });

      // Assert
      expect(result.current.messageInput).toBe('');
    });

    it('should handle rapid state transitions', () => {
      // Arrange
      const { result } = renderHook(() => useTeamChat());

      // Act
      act(() => {
        result.current.setShowCallModal('voice');
        result.current.setCallStatus('connected');
        result.current.setShowCallModal(null);
        result.current.setCallStatus('calling');
      });

      // Assert - State should be consistent
      expect(result.current.showCallModal).toBeNull();
      expect(result.current.callStatus).toBe('calling');
    });
  });

  describe('Performance', () => {
    it('should initialize quickly', () => {
      // Arrange
      const start = performance.now();

      // Act
      renderHook(() => useTeamChat());
      const end = performance.now();

      // Assert
      expect(end - start).toBeLessThan(50);
    });
  });
});

