// Admin Conversations Mock Data

export const mockConversations = [
  {
    id: 'conv-001',
    customerId: 'cust-101',
    customerName: 'Ahmet Yıldız',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust101',
    channel: 'whatsapp',
    status: 'active',
    priority: 'high',
    subject: 'Ürün iadesi talebi',
    lastMessage: 'Siparişimi iptal etmek istiyorum, nasıl yapabilirim?',
    lastMessageTime: '2025-12-10T10:23:00Z',
    unreadCount: 3,
    assignedAgent: {
      id: 'agent-001',
      name: 'Ayşe Yılmaz',
      avatar: 'https://i.pravatar.cc/150?u=agent001'
    },
    tags: ['iade', 'acil'],
    sentiment: 'negative',
    aiHandled: false,
    responseTime: '2.1 dk',
    createdAt: '2025-12-10T10:15:00Z'
  },
  {
    id: 'conv-002',
    customerId: 'cust-102',
    customerName: 'Elif Kara',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust102',
    channel: 'instagram',
    status: 'waiting',
    priority: 'medium',
    subject: 'Ürün fiyat bilgisi',
    lastMessage: 'Merhaba, 42 numara ayakkabınız var mı?',
    lastMessageTime: '2025-12-10T10:18:00Z',
    unreadCount: 1,
    assignedAgent: null,
    tags: ['fiyat', 'ürün'],
    sentiment: 'neutral',
    aiHandled: true,
    responseTime: '0.5 dk',
    createdAt: '2025-12-10T10:17:00Z'
  },
  {
    id: 'conv-003',
    customerId: 'cust-103',
    customerName: 'Mehmet Arslan',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust103',
    channel: 'web',
    status: 'resolved',
    priority: 'low',
    subject: 'Randevu talebi',
    lastMessage: 'Teşekkürler, randevumu oluşturdum.',
    lastMessageTime: '2025-12-10T09:45:00Z',
    unreadCount: 0,
    assignedAgent: {
      id: 'agent-003',
      name: 'Zeynep Demir',
      avatar: 'https://i.pravatar.cc/150?u=agent003'
    },
    tags: ['randevu', 'çözüldü'],
    sentiment: 'positive',
    aiHandled: true,
    responseTime: '1.2 dk',
    createdAt: '2025-12-10T09:30:00Z',
    resolvedAt: '2025-12-10T09:45:00Z'
  },
  {
    id: 'conv-004',
    customerId: 'cust-104',
    customerName: 'Fatma Özkan',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust104',
    channel: 'facebook',
    status: 'active',
    priority: 'high',
    subject: 'Ödeme sorunu',
    lastMessage: 'Kart bilgilerimi girdim ama ödeme yapamıyorum',
    lastMessageTime: '2025-12-10T10:25:00Z',
    unreadCount: 2,
    assignedAgent: {
      id: 'agent-002',
      name: 'Mehmet Kaya',
      avatar: 'https://i.pravatar.cc/150?u=agent002'
    },
    tags: ['ödeme', 'teknik'],
    sentiment: 'negative',
    aiHandled: false,
    responseTime: '3.5 dk',
    createdAt: '2025-12-10T10:20:00Z'
  },
  {
    id: 'conv-005',
    customerId: 'cust-105',
    customerName: 'Can Şahin',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust105',
    channel: 'whatsapp',
    status: 'waiting',
    priority: 'medium',
    subject: 'Kargo takibi',
    lastMessage: 'Siparişim ne zaman gelir?',
    lastMessageTime: '2025-12-10T10:10:00Z',
    unreadCount: 1,
    assignedAgent: null,
    tags: ['kargo', 'takip'],
    sentiment: 'neutral',
    aiHandled: true,
    responseTime: '0.8 dk',
    createdAt: '2025-12-10T10:09:00Z'
  }
];

export const mockConversationMessages = {
  'conv-001': [
    {
      id: 'msg-001-1',
      senderId: 'cust-101',
      senderName: 'Ahmet Yıldız',
      senderType: 'customer',
      content: 'Merhaba, 3 gün önce aldığım ürünü iade etmek istiyorum.',
      timestamp: '2025-12-10T10:15:00Z',
      read: true
    },
    {
      id: 'msg-001-2',
      senderId: 'agent-001',
      senderName: 'Ayşe Yılmaz',
      senderType: 'agent',
      content: 'Merhaba Ahmet Bey, iade işleminizde size yardımcı olabilirim. Sipariş numaranızı alabilir miyim?',
      timestamp: '2025-12-10T10:17:00Z',
      read: true
    },
    {
      id: 'msg-001-3',
      senderId: 'cust-101',
      senderName: 'Ahmet Yıldız',
      senderType: 'customer',
      content: 'Sipariş numaram: #AS-2025-1247',
      timestamp: '2025-12-10T10:18:00Z',
      read: true
    },
    {
      id: 'msg-001-4',
      senderId: 'agent-001',
      senderName: 'Ayşe Yılmaz',
      senderType: 'agent',
      content: 'Teşekkürler. Siparişinizi kontrol ediyorum...',
      timestamp: '2025-12-10T10:19:00Z',
      read: true
    },
    {
      id: 'msg-001-5',
      senderId: 'cust-101',
      senderName: 'Ahmet Yıldız',
      senderType: 'customer',
      content: 'Siparişimi iptal etmek istiyorum, nasıl yapabilirim?',
      timestamp: '2025-12-10T10:23:00Z',
      read: false
    }
  ]
};

export const mockConversationStats = {
  total: 2847,
  active: 127,
  waiting: 43,
  resolved: 2677,
  avgResponseTime: '2.3 dk',
  aiHandledPercentage: 78.5,
  satisfactionRate: 94.2
};

export const mockConversationFilters = {
  channels: ['whatsapp', 'instagram', 'facebook', 'web'],
  statuses: ['active', 'waiting', 'resolved', 'closed'],
  priorities: ['high', 'medium', 'low'],
  agents: [
    { id: 'agent-001', name: 'Ayşe Yılmaz' },
    { id: 'agent-002', name: 'Mehmet Kaya' },
    { id: 'agent-003', name: 'Zeynep Demir' },
    { id: 'agent-004', name: 'Can Öztürk' }
  ],
  tags: ['iade', 'fiyat', 'ürün', 'randevu', 'kargo', 'teknik', 'ödeme']
};
