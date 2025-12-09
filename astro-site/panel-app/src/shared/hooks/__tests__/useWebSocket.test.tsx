/**
 * @vitest-environment jsdom
 */
import { renderHook, act, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useWebSocket } from '../useWebSocket';
import { wsClient } from '@/lib/websocket/client';
import { logger } from '@/shared/utils/logger';
import toast from 'react-hot-toast';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    custom: vi.fn(),
    __esModule: true
  }
}));

// Mock WebSocket client
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn()
};

vi.mock('@/lib/websocket/client', () => ({
  wsClient: {
    connect: vi.fn(),
    emit: vi.fn()
  }
}));

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(wsClient.connect).mockReturnValue(mockSocket as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Connect on mount
  it('should connect to WebSocket on mount', () => {
    // Arrange & Act
    renderHook(() => useWebSocket());
    
    // Assert
    expect(wsClient.connect).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith('notification', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('conversation:update', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('message:new', expect.any(Function));
  });

  // Test 2: Handle notifications - Success type
  it('should show success toast for success notification', () => {
    // Arrange
    renderHook(() => useWebSocket());
    
    const notificationCallback = vi.mocked(mockSocket.on).mock.calls.find(
      call => call[0] === 'notification'
    )?.[1];
    
    const successNotification = {
      id: 'notif-1',
      type: 'success' as const,
      title: 'Success',
      message: 'Operation completed',
      timestamp: new Date()
    };
    
    // Act
    act(() => {
      notificationCallback?.(successNotification);
    });
    
    // Assert
    expect(logger.debug).toHaveBeenCalledWith('📬 New notification:', successNotification);
    expect(toast.success).toHaveBeenCalledWith('Operation completed', { duration: 4000 });
  });

  // Test 3: Handle notifications - Error type
  it('should show error toast for error notification', () => {
    // Arrange
    renderHook(() => useWebSocket());
    
    const notificationCallback = vi.mocked(mockSocket.on).mock.calls.find(
      call => call[0] === 'notification'
    )?.[1];
    
    const errorNotification = {
      id: 'notif-2',
      type: 'error' as const,
      title: 'Error',
      message: 'Operation failed',
      timestamp: new Date()
    };
    
    // Act
    act(() => {
      notificationCallback?.(errorNotification);
    });
    
    // Assert
    expect(toast.error).toHaveBeenCalledWith('Operation failed', { duration: 5000 });
  });

  // Test 4: Handle conversation updates
  it('should handle conversation update events', () => {
    // Arrange
    renderHook(() => useWebSocket());
    
    const conversationCallback = vi.mocked(mockSocket.on).mock.calls.find(
      call => call[0] === 'conversation:update'
    )?.[1];
    
    const conversationUpdate = {
      conversationId: 'conv-123',
      type: 'new_message' as const,
      data: { messageId: 'msg-456', content: 'Hello' }
    };
    
    // Act
    act(() => {
      conversationCallback?.(conversationUpdate);
    });
    
    // Assert
    expect(logger.debug).toHaveBeenCalledWith('💬 Conversation update:', conversationUpdate);
  });

  // Test 5: Cleanup on unmount
  it('should cleanup event listeners on unmount', () => {
    // Arrange
    const { unmount } = renderHook(() => useWebSocket());
    
    // Act
    unmount();
    
    // Assert
    expect(mockSocket.off).toHaveBeenCalledWith('notification');
    expect(mockSocket.off).toHaveBeenCalledWith('conversation:update');
    expect(mockSocket.off).toHaveBeenCalledWith('message:new');
  });
});

