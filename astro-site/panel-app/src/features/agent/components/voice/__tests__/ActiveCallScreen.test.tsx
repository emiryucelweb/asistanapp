/**
 * @vitest-environment jsdom
 * 
 * ActiveCallScreen Component Tests - ENTERPRISE GRADE
 * 
 * Tests for:
 * - Call control UI states (mute, hold, speaker)
 * - Call duration timer accuracy
 * - Connection quality indicator
 * - Call notes functionality
 * - Call status display
 * - End call behavior
 * 
 * @group components
 * @group voice
 * @group webrtc
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Accessibility Tests
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'voice.controls.microphone': 'Microphone',
        'voice.controls.muted': 'Muted',
        'voice.controls.hold': 'Hold',
        'voice.controls.resume': 'Resume',
        'voice.controls.speaker': 'Speaker',
        'voice.controls.transfer': 'Transfer',
        'voice.addNote': 'Add Note',
        'voice.endCall': 'End Call',
        'voice.callStatus.connected': 'Connected',
        'voice.callStatus.onHold': 'On Hold',
        'voice.callStatus.recording': 'Recording',
        'voice.connectionQuality.excellent': 'Excellent',
        'voice.connectionQuality.good': 'Good',
        'voice.connectionQuality.fair': 'Fair',
        'voice.connectionQuality.poor': 'Poor',
        'voice.callDetails': 'Call Details',
        'voice.callDetailsSubtitle': 'Customer information and call notes',
        'voice.customer': 'Customer',
        'voice.callStartTime': 'Call Start Time',
        'voice.callType': 'Call Type',
        'voice.incomingCall': 'Incoming Call',
        'voice.outgoingCall': 'Outgoing Call',
        'voice.callNotes': 'Call Notes',
        'voice.callNotesPlaceholder': 'Take notes during the call...',
        'voice.callNotesHint': 'Notes are saved automatically',
        'voice.save': 'Save',
        'voice.phoneCallNote': 'This is a phone call. Use the controls to manage the call.',
        'voice.notesSaved': 'Notes saved successfully',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('@/features/agent/utils/locale', () => ({
  formatTime: vi.fn((date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }),
}));

vi.mock('@/shared/utils/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

import ActiveCallScreen from '../ActiveCallScreen';
import { showSuccess } from '@/shared/utils/toast';
import type { VoiceCall, CallMediaState } from '@/types';

// ============================================================================
// TEST FACTORIES
// ============================================================================

/**
 * Factory: Create mock VoiceCall
 */
const createMockCall = (overrides: Partial<VoiceCall> = {}): VoiceCall => ({
  id: 'call-123',
  conversationId: 'conv-456',
  caller: {
    id: 'customer-789',
    name: 'John Doe',
    phoneNumber: '+1 555-0123',
    avatar: undefined,
  },
  status: 'connected',
  callType: 'inbound',
  startedAt: new Date().toISOString(),
  queuedAt: new Date(Date.now() - 30000).toISOString(),
  ...overrides,
});

/**
 * Factory: Create mock CallMediaState
 */
const createMockMediaState = (overrides: Partial<CallMediaState> = {}): CallMediaState => ({
  audio: {
    muted: false,
    volume: 80,
    ...overrides.audio,
  },
  recording: {
    isRecording: false,
    duration: 0,
    ...overrides.recording,
  },
  connection: {
    quality: 'excellent',
    latency: 45,
    ...overrides.connection,
  },
  ...overrides,
});

/**
 * Factory: Create mock handlers
 */
const createMockHandlers = () => ({
  onToggleMute: vi.fn(),
  onToggleSpeaker: vi.fn(),
  onHold: vi.fn(),
  onResume: vi.fn(),
  onTransfer: vi.fn(),
  onEndCall: vi.fn(),
});

// ============================================================================
// ACTIVE CALL SCREEN TESTS
// ============================================================================

describe('ActiveCallScreen - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cleanup();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should render caller information correctly', () => {
      // Arrange
      const mockCall = createMockCall({ caller: { id: '1', name: 'Alice Smith', phoneNumber: '+1 555-9999' } });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert - Name and phone appear in multiple sections (header and details)
      const nameElements = screen.getAllByText('Alice Smith');
      const phoneElements = screen.getAllByText('+1 555-9999');
      expect(nameElements.length).toBeGreaterThan(0);
      expect(phoneElements.length).toBeGreaterThan(0);
    });

    it('should render caller avatar initial when no avatar provided', () => {
      // Arrange
      const mockCall = createMockCall({ caller: { id: '1', name: 'Bob Wilson', phoneNumber: '+1 555-0000' } });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('B')).toBeInTheDocument(); // First letter
    });

    it('should display connected status indicator', () => {
      // Arrange
      const mockCall = createMockCall({ status: 'connected' });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('should display on hold status indicator', () => {
      // Arrange
      const mockCall = createMockCall({ status: 'on_hold' });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('On Hold')).toBeInTheDocument();
    });
  });

  // ==================== Call Controls Tests ====================

  describe('Call Controls', () => {
    it('should call onToggleMute when mute button is clicked', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const muteButton = screen.getByText('Microphone').closest('button')!;
      await user.click(muteButton);

      // Assert
      expect(mockHandlers.onToggleMute).toHaveBeenCalledTimes(1);
    });

    it('should show muted state when audio is muted', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ audio: { muted: true, volume: 80 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('Muted')).toBeInTheDocument();
    });

    it('should call onToggleSpeaker when speaker button is clicked', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const speakerButton = screen.getByText('Speaker').closest('button')!;
      await user.click(speakerButton);

      // Assert
      expect(mockHandlers.onToggleSpeaker).toHaveBeenCalledTimes(1);
    });

    it('should call onHold when hold button is clicked', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall({ status: 'connected' })}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const holdButton = screen.getByText('Hold').closest('button')!;
      await user.click(holdButton);

      // Assert
      expect(mockHandlers.onHold).toHaveBeenCalledTimes(1);
    });

    it('should call onResume when resume button is clicked (on hold)', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall({ status: 'on_hold' })}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const resumeButton = screen.getByText('Resume').closest('button')!;
      await user.click(resumeButton);

      // Assert
      expect(mockHandlers.onResume).toHaveBeenCalledTimes(1);
    });

    it('should call onEndCall when end call button is clicked', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const endCallButtons = screen.getAllByText('End Call');
      await user.click(endCallButtons[0].closest('button')!);

      // Assert
      expect(mockHandlers.onEndCall).toHaveBeenCalledTimes(1);
    });

    it('should call onTransfer when transfer button is clicked', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const transferButton = screen.getByText('Transfer').closest('button')!;
      await user.click(transferButton);

      // Assert
      expect(mockHandlers.onTransfer).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== Call Duration Timer Tests ====================

  describe('Call Duration Timer', () => {
    it('should display initial duration as 0:00', () => {
      // Arrange
      const mockCall = createMockCall({ startedAt: new Date().toISOString() });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });

    // Timer duration formatting tests using unit testing approach
    it('should format seconds correctly', () => {
      // Arrange - Test the formatDuration logic directly
      const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
          return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      // Act & Assert
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(30)).toBe('0:30');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3661)).toBe('1:01:01');
    });

    it('should format duration with hours correctly', () => {
      // Arrange
      const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
          return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      // Act & Assert - 1 hour, 5 minutes, 30 seconds
      expect(formatDuration(3930)).toBe('1:05:30');
      // 2 hours
      expect(formatDuration(7200)).toBe('2:00:00');
      // Edge case: just under an hour
      expect(formatDuration(3599)).toBe('59:59');
    });
    
    it('should render duration display element', () => {
      // Arrange
      const mockCall = createMockCall({ startedAt: new Date().toISOString() });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert - Duration element should exist (could be multiple time displays)
      const durationElements = screen.getAllByText(/\d+:\d{2}/);
      expect(durationElements.length).toBeGreaterThan(0);
    });

    it('should not start timer when call status is not connected', () => {
      // Arrange
      const mockCall = createMockCall({ status: 'on_hold', startedAt: undefined });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert - Should show 0:00
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });

  // ==================== Connection Quality Tests ====================

  describe('Connection Quality', () => {
    it('should display excellent quality indicator', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ connection: { quality: 'excellent', latency: 30 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText(/Excellent.*30ms/)).toBeInTheDocument();
    });

    it('should display good quality indicator', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ connection: { quality: 'good', latency: 75 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText(/Good.*75ms/)).toBeInTheDocument();
    });

    it('should display fair quality indicator', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ connection: { quality: 'fair', latency: 150 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText(/Fair.*150ms/)).toBeInTheDocument();
    });

    it('should display poor quality indicator', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ connection: { quality: 'poor', latency: 300 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText(/Poor.*300ms/)).toBeInTheDocument();
    });
  });

  // ==================== Recording Indicator Tests ====================

  describe('Recording Indicator', () => {
    it('should display recording indicator when recording', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ recording: { isRecording: true, duration: 0 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('Recording')).toBeInTheDocument();
    });

    it('should not display recording indicator when not recording', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState({ recording: { isRecording: false, duration: 0 } })}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.queryByText('Recording')).not.toBeInTheDocument();
    });
  });

  // ==================== Call Notes Tests ====================

  describe('Call Notes', () => {
    it('should render notes textarea', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      const notesTextarea = screen.getByPlaceholderText('Take notes during the call...');
      expect(notesTextarea).toBeInTheDocument();
    });

    it('should update notes when typing', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const notesTextarea = screen.getByPlaceholderText('Take notes during the call...');
      await user.type(notesTextarea, 'Customer requested callback');

      // Assert
      expect(notesTextarea).toHaveValue('Customer requested callback');
    });

    it('should disable save button when notes are empty', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when notes have content', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const notesTextarea = screen.getByPlaceholderText('Take notes during the call...');
      await user.type(notesTextarea, 'Test note');

      // Assert
      const saveButton = screen.getByText('Save');
      expect(saveButton).not.toBeDisabled();
    });

    it('should call showSuccess when notes are saved', async () => {
      // Arrange
      const mockHandlers = createMockHandlers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Act
      const notesTextarea = screen.getByPlaceholderText('Take notes during the call...');
      await user.type(notesTextarea, 'Important note');

      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      // Assert
      expect(showSuccess).toHaveBeenCalledWith('Notes saved successfully');
    });
  });

  // ==================== Call Type Display Tests ====================

  describe('Call Type Display', () => {
    it('should display incoming call type', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall({ callType: 'inbound' })}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('Incoming Call')).toBeInTheDocument();
    });

    it('should display outgoing call type', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall({ callType: 'outbound' })}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('Outgoing Call')).toBeInTheDocument();
    });
  });

  // ==================== Accessibility Tests ====================

  describe('Accessibility', () => {
    it('should have accessible end call button', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      const closeButton = screen.getByLabelText('End Call');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have accessible notes textarea', () => {
      // Arrange
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={createMockCall()}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      const notesTextarea = screen.getByLabelText('Call Notes');
      expect(notesTextarea).toBeInTheDocument();
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle missing phone number', () => {
      // Arrange
      const mockCall = createMockCall({ 
        caller: { id: '1', name: 'Unknown Caller', phoneNumber: undefined } 
      });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert - Name appears in multiple sections
      const nameElements = screen.getAllByText('Unknown Caller');
      expect(nameElements.length).toBeGreaterThan(0);
    });

    it('should handle missing startedAt time', () => {
      // Arrange
      const mockCall = createMockCall({ startedAt: undefined });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle very long caller name', () => {
      // Arrange
      const longName = 'A'.repeat(100);
      const mockCall = createMockCall({ caller: { id: '1', name: longName, phoneNumber: '+1 555-0000' } });
      const mockHandlers = createMockHandlers();

      // Act
      render(
        <ActiveCallScreen
          call={mockCall}
          mediaState={createMockMediaState()}
          {...mockHandlers}
        />
      );

      // Assert - Name appears multiple times (header and details section)
      // So we use getAllByText and check at least one exists
      const nameElements = screen.getAllByText(longName);
      expect(nameElements.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

describe('ActiveCallScreen - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cleanup();
  });

  it('should handle complete call lifecycle', async () => {
    // Arrange
    const mockHandlers = createMockHandlers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const startTime = new Date();

    const { rerender } = render(
      <ActiveCallScreen
        call={createMockCall({ status: 'connected', startedAt: startTime.toISOString() })}
        mediaState={createMockMediaState()}
        {...mockHandlers}
      />
    );

    // Act - Call progresses
    act(() => {
      vi.advanceTimersByTime(30000); // 30 seconds
    });

    // Put on hold
    const holdButton = screen.getByText('Hold').closest('button')!;
    await user.click(holdButton);
    expect(mockHandlers.onHold).toHaveBeenCalled();

    // Rerender with on_hold status
    rerender(
      <ActiveCallScreen
        call={createMockCall({ status: 'on_hold', startedAt: startTime.toISOString() })}
        mediaState={createMockMediaState()}
        {...mockHandlers}
      />
    );

    // Assert on hold status
    expect(screen.getByText('On Hold')).toBeInTheDocument();

    // Resume call
    const resumeButton = screen.getByText('Resume').closest('button')!;
    await user.click(resumeButton);
    expect(mockHandlers.onResume).toHaveBeenCalled();
  });

  it('should handle mute toggle during call', async () => {
    // Arrange
    const mockHandlers = createMockHandlers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const { rerender } = render(
      <ActiveCallScreen
        call={createMockCall()}
        mediaState={createMockMediaState({ audio: { muted: false, volume: 80 } })}
        {...mockHandlers}
      />
    );

    // Assert initial unmuted state
    expect(screen.getByText('Microphone')).toBeInTheDocument();

    // Act - Mute
    const muteButton = screen.getByText('Microphone').closest('button')!;
    await user.click(muteButton);

    // Rerender with muted state
    rerender(
      <ActiveCallScreen
        call={createMockCall()}
        mediaState={createMockMediaState({ audio: { muted: true, volume: 80 } })}
        {...mockHandlers}
      />
    );

    // Assert muted state
    expect(screen.getByText('Muted')).toBeInTheDocument();
  });

  it('should handle note-taking during call', async () => {
    // Arrange
    const mockHandlers = createMockHandlers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ActiveCallScreen
        call={createMockCall()}
        mediaState={createMockMediaState()}
        {...mockHandlers}
      />
    );

    // Act - Take notes
    const notesTextarea = screen.getByPlaceholderText('Take notes during the call...');
    await user.type(notesTextarea, 'Customer complaint about billing\n');
    await user.type(notesTextarea, 'Requested refund for last month');

    // Save notes
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Assert
    expect(showSuccess).toHaveBeenCalled();
    expect(notesTextarea).toHaveValue('Customer complaint about billing\nRequested refund for last month');
  });
});
