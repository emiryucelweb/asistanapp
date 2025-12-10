export interface QuickReply {
  id: string;
  category: 'greeting' | 'shipping' | 'payment' | 'return' | 'technical' | 'closing' | 'product';
  title: string;
  shortcut: string;
  content: string;
  useCount: number;
  lastUsed?: string;
  tags: string[];
  variables?: string[];
}

export const mockQuickReplies: QuickReply[] = [
  {
    id: 'qr-001',
    category: 'greeting',
    title: 'Hoş Geldin - Genel',
    shortcut: '/hosgeldin',
    content: 'Merhaba {{customerName}}! AsistanApp\'a hoş geldiniz. Size nasıl yardımcı olabilirim? 😊',
    useCount: 247,
    lastUsed: '2025-12-10T11:30:00Z',
    tags: ['selamlama', 'karşılama'],
    variables: ['customerName']
  },
  {
    id: 'qr-002',
    category: 'shipping',
    title: 'Kargo Bilgisi',
    shortcut: '/kargo',
    content: 'Siparişiniz {{orderNumber}} numaralı kargo ile {{courierCompany}} tarafından taşınıyor. Takip numaranız: {{trackingNumber}}',
    useCount: 456,
    lastUsed: '2025-12-10T11:42:00Z',
    tags: ['kargo', 'takip'],
    variables: ['orderNumber', 'courierCompany', 'trackingNumber']
  },
  {
    id: 'qr-003',
    category: 'payment',
    title: 'Ödeme Seçenekleri',
    shortcut: '/odeme',
    content: 'Ödeme seçeneklerimiz:\n✅ Kredi/Banka Kartı\n✅ Havale/EFT\n✅ Kapıda Ödeme\n✅ Mobil Ödeme',
    useCount: 312,
    lastUsed: '2025-12-10T11:28:00Z',
    tags: ['ödeme', 'bilgi']
  }
];

export const mockQuickReplyStats = {
  totalReplies: 20,
  mostUsed: 'Kargo Bilgisi',
  avgSaveTime: '45 saniye',
  totalUsageCount: 4842
};
