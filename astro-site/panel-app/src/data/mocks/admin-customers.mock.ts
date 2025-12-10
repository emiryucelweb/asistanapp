/**
 * Admin Panel - Ultra Detailed Customer Data
 * Realistic customer profiles with full engagement history
 */

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  segment: 'vip' | 'regular' | 'potential' | 'at-risk';
  status: 'active' | 'inactive' | 'blocked';
  joinDate: string;
  lastPurchase?: string;
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  averageOrderValue: number;
  location: {
    city: string;
    country: string;
  };
  tags: string[];
  notes?: string;
  assignedAgent?: {
    id: string;
    name: string;
  };
  communicationPreference: 'whatsapp' | 'email' | 'sms' | 'phone';
  satisfactionScore: number; // 1-5
  engagementLevel: 'high' | 'medium' | 'low';
}

export const mockAdminCustomers: AdminCustomer[] = [
  {
    id: 'cust-001',
    name: 'Ahmet Yıldırım',
    email: 'ahmet.yildirim@example.com',
    phone: '+905301234567',
    avatar: 'https://i.pravatar.cc/150?u=cust001',
    segment: 'vip',
    status: 'active',
    joinDate: '2024-03-15',
    lastPurchase: '2025-12-08',
    totalOrders: 47,
    totalSpent: 42350.75,
    lifetimeValue: 45280.50,
    averageOrderValue: 901.08,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: ['vip', 'sadık-müşteri', 'yüksek-değer'],
    notes: 'Premium müşteri, aylık düzenli alışveriş yapıyor',
    assignedAgent: {
      id: 'agent-001',
      name: 'Zeynep Kaya'
    },
    communicationPreference: 'whatsapp',
    satisfactionScore: 4.8,
    engagementLevel: 'high'
  },
  {
    id: 'cust-002',
    name: 'Elif Demir',
    email: 'elif.demir@example.com',
    phone: '+905312345678',
    avatar: 'https://i.pravatar.cc/150?u=cust002',
    segment: 'regular',
    status: 'active',
    joinDate: '2024-08-22',
    lastPurchase: '2025-12-05',
    totalOrders: 12,
    totalSpent: 8450.30,
    lifetimeValue: 9120.45,
    averageOrderValue: 704.19,
    location: {
      city: 'Ankara',
      country: 'Türkiye'
    },
    tags: ['aktif', 'kampanya-takipçisi'],
    assignedAgent: {
      id: 'agent-002',
      name: 'Mehmet Özkan'
    },
    communicationPreference: 'email',
    satisfactionScore: 4.5,
    engagementLevel: 'medium'
  },
  {
    id: 'cust-003',
    name: 'Can Öztürk',
    email: 'can.ozturk@example.com',
    phone: '+905323456789',
    avatar: 'https://i.pravatar.cc/150?u=cust003',
    segment: 'potential',
    status: 'active',
    joinDate: '2025-11-10',
    lastPurchase: '2025-11-12',
    totalOrders: 2,
    totalSpent: 1250.00,
    lifetimeValue: 1350.00,
    averageOrderValue: 625.00,
    location: {
      city: 'İzmir',
      country: 'Türkiye'
    },
    tags: ['yeni-müşteri', 'potansiyel'],
    communicationPreference: 'sms',
    satisfactionScore: 4.2,
    engagementLevel: 'medium'
  },
  {
    id: 'cust-004',
    name: 'Ayşe Kara',
    email: 'ayse.kara@example.com',
    phone: '+905334567890',
    avatar: 'https://i.pravatar.cc/150?u=cust004',
    segment: 'at-risk',
    status: 'active',
    joinDate: '2023-05-18',
    lastPurchase: '2025-06-20',
    totalOrders: 23,
    totalSpent: 15680.90,
    lifetimeValue: 16890.20,
    averageOrderValue: 681.78,
    location: {
      city: 'Bursa',
      country: 'Türkiye'
    },
    tags: ['riskli', 'uzun-süre-alışveriş-yok'],
    notes: 'Son 5 aydır alışveriş yapmadı, kazanma kampanyası gönderilmeli',
    assignedAgent: {
      id: 'agent-001',
      name: 'Zeynep Kaya'
    },
    communicationPreference: 'email',
    satisfactionScore: 3.8,
    engagementLevel: 'low'
  },
  {
    id: 'cust-005',
    name: 'Mehmet Yılmaz',
    email: 'mehmet.yilmaz@example.com',
    phone: '+905345678901',
    avatar: 'https://i.pravatar.cc/150?u=cust005',
    segment: 'vip',
    status: 'active',
    joinDate: '2023-01-10',
    lastPurchase: '2025-12-09',
    totalOrders: 89,
    totalSpent: 78920.50,
    lifetimeValue: 85670.80,
    averageOrderValue: 886.75,
    location: {
      city: 'Antalya',
      country: 'Türkiye'
    },
    tags: ['vip', 'en-sadık-müşteri', 'referans-veriyor'],
    notes: 'Şirketin en değerli müşterilerinden, arkadaşlarını yönlendiriyor',
    assignedAgent: {
      id: 'agent-003',
      name: 'Ali Yıldız'
    },
    communicationPreference: 'whatsapp',
    satisfactionScore: 5.0,
    engagementLevel: 'high'
  },
  {
    id: 'cust-006',
    name: 'Fatma Şahin',
    email: 'fatma.sahin@example.com',
    phone: '+905356789012',
    avatar: 'https://i.pravatar.cc/150?u=cust006',
    segment: 'regular',
    status: 'active',
    joinDate: '2024-06-05',
    lastPurchase: '2025-11-28',
    totalOrders: 18,
    totalSpent: 12340.60,
    lifetimeValue: 13560.90,
    averageOrderValue: 685.59,
    location: {
      city: 'Adana',
      country: 'Türkiye'
    },
    tags: ['düzenli-müşteri', 'sezonluk-alışveriş'],
    communicationPreference: 'email',
    satisfactionScore: 4.4,
    engagementLevel: 'medium'
  },
  {
    id: 'cust-007',
    name: 'Hasan Çelik',
    email: 'hasan.celik@example.com',
    phone: '+905367890123',
    segment: 'regular',
    status: 'inactive',
    joinDate: '2024-02-14',
    lastPurchase: '2025-03-10',
    totalOrders: 8,
    totalSpent: 4560.40,
    lifetimeValue: 5120.80,
    averageOrderValue: 570.05,
    location: {
      city: 'Konya',
      country: 'Türkiye'
    },
    tags: ['pasif', 'geri-kazanılmalı'],
    notes: '9 aydır hiç alışveriş yapmadı',
    communicationPreference: 'phone',
    satisfactionScore: 3.5,
    engagementLevel: 'low'
  },
  {
    id: 'cust-008',
    name: 'Zeynep Arslan',
    email: 'zeynep.arslan@example.com',
    phone: '+905378901234',
    avatar: 'https://i.pravatar.cc/150?u=cust008',
    segment: 'regular',
    status: 'active',
    joinDate: '2024-09-20',
    lastPurchase: '2025-12-07',
    totalOrders: 15,
    totalSpent: 9870.25,
    lifetimeValue: 10650.70,
    averageOrderValue: 658.02,
    location: {
      city: 'Gaziantep',
      country: 'Türkiye'
    },
    tags: ['aktif', 'hızlı-karar-verici'],
    assignedAgent: {
      id: 'agent-002',
      name: 'Mehmet Özkan'
    },
    communicationPreference: 'whatsapp',
    satisfactionScore: 4.6,
    engagementLevel: 'high'
  },
  {
    id: 'cust-009',
    name: 'Burak Aydın',
    email: 'burak.aydin@example.com',
    phone: '+905389012345',
    avatar: 'https://i.pravatar.cc/150?u=cust009',
    segment: 'potential',
    status: 'active',
    joinDate: '2025-10-15',
    lastPurchase: '2025-12-01',
    totalOrders: 3,
    totalSpent: 1890.75,
    lifetimeValue: 2050.90,
    averageOrderValue: 630.25,
    location: {
      city: 'Kayseri',
      country: 'Türkiye'
    },
    tags: ['yeni-müşteri', 'fiyat-odaklı'],
    communicationPreference: 'email',
    satisfactionScore: 4.0,
    engagementLevel: 'medium'
  },
  {
    id: 'cust-010',
    name: 'Selin Koç',
    email: 'selin.koc@example.com',
    phone: '+905390123456',
    avatar: 'https://i.pravatar.cc/150?u=cust010',
    segment: 'vip',
    status: 'active',
    joinDate: '2023-11-08',
    lastPurchase: '2025-12-10',
    totalOrders: 56,
    totalSpent: 52340.90,
    lifetimeValue: 56780.40,
    averageOrderValue: 934.66,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: ['vip', 'moda-tutkunu', 'trend-takipçisi'],
    notes: 'Her yeni ürün çıktığında ilk alan müşterilerden',
    assignedAgent: {
      id: 'agent-001',
      name: 'Zeynep Kaya'
    },
    communicationPreference: 'whatsapp',
    satisfactionScore: 4.9,
    engagementLevel: 'high'
  }
];

// Customer Statistics
export const mockCustomerStats = {
  total: 1847,
  active: 1523,
  inactive: 312,
  blocked: 12,
  vip: 87,
  regular: 1524,
  potential: 156,
  atRisk: 80,
  averageLifetimeValue: 8456.30,
  totalRevenue: 15619478.10,
  segmentDistribution: {
    vip: 4.7,
    regular: 82.5,
    potential: 8.4,
    atRisk: 4.4
  }
};
