// Agent Dashboard Mock Data

export const mockAgentStats = {
  todayConversations: {
    value: 24,
    target: 30,
    percentage: 80
  },
  avgResponseTime: {
    value: '1.8 dk',
    target: '2.0 dk',
    performance: 'good'
  },
  satisfactionScore: {
    value: 96.5,
    target: 95.0,
    performance: 'excellent'
  },
  resolvedToday: {
    value: 21,
    total: 24,
    percentage: 87.5
  }
};

export const mockAgentQueue = [
  {
    id: 'queue-001',
    customerId: 'cust-201',
    customerName: 'Selin Aydın',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust201',
    channel: 'whatsapp',
    subject: 'Ürün bilgisi talebi',
    priority: 'high',
    waitTime: '3 dk',
    preview: 'Merhaba, bu ürünün stokta olup olmadığını öğrenebilir miyim?'
  },
  {
    id: 'queue-002',
    customerId: 'cust-202',
    customerName: 'Burak Çelik',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust202',
    channel: 'instagram',
    subject: 'Fiyat sorgusu',
    priority: 'medium',
    waitTime: '1 dk',
    preview: 'Fiyat listesini görebilir miyim?'
  },
  {
    id: 'queue-003',
    customerId: 'cust-203',
    customerName: 'Deniz Yurt',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust203',
    channel: 'web',
    subject: 'Randevu değişikliği',
    priority: 'medium',
    waitTime: '5 dk',
    preview: 'Randevumu ertelemek istiyorum.'
  }
];

export const mockAgentActiveConversations = [
  {
    id: 'active-001',
    customerId: 'cust-301',
    customerName: 'Aylin Şen',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust301',
    channel: 'whatsapp',
    subject: 'Kargo takibi',
    lastMessage: 'Anlıyorum, teşekkür ederim',
    lastMessageTime: '2 dk önce',
    unreadCount: 0,
    typing: false
  },
  {
    id: 'active-002',
    customerId: 'cust-302',
    customerName: 'Emre Polat',
    customerAvatar: 'https://i.pravatar.cc/150?u=cust302',
    channel: 'facebook',
    subject: 'Ödeme sorunu',
    lastMessage: 'Şimdi tekrar deniyorum...',
    lastMessageTime: '1 dk önce',
    unreadCount: 1,
    typing: true
  }
];

export const mockAgentPerformanceToday = {
  hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
  conversationsHandled: [2, 3, 4, 3, 2, 3, 4, 2, 1],
  avgResponseTimes: [1.5, 1.8, 2.1, 1.9, 1.7, 1.6, 2.0, 1.8, 1.5]
};

export const mockQuickReplies = [
  {
    id: 'qr-001',
    title: 'Hoş geldiniz',
    content: 'Merhaba! Size nasıl yardımcı olabilirim?',
    category: 'karşılama',
    usageCount: 142
  },
  {
    id: 'qr-002',
    title: 'Bilgi alınıyor',
    content: 'Bilgilerinizi kontrol ediyorum, lütfen bekleyin...',
    category: 'bekleme',
    usageCount: 98
  },
  {
    id: 'qr-003',
    title: 'Teşekkür',
    content: 'Yardımcı olabildiysem ne mutlu bana! İyi günler dilerim.',
    category: 'kapanış',
    usageCount: 156
  },
  {
    id: 'qr-004',
    title: 'Randevu onayı',
    content: 'Randevunuz başarıyla oluşturuldu. Size SMS ile bilgi göndereceğiz.',
    category: 'randevu',
    usageCount: 87
  }
];
