/**
 * Admin Panel API Service
 * All backend API calls for admin panel
 * 
 * @module services/api/admin
 */

import { apiClient } from '@/lib/api/client';
import type {
  Conversation,
  TeamChatMessage,
  Dashboard,
  Report,
  TeamMember,
  Settings,
} from '@/types';

// ==================== DASHBOARD ====================

export const adminDashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(dateRange: string = '30d') {
    const response = await apiClient.get('/admin/dashboard/stats', {
      params: { dateRange },
    });
    return response.data;
  },

  /**
   * Get recent activities
   */
  async getActivities(limit: number = 10) {
    const response = await apiClient.get('/admin/dashboard/activities', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get alerts
   */
  async getAlerts() {
    const response = await apiClient.get('/admin/dashboard/alerts');
    return response.data;
  },
};

// ==================== CONVERSATIONS ====================

export const adminConversationsApi = {
  /**
   * Get all conversations with filters
   */
  async getConversations(filters?: {
    status?: string;
    priority?: string;
    channel?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<{ data: Conversation[]; total: number }>(
      '/admin/conversations',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get single conversation
   */
  async getConversation(id: string) {
    const response = await apiClient.get<Conversation>(`/admin/conversations/${id}`);
    return response.data;
  },

  /**
   * Assign conversation to agent
   */
  async assignConversation(conversationId: string, agentId: string) {
    const response = await apiClient.post(`/admin/conversations/${conversationId}/assign`, {
      agentId,
    });
    return response.data;
  },

  /**
   * Resolve conversation
   */
  async resolveConversation(conversationId: string) {
    const response = await apiClient.post(`/admin/conversations/${conversationId}/resolve`);
    return response.data;
  },
};

// ==================== REPORTS ====================

export const adminReportsApi = {
  /**
   * Get report data by category
   */
  async getReport(category: string, dateRange: string = '30d') {
    const response = await apiClient.get(`/admin/reports/${category}`, {
      params: { dateRange },
    });
    return response.data;
  },

  /**
   * Export report as PDF
   */
  async exportPDF(category: string, dateRange: string = '30d') {
    const response = await apiClient.get(`/admin/reports/${category}/export/pdf`, {
      params: { dateRange },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export report as Excel
   */
  async exportExcel(category: string, dateRange: string = '30d') {
    const response = await apiClient.get(`/admin/reports/${category}/export/excel`, {
      params: { dateRange },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export report as CSV
   */
  async exportCSV(category: string, dateRange: string = '30d') {
    const response = await apiClient.get(`/admin/reports/${category}/export/csv`, {
      params: { dateRange },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get quick stats
   */
  async getQuickStats(dateRange: string = '30d') {
    const response = await apiClient.get('/admin/reports/quick-stats', {
      params: { dateRange },
    });
    return response.data;
  },
};

// ==================== TEAM ====================

export const adminTeamApi = {
  /**
   * Get all team members
   */
  async getTeamMembers() {
    const response = await apiClient.get<TeamMember[]>('/admin/team/members');
    return response.data;
  },

  /**
   * Get team member by ID
   */
  async getTeamMember(id: string) {
    const response = await apiClient.get<TeamMember>(`/admin/team/members/${id}`);
    return response.data;
  },

  /**
   * Create team member
   */
  async createTeamMember(data: Partial<TeamMember>) {
    const response = await apiClient.post<TeamMember>('/admin/team/members', data);
    return response.data;
  },

  /**
   * Update team member
   */
  async updateTeamMember(id: string, data: Partial<TeamMember>) {
    const response = await apiClient.put<TeamMember>(`/admin/team/members/${id}`, data);
    return response.data;
  },

  /**
   * Delete team member
   */
  async deleteTeamMember(id: string) {
    const response = await apiClient.delete(`/admin/team/members/${id}`);
    return response.data;
  },
};

// ==================== TEAM CHAT ====================

export const adminTeamChatApi = {
  /**
   * Get team chat messages
   */
  async getMessages(channelId: string, limit: number = 50) {
    const response = await apiClient.get<TeamChatMessage[]>('/admin/team-chat/messages', {
      params: { channelId, limit },
    });
    return response.data;
  },

  /**
   * Send message
   */
  async sendMessage(channelId: string, content: string, attachments?: string[]) {
    const response = await apiClient.post<TeamChatMessage>('/admin/team-chat/messages', {
      channelId,
      content,
      attachments,
    });
    return response.data;
  },

  /**
   * Search messages
   */
  async searchMessages(query: string, channelId?: string) {
    const response = await apiClient.get<TeamChatMessage[]>('/admin/team-chat/search', {
      params: { query, channelId },
    });
    return response.data;
  },

  /**
   * Get channels
   */
  async getChannels() {
    const response = await apiClient.get('/admin/team-chat/channels');
    return response.data;
  },

  /**
   * Create channel
   */
  async createChannel(name: string, members: string[]) {
    const response = await apiClient.post('/admin/team-chat/channels', {
      name,
      members,
    });
    return response.data;
  },
};

// ==================== SETTINGS ====================

export const adminSettingsApi = {
  /**
   * Get all settings
   */
  async getSettings() {
    const response = await apiClient.get<Settings>('/admin/settings');
    return response.data;
  },

  /**
   * Update settings
   */
  async updateSettings(section: string, data: Record<string, any>) {
    const response = await apiClient.put(`/admin/settings/${section}`, data);
    return response.data;
  },

  /**
   * Upload file (logo, avatar, etc.)
   */
  async uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/admin/settings/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ==================== HELP ====================

export const adminHelpApi = {
  /**
   * Get FAQ items
   */
  async getFAQ() {
    const response = await apiClient.get('/admin/help/faq');
    return response.data;
  },

  /**
   * Search help articles
   */
  async searchHelp(query: string) {
    const response = await apiClient.get('/admin/help/search', {
      params: { query },
    });
    return response.data;
  },

  /**
   * Submit support ticket
   */
  async submitTicket(data: {
    subject: string;
    description: string;
    priority: string;
    attachments?: string[];
  }) {
    const response = await apiClient.post('/admin/help/tickets', data);
    return response.data;
  },
};

