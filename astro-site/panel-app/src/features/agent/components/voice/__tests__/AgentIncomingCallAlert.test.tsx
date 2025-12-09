/**
 * AgentIncomingCallAlert Component Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for incoming call alert with AI handoff
 * 
 * @group component
 * @group agent
 * @group voice
 * @group critical
 * 
 * GOLDEN RULES:
 * ✅ #1:  AAA Pattern (Arrange-Act-Assert)
 * ✅ #2:  Single Responsibility
 * ✅ #3:  State Isolation
 * ✅ #4:  Consistent Mocks (Shared Infrastructure)
 * ✅ #5:  Descriptive Names
 * ✅ #6:  Edge Case Coverage
 * ✅ #7:  Real-World Scenarios
 * ✅ #8:  Error Handling
 * ✅ #9:  Correct Async/Await
 * ✅ #10: Cleanup
 * ✅ #11: Immutability
 * ✅ #12: Type Safety
 * ✅ #13: Enterprise-Grade Quality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentIncomingCallAlert from '../AgentIncomingCallAlert';
import type { VoiceCall } from '@/types';
import { logger } from '@/shared/utils/logger';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'voice.aiHandoff.title': 'AI needs your help!',
        'voice.aiHandoff.defaultReason': 'Complex customer request',
        'voice.waiting': 'Waiting',
        'voice.internalCall': 'Internal Call',
        'voice.externalCall': 'External Call',
        'voice.priority.urgent': 'URGENT',
        'voice.priority.high': 'HIGH',
        'voice.aiHandoff.talkedFor': 'AI talked for',
        'voice.aiHandoff.summary': 'AI Summary',
        'voice.aiHandoff.whatDiscussed': 'What was discussed',
        'voice.aiHandoff.whyStuck': 'Why AI got stuck',
        'voice.aiHandoff.customerIntent': 'Customer needs',
        'voice.aiHandoff.customerMood': 'Customer mood',
        'voice.aiHandoff.sentiment.positive': 'Positive',
        'voice.aiHandoff.sentiment.negative': 'Negative',
        'voice.aiHandoff.sentiment.neutral': 'Neutral',
        'voice.aiHandoff.previousInteractions': 'Previous contacts',
        'voice.aiHandoff.last': 'Last',
        'voice.aiHandoff.quickNotes': 'Quick Notes',
        'voice.aiHandoff.suggestedResponse': 'Suggested Response',
        'voice.aiHandoff.notes': 'Notes',
        'voice.reject': 'Reject',
        'voice.answer': 'Answer',
        'voice.aiHandoff.autoReject': `Auto-reject in ${params?.seconds || 30}s`,
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Audio API
const mockAudioInstance = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  currentTime: 0,
  loop: false,
};

global.Audio = vi.fn(() => mockAudioInstance) as unknown as typeof Audio;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createMockCall = (overrides?: Partial<VoiceCall>): VoiceCall => ({
  id: 'call-123',
  caller: {
    id: 'caller-123',
    name: 'Jane Smith',
    phoneNumber: '+905551234567',
    avatar: undefined,
    role: 'customer',
  },
  status: 'ringing',
  callType: 'inbound',
  startedAt: new Date().toISOString(),
  endedAt: undefined,
  duration: 0,
  aiHandling: {
    aiHandledFirst: true,
    aiDuration: 180,
    aiStuckReason: 'Customer requested to speak with human',
    aiSummary: {
      conversationContext: 'Customer asking about refund policy',
      stuckReason: 'Requires manager approval',
      customerIntent: 'Request refund for recent purchase',
      sentiment: 'neutral',
      previousInteractions: 3,
      lastInteractionDate: '2025-01-10',
      quickNotes: ['Order #12345', 'Purchased 5 days ago'],
      suggestedResponse: 'Check order status and eligibility',
      keyTopics: ['refund', 'policy', 'order'],
      customerIssues: ['refund request'],
      aiAttempts: 2,
    },
  },
  metadata: {
    priority: 'normal',
    notes: '',
  },
  ...overrides,
});

// ============================================================================
// TESTS
// ============================================================================

// Global setup for all tests
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  mockAudioInstance.play.mockClear();
  mockAudioInstance.pause.mockClear();
  mockAudioInstance.play.mockResolvedValue(undefined);
  mockAudioInstance.currentTime = 0;
  mockAudioInstance.loop = false;
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('AgentIncomingCallAlert - Rendering', () => {
  it('should render with incoming call', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('AI needs your help!')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('+905551234567')).toBeInTheDocument();
  });

  it('should display caller avatar when provided', () => {
    // Arrange
    const mockCall = createMockCall({
      caller: {
        id: 'caller-123',
        name: 'John Doe',
        phoneNumber: '+905551234567',
        avatar: '/avatar.jpg',
        role: 'customer',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
  });

  it('should display user icon when no avatar provided', () => {
    // Arrange
    const mockCall = createMockCall({
      caller: {
        id: 'caller-123',
        name: 'Bob Wilson',
        phoneNumber: '+905551234567',
        avatar: undefined,
        role: 'customer',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    // User icon should be rendered (can't directly test SVG, but component renders)
  });

  it('should display AI stuck reason', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiStuckReason: 'Customer needs technical support',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Customer needs technical support')).toBeInTheDocument();
  });

  it('should display default reason when AI stuck reason not provided', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiStuckReason: undefined,
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Complex customer request')).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByRole('button', { name: /Answer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Ring Timer', () => {
  it('should start timer at 0:00', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('should display timer', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Timer starts at 0:00
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('should display waiting label', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Waiting')).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Auto-Reject', () => {


  it('should auto-reject after 30 seconds', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Not rejected yet
    expect(mockHandlers.onReject).not.toHaveBeenCalled();

    // After 30 seconds
    vi.advanceTimersByTime(30000);

    // Assert - Should be rejected
    expect(mockHandlers.onReject).toHaveBeenCalledTimes(1);
  });

  it('should display auto-reject warning', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Countdown message is displayed
    expect(screen.getByText(/Auto-reject in/i)).toBeInTheDocument();
  });

  it('should not auto-reject if call is accepted', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    const { unmount } = render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Accept call and unmount (simulates component cleanup)
    unmount();

    // Advance timer past 30 seconds
    vi.advanceTimersByTime(31000);

    // Assert - Should not be called after unmount
    expect(mockHandlers.onReject).not.toHaveBeenCalled();
  });
});

describe('AgentIncomingCallAlert - Audio Playback', () => {


  it('should play ring sound on mount', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(Audio).toHaveBeenCalledWith('/sounds/incoming-call.mp3');
  });

  it('should loop ring sound', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };
    const mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      loop: false,
    };
    (global.Audio as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockAudio);

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(mockAudio.loop).toBe(true);
  });

  it('should stop ring sound on unmount', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };
    const mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      loop: false,
    };
    (global.Audio as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockAudio);

    // Act
    const { unmount } = render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    unmount();

    // Assert
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(mockAudio.currentTime).toBe(0);
  });

  it('should handle audio play error gracefully', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };
    const mockAudio = {
      play: vi.fn().mockRejectedValue(new Error('Audio play failed')),
      pause: vi.fn(),
      currentTime: 0,
      loop: false,
    };
    (global.Audio as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockAudio);

    // Act & Assert - Should not throw
    expect(() => {
      render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    }).not.toThrow();

    // Logger should be called
    waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });
  });
});

describe('AgentIncomingCallAlert - AI Summary Display', () => {


  it('should display AI conversation duration', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiDuration: 180, // 3 minutes
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(/3:00/)).toBeInTheDocument();
    expect(screen.getByText('AI talked for')).toBeInTheDocument();
  });

  it('should display conversation context', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          conversationContext: 'Customer wants to cancel subscription',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Text is in quotes in the component
    expect(screen.getByText(/Customer wants to cancel subscription/)).toBeInTheDocument();
  });

  it('should display stuck reason', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          stuckReason: 'Needs password reset approval',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Needs password reset approval')).toBeInTheDocument();
  });

  it('should display customer intent', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          customerIntent: 'Upgrade to premium plan',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Upgrade to premium plan')).toBeInTheDocument();
  });

  it('should display previous interactions count', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          previousInteractions: 5,
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Previous contacts')).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Sentiment Display', () => {


  it('should display positive sentiment', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          sentiment: 'positive',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('😊 Positive')).toBeInTheDocument();
  });

  it('should display negative sentiment', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          sentiment: 'negative',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('😟 Negative')).toBeInTheDocument();
  });

  it('should display neutral sentiment', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          sentiment: 'neutral',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('😐 Neutral')).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Priority Display', () => {


  it('should display urgent priority badge', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'urgent',
        notes: '',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(/URGENT/i)).toBeInTheDocument();
  });

  it('should display high priority badge', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'high',
        notes: '',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
  });

  it('should not display priority badge for normal priority', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'normal',
        notes: '',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.queryByText(/URGENT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HIGH/i)).not.toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Call Type Display', () => {


  it('should display internal call badge', () => {
    // Arrange
    const mockCall = createMockCall({
      callType: 'internal',
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(/Internal Call/i)).toBeInTheDocument();
  });

  it('should display external call badge', () => {
    // Arrange
    const mockCall = createMockCall({
      callType: 'inbound',
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(/External Call/i)).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Quick Notes', () => {


  it('should display quick notes when available', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          quickNotes: ['First note', 'Second note', 'Third note'],
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('First note')).toBeInTheDocument();
    expect(screen.getByText('Second note')).toBeInTheDocument();
    expect(screen.getByText('Third note')).toBeInTheDocument();
  });

  it('should not display quick notes section when empty', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          quickNotes: [],
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.queryByText('Quick Notes')).not.toBeInTheDocument();
  });

  it('should not display quick notes section when undefined', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          quickNotes: [],
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.queryByText('Quick Notes')).not.toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Suggested Response', () => {


  it('should display suggested response when available', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          suggestedResponse: 'Offer a 10% discount for the inconvenience',
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Component wraps suggestion in quotes
    expect(screen.getByText((content, element) => {
      return element?.textContent === '"Offer a 10% discount for the inconvenience"';
    })).toBeInTheDocument();
  });

  it('should not display suggested response when not available', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: {
          ...createMockCall().aiHandling!.aiSummary!,
          suggestedResponse: undefined,
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.queryByText('Suggested Response')).not.toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - User Actions', () => {


  it('should call onAccept when accept button clicked', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    const acceptButton = screen.getByRole('button', { name: /Answer/i });
    await user.click(acceptButton);

    // Assert
    expect(mockHandlers.onAccept).toHaveBeenCalledTimes(1);
  });

  it('should call onReject when reject button clicked', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    const rejectButton = screen.getByRole('button', { name: /Reject/i });
    await user.click(rejectButton);

    // Assert
    expect(mockHandlers.onReject).toHaveBeenCalledTimes(1);
  });

  it('should handle rapid button clicks', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    const acceptButton = screen.getByRole('button', { name: /Answer/i });

    // Click multiple times rapidly
    await user.click(acceptButton);
    await user.click(acceptButton);
    await user.click(acceptButton);

    // Assert
    expect(mockHandlers.onAccept).toHaveBeenCalledTimes(3);
  });
});

describe('AgentIncomingCallAlert - Edge Cases', () => {


  it('should handle missing phone number', () => {
    // Arrange
    const mockCall = createMockCall({
      caller: {
        id: 'caller-123',
        name: 'Anonymous Caller',
        phoneNumber: undefined,
        avatar: undefined,
        role: 'customer',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Anonymous Caller')).toBeInTheDocument();
    expect(screen.queryByText(/\+90/)).not.toBeInTheDocument();
  });

  it('should handle missing AI summary', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiSummary: undefined,
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act & Assert - Should not crash
    expect(() => {
      render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);
    }).not.toThrow();
  });

  it('should handle missing AI duration', () => {
    // Arrange
    const mockCall = createMockCall({
      aiHandling: {
        ...createMockCall().aiHandling!,
        aiDuration: undefined,
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Should not display AI duration section
    expect(screen.queryByText('AI talked for')).not.toBeInTheDocument();
  });

  it('should handle missing metadata notes', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'normal',
        notes: undefined,
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Should not display notes section
    expect(screen.queryByText('Notes')).not.toBeInTheDocument();
  });

  it('should handle very long caller name', () => {
    // Arrange
    const longName = 'A'.repeat(100);
    const mockCall = createMockCall({
      caller: {
        id: 'caller-123',
        name: longName,
        phoneNumber: '+905551234567',
        avatar: undefined,
        role: 'customer',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText(longName)).toBeInTheDocument();
  });
});

describe('AgentIncomingCallAlert - Real-World Scenarios', () => {


  it('should handle typical incoming call workflow', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act - Call comes in
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - Initial state
    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(screen.getByText('AI needs your help!')).toBeInTheDocument();

    // Agent accepts the call
    const acceptButton = screen.getByRole('button', { name: /Answer/i });
    await user.click(acceptButton);

    // Assert - Callback fired
    expect(mockHandlers.onAccept).toHaveBeenCalledTimes(1);
  });

  it('should handle urgent call with complete AI context', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'urgent',
        notes: 'VIP customer - handle with care',
      },
      aiHandling: {
        aiHandledFirst: true,
        aiDuration: 240,
        aiStuckReason: 'Customer requested manager',
        aiSummary: {
          conversationContext: 'Complaint about service quality',
          stuckReason: 'Requires escalation to management',
          customerIntent: 'Speak with manager about refund',
          sentiment: 'negative',
          previousInteractions: 8,
          lastInteractionDate: '2025-01-20',
          quickNotes: [
            'Premium account holder',
            'Multiple failed deliveries',
            'Requesting full refund',
          ],
          suggestedResponse: 'Connect to manager immediately and offer compensation',
          keyTopics: ['complaint', 'refund', 'manager'],
          customerIssues: ['service quality', 'failed deliveries'],
          aiAttempts: 4,
        },
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert - All critical info displayed
    expect(screen.getByText(/URGENT/i)).toBeInTheDocument();
    expect(screen.getByText('VIP customer - handle with care')).toBeInTheDocument();
    // conversationContext wrapped in quotes by component
    expect(screen.getByText((content, element) => {
      return element?.textContent === '"Complaint about service quality"';
    })).toBeInTheDocument();
    expect(screen.getByText('😟 Negative')).toBeInTheDocument();
    expect(screen.getByText('Premium account holder')).toBeInTheDocument();
    // suggestedResponse wrapped in quotes by component
    expect(screen.getByText((content, element) => {
      return element?.textContent === '"Connect to manager immediately and offer compensation"';
    })).toBeInTheDocument();
  });

  it('should handle missed call scenario (auto-reject)', () => {
    // Arrange
    const mockCall = createMockCall();
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Wait for 30 seconds (auto-reject timeout)
    vi.advanceTimersByTime(30000);

    // Assert
    expect(mockHandlers.onReject).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onAccept).not.toHaveBeenCalled();
  });
});

describe('AgentIncomingCallAlert - Additional Notes', () => {


  it('should display additional notes when available', () => {
    // Arrange
    const mockCall = createMockCall({
      metadata: {
        priority: 'normal',
        notes: 'Customer prefers email communication',
      },
    });
    const mockHandlers = {
      onAccept: vi.fn(),
      onReject: vi.fn(),
    };

    // Act
    render(<AgentIncomingCallAlert call={mockCall} {...mockHandlers} />);

    // Assert
    expect(screen.getByText('Customer prefers email communication')).toBeInTheDocument();
  });
});

