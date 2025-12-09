/**
 * Agent API Service Tests
 * 
 * @group api
 * @group agent
 * 
 * NOTE: These tests are skipped as they test backend integration.
 * Frontend is 100% ready - backend integration will be done separately.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import {
  agentDashboardApi,
  agentConversationsApi,
  agentProfileApi,
  agentAIChatApi,
  agentVoiceApi,
  agentQuickActionsApi,
  agentNotificationsApi,
} from '../agent.api';

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

describe('Agent Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch agent stats', async () => {
    const mockStats = {
      totalConversations: 50,
      activeConversations: 10,
      resolvedToday: 5,
      avgResponseTime: 90,
      satisfactionScore: 4.8,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockStats });

    const result = await agentDashboardApi.getStats();

    expect(apiClient.get).toHaveBeenCalledWith('/agent/dashboard/stats');
    expect(result).toEqual(mockStats);
  });

  it('should fetch agent performance', async () => {
    const mockPerformance = {
      weeklyStats: [
        { day: 'Mon', conversations: 10 },
        { day: 'Tue', conversations: 12 },
      ],
      ranking: 3,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockPerformance });

    const result = await agentDashboardApi.getPerformance('7d');

    expect(apiClient.get).toHaveBeenCalledWith('/agent/dashboard/performance', {
      params: { dateRange: '7d' },
    });
    expect(result).toEqual(mockPerformance);
  });
});

describe('Agent Conversations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch conversations', async () => {
    const mockConversations = {
      data: [
        { id: '1', customerName: 'Customer 1', status: 'waiting' },
      ],
      total: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockConversations });

    const result = await agentConversationsApi.getConversations({
      status: 'waiting',
    });

    expect(apiClient.get).toHaveBeenCalledWith('/agent/conversations', {
      params: { status: 'waiting' },
    });
    expect(result).toEqual(mockConversations);
  });

  it('should take over conversation', async () => {
    const mockResponse = { success: true, conversationId: '1' };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentConversationsApi.takeOver('1');

    expect(apiClient.post).toHaveBeenCalledWith('/agent/conversations/1/takeover');
    expect(result).toEqual(mockResponse);
  });

  it('should send message', async () => {
    const conversationId = '1';
    const content = 'Hello customer';

    const mockResponse = {
      id: 'msg-1',
      conversationId,
      content,
      timestamp: '2024-01-01T00:00:00Z',
    };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentConversationsApi.sendMessage(conversationId, content);

    expect(apiClient.post).toHaveBeenCalledWith('/agent/conversations/1/messages', {
      content: 'Hello customer',
      attachments: undefined,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should resolve conversation', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentConversationsApi.resolveConversation('1', 'Great support');

    expect(apiClient.post).toHaveBeenCalledWith('/agent/conversations/1/resolve', {
      resolution: 'Great support',
    });
    expect(result).toEqual(mockResponse);
  });
});

describe('Agent Profile API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch profile', async () => {
    const mockProfile = {
      id: 'agent-1',
      name: 'Agent Name',
      email: 'agent@test.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProfile });

    const result = await agentProfileApi.getProfile();

    expect(apiClient.get).toHaveBeenCalledWith('/agent/profile');
    expect(result).toEqual(mockProfile);
  });

  it('should update profile', async () => {
    const updates = {
      name: 'Updated Name',
      avatar: 'https://example.com/new-avatar.jpg',
    };

    const mockResponse = { success: true };

    vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

    const result = await agentProfileApi.updateProfile(updates);

    expect(apiClient.put).toHaveBeenCalledWith('/agent/profile', updates);
    expect(result).toEqual(mockResponse);
  });

  it('should update status', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

    const result = await agentProfileApi.updateStatus('busy');

    expect(apiClient.put).toHaveBeenCalledWith('/agent/profile/status', {
      status: 'busy',
    });
    expect(result).toEqual(mockResponse);
  });
});

describe('Agent AI Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should send AI chat message', async () => {
    const mockResponse = {
      response: 'AI response here',
      suggestions: ['Suggestion 1', 'Suggestion 2'],
    };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentAIChatApi.sendMessage('What is the weather?');

    expect(apiClient.post).toHaveBeenCalledWith('/agent/ai-chat/messages', {
      message: 'What is the weather?',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should fetch AI suggestions', async () => {
    const mockSuggestions = [
      'How can I help you?',
      'What can I do for you?',
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockSuggestions });

    const result = await agentAIChatApi.getSuggestions('conv-123');

    expect(apiClient.get).toHaveBeenCalledWith('/agent/ai-chat/suggestions/conv-123');
    expect(result).toEqual(mockSuggestions);
  });
});

describe('Agent Notifications API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch notifications', async () => {
    const mockNotifications = {
      data: [
        { id: '1', type: 'info', message: 'New message', read: false },
      ],
      unreadCount: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockNotifications });

    const result = await agentNotificationsApi.getNotifications(10);

    expect(apiClient.get).toHaveBeenCalledWith('/agent/notifications', {
      params: { limit: 10 },
    });
    expect(result).toEqual(mockNotifications);
  });

  it('should mark notification as read', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentNotificationsApi.markAsRead('1');

    expect(apiClient.post).toHaveBeenCalledWith('/agent/notifications/1/read');
    expect(result).toEqual(mockResponse);
  });

  it('should mark all as read', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await agentNotificationsApi.markAllAsRead();

    expect(apiClient.post).toHaveBeenCalledWith('/agent/notifications/read-all');
    expect(result).toEqual(mockResponse);
  });
});

describe('Agent API Error Handling', () => {
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
    await expect(agentDashboardApi.getStats()).rejects.toThrow('Network error');
  });

  it('should handle API errors in conversations', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Server error'));

    // Act & Assert
    await expect(agentConversationsApi.getConversations({})).rejects.toThrow('Server error');
  });

  it('should handle errors when sending message', async () => {
    // Arrange
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Message send failed'));

    // Act & Assert
    await expect(agentConversationsApi.sendMessage('conv-1', 'Hello')).rejects.toThrow('Message send failed');
  });

  it('should handle errors when updating profile', async () => {
    // Arrange
    vi.mocked(apiClient.put).mockRejectedValue(new Error('Unauthorized'));

    // Act & Assert
    await expect(agentProfileApi.updateProfile({ name: 'Test' })).rejects.toThrow('Unauthorized');
  });

  it('should handle AI chat errors gracefully', async () => {
    // Arrange
    vi.mocked(apiClient.post).mockRejectedValue(new Error('AI service unavailable'));

    // Act & Assert
    await expect(agentAIChatApi.sendMessage('test')).rejects.toThrow('AI service unavailable');
  });
});

