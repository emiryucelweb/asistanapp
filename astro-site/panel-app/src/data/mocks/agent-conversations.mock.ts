/**
 * Agent Panel - Ultra Detailed Conversations Mock Data
 * Real-world conversation scenarios with full message histories
 */

export interface ConversationMessage {
  id: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'ai' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'location';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    duration?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface AgentConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone?: string;
  customerEmail?: string;
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'web' | 'phone';
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  assignedAgent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isAssignedToMe: boolean;
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  totalMessages: number;
  messages: ConversationMessage[];
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  aiHandled: boolean;
  aiStuck: boolean;
  responseTime: string;
  waitingTime?: string;
  createdAt: string;
  resolvedAt?: string;
  customerSatisfactionScore?: number;
  notes?: string;
}

export const mockAgentConversations: AgentConversation[] = [
  {
    id: 'conv-ag-001',
    customerId: 'cust-001',
    customerName: 'Ahmet Yıldırım',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust001',
    customerPhone: '+905301234567',
    customerEmail: 'ahmet.yildirim@example.com',
    channel: 'whatsapp',
    status: 'active',
    priority: 'high',
    assignedAgent: {
      id: 'agent-current',
      name: 'Ben (Zeynep Kaya)',
      avatar: 'https://i.pravatar.cc/150?u=agent-current'
    },
    isAssignedToMe: true,
    subject: 'Sipariş takibi - Acil',
    lastMessage: 'Peki teşekkürler, bekliyorum.',
    lastMessageTime: '2025-12-10T11:35:00Z',
    unreadCount: 0,
    totalMessages: 12,
    messages: [
      {
        id: 'msg-001-001',
        senderId: 'cust-001',
        senderType: 'customer',
        senderName: 'Ahmet Yıldırım',
        content: 'Merhaba, 3 gün önce verdiğim sipariş hala elime ulaşmadı. Kargo takip numarası AR123456789TR',
        timestamp: '2025-12-10T10:15:00Z',
        read: true,
        type: 'text'
      },
      {
        id: 'msg-001-002',
        senderId: 'ai-bot',
        senderType: 'ai',
        senderName: 'AI Asistan',
        content: 'Merhaba Ahmet Bey! Siparişiniz için üzgünüz. Kargo takip numaranızı kontrol ediyorum...',
        timestamp: '2025-12-10T10:15:30Z',
        read: true,
        type: 'text'
      }
    ],
    tags: ['kargo-sorunu', 'acil', 'çözüldü'],
    sentiment: 'positive',
    aiHandled: false,
    aiStuck: true,
    responseTime: '0.5 dk',
    waitingTime: '1 dk',
    createdAt: '2025-12-10T10:15:00Z',
    notes: 'Kargo gecikti, öncelikli gönderim + %15 kupon verildi'
  }
];

export const mockAgentStats = {
  activeConversations: 2,
  waitingConversations: 2,
  resolvedToday: 8,
  totalHandled: 47,
  avgResponseTime: '1.8 dk',
  satisfactionScore: 4.7,
  aiHandoffRate: 32.5,
  conversationsByChannel: {
    whatsapp: 23,
    instagram: 12,
    web: 8,
    facebook: 3,
    phone: 1
  }
};

export const mockQueueStats = {
  waiting: 2,
  avgWaitTime: '4.2 dk',
  longestWait: '8 dk',
  aiStuckCount: 2
};
