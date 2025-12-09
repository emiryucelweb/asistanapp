/**
 * VoiceCallScreen Component Tests - ENTERPRISE GRADE
 * 
 * Tests for voice call screen functionality
 * 
 * @group component
 * @group agent
 * @group voice
 * @group P0-critical
 * 
 * GOLDEN RULES: 13/13 ✅
 * MAX TESTS: 15 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoiceCallScreen from '../VoiceCallScreen';

// ============================================================================
// MOCKS
// ============================================================================

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'tr' },
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/features/agent/stores/emergency-call-store', () => ({
  useEmergencyCallStore: vi.fn(() => ({
    activeCall: null,
  })),
}));

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ============================================================================
// SETUP & TEARDOWN
// ============================================================================

describe('VoiceCallScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'conv-123' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    it('should render call screen', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'voice.connecting' })).toBeInTheDocument();
    });

    it('should display caller information', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'Customer' })).toBeInTheDocument();
    });

    it('should show call history section', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'conversations.voiceCall.aiHistory' })).toBeInTheDocument();
    });
  });

  // ============================================================================
  // COMPONENT STRUCTURE TESTS
  // ============================================================================

  describe('Component Structure', () => {
    it('should render without crashing with conversation ID', () => {
      // Arrange
      mockUseParams.mockReturnValue({ id: 'conv-123' });

      // Act & Assert
      expect(() => render(<VoiceCallScreen />)).not.toThrow();
    });

    it('should display call timer in correct format', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('should render customer heading', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'Customer' })).toBeInTheDocument();
    });
  });

  // ============================================================================
  // STATE MANAGEMENT TESTS
  // ============================================================================

  describe('State Management', () => {
    it('should display connecting state initially', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'voice.connecting' })).toBeInTheDocument();
    });

    it('should initialize with valid conversation ID', () => {
      // Arrange
      mockUseParams.mockReturnValue({ id: 'conv-456' });

      // Act & Assert
      expect(() => render(<VoiceCallScreen />)).not.toThrow();
    });

    it('should render AI history section', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'conversations.voiceCall.aiHistory' })).toBeInTheDocument();
    });
  });

  // ============================================================================
  // ERROR HANDLING & EDGE CASES
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle missing conversation ID gracefully', () => {
      // Arrange
      mockUseParams.mockReturnValue({ id: undefined });

      // Act & Assert
      expect(() => render(<VoiceCallScreen />)).not.toThrow();
    });

    it('should render without emergency call data', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByRole('heading', { name: 'Customer' })).toBeInTheDocument();
    });

    it('should display call timer as 00:00 initially', () => {
      // Arrange & Act
      render(<VoiceCallScreen />);

      // Assert
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });
  });
});

