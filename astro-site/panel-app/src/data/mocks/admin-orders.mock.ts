/**
 * Admin Panel - Order Management with Full Lifecycle Tracking
 * E-commerce orders with timeline, shipping, payment details
 */

export interface OrderTimeline {
  status: string;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery' | 'mobile_payment';
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    country: string;
  };
  shipping?: {
    courierCompany: string;
    trackingNumber: string;
    estimatedDelivery: string;
    actualDelivery?: string;
  };
  timeline: OrderTimeline[];
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockAdminOrders: AdminOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2025-001234',
    customer: {
      id: 'cust-001',
      name: 'Ahmet Yıldırım',
      email: 'ahmet.yildirim@example.com',
      phone: '+905301234567'
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    items: [
      {
        id: 'item-001-1',
        productId: 'prod-001',
        productName: 'Erkek Spor Ayakkabı - Premium',
        variantId: 'var-001-2',
        variantName: '41 Numara',
        quantity: 1,
        unitPrice: 799.99,
        totalPrice: 799.99,
        image: 'https://via.placeholder.com/100x100?text=Nike'
      },
      {
        id: 'item-001-2',
        productId: 'prod-007',
        productName: 'Erkek Terlik - Lacivert',
        variantId: 'var-007-2',
        variantName: '41 Numara',
        quantity: 2,
        unitPrice: 199.99,
        totalPrice: 399.98,
        image: 'https://via.placeholder.com/100x100?text=Crocs'
      }
    ],
    pricing: {
      subtotal: 1199.97,
      shipping: 0,
      tax: 216.00,
      discount: 120.00,
      total: 1295.97
    },
    shippingAddress: {
      fullName: 'Ahmet Yıldırım',
      phone: '+905301234567',
      addressLine1: 'Caferağa Mah. Moda Cad.',
      addressLine2: 'No:45 Daire:3',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Ahmet Yıldırım',
      phone: '+905301234567',
      addressLine1: 'Caferağa Mah. Moda Cad. No:45 D:3',
      city: 'İstanbul',
      country: 'Türkiye'
    },
    shipping: {
      courierCompany: 'Aras Kargo',
      trackingNumber: 'AR123456789TR',
      estimatedDelivery: '2025-12-10',
      actualDelivery: '2025-12-09T14:30:00Z'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-07T10:15:00Z' },
      { status: 'Ödeme Onaylandı', timestamp: '2025-12-07T10:15:30Z' },
      { status: 'Sipariş Hazırlanıyor', timestamp: '2025-12-07T14:20:00Z' },
      { status: 'Kargoya Verildi', timestamp: '2025-12-08T09:00:00Z', note: 'Aras Kargo - AR123456789TR' },
      { status: 'Teslim Edildi', timestamp: '2025-12-09T14:30:00Z', note: 'Müşteri teslim aldı' }
    ],
    notes: 'VIP müşteri, hızlı teslimat talep etti',
    tags: ['vip', 'hızlı-teslimat', 'tamamlandı'],
    createdAt: '2025-12-07T10:15:00Z',
    updatedAt: '2025-12-09T14:30:00Z'
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2025-001235',
    customer: {
      id: 'cust-002',
      name: 'Elif Demir',
      email: 'elif.demir@example.com',
      phone: '+905312345678'
    },
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    items: [
      {
        id: 'item-002-1',
        productId: 'prod-002',
        productName: 'Kadın Bot - Kahverengi Süet',
        variantId: 'var-002-3',
        variantName: '38 Numara',
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99,
        image: 'https://via.placeholder.com/100x100?text=Timberland'
      }
    ],
    pricing: {
      subtotal: 1299.99,
      shipping: 29.90,
      tax: 234.00,
      discount: 0,
      total: 1563.89
    },
    shippingAddress: {
      fullName: 'Elif Demir',
      phone: '+905312345678',
      addressLine1: 'Atatürk Mah. 123 Sok.',
      addressLine2: 'No:7/2',
      city: 'Ankara',
      district: 'Çankaya',
      postalCode: '06420',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Elif Demir',
      phone: '+905312345678',
      addressLine1: 'Atatürk Mah. 123 Sok. No:7/2',
      city: 'Ankara',
      country: 'Türkiye'
    },
    shipping: {
      courierCompany: 'Yurtiçi Kargo',
      trackingNumber: 'YK987654321TR',
      estimatedDelivery: '2025-12-11'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-08T11:20:00Z' },
      { status: 'Ödeme Bekleniyor', timestamp: '2025-12-08T11:20:10Z' },
      { status: 'Ödeme Onaylandı', timestamp: '2025-12-08T15:30:00Z', note: 'Havale alındı' },
      { status: 'Sipariş Hazırlanıyor', timestamp: '2025-12-09T09:00:00Z' },
      { status: 'Kargoya Verildi', timestamp: '2025-12-10T10:15:00Z', note: 'Yurtiçi Kargo - YK987654321TR' }
    ],
    tags: ['havale', 'kargoda'],
    createdAt: '2025-12-08T11:20:00Z',
    updatedAt: '2025-12-10T10:15:00Z'
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2025-001236',
    customer: {
      id: 'cust-003',
      name: 'Can Öztürk',
      email: 'can.ozturk@example.com',
      phone: '+905323456789'
    },
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_payment',
    items: [
      {
        id: 'item-003-1',
        productId: 'prod-003',
        productName: 'Unisex Sneaker - Beyaz',
        variantId: 'var-003-5',
        variantName: '42 Numara',
        quantity: 2,
        unitPrice: 549.99,
        totalPrice: 1099.98,
        image: 'https://via.placeholder.com/100x100?text=Adidas'
      }
    ],
    pricing: {
      subtotal: 1099.98,
      shipping: 0,
      tax: 198.00,
      discount: 55.00,
      total: 1242.98
    },
    shippingAddress: {
      fullName: 'Can Öztürk',
      phone: '+905323456789',
      addressLine1: 'Alsancak Mah. Kıbrıs Şehitleri Cad.',
      addressLine2: 'No:123',
      city: 'İzmir',
      district: 'Konak',
      postalCode: '35220',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Can Öztürk',
      phone: '+905323456789',
      addressLine1: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:123',
      city: 'İzmir',
      country: 'Türkiye'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-10T09:30:00Z' },
      { status: 'Ödeme Onaylandı', timestamp: '2025-12-10T09:30:15Z', note: 'Apple Pay ile ödendi' },
      { status: 'Sipariş Hazırlanıyor', timestamp: '2025-12-10T10:00:00Z' }
    ],
    tags: ['yeni-sipariş', 'apple-pay'],
    createdAt: '2025-12-10T09:30:00Z',
    updatedAt: '2025-12-10T10:00:00Z'
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2025-001237',
    customer: {
      id: 'cust-004',
      name: 'Ayşe Kara',
      email: 'ayse.kara@example.com',
      phone: '+905334567890'
    },
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'credit_card',
    items: [
      {
        id: 'item-004-1',
        productId: 'prod-005',
        productName: 'Kadın Topuklu Ayakkabı - Kırmızı',
        variantId: 'var-005-3',
        variantName: '38 Numara',
        quantity: 1,
        unitPrice: 649.99,
        totalPrice: 649.99,
        image: 'https://via.placeholder.com/100x100?text=Aldo'
      }
    ],
    pricing: {
      subtotal: 649.99,
      shipping: 29.90,
      tax: 117.00,
      discount: 0,
      total: 796.89
    },
    shippingAddress: {
      fullName: 'Ayşe Kara',
      phone: '+905334567890',
      addressLine1: 'Heykel Mah. Atatürk Cad.',
      city: 'Bursa',
      district: 'Osmangazi',
      postalCode: '16040',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Ayşe Kara',
      phone: '+905334567890',
      addressLine1: 'Heykel Mah. Atatürk Cad.',
      city: 'Bursa',
      country: 'Türkiye'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-05T14:20:00Z' },
      { status: 'Ödeme Onaylandı', timestamp: '2025-12-05T14:20:30Z' },
      { status: 'İptal Talebi', timestamp: '2025-12-05T16:00:00Z', note: 'Müşteri iptal etti - fikir değiştirdi' },
      { status: 'İptal Edildi', timestamp: '2025-12-05T16:15:00Z' },
      { status: 'İade Onaylandı', timestamp: '2025-12-06T10:00:00Z', note: 'Para iadesi yapıldı' }
    ],
    notes: 'Müşteri fikir değiştirdi, sipariş hazırlanmadan iptal edildi',
    tags: ['iptal', 'iade-yapıldı'],
    createdAt: '2025-12-05T14:20:00Z',
    updatedAt: '2025-12-06T10:00:00Z'
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2025-001238',
    customer: {
      id: 'cust-005',
      name: 'Mehmet Yılmaz',
      email: 'mehmet.yilmaz@example.com',
      phone: '+905345678901'
    },
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-005-1',
        productId: 'prod-004',
        productName: 'Erkek Sandalet - Siyah Deri',
        variantId: 'var-004-2',
        variantName: '41 Numara',
        quantity: 1,
        unitPrice: 549.99,
        totalPrice: 549.99
      },
      {
        id: 'item-005-2',
        productId: 'prod-008',
        productName: 'Kadın Babet - Siyah Rugan',
        variantId: 'var-008-3',
        variantName: '38 Numara',
        quantity: 1,
        unitPrice: 449.99,
        totalPrice: 449.99
      }
    ],
    pricing: {
      subtotal: 999.98,
      shipping: 0,
      tax: 180.00,
      discount: 0,
      total: 1179.98
    },
    shippingAddress: {
      fullName: 'Mehmet Yılmaz',
      phone: '+905345678901',
      addressLine1: 'Lara Sahil Yolu',
      addressLine2: 'No:234',
      city: 'Antalya',
      district: 'Muratpaşa',
      postalCode: '07100',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Mehmet Yılmaz',
      phone: '+905345678901',
      addressLine1: 'Lara Sahil Yolu No:234',
      city: 'Antalya',
      country: 'Türkiye'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-10T11:00:00Z' },
      { status: 'Sipariş Onaylandı', timestamp: '2025-12-10T11:05:00Z' }
    ],
    notes: 'Kapıda ödeme, kargo hazırlanıyor',
    tags: ['kapıda-ödeme', 'vip-müşteri'],
    createdAt: '2025-12-10T11:00:00Z',
    updatedAt: '2025-12-10T11:05:00Z'
  },
  {
    id: 'ord-006',
    orderNumber: 'ORD-2025-001239',
    customer: {
      id: 'cust-008',
      name: 'Zeynep Arslan',
      email: 'zeynep.arslan@example.com',
      phone: '+905378901234'
    },
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'bank_transfer',
    items: [
      {
        id: 'item-006-1',
        productId: 'prod-001',
        productName: 'Erkek Spor Ayakkabı - Premium',
        variantId: 'var-001-3',
        variantName: '42 Numara',
        quantity: 1,
        unitPrice: 799.99,
        totalPrice: 799.99
      }
    ],
    pricing: {
      subtotal: 799.99,
      shipping: 0,
      tax: 144.00,
      discount: 0,
      total: 943.99
    },
    shippingAddress: {
      fullName: 'Zeynep Arslan',
      phone: '+905378901234',
      addressLine1: 'Şehitkamil Mah. İnönü Cad.',
      city: 'Gaziantep',
      district: 'Şehitkamil',
      postalCode: '27400',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Zeynep Arslan',
      phone: '+905378901234',
      addressLine1: 'Şehitkamil Mah. İnönü Cad.',
      city: 'Gaziantep',
      country: 'Türkiye'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-10T11:45:00Z' },
      { status: 'Ödeme Bekleniyor', timestamp: '2025-12-10T11:45:10Z', note: 'Havale bilgileri gönderildi' }
    ],
    notes: 'Ödeme bekleniyor',
    tags: ['ödeme-bekliyor', 'havale'],
    createdAt: '2025-12-10T11:45:00Z',
    updatedAt: '2025-12-10T11:45:10Z'
  },
  {
    id: 'ord-007',
    orderNumber: 'ORD-2025-001240',
    customer: {
      id: 'cust-010',
      name: 'Selin Koç',
      email: 'selin.koc@example.com',
      phone: '+905390123456'
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    items: [
      {
        id: 'item-007-1',
        productId: 'prod-002',
        productName: 'Kadın Bot - Kahverengi Süet',
        variantId: 'var-002-2',
        variantName: '37 Numara',
        quantity: 2,
        unitPrice: 1299.99,
        totalPrice: 2599.98
      }
    ],
    pricing: {
      subtotal: 2599.98,
      shipping: 0,
      tax: 468.00,
      discount: 260.00,
      total: 2807.98
    },
    shippingAddress: {
      fullName: 'Selin Koç',
      phone: '+905390123456',
      addressLine1: 'Nişantaşı Mah. Teşvikiye Cad.',
      addressLine2: 'No:89 D:12',
      city: 'İstanbul',
      district: 'Şişli',
      postalCode: '34365',
      country: 'Türkiye'
    },
    billingAddress: {
      fullName: 'Selin Koç',
      phone: '+905390123456',
      addressLine1: 'Nişantaşı Mah. Teşvikiye Cad. No:89 D:12',
      city: 'İstanbul',
      country: 'Türkiye'
    },
    shipping: {
      courierCompany: 'MNG Kargo',
      trackingNumber: 'MNG456789123TR',
      estimatedDelivery: '2025-12-06',
      actualDelivery: '2025-12-05T16:20:00Z'
    },
    timeline: [
      { status: 'Sipariş Oluşturuldu', timestamp: '2025-12-03T15:30:00Z' },
      { status: 'Ödeme Onaylandı', timestamp: '2025-12-03T15:30:45Z' },
      { status: 'Sipariş Hazırlanıyor', timestamp: '2025-12-04T09:00:00Z' },
      { status: 'Kargoya Verildi', timestamp: '2025-12-04T14:30:00Z', note: 'MNG Kargo - MNG456789123TR' },
      { status: 'Teslim Edildi', timestamp: '2025-12-05T16:20:00Z', note: 'Erken teslimat - VIP müşteri' }
    ],
    notes: 'VIP müşteri, erken teslimat yapıldı',
    tags: ['vip', 'tamamlandı', 'erken-teslimat'],
    createdAt: '2025-12-03T15:30:00Z',
    updatedAt: '2025-12-05T16:20:00Z'
  }
];

// Order Statistics
export const mockOrderStats = {
  total: 3847,
  pending: 234,
  confirmed: 156,
  preparing: 89,
  shipped: 234,
  delivered: 3298,
  cancelled: 123,
  refunded: 45,
  totalRevenue: 8945678.90,
  avgOrderValue: 2325.60,
  ordersByPaymentMethod: {
    credit_card: 2134,
    bank_transfer: 876,
    cash_on_delivery: 623,
    mobile_payment: 214
  },
  ordersByStatus: {
    pending: 6.1,
    confirmed: 4.1,
    preparing: 2.3,
    shipped: 6.1,
    delivered: 85.7,
    cancelled: 3.2,
    refunded: 1.2
  }
};
