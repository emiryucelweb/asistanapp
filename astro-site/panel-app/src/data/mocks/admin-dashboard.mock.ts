// Admin Dashboard Mock Data - KPIs, Statistics, Charts

export const mockAdminKPIs = {
  totalConversations: {
    value: 2847,
    change: 12.5,
    trend: 'up' as const,
    previousPeriod: 2532
  },
  activeCustomers: {
    value: 1923,
    change: 8.3,
    trend: 'up' as const,
    previousPeriod: 1776
  },
  responseTime: {
    value: '2.3 dk',
    change: -15.2,
    trend: 'down' as const,
    previousPeriod: '2.7 dk'
  },
  satisfactionRate: {
    value: 94.2,
    change: 3.1,
    trend: 'up' as const,
    previousPeriod: 91.4
  },
  aiResolutionRate: {
    value: 78.5,
    change: 5.7,
    trend: 'up' as const,
    previousPeriod: 74.3
  },
  teamUtilization: {
    value: 86.3,
    change: -2.4,
    trend: 'down' as const,
    previousPeriod: 88.4
  }
};

export const mockConversationTrend = [
  { date: '2025-12-03', total: 387, aiHandled: 301, humanHandled: 86 },
  { date: '2025-12-04', total: 412, aiHandled: 328, humanHandled: 84 },
  { date: '2025-12-05', total: 395, aiHandled: 315, humanHandled: 80 },
  { date: '2025-12-06', total: 428, aiHandled: 339, humanHandled: 89 },
  { date: '2025-12-07', total: 403, aiHandled: 321, humanHandled: 82 },
  { date: '2025-12-08', total: 389, aiHandled: 307, humanHandled: 82 },
  { date: '2025-12-09', total: 441, aiHandled: 354, humanHandled: 87 },
  { date: '2025-12-10', total: 392, aiHandled: 311, humanHandled: 81 }
];

export const mockChannelDistribution = [
  { channel: 'WhatsApp', count: 1247, percentage: 43.8, color: '#25D366' },
  { channel: 'Instagram', count: 823, percentage: 28.9, color: '#E4405F' },
  { channel: 'Web Chat', count: 512, percentage: 18.0, color: '#0084FF' },
  { channel: 'Facebook', count: 265, percentage: 9.3, color: '#1877F2' }
];

export const mockPeakHours = [
  { hour: '00:00', count: 12 },
  { hour: '01:00', count: 8 },
  { hour: '02:00', count: 5 },
  { hour: '03:00', count: 3 },
  { hour: '04:00', count: 4 },
  { hour: '05:00', count: 7 },
  { hour: '06:00', count: 15 },
  { hour: '07:00', count: 28 },
  { hour: '08:00', count: 45 },
  { hour: '09:00', count: 67 },
  { hour: '10:00', count: 89 },
  { hour: '11:00', count: 102 },
  { hour: '12:00', count: 95 },
  { hour: '13:00', count: 78 },
  { hour: '14:00', count: 92 },
  { hour: '15:00', count: 108 },
  { hour: '16:00', count: 112 },
  { hour: '17:00', count: 98 },
  { hour: '18:00', count: 87 },
  { hour: '19:00', count: 73 },
  { hour: '20:00', count: 56 },
  { hour: '21:00', count: 42 },
  { hour: '22:00', count: 31 },
  { hour: '23:00', count: 19 }
];

export const mockRecentAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'Yüksek bekleme süresi',
    message: 'Son 15 dakikada ortalama yanıt süresi 5 dakikayı aştı',
    timestamp: '2025-12-10T09:45:00Z',
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'AI performansı iyileşti',
    message: 'Bu hafta AI çözüm oranı %5.7 arttı',
    timestamp: '2025-12-10T08:30:00Z',
    read: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Yeni müşteri kaydı',
    message: '127 yeni müşteri bu hafta sisteme eklendi',
    timestamp: '2025-12-10T07:15:00Z',
    read: true
  }
];

export const mockTeamPerformance = [
  {
    agentId: 'agent-001',
    name: 'Ayşe Yılmaz',
    avatar: 'https://i.pravatar.cc/150?u=agent001',
    conversationsHandled: 87,
    avgResponseTime: '1.8 dk',
    satisfactionScore: 96.5,
    status: 'online' as const
  },
  {
    agentId: 'agent-002',
    name: 'Mehmet Kaya',
    avatar: 'https://i.pravatar.cc/150?u=agent002',
    conversationsHandled: 79,
    avgResponseTime: '2.1 dk',
    satisfactionScore: 94.2,
    status: 'online' as const
  },
  {
    agentId: 'agent-003',
    name: 'Zeynep Demir',
    avatar: 'https://i.pravatar.cc/150?u=agent003',
    conversationsHandled: 92,
    avgResponseTime: '1.5 dk',
    satisfactionScore: 97.8,
    status: 'busy' as const
  },
  {
    agentId: 'agent-004',
    name: 'Can Öztürk',
    avatar: 'https://i.pravatar.cc/150?u=agent004',
    conversationsHandled: 68,
    avgResponseTime: '2.4 dk',
    satisfactionScore: 92.1,
    status: 'offline' as const
  }
];

export const mockTopIssues = [
  { category: 'Ürün Bilgisi', count: 487, percentage: 17.1 },
  { category: 'Fiyat Sorgusu', count: 423, percentage: 14.9 },
  { category: 'Sipariş Takibi', count: 398, percentage: 14.0 },
  { category: 'Randevu', count: 367, percentage: 12.9 },
  { category: 'Teknik Destek', count: 312, percentage: 11.0 },
  { category: 'İptal/İade', count: 289, percentage: 10.2 },
  { category: 'Diğer', count: 571, percentage: 20.1 }
];
