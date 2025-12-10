// Admin Team & Settings Mock Data

export const mockTeamMembers = [
  {
    id: 'agent-001',
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@demo.com',
    avatar: 'https://i.pravatar.cc/150?u=agent001',
    role: 'senior_agent',
    status: 'online',
    department: 'Müşteri Hizmetleri',
    joinDate: '2024-03-15',
    stats: {
      conversationsToday: 24,
      avgResponseTime: '1.8 dk',
      satisfactionScore: 96.5
    },
    permissions: ['view_conversations', 'reply_messages', 'assign_conversations', 'view_reports']
  },
  {
    id: 'agent-002',
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@demo.com',
    avatar: 'https://i.pravatar.cc/150?u=agent002',
    role: 'agent',
    status: 'online',
    department: 'Müşteri Hizmetleri',
    joinDate: '2024-05-20',
    stats: {
      conversationsToday: 19,
      avgResponseTime: '2.1 dk',
      satisfactionScore: 94.2
    },
    permissions: ['view_conversations', 'reply_messages']
  },
  {
    id: 'agent-003',
    name: 'Zeynep Demir',
    email: 'zeynep.demir@demo.com',
    avatar: 'https://i.pravatar.cc/150?u=agent003',
    role: 'team_lead',
    status: 'busy',
    department: 'Müşteri Hizmetleri',
    joinDate: '2024-01-10',
    stats: {
      conversationsToday: 27,
      avgResponseTime: '1.5 dk',
      satisfactionScore: 97.8
    },
    permissions: ['view_conversations', 'reply_messages', 'assign_conversations', 'view_reports', 'manage_team']
  },
  {
    id: 'agent-004',
    name: 'Can Öztürk',
    email: 'can.ozturk@demo.com',
    avatar: 'https://i.pravatar.cc/150?u=agent004',
    role: 'agent',
    status: 'offline',
    department: 'Teknik Destek',
    joinDate: '2024-07-01',
    stats: {
      conversationsToday: 0,
      avgResponseTime: '2.4 dk',
      satisfactionScore: 92.1
    },
    permissions: ['view_conversations', 'reply_messages']
  },
  {
    id: 'admin-001',
    name: 'Emir Yücel',
    email: 'emir.yucel@demo.com',
    avatar: 'https://i.pravatar.cc/150?u=admin001',
    role: 'admin',
    status: 'online',
    department: 'Yönetim',
    joinDate: '2023-11-01',
    stats: {
      conversationsToday: 5,
      avgResponseTime: '1.2 dk',
      satisfactionScore: 98.3
    },
    permissions: ['all']
  }
];

export const mockTeamDepartments = [
  {
    id: 'dept-001',
    name: 'Müşteri Hizmetleri',
    memberCount: 3,
    avgResponseTime: '1.9 dk',
    satisfactionRate: 95.8
  },
  {
    id: 'dept-002',
    name: 'Teknik Destek',
    memberCount: 1,
    avgResponseTime: '2.4 dk',
    satisfactionRate: 92.1
  },
  {
    id: 'dept-003',
    name: 'Yönetim',
    memberCount: 1,
    avgResponseTime: '1.2 dk',
    satisfactionRate: 98.3
  }
];

export const mockTeamChat = {
  channels: [
    {
      id: 'channel-001',
      name: 'Genel',
      type: 'public',
      memberCount: 5,
      unreadCount: 3,
      lastMessage: {
        senderId: 'agent-003',
        senderName: 'Zeynep Demir',
        content: 'Yeni müşteriler için hoş geldin mesajı şablonunu güncelledim',
        timestamp: '2025-12-10T10:15:00Z'
      }
    },
    {
      id: 'channel-002',
      name: 'Teknik',
      type: 'public',
      memberCount: 3,
      unreadCount: 0,
      lastMessage: {
        senderId: 'agent-004',
        senderName: 'Can Öztürk',
        content: 'Ödeme sistemi güncellemesi tamamlandı',
        timestamp: '2025-12-10T09:42:00Z'
      }
    },
    {
      id: 'channel-003',
      name: 'Duyurular',
      type: 'announcement',
      memberCount: 5,
      unreadCount: 1,
      lastMessage: {
        senderId: 'admin-001',
        senderName: 'Emir Yücel',
        content: 'Yarın saat 14:00\'te haftalık toplantımız var',
        timestamp: '2025-12-10T08:30:00Z'
      }
    }
  ],
  messages: {
    'channel-001': [
      {
        id: 'tchat-001',
        senderId: 'agent-001',
        senderName: 'Ayşe Yılmaz',
        senderAvatar: 'https://i.pravatar.cc/150?u=agent001',
        content: 'Bugün müşteri yoğunluğu fazla olabilir, hazırlıklı olalım',
        timestamp: '2025-12-10T08:45:00Z',
        reactions: [{ emoji: '👍', count: 3, users: ['agent-002', 'agent-003', 'agent-004'] }]
      },
      {
        id: 'tchat-002',
        senderId: 'agent-002',
        senderName: 'Mehmet Kaya',
        senderAvatar: 'https://i.pravatar.cc/150?u=agent002',
        content: 'Tamam, ben hazırım!',
        timestamp: '2025-12-10T08:47:00Z',
        reactions: []
      },
      {
        id: 'tchat-003',
        senderId: 'agent-003',
        senderName: 'Zeynep Demir',
        senderAvatar: 'https://i.pravatar.cc/150?u=agent003',
        content: 'Yeni müşteriler için hoş geldin mesajı şablonunu güncelledim',
        timestamp: '2025-12-10T10:15:00Z',
        reactions: [{ emoji: '🎉', count: 2, users: ['agent-001', 'admin-001'] }]
      }
    ]
  }
};

export const mockRoles = [
  { id: 'agent', name: 'Temsilci', description: 'Müşteri sohbetlerini yönetir' },
  { id: 'senior_agent', name: 'Kıdemli Temsilci', description: 'Temsilci + Sohbet atama yetkisi' },
  { id: 'team_lead', name: 'Takım Lideri', description: 'Kıdemli Temsilci + Takım yönetimi' },
  { id: 'admin', name: 'Yönetici', description: 'Tüm yetkilere sahip' }
];

export const mockPermissions = [
  'view_conversations',
  'reply_messages',
  'assign_conversations',
  'view_reports',
  'export_reports',
  'manage_team',
  'manage_settings',
  'view_analytics',
  'manage_integrations'
];
