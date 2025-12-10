/**
 * Mock Data for Settings API
 */

import { mockDelay } from '../config';
import { 
  mockBusinessProfile,
  mockChannelSettings,
  mockNotificationSettings,
  mockAISettings,
  mockIntegrations,
  mockSecuritySettings,
  mockCustomizationSettings
} from '@/data/mocks';

export const mockSettingsApi = {
  async getBusinessProfile() {
    await mockDelay();
    return mockBusinessProfile;
  },

  async updateBusinessProfile(data: any) {
    await mockDelay();
    return { success: true, ...data };
  },

  async getChannelSettings() {
    await mockDelay();
    return mockChannelSettings;
  },

  async updateChannelSettings(channel: string, data: any) {
    await mockDelay();
    return { success: true, channel, ...data };
  },

  async getNotificationSettings() {
    await mockDelay();
    return mockNotificationSettings;
  },

  async updateNotificationSettings(data: any) {
    await mockDelay();
    return { success: true, ...data };
  },

  async getAISettings() {
    await mockDelay();
    return mockAISettings;
  },

  async updateAISettings(data: any) {
    await mockDelay();
    return { success: true, ...data };
  },

  async getIntegrations() {
    await mockDelay();
    return mockIntegrations;
  },

  async connectIntegration(integrationId: string) {
    await mockDelay();
    return { success: true, integrationId, connected: true };
  },

  async disconnectIntegration(integrationId: string) {
    await mockDelay();
    return { success: true, integrationId, connected: false };
  },

  async getSecuritySettings() {
    await mockDelay();
    return mockSecuritySettings;
  },

  async updateSecuritySettings(data: any) {
    await mockDelay();
    return { success: true, ...data };
  },

  async getCustomizationSettings() {
    await mockDelay();
    return mockCustomizationSettings;
  },

  async updateCustomizationSettings(data: any) {
    await mockDelay();
    return { success: true, ...data };
  }
};
