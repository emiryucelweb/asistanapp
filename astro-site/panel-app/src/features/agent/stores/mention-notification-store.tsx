/**
 * Mention Notification Store
 * 
 * Global state for managing mention toast notifications in agent panel
 * Shows toast pop-up at bottom-right for 5 seconds
 * Used for testing and will be integrated with backend WebSocket
 */
import { create } from 'zustand';
import { logger } from '@/shared/utils/logger';

export interface MentionToastData {
  channelId: string;
  messageId: string;
  channelName: string;
  mentionedBy: string;
  message: string;
}

interface MentionNotificationStore {
  activeToast: MentionToastData | null;
  showToast: (toast: MentionToastData) => void;
  dismissToast: () => void;
  // Test function for DEV mode
  simulateMention: () => void;
}

export const useMentionNotificationStore = create<MentionNotificationStore>((set, get) => ({
  activeToast: null,
  
  showToast: (toast) => {
    logger.info('[MentionNotificationStore] Toast shown', { toast });
    set({ activeToast: toast });
  },
  
  dismissToast: () => {
    logger.info('[MentionNotificationStore] Toast dismissed');
    set({ activeToast: null });
  },
  
  // Test function - simulates receiving a mention notification
  // NOTE: Test data only - will be removed in production when WebSocket integration is complete
  simulateMention: () => {
    const testToast: MentionToastData = {
      channelId: 'channel-1',
      messageId: 'message-123',
      channelName: 'general-chat',
      mentionedBy: 'John Doe',
      message: 'Hey @Test User, I need your review on this topic. What do you think?',
    };
    
    get().showToast(testToast);
    logger.info('[MentionNotificationStore] Test mention simulated');
  },
}));

