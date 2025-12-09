/**
 * MOCK DATA - For Development Only
 * TODO: Replace with real API calls in production
 */

import { logger } from '@/shared/utils/logger';

export interface MockConversation {
  id: string;
  customerName: string;
  channel: 'whatsapp' | 'instagram' | 'web' | 'facebook' | 'phone';
  status: 'waiting' | 'assigned' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedTo?: string;
  assignedToMe: boolean;
  isLocked: boolean;
  lockedBy?: string;
  aiStuck: boolean;
  sentiment?: 'happy' | 'neutral' | 'angry' | 'sad';
}

export const getMockConversations = (currentAgent: string): MockConversation[] => {
  if (!import.meta.env.DEV) {
    logger.warn('⚠️ Mock data is being used in production!');
  }

  return [
    {
      id: '1',
      customerName: 'Ahmet Bey',
      channel: 'whatsapp',
      status: 'waiting',
      priority: 'high',
      lastMessage: 'Siparişim nerede? Acil durum!',
      lastMessageTime: '2 dk önce',
      unreadCount: 3,
      assignedToMe: false,
      isLocked: false,
      aiStuck: true,
      sentiment: 'angry',
    },
    {
      id: '2',
      customerName: 'Zeynep Hanım',
      channel: 'instagram',
      status: 'assigned',
      priority: 'medium',
      lastMessage: 'Ürün iadesi yapmak istiyorum',
      lastMessageTime: '5 dk önce',
      unreadCount: 1,
      assignedTo: currentAgent,
      assignedToMe: true,
      isLocked: true,
      lockedBy: currentAgent,
      aiStuck: false,
      sentiment: 'neutral',
    },
    {
      id: '3',
      customerName: 'Mehmet Bey',
      channel: 'web',
      status: 'assigned',
      priority: 'low',
      lastMessage: 'Teşekkürler, çok yardımcı oldunuz',
      lastMessageTime: '10 dk önce',
      unreadCount: 0,
      assignedTo: 'Can Demir',
      assignedToMe: false,
      isLocked: true,
      lockedBy: 'Can Demir',
      aiStuck: false,
      sentiment: 'happy',
    },
    {
      id: '4',
      customerName: 'Ayşe Yılmaz',
      channel: 'facebook',
      status: 'resolved',
      priority: 'medium',
      lastMessage: 'Sorunum çözüldü, teşekkürler',
      lastMessageTime: '1 saat önce',
      unreadCount: 0,
      assignedTo: currentAgent,
      assignedToMe: true,
      isLocked: false,
      aiStuck: false,
      sentiment: 'happy',
    },
    {
      id: '5',
      customerName: 'Ali Yıldız',
      channel: 'phone',
      status: 'assigned',
      priority: 'high',
      lastMessage: 'Telefon araması - Asistan yardım istiyor',
      lastMessageTime: '30 sn önce',
      unreadCount: 0,
      assignedToMe: true,
      isLocked: true,
      lockedBy: currentAgent,
      aiStuck: true,
      sentiment: 'angry',
    },
    {
      id: '6',
      customerName: 'Fatma Şahin',
      channel: 'whatsapp',
      status: 'resolved',
      priority: 'low',
      lastMessage: 'Telefon görüşmesi özeti: Müşteri ürün bilgisi aldı ve sipariş verdi.',
      lastMessageTime: '15 dk önce',
      unreadCount: 0,
      assignedTo: currentAgent,
      assignedToMe: true,
      isLocked: false,
      aiStuck: false,
      sentiment: 'happy',
    },
  ];
};

export const getMockAgents = () => {
  if (!import.meta.env.DEV) {
    logger.warn('⚠️ Mock data is being used in production!');
  }

  return [
    { id: '1', name: 'Ayşe Yılmaz', status: 'online' as const, activeConversations: 3 },
    { id: '2', name: 'Mehmet Demir', status: 'online' as const, activeConversations: 5 },
    { id: '3', name: 'Zeynep Kaya', status: 'busy' as const, activeConversations: 8 },
    { id: '4', name: 'Ali Öztürk', status: 'offline' as const, activeConversations: 0 },
    { id: '5', name: 'Fatma Şahin', status: 'online' as const, activeConversations: 2 },
  ];
};


