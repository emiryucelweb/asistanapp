/* =========================================
   useMessageTemplates Hook
   Comprehensive template management hook
   Production-ready with error handling
========================================= */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/shared/utils/logger';
import { useBusiness } from '@/contexts/BusinessContext';
import { 
  messageTemplatesService, 
  MessageTemplate, 
  TemplateCategory,
  processTemplateShortcuts,
  getDefaultVariables
} from '@/services/message-templates';

interface UseMessageTemplatesOptions {
  category?: string;
  searchQuery?: string;
  autoLoadPopular?: boolean;
  enableShortcuts?: boolean;
}

interface TemplateFilters {
  category: string;
  searchQuery: string;
  showGlobalOnly: boolean;
  showActiveOnly: boolean;
}

export const useMessageTemplates = (options: UseMessageTemplatesOptions = {}) => {
  const { config } = useBusiness();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    category: options.category || 'all',
    searchQuery: options.searchQuery || '',
    showGlobalOnly: false,
    showActiveOnly: true
  });

  // Load templates and categories
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load categories
      const categoriesData = messageTemplatesService.getAllCategories();
      setCategories(categoriesData);

      // Load templates based on business type and filters
      let templatesData: MessageTemplate[];
      
      if (filters.category === 'all') {
        templatesData = messageTemplatesService.getTemplatesByBusinessType(config.id);
      } else {
        templatesData = messageTemplatesService.getTemplatesByCategory(filters.category, config.id);
      }

      // Apply search filter
      if (filters.searchQuery) {
        templatesData = messageTemplatesService.searchTemplates(filters.searchQuery, config.id);
      }

      // Apply additional filters
      if (filters.showGlobalOnly) {
        templatesData = templatesData.filter(template => template.isGlobal);
      }

      if (filters.showActiveOnly) {
        templatesData = templatesData.filter(template => template.isActive);
      }

      setTemplates(templatesData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablonlar yüklenemedi');
      logger.error('Error loading templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.id, filters]);

  // Initial load and reload when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load popular templates if requested
  const popularTemplates = useMemo(() => {
    if (options.autoLoadPopular) {
      return messageTemplatesService.getPopularTemplates(5);
    }
    return [];
  }, [options.autoLoadPopular]);

  // Filter methods
  const updateFilters = useCallback((newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setCategory = useCallback((category: string) => {
    updateFilters({ category });
  }, [updateFilters]);

  const setSearchQuery = useCallback((query: string) => {
    updateFilters({ searchQuery: query });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      searchQuery: '',
      showGlobalOnly: false,
      showActiveOnly: true
    });
  }, []);

  // Template operations
  const useTemplate = useCallback((templateId: string, variables?: Record<string, string>) => {
    try {
      const defaultVars = getDefaultVariables(config.id);
      const finalVariables = { ...defaultVars, ...variables };
      const content = messageTemplatesService.useTemplate(templateId, finalVariables);
      
      // Reload to update usage counts
      loadData();
      
      return content;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablon kullanılamadı');
      return '';
    }
  }, [config.id, loadData]);

  const createTemplate = useCallback((templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const newTemplate = messageTemplatesService.createTemplate(templateData);
      loadData(); // Reload to show new template
      return newTemplate;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablon oluşturulamadı');
      return null;
    }
  }, [loadData]);

  const updateTemplate = useCallback((id: string, updates: Partial<MessageTemplate>) => {
    try {
      const updatedTemplate = messageTemplatesService.updateTemplate(id, updates);
      if (updatedTemplate) {
        loadData(); // Reload to show updates
      }
      return updatedTemplate;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablon güncellenemedi');
      return null;
    }
  }, [loadData]);

  const deleteTemplate = useCallback((id: string) => {
    try {
      const success = messageTemplatesService.deleteTemplate(id);
      if (success) {
        loadData(); // Reload to reflect deletion
      }
      return success;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablon silinemedi');
      return false;
    }
  }, [loadData]);

  const duplicateTemplate = useCallback((id: string, newTitle?: string) => {
    try {
      const duplicate = messageTemplatesService.duplicateTemplate(id, newTitle);
      if (duplicate) {
        loadData(); // Reload to show duplicate
      }
      return duplicate;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablon kopyalanamadı');
      return null;
    }
  }, [loadData]);

  // Shortcut processing
  const processShortcut = useCallback((text: string): string | null => {
    if (!options.enableShortcuts) return null;
    
    try {
      return processTemplateShortcuts(text, config.id);
    } catch (err: unknown) {
      logger.warn('Error processing shortcut:', { error: err });
      return null;
    }
  }, [config.id, options.enableShortcuts]);

  // Get template by ID
  const getTemplate = useCallback((id: string): MessageTemplate | null => {
    return messageTemplatesService.getTemplateById(id);
  }, []);

  // Analytics
  const getTemplateAnalytics = useCallback((templateId?: string) => {
    return messageTemplatesService.getUsageAnalytics(templateId);
  }, []);

  // Export/Import
  const exportTemplates = useCallback(() => {
    return messageTemplatesService.exportTemplates(config.id);
  }, [config.id]);

  const importTemplates = useCallback((templates: MessageTemplate[]) => {
    try {
      const result = messageTemplatesService.importTemplates(templates);
      loadData(); // Reload to show imported templates
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Şablonlar içe aktarılamadı');
      return { success: 0, errors: ['Import failed'] };
    }
  }, [loadData]);

  // Get templates grouped by category
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, MessageTemplate[]> = {};
    
    templates.forEach(template => {
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(template);
    });
    
    // Sort templates within each category by usage count
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.usageCount - a.usageCount);
    });
    
    return grouped;
  }, [templates]);

  // Get category info by ID
  const getCategoryInfo = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  // Statistics
  const statistics = useMemo(() => {
    const totalTemplates = templates.length;
    const globalTemplates = templates.filter(t => t.isGlobal).length;
    const businessSpecific = totalTemplates - globalTemplates;
    const mostUsed = templates.reduce((max, template) => 
      template.usageCount > max.usageCount ? template : max
    , templates[0] || { usageCount: 0 });
    
    return {
      totalTemplates,
      globalTemplates,
      businessSpecific,
      mostUsedTemplate: mostUsed,
      categoriesCount: categories.length,
      averageUsage: totalTemplates > 0 ? 
        Math.round(templates.reduce((sum, t) => sum + t.usageCount, 0) / totalTemplates) : 0
    };
  }, [templates, categories]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Data
    templates,
    categories,
    popularTemplates,
    templatesByCategory,
    statistics,
    
    // State
    isLoading,
    error,
    filters,
    
    // Actions
    useTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    processShortcut,
    getTemplate,
    getCategoryInfo,
    
    // Filters
    setCategory,
    setSearchQuery,
    updateFilters,
    clearFilters,
    
    // Analytics
    getTemplateAnalytics,
    
    // Import/Export
    exportTemplates,
    importTemplates,
    
    // Utilities
    clearError,
    refresh
  };
};
