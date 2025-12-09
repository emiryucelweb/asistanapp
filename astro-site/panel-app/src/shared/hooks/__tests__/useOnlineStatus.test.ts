/**
 * @vitest-environment jsdom
 */
import { renderHook, act, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useOnlineStatus } from '../useOnlineStatus';
import { showSuccess, showWarning } from '@/shared/utils/toast';
import { logger } from '@/shared/utils/logger';

// Mock toast utilities
vi.mock('@/shared/utils/toast', () => ({
  showSuccess: vi.fn(),
  showWarning: vi.fn()
}));

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Initial online status
  it('should initialize with correct online status', () => {
    // Arrange
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // Act
    const { result } = renderHook(() => useOnlineStatus());
    
    // Assert
    expect(result.current.isOnline).toBe(true);
    expect(result.current.lastStatusChange).toBeNull();
  });

  // Test 2: Detect going offline
  it('should detect when network goes offline', () => {
    // Arrange
    const { result } = renderHook(() => useOnlineStatus());
    
    expect(result.current.isOnline).toBe(true);
    
    // Act - Simulate offline event
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    // Assert
    expect(result.current.isOnline).toBe(false);
    expect(result.current.lastStatusChange).toBeInstanceOf(Date);
    expect(logger.warn).toHaveBeenCalledWith('Network connection lost');
    expect(showWarning).toHaveBeenCalledWith('İnternet bağlantısı kesildi');
  });

  // Test 3: Detect coming back online
  it('should detect when network comes back online', () => {
    // Arrange
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    const { result } = renderHook(() => useOnlineStatus());
    
    expect(result.current.isOnline).toBe(false);
    
    // Act - Simulate online event
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    // Assert
    expect(result.current.isOnline).toBe(true);
    expect(result.current.lastStatusChange).toBeInstanceOf(Date);
    expect(logger.info).toHaveBeenCalledWith('Network connection restored');
    expect(showSuccess).toHaveBeenCalledWith('İnternet bağlantısı geri geldi');
  });

  // Test 4: Callback functions on status change
  it('should call onOnline and onOffline callbacks', () => {
    // Arrange
    const onOnline = vi.fn();
    const onOffline = vi.fn();
    
    renderHook(() => useOnlineStatus({ onOnline, onOffline }));
    
    // Act - Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    // Assert - Offline callback called
    expect(onOffline).toHaveBeenCalledTimes(1);
    expect(onOnline).not.toHaveBeenCalled();
    
    // Act - Come back online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    // Assert - Online callback called
    expect(onOnline).toHaveBeenCalledTimes(1);
    expect(onOffline).toHaveBeenCalledTimes(1);
  });

  // Test 5: Disable notifications
  it('should not show notifications when disabled', () => {
    // Arrange
    renderHook(() => useOnlineStatus({ showNotifications: false }));
    
    // Act - Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    // Assert - No toast shown
    expect(showWarning).not.toHaveBeenCalled();
    
    // Act - Come online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    // Assert - No toast shown
    expect(showSuccess).not.toHaveBeenCalled();
    
    // But logger should still work
    expect(logger.warn).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalled();
  });
});

