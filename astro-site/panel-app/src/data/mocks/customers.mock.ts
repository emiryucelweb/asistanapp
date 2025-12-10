// Customer Data Mock

export const mockCustomers = [
  {
    id: 'cust-001',
    name: 'Ahmet Yıldız',
    email: 'ahmet.yildiz@email.com',
    phone: '+90 532 111 2233',
    avatar: 'https://i.pravatar.cc/150?u=cust001',
    tags: ['vip', 'frequent'],
    lifetimeValue: 12450,
    totalConversations: 47,
    satisfactionScore: 4.8,
    lastContactDate: '2025-12-10T10:15:00Z',
    notes: 'Özel randevu saatleri tercih ediyor. Öğleden sonra aramayı tercih eder.',
    customFields: {
      preferredDoctor: 'Dr. Ayşe Kaya',
      allergies: 'Penisilin',
      insuranceProvider: 'Axa Sigorta'
    }
  },
  {
    id: 'cust-002',
    name: 'Elif Kara',
    email: 'elif.kara@email.com',
    phone: '+90 533 222 3344',
    avatar: 'https://i.pravatar.cc/150?u=cust002',
    tags: ['new'],
    lifetimeValue: 850,
    totalConversations: 3,
    satisfactionScore: 5.0,
    lastContactDate: '2025-12-10T10:18:00Z',
    notes: 'Yeni müşteri, fiyat konusunda hassas',
    customFields: {
      referralSource: 'Instagram'
    }
  },
  {
    id: 'cust-003',
    name: 'Mehmet Arslan',
    email: 'mehmet.arslan@email.com',
    phone: '+90 534 333 4455',
    avatar: 'https://i.pravatar.cc/150?u=cust003',
    tags: ['regular'],
    lifetimeValue: 5670,
    totalConversations: 24,
    satisfactionScore: 4.6,
    lastContactDate: '2025-12-10T09:45:00Z',
    notes: 'Düzenli kontroller için geliyor',
    customFields: {
      treatmentPlan: 'Ortodonti',
      nextAppointment: '2025-12-15'
    }
  }
];

export const mockCustomerHistory = {
  'cust-001': {
    conversations: [
      {
        id: 'conv-hist-001',
        date: '2025-12-10',
        channel: 'whatsapp',
        subject: 'Ürün iadesi',
        status: 'active',
        agent: 'Ayşe Yılmaz'
      },
      {
        id: 'conv-hist-002',
        date: '2025-12-03',
        channel: 'web',
        subject: 'Randevu değişikliği',
        status: 'resolved',
        agent: 'Zeynep Demir'
      },
      {
        id: 'conv-hist-003',
        date: '2025-11-28',
        channel: 'whatsapp',
        subject: 'Fiyat sorgusu',
        status: 'resolved',
        agent: 'Mehmet Kaya'
      }
    ],
    purchases: [
      {
        id: 'purchase-001',
        date: '2025-11-15',
        amount: 3500,
        items: ['Diş beyazlatma'],
        status: 'completed'
      },
      {
        id: 'purchase-002',
        date: '2025-09-20',
        amount: 2800,
        items: ['Kanal tedavisi'],
        status: 'completed'
      }
    ],
    appointments: [
      {
        id: 'appt-001',
        date: '2025-12-15T14:00:00Z',
        service: 'Kontrol muayenesi',
        doctor: 'Dr. Ayşe Kaya',
        status: 'scheduled'
      },
      {
        id: 'appt-002',
        date: '2025-11-15T10:00:00Z',
        service: 'Diş beyazlatma',
        doctor: 'Dr. Ayşe Kaya',
        status: 'completed'
      }
    ]
  }
};

export const mockCustomerSegments = [
  { id: 'seg-001', name: 'VIP Müşteriler', count: 47, criteria: 'lifetimeValue > 10000' },
  { id: 'seg-002', name: 'Yeni Müşteriler', count: 123, criteria: 'totalConversations < 5' },
  { id: 'seg-003', name: 'Risk Altında', count: 18, criteria: 'lastContact > 90 days' },
  { id: 'seg-004', name: 'Aktif Müşteriler', count: 342, criteria: 'lastContact < 30 days' }
];
