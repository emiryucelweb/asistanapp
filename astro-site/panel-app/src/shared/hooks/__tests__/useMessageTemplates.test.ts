/**
 * @vitest-environment jsdom
 */
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useMessageTemplates } from '../useMessageTemplates';
import { messageTemplatesService, MessageTemplate, TemplateCategory, TemplateUsageAnalytics } from '@/services/message-templates';
import { logger } from '@/shared/utils/logger';
import { BusinessType } from '@/shared/config/business-types';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock message templates service
vi.mock('@/services/message-templates', () => ({
  messageTemplatesService: {
    getAllCategories: vi.fn(),
    getTemplatesByBusinessType: vi.fn(),
    getTemplatesByCategory: vi.fn(),
    searchTemplates: vi.fn(),
    getPopularTemplates: vi.fn(),
    useTemplate: vi.fn(),
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    deleteTemplate: vi.fn(),
    duplicateTemplate: vi.fn(),
    getTemplateById: vi.fn(),
    getUsageAnalytics: vi.fn(),
    exportTemplates: vi.fn(),
    importTemplates: vi.fn()
  },
  processTemplateShortcuts: vi.fn(),
  getDefaultVariables: vi.fn()
}));

// Mock BusinessContext
vi.mock('@/contexts/BusinessContext', () => ({
  useBusiness: vi.fn(() => ({
    config: {
      id: 'business-123',
      name: 'Test Business',
      type: 'ecommerce'
    }
  }))
}));

describe('useMessageTemplates', () => {
  const mockTemplates: MessageTemplate[] = [
    {
      id: 'template-1',
      title: 'Welcome Message',
      content: 'Welcome to {{businessName}}!',
      category: 'greeting',
      businessTypes: ['ecommerce' as BusinessType],
      isGlobal: false,
      isActive: true,
      usageCount: 10,
      variables: [
        {
          name: 'businessName',
          description: 'The name of the business',
          defaultValue: 'Our Business',
          required: true,
          type: 'text'
        }
      ],
      shortcut: '/welcome',
      tags: ['welcome', 'greeting'],
      language: 'en',
      version: '1.0.0',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'template-2',
      title: 'Order Confirmation',
      content: 'Your order #{{orderNumber}} has been confirmed',
      category: 'sales',
      businessTypes: ['ecommerce' as BusinessType],
      isGlobal: true,
      isActive: true,
      usageCount: 25,
      variables: [
        {
          name: 'orderNumber',
          description: 'The order number',
          defaultValue: '12345',
          required: true,
          type: 'text'
        }
      ],
      shortcut: '/order',
      tags: ['order', 'confirmation'],
      language: 'en',
      version: '1.0.0',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    }
  ];

  const mockCategories: TemplateCategory[] = [
    { 
      id: 'greeting', 
      name: 'Greetings', 
      icon: '👋',
      description: 'Welcome and greeting messages',
      color: '#4CAF50',
      isActive: true
    },
    { 
      id: 'sales', 
      name: 'Sales', 
      icon: '📦',
      description: 'Sales and order related messages',
      color: '#2196F3',
      isActive: true
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    
    // Setup default mocks
    vi.mocked(messageTemplatesService.getAllCategories).mockReturnValue(mockCategories);
    vi.mocked(messageTemplatesService.getTemplatesByBusinessType).mockReturnValue(mockTemplates);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Initial loading
  it('should load templates and categories on mount', async () => {
    // Arrange
    vi.mocked(messageTemplatesService.getAllCategories).mockReturnValue(mockCategories);
    vi.mocked(messageTemplatesService.getTemplatesByBusinessType).mockReturnValue(mockTemplates);
    
    // Act
    const { result } = renderHook(() => useMessageTemplates());
    
    // Assert - Loaded state (sync operations complete almost immediately)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.templates).toHaveLength(2);
      expect(result.current.categories).toHaveLength(2);
      expect(result.current.error).toBeNull();
    }, { timeout: 3000 });
  });

  // Test 2: Filter by category
  it('should filter templates by category', async () => {
    // Arrange
    const greetingTemplates = [mockTemplates[0]];
    vi.mocked(messageTemplatesService.getTemplatesByCategory).mockReturnValue(greetingTemplates);
    
    const { result } = renderHook(() => useMessageTemplates({ category: 'greeting' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    act(() => {
      result.current.setCategory('greeting');
    });
    
    // Assert
    await waitFor(() => {
      expect(messageTemplatesService.getTemplatesByCategory).toHaveBeenCalledWith('greeting', 'business-123');
    });
  });

  // Test 3: Search templates
  it('should search templates by query', async () => {
    // Arrange
    const searchResults = [mockTemplates[1]];
    vi.mocked(messageTemplatesService.searchTemplates).mockReturnValue(searchResults);
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    act(() => {
      result.current.setSearchQuery('order');
    });
    
    // Assert
    await waitFor(() => {
      expect(messageTemplatesService.searchTemplates).toHaveBeenCalledWith('order', 'business-123');
    });
  });

  // Test 4: Use template with variables
  it('should use template and replace variables', async () => {
    // Arrange
    const { getDefaultVariables } = await import('@/services/message-templates');
    vi.mocked(getDefaultVariables).mockReturnValue({
      businessName: 'Test Business',
      supportEmail: 'support@test.com'
    });
    vi.mocked(messageTemplatesService.useTemplate).mockReturnValue('Your order #12345 has been confirmed');
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    let content: string | undefined;
    act(() => {
      content = result.current.useTemplate('template-2', { orderNumber: '12345' });
    });
    
    // Assert
    expect(content).toBe('Your order #12345 has been confirmed');
    expect(messageTemplatesService.useTemplate).toHaveBeenCalledWith(
      'template-2',
      expect.objectContaining({ orderNumber: '12345' })
    );
  });

  // Test 5: Create new template
  it('should create new template', async () => {
    // Arrange
    const newTemplate = {
      title: 'Shipping Update',
      content: 'Your order is on the way!',
      category: 'info' as const,
      businessTypes: ['ecommerce' as BusinessType],
      isGlobal: false,
      isActive: true,
      variables: [],
      tags: ['shipping', 'update'],
      language: 'en' as const,
      version: '1.0.0',
      shortcut: '/ship'
    };
    
    const createdTemplate = {
      ...newTemplate,
      id: 'template-3',
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    vi.mocked(messageTemplatesService.createTemplate).mockReturnValue(createdTemplate);
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    let created: MessageTemplate | null = null;
    act(() => {
      created = result.current.createTemplate(newTemplate);
    });
    
    // Assert
    expect(created).toEqual(createdTemplate);
    expect(messageTemplatesService.createTemplate).toHaveBeenCalledWith(newTemplate);
  });

  // Test 6: Update template
  it('should update existing template', async () => {
    // Arrange
    const updates = {
      title: 'Updated Welcome Message',
      content: 'Welcome to our store!'
    };
    
    const updatedTemplate = {
      ...mockTemplates[0],
      ...updates,
      updatedAt: new Date()
    };
    
    vi.mocked(messageTemplatesService.updateTemplate).mockReturnValue(updatedTemplate);
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    let updated: MessageTemplate | null = null;
    act(() => {
      updated = result.current.updateTemplate('template-1', updates);
    });
    
    // Assert
    expect(updated).toEqual(updatedTemplate);
    expect(messageTemplatesService.updateTemplate).toHaveBeenCalledWith('template-1', updates);
  });

  // Test 7: Delete template
  it('should delete template', async () => {
    // Arrange
    vi.mocked(messageTemplatesService.deleteTemplate).mockReturnValue(true);
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Act
    let success = false;
    act(() => {
      success = result.current.deleteTemplate('template-1');
    });
    
    // Assert
    expect(success).toBe(true);
    expect(messageTemplatesService.deleteTemplate).toHaveBeenCalledWith('template-1');
  });

  // Test 8: Error Handling - Failed to load
  it('should handle loading errors gracefully', async () => {
    // Arrange
    vi.mocked(messageTemplatesService.getTemplatesByBusinessType).mockImplementation(() => {
      throw new Error('Network error');
    });
    
    // Act
    const { result } = renderHook(() => useMessageTemplates());
    
    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Network error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // Test 9: Real-World Scenario - Complete template workflow
  it('should handle complete template management workflow', async () => {
    // Arrange
    vi.mocked(messageTemplatesService.getPopularTemplates).mockReturnValue([mockTemplates[1]]);
    vi.mocked(messageTemplatesService.duplicateTemplate).mockReturnValue({
      ...mockTemplates[0],
      id: 'template-3',
      title: 'Welcome Message (Copy)'
    });
    
    const { result } = renderHook(() => 
      useMessageTemplates({ autoLoadPopular: true, enableShortcuts: true })
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Step 1: View popular templates
    expect(result.current.popularTemplates).toHaveLength(1);
    expect(result.current.popularTemplates[0].id).toBe('template-2');
    
    // Step 2: Filter by global templates only
    act(() => {
      result.current.updateFilters({ showGlobalOnly: true });
    });
    
    await waitFor(() => {
      const globalTemplates = result.current.templates.filter(t => t.isGlobal);
      expect(globalTemplates).toHaveLength(1);
    });
    
    // Step 3: Duplicate a template
    let duplicated: MessageTemplate | null = null;
    act(() => {
      duplicated = result.current.duplicateTemplate('template-1', 'Welcome Message (Copy)');
    });
    
    expect(duplicated).not.toBeNull();
    expect(duplicated!.title).toBe('Welcome Message (Copy)');
    
    // Step 4: Process shortcut
    const { processTemplateShortcuts } = await import('@/services/message-templates');
    vi.mocked(processTemplateShortcuts).mockReturnValue('Welcome to Test Business!');
    
    let processed: string | null = null;
    act(() => {
      processed = result.current.processShortcut('/welcome');
    });
    
    expect(processed).toBe('Welcome to Test Business!');
  });

  // Test 10: Statistics and analytics
  it('should calculate template statistics correctly', async () => {
    // Arrange
    const analytics: TemplateUsageAnalytics[] = [
      {
        templateId: 'template-1',
        usedAt: new Date(),
        businessType: 'ecommerce',
        agentId: 'agent-1',
        conversationId: 'conv-1',
        responseTime: 1500
      }
    ];
    
    vi.mocked(messageTemplatesService.getUsageAnalytics).mockReturnValue(analytics);
    
    const { result } = renderHook(() => useMessageTemplates());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Assert statistics
    expect(result.current.statistics.totalTemplates).toBe(2);
    expect(result.current.statistics.globalTemplates).toBe(1);
    expect(result.current.statistics.businessSpecific).toBe(1);
    expect(result.current.statistics.mostUsedTemplate.id).toBe('template-2'); // highest usageCount
    expect(result.current.statistics.categoriesCount).toBe(2);
    
    // Test grouped by category
    expect(result.current.templatesByCategory.greeting).toHaveLength(1);
    expect(result.current.templatesByCategory.sales).toHaveLength(1);
    
    // Test analytics
    const templateAnalytics = result.current.getTemplateAnalytics('template-1');
    expect(templateAnalytics).toEqual(analytics);
  });
});

