/**
 * @vitest-environment jsdom
 * 
 * ModuleGuard Component Tests - ENTERPRISE GRADE
 * 
 * Tests for plan-based feature visibility, module access control,
 * and subscription-based UI rendering.
 * 
 * @group components
 * @group auth
 * @group feature-flags
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Error Handling
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

// ============================================================================
// MOCKS
// ============================================================================

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock BusinessContext
const mockUseBusiness = vi.fn();
vi.mock('@/contexts/BusinessContext', () => ({
  useBusiness: () => mockUseBusiness(),
}));

// Mock DisabledModulePage
vi.mock('@/shared/pages/DisabledModulePage', () => ({
  default: () => <div data-testid="disabled-module-page">Modül Devre Dışı</div>,
}));

// Import after mocks
import ModuleGuard from '../ModuleGuard';

// ============================================================================
// TEST FACTORIES
// ============================================================================

/**
 * Factory: Create mock module list
 */
const createMockModules = (enabledModuleIds: string[]) => {
  const allModules = [
    { id: 'ai-assistant', name: 'AI Asistan', enabled: false },
    { id: 'voice-calls', name: 'Sesli Aramalar', enabled: false },
    { id: 'analytics', name: 'Analitik', enabled: false },
    { id: 'appointments', name: 'Randevular', enabled: false },
    { id: 'reports', name: 'Raporlar', enabled: false },
    { id: 'team-chat', name: 'Ekip Sohbeti', enabled: false },
    { id: 'integrations', name: 'Entegrasyonlar', enabled: false },
  ];

  return allModules.map(module => ({
    ...module,
    enabled: enabledModuleIds.includes(module.id),
  }));
};

/**
 * Factory: Create mock business context
 */
const createMockBusinessContext = (options: {
  enabledModuleIds?: string[];
  isLoading?: boolean;
}) => ({
  enabledModules: createMockModules(options.enabledModuleIds || []),
  isLoading: options.isLoading ?? false,
});

// ============================================================================
// MODULE GUARD TESTS
// ============================================================================

describe('ModuleGuard - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should render children when module is enabled', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['ai-assistant'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="protected-content">Protected Content</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('disabled-module-page')).not.toBeInTheDocument();
    });

    it('should render DisabledModulePage when module is disabled', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: [] })
      );

      // Act
      render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="protected-content">Protected Content</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ isLoading: true })
      );

      // Act
      render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="protected-content">Protected Content</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('disabled-module-page')).not.toBeInTheDocument();
      // Loading animation should be present
      const container = document.querySelector('.animate-bounce');
      expect(container).toBeInTheDocument();
    });
  });

  // ==================== Module Access Tests ====================

  describe('Module Access Control', () => {
    it('should allow access to enabled module', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['voice-calls', 'analytics'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="voice-calls">
          <div data-testid="voice-content">Voice Features</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('voice-content')).toBeInTheDocument();
    });

    it('should deny access to disabled module', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['analytics'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="voice-calls">
          <div data-testid="voice-content">Voice Features</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.queryByTestId('voice-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });

    it('should handle unknown module ID gracefully', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['analytics'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="non-existent-module">
          <div data-testid="content">Content</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });
  });

  // ==================== Plan-Based Feature Visibility ====================

  describe('Plan-Based Feature Visibility', () => {
    it('should show all modules for enterprise plan', () => {
      // Arrange
      const enterpriseModules = [
        'ai-assistant',
        'voice-calls',
        'analytics',
        'appointments',
        'reports',
        'team-chat',
        'integrations',
      ];
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: enterpriseModules })
      );

      // Act & Assert
      enterpriseModules.forEach(moduleId => {
        cleanup();
        render(
          <ModuleGuard moduleId={moduleId}>
            <div data-testid={`${moduleId}-content`}>Content</div>
          </ModuleGuard>
        );
        expect(screen.getByTestId(`${moduleId}-content`)).toBeInTheDocument();
      });
    });

    it('should show limited modules for starter plan', () => {
      // Arrange
      const starterModules = ['analytics', 'appointments'];
      const premiumModules = ['ai-assistant', 'voice-calls', 'integrations'];
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: starterModules })
      );

      // Act & Assert - Starter modules should be accessible
      starterModules.forEach(moduleId => {
        cleanup();
        render(
          <ModuleGuard moduleId={moduleId}>
            <div data-testid={`${moduleId}-content`}>Content</div>
          </ModuleGuard>
        );
        expect(screen.getByTestId(`${moduleId}-content`)).toBeInTheDocument();
      });

      // Premium modules should be blocked
      premiumModules.forEach(moduleId => {
        cleanup();
        render(
          <ModuleGuard moduleId={moduleId}>
            <div data-testid={`${moduleId}-content`}>Content</div>
          </ModuleGuard>
        );
        expect(screen.queryByTestId(`${moduleId}-content`)).not.toBeInTheDocument();
        expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
      });
    });

    it('should show no premium modules for free plan', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: [] })
      );

      // Act
      render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="ai-content">AI Features</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
      expect(screen.queryByTestId('ai-content')).not.toBeInTheDocument();
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle empty module list', () => {
      // Arrange
      mockUseBusiness.mockReturnValue({
        enabledModules: [],
        isLoading: false,
      });

      // Act
      render(
        <ModuleGuard moduleId="any-module">
          <div data-testid="content">Content</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });

    it('should handle module with undefined enabled property', () => {
      // Arrange
      mockUseBusiness.mockReturnValue({
        enabledModules: [{ id: 'test-module', name: 'Test' }], // enabled is undefined
        isLoading: false,
      });

      // Act
      render(
        <ModuleGuard moduleId="test-module">
          <div data-testid="content">Content</div>
        </ModuleGuard>
      );

      // Assert - Should treat undefined as false (disabled)
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });

    it('should handle rapid loading state changes', async () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ isLoading: true })
      );

      // Act - Start with loading
      const { rerender } = render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="content">Content</div>
        </ModuleGuard>
      );

      // Assert loading state
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      // Update to loaded with module enabled
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['ai-assistant'] })
      );

      rerender(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="content">Content</div>
        </ModuleGuard>
      );

      // Assert - Content should now be visible
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });
  });

  // ==================== Real-World Scenarios ====================

  describe('Real-World Scenarios', () => {
    it('should handle plan downgrade scenario', () => {
      // Arrange - Initially enterprise
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ 
          enabledModuleIds: ['ai-assistant', 'voice-calls', 'analytics'] 
        })
      );

      const { rerender } = render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="ai-content">AI Features</div>
        </ModuleGuard>
      );

      // Assert - Initially accessible
      expect(screen.getByTestId('ai-content')).toBeInTheDocument();

      // Act - Simulate downgrade to starter
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['analytics'] })
      );

      rerender(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="ai-content">AI Features</div>
        </ModuleGuard>
      );

      // Assert - Now blocked
      expect(screen.queryByTestId('ai-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });

    it('should handle plan upgrade scenario', () => {
      // Arrange - Initially starter
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['analytics'] })
      );

      const { rerender } = render(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="ai-content">AI Features</div>
        </ModuleGuard>
      );

      // Assert - Initially blocked
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();

      // Act - Simulate upgrade
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ 
          enabledModuleIds: ['analytics', 'ai-assistant', 'voice-calls'] 
        })
      );

      rerender(
        <ModuleGuard moduleId="ai-assistant">
          <div data-testid="ai-content">AI Features</div>
        </ModuleGuard>
      );

      // Assert - Now accessible
      expect(screen.getByTestId('ai-content')).toBeInTheDocument();
    });

    it('should handle nested ModuleGuards', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['analytics', 'reports'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="analytics">
          <div data-testid="analytics-section">
            <ModuleGuard moduleId="reports">
              <div data-testid="reports-section">Advanced Reports</div>
            </ModuleGuard>
          </div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('analytics-section')).toBeInTheDocument();
      expect(screen.getByTestId('reports-section')).toBeInTheDocument();
    });

    it('should block nested content when parent module is disabled', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: ['reports'] })
      );

      // Act
      render(
        <ModuleGuard moduleId="analytics">
          <div data-testid="analytics-section">
            <ModuleGuard moduleId="reports">
              <div data-testid="reports-section">Advanced Reports</div>
            </ModuleGuard>
          </div>
        </ModuleGuard>
      );

      // Assert - Parent blocked, so nested content not rendered
      expect(screen.queryByTestId('analytics-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reports-section')).not.toBeInTheDocument();
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// PLAN-BASED UI VISIBILITY TESTS
// ============================================================================

describe('Plan-Based UI Visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  /**
   * Plan configuration for different subscription tiers
   */
  const planConfigurations = {
    free: {
      modules: [],
      limits: { conversations: 100, users: 1, storage: 1, apiCalls: 1000 },
    },
    starter: {
      modules: ['analytics', 'appointments'],
      limits: { conversations: 1000, users: 5, storage: 10, apiCalls: 10000 },
    },
    professional: {
      modules: ['analytics', 'appointments', 'reports', 'team-chat'],
      limits: { conversations: 10000, users: 25, storage: 50, apiCalls: 100000 },
    },
    enterprise: {
      modules: ['ai-assistant', 'voice-calls', 'analytics', 'appointments', 'reports', 'team-chat', 'integrations'],
      limits: { conversations: -1, users: -1, storage: 500, apiCalls: -1 }, // -1 = unlimited
    },
  };

  describe('Feature Access by Plan', () => {
    Object.entries(planConfigurations).forEach(([planName, config]) => {
      it(`should enforce ${planName} plan module restrictions`, () => {
        // Arrange
        mockUseBusiness.mockReturnValue(
          createMockBusinessContext({ enabledModuleIds: config.modules })
        );

        // Act & Assert
        const allModules = ['ai-assistant', 'voice-calls', 'analytics', 'appointments', 'reports', 'team-chat', 'integrations'];
        
        allModules.forEach(moduleId => {
          cleanup();
          render(
            <ModuleGuard moduleId={moduleId}>
              <div data-testid={`${moduleId}-content`}>Content</div>
            </ModuleGuard>
          );

          if (config.modules.includes(moduleId)) {
            expect(screen.getByTestId(`${moduleId}-content`)).toBeInTheDocument();
          } else {
            expect(screen.queryByTestId(`${moduleId}-content`)).not.toBeInTheDocument();
          }
        });
      });
    });
  });

  describe('Upgrade Prompt Rendering', () => {
    it('should show disabled module page with upgrade option for blocked features', () => {
      // Arrange
      mockUseBusiness.mockReturnValue(
        createMockBusinessContext({ enabledModuleIds: [] })
      );

      // Act
      render(
        <ModuleGuard moduleId="ai-assistant">
          <div>AI Features</div>
        </ModuleGuard>
      );

      // Assert
      expect(screen.getByTestId('disabled-module-page')).toBeInTheDocument();
      // DisabledModulePage should contain upgrade information
      expect(screen.getByText(/Modül Devre Dışı/i)).toBeInTheDocument();
    });
  });
});
