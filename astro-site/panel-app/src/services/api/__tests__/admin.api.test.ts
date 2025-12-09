/**
 * Admin API Service Tests
 * 
 * @group api
 * @group admin
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { 
  adminDashboardApi, 
  adminConversationsApi, 
  adminReportsApi,
  adminTeamApi,
  adminTeamChatApi,
  adminSettingsApi,
  adminHelpApi
} from '../admin.api';

// Mock API client
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Admin Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch dashboard stats', async () => {
    const mockStats = {
      totalConversations: 100,
      activeConversations: 50,
      resolvedConversations: 40,
      avgResponseTime: 120,
      customerSatisfaction: 4.5,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockStats });

    const result = await adminDashboardApi.getStats('30d');

    expect(apiClient.get).toHaveBeenCalledWith('/admin/dashboard/stats', {
      params: { dateRange: '30d' },
    });
    expect(result).toEqual(mockStats);
  });

  it('should fetch recent activities', async () => {
    const mockActivities = [
      { id: '1', type: 'conversation', message: 'New conversation', timestamp: '2024-01-01' },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockActivities });

    const result = await adminDashboardApi.getActivities(10);

    expect(apiClient.get).toHaveBeenCalledWith('/admin/dashboard/activities', {
      params: { limit: 10 },
    });
    expect(result).toEqual(mockActivities);
  });
});

describe('Admin Conversations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch all conversations', async () => {
    const mockConversations = {
      data: [{ id: '1', customerName: 'Test', status: 'waiting' }],
      total: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockConversations });

    const result = await adminConversationsApi.getConversations({
      page: 1,
      limit: 20,
      status: 'waiting',
    });

    expect(apiClient.get).toHaveBeenCalledWith('/admin/conversations', {
      params: { page: 1, limit: 20, status: 'waiting' },
    });
    expect(result).toEqual(mockConversations);
  });

  it('should fetch single conversation', async () => {
    const mockConversation = {
      id: '1',
      customerName: 'Test',
      messages: [],
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockConversation });

    const result = await adminConversationsApi.getConversation('1');

    expect(apiClient.get).toHaveBeenCalledWith('/admin/conversations/1');
    expect(result).toEqual(mockConversation);
  });

  it('should assign conversation to agent', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await adminConversationsApi.assignConversation('conv-1', 'agent-1');

    expect(apiClient.post).toHaveBeenCalledWith('/admin/conversations/conv-1/assign', {
      agentId: 'agent-1',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should resolve conversation', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await adminConversationsApi.resolveConversation('conv-1');

    expect(apiClient.post).toHaveBeenCalledWith('/admin/conversations/conv-1/resolve');
    expect(result).toEqual(mockResponse);
  });
});

describe('Admin Reports API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get report data', async () => {
    const mockReport = {
      id: 'report-1',
      type: 'ai',
      data: {},
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockReport });

    const result = await adminReportsApi.getReport('ai', '30d');

    expect(apiClient.get).toHaveBeenCalledWith('/admin/reports/ai', {
      params: { dateRange: '30d' },
    });
    expect(result).toEqual(mockReport);
  });

  it('should export report as PDF', async () => {
    const mockBlob = new Blob(['pdf content']);

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockBlob });

    const result = await adminReportsApi.exportPDF('ai', '30d');

    expect(apiClient.get).toHaveBeenCalledWith('/admin/reports/ai/export/pdf', {
      params: { dateRange: '30d' },
      responseType: 'blob',
    });
    expect(result).toEqual(mockBlob);
  });
});

describe('Admin Team API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch team members', async () => {
    const mockMembers = [
      { id: '1', name: 'Agent 1', role: 'agent', status: 'active' },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockMembers });

    const result = await adminTeamApi.getTeamMembers();

    expect(apiClient.get).toHaveBeenCalledWith('/admin/team/members');
    expect(result).toEqual(mockMembers);
  });

  it('should create team member', async () => {
    const newMember = {
      name: 'New Agent',
      email: 'agent@test.com',
      role: 'agent' as const,
    };

    const mockResponse = { id: '2', ...newMember };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await adminTeamApi.createTeamMember(newMember);

    expect(apiClient.post).toHaveBeenCalledWith('/admin/team/members', newMember);
    expect(result).toEqual(mockResponse);
  });

  it('should update team member', async () => {
    const updates = { status: 'inactive' as const };
    const mockResponse = { id: '1', status: 'inactive' };

    vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

    const result = await adminTeamApi.updateTeamMember('1', updates);

    expect(apiClient.put).toHaveBeenCalledWith('/admin/team/members/1', updates);
    expect(result).toEqual(mockResponse);
  });

  it('should delete team member', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.delete).mockResolvedValue({ data: mockResponse });

    const result = await adminTeamApi.deleteTeamMember('1');

    expect(apiClient.delete).toHaveBeenCalledWith('/admin/team/members/1');
    expect(result).toEqual(mockResponse);
  });
});

describe('Admin Settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch settings', async () => {
    const mockSettings = {
      general: { tenantName: 'Test Tenant' },
      notifications: { emailNotifications: true },
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockSettings });

    const result = await adminSettingsApi.getSettings();

    expect(apiClient.get).toHaveBeenCalledWith('/admin/settings');
    expect(result).toEqual(mockSettings);
  });

  it('should update settings', async () => {
    const updates = { tenantName: 'Updated Tenant' };

    const mockResponse = { success: true };

    vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

    const result = await adminSettingsApi.updateSettings('general', updates);

    expect(apiClient.put).toHaveBeenCalledWith('/admin/settings/general', updates);
    expect(result).toEqual(mockResponse);
  });
});

describe('Admin API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle network errors in dashboard stats', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(adminDashboardApi.getStats('30d')).rejects.toThrow('Network error');
  });

  it('should handle API errors in conversations list', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Server error'));

    // Act & Assert
    await expect(adminConversationsApi.getConversations({ page: 1, limit: 20 })).rejects.toThrow('Server error');
  });

  it('should handle errors when fetching reports', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Report not found'));

    // Act & Assert
    await expect(adminReportsApi.getReport('ai', '30d')).rejects.toThrow('Report not found');
  });

  it('should handle errors when creating team member', async () => {
    // Arrange
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation failed'));

    // Act & Assert
    await expect(
      adminTeamApi.createTeamMember({ name: 'Test', email: 'test@test.com', role: 'agent' as const })
    ).rejects.toThrow('Validation failed');
  });

  it('should handle errors when updating settings', async () => {
    // Arrange
    vi.mocked(apiClient.put).mockRejectedValue(new Error('Unauthorized'));

    // Act & Assert
    await expect(adminSettingsApi.updateSettings('general', {})).rejects.toThrow('Unauthorized');
  });
});

