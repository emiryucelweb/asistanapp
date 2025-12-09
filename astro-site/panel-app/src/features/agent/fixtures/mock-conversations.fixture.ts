// NOTE: Test/fixture file - Hardcoded strings are acceptable for mock/test data
// This file should NOT be imported in production code

/**
 * Mock Conversations Fixture
 * Test and development data for conversation management
 * 
 * @module agent/fixtures/mock-conversations
 */

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  agentName?: string;
  assignedBy?: string;
  assignmentReason?: string;
}

export interface MockConversation {
  id: string;
  customerName: string;
  channel: 'whatsapp' | 'instagram' | 'web' | 'facebook' | 'phone';
  status: 'waiting' | 'assigned' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedTo?: string;
  assignedToMe: boolean;
  isLocked: boolean;
  lockedBy?: string;
  messages: Message[];
  aiStuck: boolean;
  sentiment?: 'happy' | 'neutral' | 'angry' | 'sad';
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Generate mock conversations for development and testing
 * @param currentAgentName - Name of the current agent for assignment
 */
export function getMockConversations(currentAgentName: string = 'Agent'): MockConversation[] {
  return [
    {
      id: '1',
      customerName: 'Ahmet Bey',
      channel: 'whatsapp',
      status: 'waiting',
      priority: 'high',
      lastMessage: 'Siparişim nerede? Acil durum!',
      lastMessageTime: '2 dk önce',
      unreadCount: 3,
      assignedToMe: false,
      isLocked: false,
      aiStuck: true,
      messages: [
        { id: 'm1', sender: 'customer', text: 'Merhaba', timestamp: new Date(Date.now() - 600000) },
        { id: 'm2', sender: 'ai', text: 'Merhaba! Size nasıl yardımcı olabilirim?', timestamp: new Date(Date.now() - 580000) },
        { id: 'm3', sender: 'customer', text: 'Siparişim nerede? Acil durum!', timestamp: new Date(Date.now() - 120000) },
      ],
    },
    {
      id: '2',
      customerName: 'Zeynep Hanım',
      channel: 'instagram',
      status: 'assigned',
      priority: 'medium',
      lastMessage: 'Ürün iadesi yapmak istiyorum',
      lastMessageTime: '5 dk önce',
      unreadCount: 1,
      assignedTo: currentAgentName,
      assignedToMe: true,
      isLocked: true,
      lockedBy: currentAgentName,
      aiStuck: false,
      messages: [
        { id: 'm0', sender: 'system', text: 'Konuşma atandı', timestamp: new Date(Date.now() - 310000), assignedBy: 'Mehmet Demir', assignmentReason: 'İade konusunda uzman bir agent gerekli' },
        { id: 'm1', sender: 'customer', text: 'Ürün iadesi yapmak istiyorum', timestamp: new Date(Date.now() - 300000) },
        { id: 'm2', sender: 'agent', text: 'Tabii, size yardımcı olabilirim. Hangi ürünü iade etmek istiyorsunuz?', timestamp: new Date(Date.now() - 280000), agentName: currentAgentName },
      ],
    },
    {
      id: '3',
      customerName: 'Mehmet Bey',
      channel: 'web',
      status: 'assigned',
      priority: 'low',
      lastMessage: 'Teşekkürler, çok yardımcı oldunuz',
      lastMessageTime: '10 dk önce',
      unreadCount: 0,
      assignedTo: 'Can Demir',
      assignedToMe: false,
      isLocked: true,
      lockedBy: 'Can Demir',
      aiStuck: false,
      messages: [
        { id: 'm1', sender: 'customer', text: 'Merhaba, fiyat bilgisi alabilir miyim?', timestamp: new Date(Date.now() - 600000) },
        { id: 'm2', sender: 'agent', text: 'Merhaba! Elbette, hangi ürün için?', timestamp: new Date(Date.now() - 580000), agentName: 'Can Demir' },
        { id: 'm3', sender: 'customer', text: 'Teşekkürler, çok yardımcı oldunuz', timestamp: new Date(Date.now() - 600000) },
      ],
    },
    {
      id: '4',
      customerName: 'Fatma Hanım',
      channel: 'facebook',
      status: 'resolved',
      priority: 'low',
      lastMessage: 'Sorunum çözüldü, teşekkürler',
      lastMessageTime: '1 saat önce',
      unreadCount: 0,
      assignedTo: currentAgentName,
      assignedToMe: true,
      isLocked: false,
      aiStuck: false,
      messages: [
        { id: 'm1', sender: 'customer', text: 'Hesabıma giriş yapamıyorum', timestamp: new Date(Date.now() - 3600000) },
        { id: 'm2', sender: 'agent', text: 'Şifrenizi sıfırlamanız gerekiyor. Size link gönderdim.', timestamp: new Date(Date.now() - 3580000), agentName: currentAgentName },
        { id: 'm3', sender: 'customer', text: 'Sorunum çözüldü, teşekkürler', timestamp: new Date(Date.now() - 3600000) },
      ],
    },
    {
      id: '5',
      customerName: 'Ali Yıldız',
      channel: 'phone',
      status: 'assigned',
      priority: 'high',
      lastMessage: 'Telefon araması - Asistan yardım istiyor',
      lastMessageTime: '30 sn önce',
      unreadCount: 0,
      assignedToMe: true,
      isLocked: true,
      lockedBy: currentAgentName,
      aiStuck: true,
      messages: [
        { id: 'm1', sender: 'ai', text: '🤖 AI Asistan: Görüşme başladı - Ali Yıldız ile bağlanıyorum...', timestamp: new Date(Date.now() - 120000) },
        { id: 'm2', sender: 'ai', text: '🤖 Müşteri toplu sipariş vermek istiyor', timestamp: new Date(Date.now() - 90000) },
        { id: 'm3', sender: 'ai', text: '🤖 100+ ürün için özel fiyat talebi - Yetkili destek gerekli', timestamp: new Date(Date.now() - 60000) },
        { id: 'm4', sender: 'system', text: 'AI yardım istiyor', timestamp: new Date(Date.now() - 45000), assignedBy: 'Asistan', assignmentReason: 'Toplu sipariş talebi - Özel fiyatlandırma yetkisi gerekiyor' },
        { id: 'm5', sender: 'customer', text: '📞 Telefon görüşmesi devam ediyor...', timestamp: new Date(Date.now() - 30000) },
      ],
    },
    {
      id: '6',
      customerName: 'Elif Kaya',
      channel: 'phone',
      status: 'resolved',
      priority: 'medium',
      lastMessage: 'Telefon araması tamamlandı - 5:32',
      lastMessageTime: '15 dk önce',
      unreadCount: 0,
      assignedTo: currentAgentName,
      assignedToMe: true,
      isLocked: false,
      aiStuck: false,
      messages: [
        { id: 'm1', sender: 'ai', text: '🤖 AI Asistan: Görüşme başladı - Elif Kaya aramış', timestamp: new Date(Date.now() - 1200000) },
        { id: 'm2', sender: 'ai', text: '🤖 Müşteri: "Merhaba, yeni ürünleriniz hakkında bilgi almak istiyorum"', timestamp: new Date(Date.now() - 1180000) },
        { id: 'm3', sender: 'ai', text: '🤖 Ben: "Tabii! Şu anda kampanyalı ürünlerimiz var. Hangi kategori ilginizi çekiyor?"', timestamp: new Date(Date.now() - 1160000) },
        { id: 'm4', sender: 'ai', text: '🤖 Müşteri: "Elektronik ürünlere bakıyorum"', timestamp: new Date(Date.now() - 1140000) },
        { id: 'm5', sender: 'ai', text: '🤖 Ben: "Laptop, telefon ve tablet kategorilerinde %20 indirim var. Sipariş oluşturayım mı?"', timestamp: new Date(Date.now() - 1120000) },
        { id: 'm6', sender: 'ai', text: '🤖 Müşteri: "Evet lütfen, laptop istiyorum"', timestamp: new Date(Date.now() - 1100000) },
        { id: 'm7', sender: 'ai', text: '🤖 Sipariş oluşturuldu - Ödeme işlemi tamamlandı ✅', timestamp: new Date(Date.now() - 1080000) },
        { id: 'm8', sender: 'agent', text: '📞 Telefon görüşmesi özeti (5:32 dk):\n\n✅ Müşteri elektronik kategori ürün bilgisi aldı\n✅ Laptop siparişi verildi (Kampanyalı)\n✅ Ödeme tamamlandı\n✅ Kargo bilgisi verildi\n\n💬 Müşteri Memnuniyeti: Yüksek', timestamp: new Date(Date.now() - 900000), agentName: 'AI Asistan' },
      ],
    },
  ];
}

