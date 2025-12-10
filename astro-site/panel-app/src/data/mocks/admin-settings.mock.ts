// Admin Settings Mock Data

export const mockBusinessProfile = {
  businessName: 'Smile Dental Klinik',
  industry: 'Dental',
  logo: 'https://via.placeholder.com/200x200?text=Smile+Dental',
  website: 'https://www.smileklinik.com',
  email: 'info@smileklinik.com',
  phone: '+90 532 123 4567',
  address: {
    street: 'Atatürk Caddesi No: 123',
    city: 'Istanbul',
    state: 'Istanbul',
    zipCode: '34000',
    country: 'Turkey'
  },
  timezone: 'Europe/Istanbul',
  language: 'tr',
  businessHours: {
    monday: { open: '09:00', close: '18:00', enabled: true },
    tuesday: { open: '09:00', close: '18:00', enabled: true },
    wednesday: { open: '09:00', close: '18:00', enabled: true },
    thursday: { open: '09:00', close: '18:00', enabled: true },
    friday: { open: '09:00', close: '18:00', enabled: true },
    saturday: { open: '10:00', close: '14:00', enabled: true },
    sunday: { open: '00:00', close: '00:00', enabled: false }
  }
};

export const mockChannelSettings = {
  whatsapp: {
    enabled: true,
    phoneNumber: '+90 532 123 4567',
    businessAccountId: 'wa-business-001',
    autoReply: true,
    autoReplyMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
    awayMessage: 'Şu anda mesai saatleri dışındayız. En kısa sürede size dönüş yapacağız.',
    enableAwayMessage: true
  },
  instagram: {
    enabled: true,
    username: '@smileklinik',
    accountId: 'ig-account-001',
    autoReply: true,
    autoReplyMessage: 'Merhaba! Mesajınızı aldık, kısa sürede yanıt vereceğiz.',
    storyMentionReply: true
  },
  facebook: {
    enabled: true,
    pageId: 'fb-page-001',
    pageName: 'Smile Dental Klinik',
    autoReply: true,
    autoReplyMessage: 'Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.'
  },
  web: {
    enabled: true,
    widgetColor: '#0066FF',
    widgetPosition: 'bottom-right',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
    offlineMessage: 'Şu anda çevrimdışıyız. Mesaj bırakabilirsiniz.',
    showAgentAvatar: true,
    enableFileUpload: true
  }
};

export const mockNotificationSettings = {
  email: {
    newConversation: true,
    conversationAssigned: true,
    conversationResolved: false,
    dailyDigest: true,
    weeklyReport: true
  },
  push: {
    newMessage: true,
    conversationAssigned: true,
    mentionedInTeamChat: true,
    systemAlerts: true
  },
  sound: {
    enabled: true,
    volume: 70,
    notificationSound: 'default'
  }
};

export const mockAISettings = {
  enabled: true,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  autoResponse: {
    enabled: true,
    confidenceThreshold: 0.85,
    categories: [
      { name: 'Ürün Bilgisi', enabled: true },
      { name: 'Fiyat Sorgusu', enabled: true },
      { name: 'Randevu', enabled: true },
      { name: 'Sipariş Takibi', enabled: true },
      { name: 'Teknik Destek', enabled: false }
    ]
  },
  fallbackBehavior: 'transfer_to_human',
  learningMode: true,
  customInstructions: 'Smile Dental Klinik müşteri temsilcisi olarak nazik ve profesyonel bir dil kullan. Randevu oluştururken müsaitlik durumunu kontrol et.'
};

export const mockIntegrations = [
  {
    id: 'int-001',
    name: 'Google Calendar',
    description: 'Randevu senkronizasyonu',
    icon: 'https://via.placeholder.com/48x48?text=GC',
    status: 'connected',
    connectedAt: '2024-03-15',
    lastSync: '2025-12-10T09:30:00Z'
  },
  {
    id: 'int-002',
    name: 'Stripe',
    description: 'Ödeme işlemleri',
    icon: 'https://via.placeholder.com/48x48?text=ST',
    status: 'connected',
    connectedAt: '2024-01-20',
    lastSync: '2025-12-10T08:15:00Z'
  },
  {
    id: 'int-003',
    name: 'Shopify',
    description: 'E-ticaret entegrasyonu',
    icon: 'https://via.placeholder.com/48x48?text=SH',
    status: 'not_connected',
    connectedAt: null,
    lastSync: null
  },
  {
    id: 'int-004',
    name: 'Slack',
    description: 'Takım bildirimleri',
    icon: 'https://via.placeholder.com/48x48?text=SL',
    status: 'not_connected',
    connectedAt: null,
    lastSync: null
  }
];

export const mockSecuritySettings = {
  twoFactorAuth: {
    enabled: true,
    method: 'app',
    backupCodes: 3
  },
  sessionTimeout: 480,
  ipWhitelist: {
    enabled: false,
    addresses: []
  },
  loginNotifications: true,
  suspiciousActivityAlerts: true,
  dataRetention: {
    conversations: 365,
    reports: 730,
    logs: 90
  }
};

export const mockCustomizationSettings = {
  theme: 'light',
  accentColor: '#0066FF',
  brandLogo: 'https://via.placeholder.com/200x200?text=Logo',
  customCSS: '',
  dashboardLayout: 'default',
  defaultLanguage: 'tr',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'TRY'
};
