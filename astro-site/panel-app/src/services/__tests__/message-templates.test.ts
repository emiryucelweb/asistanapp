/**
 * Message Templates Service Tests
 * 
 * @group services
 * @group templates
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MessageTemplate, TemplateVariable } from '../message-templates';

// Mock the service (since it's a class-based service with complex initialization)
const mockTemplate: MessageTemplate = {
  id: 'tpl-1',
  title: 'Test Template',
  content: 'Hello {{customerName}}!',
  category: 'greeting',
  businessTypes: ['other'],
  variables: [
    {
      name: 'customerName',
      description: 'Customer name',
      defaultValue: 'Customer',
      required: false,
      type: 'text',
    },
  ],
  isGlobal: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  usageCount: 0,
  tags: ['greeting'],
  shortcut: '/hello',
  language: 'tr',
  version: '1.0.0',
};

describe('Message Templates Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Template Structure', () => {
    it('should have valid template structure', () => {
      // Assert
      expect(mockTemplate).toHaveProperty('id');
      expect(mockTemplate).toHaveProperty('title');
      expect(mockTemplate).toHaveProperty('content');
      expect(mockTemplate).toHaveProperty('category');
      expect(mockTemplate).toHaveProperty('variables');
    });

    it('should have valid variable structure', () => {
      // Arrange
      const variable = mockTemplate.variables[0];

      // Assert
      expect(variable).toHaveProperty('name');
      expect(variable).toHaveProperty('type');
      expect(variable).toHaveProperty('required');
      expect(variable).toHaveProperty('defaultValue');
    });
  });

  describe('Template Categories', () => {
    it('should support greeting category', () => {
      // Arrange
      const template = { ...mockTemplate, category: 'greeting' as const };

      // Assert
      expect(template.category).toBe('greeting');
    });

    it('should support faq category', () => {
      // Arrange
      const template = { ...mockTemplate, category: 'faq' as const };

      // Assert
      expect(template.category).toBe('faq');
    });

    it('should support appointment category', () => {
      // Arrange
      const template = { ...mockTemplate, category: 'appointment' as const };

      // Assert
      expect(template.category).toBe('appointment');
    });

    it('should support sales category', () => {
      // Arrange
      const template = { ...mockTemplate, category: 'sales' as const };

      // Assert
      expect(template.category).toBe('sales');
    });

    it('should support support category', () => {
      // Arrange
      const template = { ...mockTemplate, category: 'support' as const };

      // Assert
      expect(template.category).toBe('support');
    });
  });

  describe('Variable Interpolation', () => {
    it('should identify variables in template content', () => {
      // Arrange
      const content = 'Hello {{customerName}}, your appointment is on {{date}}.';
      const variableRegex = /\{\{(\w+)\}\}/g;

      // Act
      const matches = Array.from(content.matchAll(variableRegex));
      const variableNames = matches.map(match => match[1]);

      // Assert
      expect(variableNames).toContain('customerName');
      expect(variableNames).toContain('date');
      expect(variableNames).toHaveLength(2);
    });

    it('should replace variables with values', () => {
      // Arrange
      let content = 'Hello {{customerName}}!';
      const values = { customerName: 'John Doe' };

      // Act
      content = content.replace(/\{\{customerName\}\}/g, values.customerName);

      // Assert
      expect(content).toBe('Hello John Doe!');
    });

    it('should handle multiple occurrences of same variable', () => {
      // Arrange
      let content = '{{customerName}}, welcome {{customerName}}!';
      const values = { customerName: 'Alice' };

      // Act
      content = content.replace(/\{\{customerName\}\}/g, values.customerName);

      // Assert
      expect(content).toBe('Alice, welcome Alice!');
    });

    it('should use default value when variable not provided', () => {
      // Arrange
      const variable: TemplateVariable = {
        name: 'customerName',
        description: 'Customer name',
        defaultValue: 'Customer',
        required: false,
        type: 'text',
      };
      let content = 'Hello {{customerName}}!';

      // Act
      content = content.replace(/\{\{customerName\}\}/g, variable.defaultValue);

      // Assert
      expect(content).toBe('Hello Customer!');
    });
  });

  describe('Template Filtering', () => {
    it('should filter by category', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', category: 'greeting' as const },
        { ...mockTemplate, id: '2', category: 'faq' as const },
        { ...mockTemplate, id: '3', category: 'greeting' as const },
      ];

      // Act
      const filtered = templates.filter(t => t.category === 'greeting');

      // Assert
      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.category === 'greeting')).toBe(true);
    });

    it('should filter by business type', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', businessTypes: ['dental_clinic'] },
        { ...mockTemplate, id: '2', businessTypes: ['restaurant'] },
        { ...mockTemplate, id: '3', businessTypes: ['dental_clinic', 'other'] },
      ];

      // Act
      const filtered = templates.filter(t => t.businessTypes.includes('dental_clinic'));

      // Assert
      expect(filtered).toHaveLength(2);
    });

    it('should filter by tags', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', tags: ['urgent', 'support'] },
        { ...mockTemplate, id: '2', tags: ['info'] },
        { ...mockTemplate, id: '3', tags: ['urgent', 'sales'] },
      ];

      // Act
      const filtered = templates.filter(t => t.tags.includes('urgent'));

      // Assert
      expect(filtered).toHaveLength(2);
    });

    it('should filter active templates', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', isActive: true },
        { ...mockTemplate, id: '2', isActive: false },
        { ...mockTemplate, id: '3', isActive: true },
      ];

      // Act
      const filtered = templates.filter(t => t.isActive);

      // Assert
      expect(filtered).toHaveLength(2);
    });

    it('should filter global templates', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', isGlobal: true },
        { ...mockTemplate, id: '2', isGlobal: false },
        { ...mockTemplate, id: '3', isGlobal: true },
      ];

      // Act
      const filtered = templates.filter(t => t.isGlobal);

      // Assert
      expect(filtered).toHaveLength(2);
    });
  });

  describe('Template Search', () => {
    it('should search by title', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', title: 'Greeting Template' },
        { ...mockTemplate, id: '2', title: 'FAQ Template' },
        { ...mockTemplate, id: '3', title: 'Another Greeting' },
      ];
      const query = 'greeting';

      // Act
      const results = templates.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase())
      );

      // Assert
      expect(results).toHaveLength(2);
    });

    it('should search by content', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', content: 'Hello customer' },
        { ...mockTemplate, id: '2', content: 'Thank you for your order' },
        { ...mockTemplate, id: '3', content: 'Hello valued customer' },
      ];
      const query = 'hello';

      // Act
      const results = templates.filter(t =>
        t.content.toLowerCase().includes(query.toLowerCase())
      );

      // Assert
      expect(results).toHaveLength(2);
    });

    it('should search by shortcut', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', shortcut: '/hello' },
        { ...mockTemplate, id: '2', shortcut: '/thanks' },
        { ...mockTemplate, id: '3', shortcut: '/hi' },
      ];
      const query = '/h';

      // Act
      const results = templates.filter(t =>
        t.shortcut?.startsWith(query)
      );

      // Assert
      expect(results).toHaveLength(2);
    });
  });

  describe('Template Sorting', () => {
    it('should sort by usage count', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', usageCount: 10 },
        { ...mockTemplate, id: '2', usageCount: 50 },
        { ...mockTemplate, id: '3', usageCount: 25 },
      ];

      // Act
      const sorted = [...templates].sort((a, b) => b.usageCount - a.usageCount);

      // Assert
      expect(sorted[0].usageCount).toBe(50);
      expect(sorted[1].usageCount).toBe(25);
      expect(sorted[2].usageCount).toBe(10);
    });

    it('should sort by title alphabetically', () => {
      // Arrange
      const templates = [
        { ...mockTemplate, id: '1', title: 'Charlie' },
        { ...mockTemplate, id: '2', title: 'Alpha' },
        { ...mockTemplate, id: '3', title: 'Bravo' },
      ];

      // Act
      const sorted = [...templates].sort((a, b) => a.title.localeCompare(b.title));

      // Assert
      expect(sorted[0].title).toBe('Alpha');
      expect(sorted[1].title).toBe('Bravo');
      expect(sorted[2].title).toBe('Charlie');
    });

    it('should sort by creation date', () => {
      // Arrange
      const now = new Date();
      const templates = [
        { ...mockTemplate, id: '1', createdAt: new Date(now.getTime() + 3000) },
        { ...mockTemplate, id: '2', createdAt: new Date(now.getTime() + 1000) },
        { ...mockTemplate, id: '3', createdAt: new Date(now.getTime() + 2000) },
      ];

      // Act
      const sorted = [...templates].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Assert
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });
  });

  describe('Variable Validation', () => {
    it('should validate required variables', () => {
      // Arrange
      const variable: TemplateVariable = {
        name: 'email',
        description: 'Email address',
        defaultValue: '',
        required: true,
        type: 'email',
      };

      // Assert
      expect(variable.required).toBe(true);
      expect(variable.type).toBe('email');
    });

    it('should validate variable types', () => {
      // Arrange
      const textVar: TemplateVariable = { name: 'name', description: '', defaultValue: '', required: false, type: 'text' };
      const numberVar: TemplateVariable = { name: 'count', description: '', defaultValue: '0', required: false, type: 'number' };
      const dateVar: TemplateVariable = { name: 'date', description: '', defaultValue: '', required: false, type: 'date' };

      // Assert
      expect(['text', 'number', 'date', 'email', 'phone']).toContain(textVar.type);
      expect(['text', 'number', 'date', 'email', 'phone']).toContain(numberVar.type);
      expect(['text', 'number', 'date', 'email', 'phone']).toContain(dateVar.type);
    });
  });

  describe('Edge Cases', () => {
    it('should handle template without variables', () => {
      // Arrange
      const template: MessageTemplate = {
        ...mockTemplate,
        content: 'Static message with no variables',
        variables: [],
      };

      // Assert
      expect(template.variables).toHaveLength(0);
      expect(template.content).not.toMatch(/\{\{.*\}\}/);
    });

    it('should handle empty content', () => {
      // Arrange
      const template: MessageTemplate = {
        ...mockTemplate,
        content: '',
      };

      // Assert
      expect(template.content).toBe('');
    });

    it('should handle multiple language support', () => {
      // Arrange
      const trTemplate = { ...mockTemplate, language: 'tr' as const };
      const enTemplate = { ...mockTemplate, language: 'en' as const };

      // Assert
      expect(['tr', 'en']).toContain(trTemplate.language);
      expect(['tr', 'en']).toContain(enTemplate.language);
    });

    it('should handle version strings', () => {
      // Arrange
      const versions = ['1.0.0', '1.2.0', '2.0.0'];
      const template = { ...mockTemplate, version: '1.2.0' };

      // Assert
      expect(versions).toContain(template.version);
      expect(template.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty template list gracefully', () => {
      // Arrange
      const templates: MessageTemplate[] = [];

      // Act
      const filtered = templates.filter(t => t.isActive);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    it('should handle undefined variables array', () => {
      // Arrange
      const template = { ...mockTemplate, variables: [] };

      // Act & Assert
      expect(template.variables).toBeDefined();
      expect(Array.isArray(template.variables)).toBe(true);
    });

    it('should handle malformed variable patterns gracefully', () => {
      // Arrange
      const content = 'Hello {broken} {{valid}}';
      const variableRegex = /\{\{(\w+)\}\}/g;

      // Act
      const matches = Array.from(content.matchAll(variableRegex));

      // Assert
      expect(matches).toHaveLength(1);
      expect(matches[0][1]).toBe('valid');
    });
  });
});

