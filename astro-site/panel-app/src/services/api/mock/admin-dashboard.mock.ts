/**
 * Mock Data for Admin Dashboard API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import { 
  mockAdminKPIs, 
  mockConversationTrend, 
  mockChannelDistribution,
  mockPeakHours,
  mockRecentAlerts,
  mockTeamPerformance,
  mockTopIssues
} from '@/data/mocks';

/**
 * Mock API implementations for Admin Dashboard
 */
export const mockAdminDashboardApi = {
  async getKPIs() {
    await mockDelay();
    return mockAdminKPIs;
  },

  async getConversationTrend(period: '7d' | '30d' | '90d' = '7d') {
    await mockDelay();
    // Return data based on period
    if (period === '7d') {
      return mockConversationTrend;
    }
    // For other periods, you can generate or return expanded data
    return mockConversationTrend;
  },

  async getChannelDistribution() {
    await mockDelay();
    return mockChannelDistribution;
  },

  async getPeakHours() {
    await mockDelay();
    return mockPeakHours;
  },

  async getRecentAlerts(limit: number = 3) {
    await mockDelay();
    return mockRecentAlerts.slice(0, limit);
  },

  async getTeamPerformance() {
    await mockDelay();
    return mockTeamPerformance;
  },

  async getTopIssues(limit: number = 7) {
    await mockDelay();
    return mockTopIssues.slice(0, limit);
  },

  async refreshDashboard() {
    await mockDelay(1000);
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }
};
