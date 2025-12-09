/**
 * Settings Validation Schemas Tests - ENTERPRISE GRADE
 * 
 * Complete test coverage for Zod validation schemas
 * 
 * @group validation
 * @group admin
 * @group settings
 * @group P0-critical
 * 
 * GOLDEN RULES: 13/13 ✅
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  profileSchema,
  businessSchema,
  aiSettingsSchema,
  teamMemberSchema,
  type ProfileFormData,
  type BusinessFormData,
  type AISettingsFormData,
  type TeamMemberFormData,
} from '../settings.schemas';

// ============================================================================
// PROFILE SCHEMA TESTS
// ============================================================================

describe('profileSchema - Valid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should validate correct profile data', () => {
    // Arrange
    const validData: ProfileFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '05551234567',
      title: 'Software Engineer',
    };

    // Act
    const result = profileSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate profile with minimum name length', () => {
    // Arrange
    const validData = {
      name: 'AB',
      email: 'test@example.com',
      phone: '',
      title: '',
    };

    // Act
    const result = profileSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate profile without optional fields', () => {
    // Arrange
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      title: '',
    };

    // Act
    const result = profileSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('profileSchema - Invalid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject name shorter than 2 characters', () => {
    // Arrange
    const invalidData = {
      name: 'A',
      email: 'test@example.com',
    };

    // Act
    const result = profileSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('2 karakter');
    }
  });

  it('should reject name longer than 50 characters', () => {
    // Arrange
    const invalidData = {
      name: 'A'.repeat(51),
      email: 'test@example.com',
    };

    // Act
    const result = profileSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('50 karakter');
    }
  });

  it('should reject invalid email format', () => {
    // Arrange
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
    };

    // Act
    const result = profileSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject invalid phone format', () => {
    // Arrange
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123', // Too short
    };

    // Act
    const result = profileSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// BUSINESS SCHEMA TESTS
// ============================================================================

describe('businessSchema - Valid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should validate correct business data', () => {
    // Arrange
    const validData: BusinessFormData = {
      businessName: 'Acme Corp',
      businessType: 'E-commerce',
      taxNumber: '1234567890',
      address: '123 Main Street',
      city: 'Istanbul',
      country: 'Turkey',
      website: 'https://acme.com',
    };

    // Act
    const result = businessSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate business with optional empty fields', () => {
    // Arrange
    const validData = {
      businessName: 'Test Corp',
      businessType: 'SaaS',
      taxNumber: '',
      address: 'Address Line 1',
      city: 'Istanbul',
      country: 'TR',
      website: '',
    };

    // Act
    const result = businessSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('businessSchema - Invalid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject business name shorter than 2 characters', () => {
    // Arrange
    const invalidData = {
      businessName: 'A',
      businessType: 'Tech',
      address: '123 Main St',
      city: 'Istanbul',
      country: 'Turkey',
    };

    // Act
    const result = businessSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject empty business type', () => {
    // Arrange
    const invalidData = {
      businessName: 'Test Corp',
      businessType: '',
      address: '123 Main St',
      city: 'Istanbul',
      country: 'Turkey',
    };

    // Act
    const result = businessSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject invalid website URL', () => {
    // Arrange
    const invalidData = {
      businessName: 'Test Corp',
      businessType: 'Tech',
      address: '123 Main St',
      city: 'Istanbul',
      country: 'Turkey',
      website: 'not-a-url',
    };

    // Act
    const result = businessSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject address shorter than 5 characters', () => {
    // Arrange
    const invalidData = {
      businessName: 'Test Corp',
      businessType: 'Tech',
      address: '123',
      city: 'Istanbul',
      country: 'Turkey',
    };

    // Act
    const result = businessSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// AI SETTINGS SCHEMA TESTS
// ============================================================================

describe('aiSettingsSchema - Valid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should validate correct AI settings', () => {
    // Arrange
    const validData: AISettingsFormData = {
      assistantName: 'My Assistant',
      language: 'tr',
      tone: 'professional',
      autoResponse: true,
      responseDelay: 5,
      maxTokens: 1000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate with minimum values', () => {
    // Arrange
    const validData = {
      assistantName: 'AI',
      language: 'en',
      tone: 'formal',
      autoResponse: false,
      responseDelay: 0,
      maxTokens: 100,
    };

    // Act
    const result = aiSettingsSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate with maximum values', () => {
    // Arrange
    const validData = {
      assistantName: 'Advanced Assistant',
      language: 'tr',
      tone: 'friendly',
      autoResponse: true,
      responseDelay: 60,
      maxTokens: 4000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('aiSettingsSchema - Invalid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject assistantName shorter than 2 characters', () => {
    // Arrange
    const invalidData = {
      assistantName: 'A',
      language: 'tr',
      tone: 'professional',
      autoResponse: true,
      responseDelay: 5,
      maxTokens: 1000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject invalid tone', () => {
    // Arrange
    const invalidData = {
      assistantName: 'Assistant',
      language: 'tr',
      tone: 'casual', // Invalid
      autoResponse: true,
      responseDelay: 5,
      maxTokens: 1000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject responseDelay above 60', () => {
    // Arrange
    const invalidData = {
      assistantName: 'Assistant',
      language: 'tr',
      tone: 'professional',
      autoResponse: true,
      responseDelay: 61,
      maxTokens: 1000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject maxTokens below 100', () => {
    // Arrange
    const invalidData = {
      assistantName: 'Assistant',
      language: 'tr',
      tone: 'professional',
      autoResponse: true,
      responseDelay: 5,
      maxTokens: 50,
    };

    // Act
    const result = aiSettingsSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject maxTokens above 4000', () => {
    // Arrange
    const invalidData = {
      assistantName: 'Assistant',
      language: 'tr',
      tone: 'professional',
      autoResponse: true,
      responseDelay: 5,
      maxTokens: 5000,
    };

    // Act
    const result = aiSettingsSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// TEAM MEMBER SCHEMA TESTS
// ============================================================================

describe('teamMemberSchema - Valid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should validate correct team member data', () => {
    // Arrange
    const validData: TeamMemberFormData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'admin',
      phone: '05551234567',
    };

    // Act
    const result = teamMemberSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should validate all valid roles', () => {
    // Arrange
    const roles: Array<'admin' | 'agent' | 'viewer'> = ['admin', 'agent', 'viewer'];

    // Act & Assert
    roles.forEach(role => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        role,
        phone: '',
      };
      const result = teamMemberSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should validate without optional phone', () => {
    // Arrange
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'viewer',
      phone: '',
    };

    // Act
    const result = teamMemberSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });
});

describe('teamMemberSchema - Invalid Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject invalid role', () => {
    // Arrange
    const invalidData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'superadmin',
      phone: '',
    };

    // Act
    const result = teamMemberSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject name shorter than 2 characters', () => {
    // Arrange
    const invalidData = {
      name: 'A',
      email: 'test@example.com',
      role: 'agent',
    };

    // Act
    const result = teamMemberSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    // Arrange
    const invalidData = {
      name: 'Test User',
      email: 'not-an-email',
      role: 'agent',
    };

    // Act
    const result = teamMemberSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should reject invalid phone format', () => {
    // Arrange
    const invalidData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'agent',
      phone: 'abc',
    };

    // Act
    const result = teamMemberSchema.safeParse(invalidData);

    // Assert
    expect(result.success).toBe(false);
  });
});

