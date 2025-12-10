/**
 * Mock Data for Team API
 */

import { mockDelay } from '../config';
import { 
  mockTeamMembers, 
  mockTeamDepartments, 
  mockTeamChat,
  mockRoles,
  mockPermissions 
} from '@/data/mocks';

export const mockTeamApi = {
  async getTeamMembers() {
    await mockDelay();
    return mockTeamMembers;
  },

  async getTeamMemberById(id: string) {
    await mockDelay();
    return mockTeamMembers.find(m => m.id === id) || null;
  },

  async updateTeamMember(id: string, data: any) {
    await mockDelay();
    return { success: true, id, ...data };
  },

  async deleteTeamMember(id: string) {
    await mockDelay();
    return { success: true, id };
  },

  async getDepartments() {
    await mockDelay();
    return mockTeamDepartments;
  },

  async getTeamChat() {
    await mockDelay();
    return mockTeamChat;
  },

  async sendTeamMessage(channelId: string, message: string) {
    await mockDelay();
    return {
      success: true,
      messageId: `team-msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  },

  async getRoles() {
    await mockDelay();
    return mockRoles;
  },

  async getPermissions() {
    await mockDelay();
    return mockPermissions;
  }
};
