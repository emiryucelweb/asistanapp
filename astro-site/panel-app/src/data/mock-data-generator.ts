/* =========================================
   AsistanApp - Advanced Mock Data Generator
   660 Müşteri Verisi (66 Sektör x 10 Müşteri)
   Zaman Bazlı Kategoriler: Bugün/Hafta/Ay/Yıl
========================================= */

import { businessTypeConfigs, BusinessType } from '@/shared/config/business-types';

// Türkçe isim havuzu (erkek/kadın karışık)
const TURKISH_NAMES = [
  'Ahmet Yılmaz', 'Fatma Kaya', 'Mehmet Demir', 'Ayşe Çelik', 'Mustafa Şahin',
  'Hatice Yıldız', 'Ali Özkan', 'Zeynep Arslan', 'Hüseyin Doğan', 'Elif Kara',
  'İbrahim Çetin', 'Meryem Aydın', 'Ömer Özdemir', 'Fadime Öztürk', 'Abdullah Güneş',
  'Hayriye Aksoy', 'Süleyman Polat', 'Rukiye Şimşek', 'Hasan Çakır', 'Cemile Yücel',
  'Recep Kılıç', 'Hanife Demirtaş', 'Yaşar Kaan', 'Sevgi Avcı', 'Kemal Tunç',
  'Gülseren Şener', 'Rıza Boyraz', 'Nurhan Ateş', 'Celal Bulut', 'Aysel Kaya',
  'Osman Erdoğan', 'Şerife Koç', 'Veli Aslan', 'Nazmiye Güler', 'Bekir Aktaş',
  'Saadet Yıldırım', 'Halil Can', 'Mediha Tekin', 'Ramazan Özer', 'Hatice Balık',
  'Sedat Korkmaz', 'Gülizar Acar', 'Turan Işık', 'Necla Soylu', 'Cahit Duman',
  'Pembe Bozkurt', 'Saim Önal', 'Fitnat Küçük', 'Ziya Kocaman', 'Hacer Ay',
  'Fikret Mutlu', 'Gülay Başer', 'Zeki Yavuz', 'Nazife Karaca', 'Oğuz Çiftçi',
  'Serpil Akyıldız', 'Cengiz Kaynak', 'Vildan Tunc', 'Erdal Sever', 'Zehra İnce'
];

// Genel mesaj şablonları (tüm sektörler için)

// Zaman kategorileri
type TimeCategory = 'today' | 'this_week' | 'this_month' | 'this_year';

// Dashboard istatistik veri yapısı
export interface DashboardStats {
  activeConversations: number;
  totalMessages: number;
  totalRevenue: number;
  vipCustomers: number;
  channelStats: {
    whatsapp: number;
    instagram: number;
    web: number;
    phone: number;
  };
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCustomers: number;
}

const getRandomTimeInCategory = (category: TimeCategory): Date => {
  const now = new Date();
  
  switch (category) {
    case 'today':
      return new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000); // Son 24 saat
    case 'this_week':
      return new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Son 7 gün
    case 'this_month':
      return new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Son 30 gün
    case 'this_year':
      return new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Son 365 gün
    default:
      return now;
  }
};

// Müşteri veri yapısı
export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessType: BusinessType;
  lastContact: Date;
  totalMessages: number;
  totalOrders: number;
  totalRevenue: number;
  customerSince: Date;
  status: 'active' | 'inactive' | 'potential';
  channel: 'whatsapp' | 'instagram' | 'web' | 'phone';
  lastMessage: string;
  isVip: boolean;
  timeCategory: TimeCategory;
}

// Müşteri verisi üreteci
const generateCustomerForSector = (
  businessType: BusinessType, 
  index: number, 
  timeCategory: TimeCategory
): MockCustomer => {
  const randomName = TURKISH_NAMES[Math.floor(Math.random() * TURKISH_NAMES.length)];
  const randomPhone = `+90 ${Math.floor(Math.random() * 900 + 500)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`;
  const randomEmail = `${randomName.toLowerCase().replace(/\s+/g, '.').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')}@gmail.com`;
  
  const lastContact = getRandomTimeInCategory(timeCategory);
  const customerSince = new Date(lastContact.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  
  // Sektöre özel temel mesaj şablonları
  const basicTemplates = [
    'Merhaba, bilgi almak istiyorum',
    'Ürünleriniz hakkında detay verebilir misiniz?',
    'Fiyat bilgisi alabilir miyim?',
    'Randevu almak istiyorum',
    'Siparişim hazır mı?',
    'Bu konuda yardım alabilir miyim?',
    'Hizmetleriniz neler?'
  ];
  const randomMessage = basicTemplates[Math.floor(Math.random() * basicTemplates.length)];
  
  return {
    id: `${businessType}_${index}_${Date.now()}`,
    name: randomName,
    phone: randomPhone,
    email: randomEmail,
    businessType,
    lastContact,
    totalMessages: Math.floor(Math.random() * 50) + 1,
    totalOrders: Math.floor(Math.random() * 20),
    totalRevenue: Math.floor(Math.random() * 10000) + 100,
    customerSince,
    status: Math.random() > 0.7 ? 'potential' : Math.random() > 0.3 ? 'active' : 'inactive',
    channel: ['whatsapp', 'instagram', 'web', 'phone'][Math.floor(Math.random() * 4)] as any,
    lastMessage: randomMessage,
    isVip: Math.random() > 0.85,
    timeCategory
  };
};

// Ana mock data üreteci
export const generateMockData = (): MockCustomer[] => {
  const allCustomers: MockCustomer[] = [];
  
  // Her sektör için 10 müşteri üret
  Object.keys(businessTypeConfigs).forEach(businessType => {
    const bt = businessType as BusinessType;
    
    // Zaman kategorilerine göre dağıt
    const timeDistribution = [
      // 3'ü bugün
      { category: 'today' as TimeCategory, count: 3 },
      // 3'ü bu hafta
      { category: 'this_week' as TimeCategory, count: 3 },
      // 3'ü bu ay
      { category: 'this_month' as TimeCategory, count: 3 },
      // 1'i bu yıl
      { category: 'this_year' as TimeCategory, count: 1 }
    ];
    
    let customerIndex = 1;
    
    timeDistribution.forEach(({ category, count }) => {
      for (let i = 0; i < count; i++) {
        const customer = generateCustomerForSector(bt, customerIndex++, category);
        allCustomers.push(customer);
      }
    });
  });
  
  return allCustomers;
};

// Sektöre göre müşterileri filtrele
export const getCustomersForSector = (
  allCustomers: MockCustomer[], 
  businessType: BusinessType
): MockCustomer[] => {
  return allCustomers.filter(customer => customer.businessType === businessType);
};

// Zaman kategorisine göre müşterileri filtrele
export const getCustomersByTimeCategory = (
  customers: MockCustomer[], 
  category: TimeCategory
): MockCustomer[] => {
  return customers.filter(customer => customer.timeCategory === category);
};

// Dashboard istatistiklerini hesapla
export const calculateDashboardStats = (customers: MockCustomer[]): DashboardStats => {
  const todayCustomers = getCustomersByTimeCategory(customers, 'today');
  const thisWeekCustomers = getCustomersByTimeCategory(customers, 'this_week');
  const thisMonthCustomers = getCustomersByTimeCategory(customers, 'this_month');
  
  const activeConversations = todayCustomers.length;
  const totalMessages = customers.reduce((sum, c) => sum + c.totalMessages, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const vipCustomers = customers.filter(c => c.isVip).length;
  
  // Kanal dağılımı
  const channelStats = {
    whatsapp: customers.filter(c => c.channel === 'whatsapp').length,
    instagram: customers.filter(c => c.channel === 'instagram').length,
    web: customers.filter(c => c.channel === 'web').length,
    phone: customers.filter(c => c.channel === 'phone').length,
  };
  
  return {
    activeConversations,
    totalMessages,
    totalRevenue,
    vipCustomers,
    channelStats,
    todayCount: todayCustomers.length,
    weekCount: thisWeekCustomers.length,
    monthCount: thisMonthCustomers.length,
    totalCustomers: customers.length
  };
};

// Mock data'yı localStorage'da sakla
export const saveMockDataToStorage = (data: MockCustomer[]) => {
  localStorage.setItem('asistanapp_mock_customers', JSON.stringify(data));
};

// Mock data'yı localStorage'dan yükle
export const loadMockDataFromStorage = (): MockCustomer[] | null => {
  const stored = localStorage.getItem('asistanapp_mock_customers');
  if (stored) {
    try {
      return JSON.parse(stored).map((customer: any) => ({
        ...customer,
        lastContact: new Date(customer.lastContact),
        customerSince: new Date(customer.customerSince)
      }));
    } catch {
      return null;
    }
  }
  return null;
};

export default {
  generateMockData,
  getCustomersForSector,
  getCustomersByTimeCategory,
  calculateDashboardStats,
  saveMockDataToStorage,
  loadMockDataFromStorage
};
