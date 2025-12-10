/**
 * Admin Panel - Product Catalog with Inventory Management
 * E-commerce product data with variants, pricing, and stock tracking
 */

export interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  pricing: {
    basePrice: number;
    salePrice?: number;
    compareAtPrice?: number;
    cost: number;
    margin: number; // percentage
  };
  inventory: {
    totalStock: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    reservedStock: number;
    availableStock: number;
  };
  sales: {
    totalSold: number;
    revenue: number;
    avgRating: number;
    reviewCount: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };
  status: 'active' | 'draft' | 'out_of_stock' | 'discontinued';
  tags: string[];
  supplier?: {
    id: string;
    name: string;
    restockDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const mockAdminProducts: AdminProduct[] = [
  {
    id: 'prod-001',
    name: 'Erkek Spor Ayakkabı - Premium',
    category: 'Ayakkabı',
    brand: 'Nike',
    sku: 'NIKE-SPT-001',
    description: 'Yüksek performanslı, rahat ve şık erkek spor ayakkabısı. Hava yastıklı taban teknolojisi ile maksimum konfor.',
    images: [
      'https://via.placeholder.com/800x800?text=Nike+Spor+1',
      'https://via.placeholder.com/800x800?text=Nike+Spor+2',
      'https://via.placeholder.com/800x800?text=Nike+Spor+3'
    ],
    variants: [
      { id: 'var-001-1', size: '40', sku: 'NIKE-SPT-001-40', stock: 15, price: 899.99 },
      { id: 'var-001-2', size: '41', sku: 'NIKE-SPT-001-41', stock: 23, price: 899.99 },
      { id: 'var-001-3', size: '42', sku: 'NIKE-SPT-001-42', stock: 18, price: 899.99 },
      { id: 'var-001-4', size: '43', sku: 'NIKE-SPT-001-43', stock: 12, price: 899.99 },
      { id: 'var-001-5', size: '44', sku: 'NIKE-SPT-001-44', stock: 8, price: 899.99 },
      { id: 'var-001-6', size: '45', sku: 'NIKE-SPT-001-45', stock: 5, price: 899.99 }
    ],
    pricing: {
      basePrice: 899.99,
      salePrice: 799.99,
      compareAtPrice: 999.99,
      cost: 450.00,
      margin: 55.6
    },
    inventory: {
      totalStock: 81,
      lowStockThreshold: 20,
      isLowStock: false,
      reservedStock: 6,
      availableStock: 75
    },
    sales: {
      totalSold: 234,
      revenue: 187234.66,
      avgRating: 4.7,
      reviewCount: 89
    },
    seo: {
      metaTitle: 'Erkek Spor Ayakkabı Premium - Nike | AsistanApp',
      metaDescription: 'Yüksek performanslı Nike erkek spor ayakkabısı. Hava yastıklı taban, nefes alabilen kumaş. Ücretsiz kargo!',
      slug: 'erkek-spor-ayakkabi-premium-nike'
    },
    status: 'active',
    tags: ['spor', 'erkek', 'nike', 'bestseller', 'indirimli'],
    supplier: {
      id: 'sup-001',
      name: 'Nike Türkiye Distribütör'
    },
    createdAt: '2024-05-12T10:00:00Z',
    updatedAt: '2025-12-08T14:30:00Z'
  },
  {
    id: 'prod-002',
    name: 'Kadın Bot - Kahverengi Süet',
    category: 'Ayakkabı',
    brand: 'Timberland',
    sku: 'TBL-BOT-002',
    description: 'Klasik kahverengi süet kadın bot. Su geçirmez özellik, rahat iç astar. Kış sezonu favorisi.',
    images: [
      'https://via.placeholder.com/800x800?text=Timberland+Bot+1',
      'https://via.placeholder.com/800x800?text=Timberland+Bot+2'
    ],
    variants: [
      { id: 'var-002-1', size: '36', sku: 'TBL-BOT-002-36', stock: 12, price: 1299.99 },
      { id: 'var-002-2', size: '37', sku: 'TBL-BOT-002-37', stock: 18, price: 1299.99 },
      { id: 'var-002-3', size: '38', sku: 'TBL-BOT-002-38', stock: 21, price: 1299.99 },
      { id: 'var-002-4', size: '39', sku: 'TBL-BOT-002-39', stock: 15, price: 1299.99 },
      { id: 'var-002-5', size: '40', sku: 'TBL-BOT-002-40', stock: 9, price: 1299.99 }
    ],
    pricing: {
      basePrice: 1299.99,
      cost: 650.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 75,
      lowStockThreshold: 15,
      isLowStock: false,
      reservedStock: 3,
      availableStock: 72
    },
    sales: {
      totalSold: 156,
      revenue: 202798.44,
      avgRating: 4.8,
      reviewCount: 67
    },
    seo: {
      metaTitle: 'Kadın Bot Kahverengi Süet - Timberland | AsistanApp',
      metaDescription: 'Su geçirmez Timberland kadın bot. Rahat, şık ve dayanıklı. Kış sezonu indirimi!',
      slug: 'kadin-bot-kahverengi-suet-timberland'
    },
    status: 'active',
    tags: ['bot', 'kadın', 'timberland', 'kış', 'su-geçirmez'],
    supplier: {
      id: 'sup-002',
      name: 'Timberland Resmi Bayi'
    },
    createdAt: '2024-08-20T11:15:00Z',
    updatedAt: '2025-12-09T09:20:00Z'
  },
  {
    id: 'prod-003',
    name: 'Unisex Sneaker - Beyaz',
    category: 'Ayakkabı',
    brand: 'Adidas',
    sku: 'ADS-SNK-003',
    description: 'Klasik beyaz sneaker. Hem erkek hem kadın için uygun. Günlük kullanıma ideal.',
    images: [
      'https://via.placeholder.com/800x800?text=Adidas+Sneaker+1'
    ],
    variants: [
      { id: 'var-003-1', size: '38', sku: 'ADS-SNK-003-38', stock: 3, price: 649.99 },
      { id: 'var-003-2', size: '39', sku: 'ADS-SNK-003-39', stock: 2, price: 649.99 },
      { id: 'var-003-3', size: '40', sku: 'ADS-SNK-003-40', stock: 0, price: 649.99 },
      { id: 'var-003-4', size: '41', sku: 'ADS-SNK-003-41', stock: 1, price: 649.99 },
      { id: 'var-003-5', size: '42', sku: 'ADS-SNK-003-42', stock: 4, price: 649.99 }
    ],
    pricing: {
      basePrice: 649.99,
      salePrice: 549.99,
      compareAtPrice: 749.99,
      cost: 325.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 10,
      lowStockThreshold: 20,
      isLowStock: true,
      reservedStock: 2,
      availableStock: 8
    },
    sales: {
      totalSold: 389,
      revenue: 252744.11,
      avgRating: 4.6,
      reviewCount: 142
    },
    seo: {
      metaTitle: 'Unisex Sneaker Beyaz - Adidas | AsistanApp',
      metaDescription: 'Klasik beyaz Adidas sneaker. Unisex model, günlük kullanım. Stoklar tükenmeden!',
      slug: 'unisex-sneaker-beyaz-adidas'
    },
    status: 'active',
    tags: ['sneaker', 'unisex', 'adidas', 'beyaz', 'stok-azalıyor'],
    supplier: {
      id: 'sup-003',
      name: 'Adidas Türkiye',
      restockDate: '2025-12-20'
    },
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2025-12-10T11:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Erkek Sandalet - Siyah Deri',
    category: 'Ayakkabı',
    brand: 'Birkenstock',
    sku: 'BRK-SND-004',
    description: 'Anatomik taban yapısı ile rahat erkek sandalet. Gerçek deri kullanım.',
    images: [
      'https://via.placeholder.com/800x800?text=Birkenstock+Sandalet+1',
      'https://via.placeholder.com/800x800?text=Birkenstock+Sandalet+2'
    ],
    variants: [
      { id: 'var-004-1', size: '40', sku: 'BRK-SND-004-40', stock: 8, price: 549.99 },
      { id: 'var-004-2', size: '41', sku: 'BRK-SND-004-41', stock: 12, price: 549.99 },
      { id: 'var-004-3', size: '42', sku: 'BRK-SND-004-42', stock: 15, price: 549.99 },
      { id: 'var-004-4', size: '43', sku: 'BRK-SND-004-43', stock: 11, price: 549.99 },
      { id: 'var-004-5', size: '44', sku: 'BRK-SND-004-44', stock: 6, price: 549.99 }
    ],
    pricing: {
      basePrice: 549.99,
      cost: 275.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 52,
      lowStockThreshold: 15,
      isLowStock: false,
      reservedStock: 1,
      availableStock: 51
    },
    sales: {
      totalSold: 98,
      revenue: 53899.02,
      avgRating: 4.9,
      reviewCount: 43
    },
    seo: {
      metaTitle: 'Erkek Sandalet Siyah Deri - Birkenstock | AsistanApp',
      metaDescription: 'Anatomik Birkenstock sandalet. Gerçek deri, rahat kullanım. Yaz sezonu indirimi!',
      slug: 'erkek-sandalet-siyah-deri-birkenstock'
    },
    status: 'active',
    tags: ['sandalet', 'erkek', 'birkenstock', 'deri', 'yaz'],
    supplier: {
      id: 'sup-004',
      name: 'Birkenstock Türkiye Distribütör'
    },
    createdAt: '2024-04-15T09:30:00Z',
    updatedAt: '2025-12-07T16:45:00Z'
  },
  {
    id: 'prod-005',
    name: 'Kadın Topuklu Ayakkabı - Kırmızı',
    category: 'Ayakkabı',
    brand: 'Aldo',
    sku: 'ALD-TPK-005',
    description: '10 cm topuklu şık kadın ayakkabısı. Özel günler için ideal.',
    images: [
      'https://via.placeholder.com/800x800?text=Aldo+Topuklu+1'
    ],
    variants: [
      { id: 'var-005-1', size: '36', sku: 'ALD-TPK-005-36', stock: 5, price: 749.99 },
      { id: 'var-005-2', size: '37', sku: 'ALD-TPK-005-37', stock: 7, price: 749.99 },
      { id: 'var-005-3', size: '38', sku: 'ALD-TPK-005-38', stock: 9, price: 749.99 },
      { id: 'var-005-4', size: '39', sku: 'ALD-TPK-005-39', stock: 6, price: 749.99 },
      { id: 'var-005-5', size: '40', sku: 'ALD-TPK-005-40', stock: 3, price: 749.99 }
    ],
    pricing: {
      basePrice: 749.99,
      salePrice: 649.99,
      compareAtPrice: 899.99,
      cost: 375.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 30,
      lowStockThreshold: 10,
      isLowStock: false,
      reservedStock: 2,
      availableStock: 28
    },
    sales: {
      totalSold: 67,
      revenue: 50249.33,
      avgRating: 4.4,
      reviewCount: 28
    },
    seo: {
      metaTitle: 'Kadın Topuklu Ayakkabı Kırmızı - Aldo | AsistanApp',
      metaDescription: 'Şık kırmızı topuklu ayakkabı. 10 cm topuk, rahat iç astar. Özel günler için!',
      slug: 'kadin-topuklu-ayakkabi-kirmizi-aldo'
    },
    status: 'active',
    tags: ['topuklu', 'kadın', 'aldo', 'kırmızı', 'şık'],
    supplier: {
      id: 'sup-005',
      name: 'Aldo Türkiye'
    },
    createdAt: '2024-09-05T13:20:00Z',
    updatedAt: '2025-12-06T10:15:00Z'
  },
  {
    id: 'prod-006',
    name: 'Çocuk Spor Ayakkabı - Mavi',
    category: 'Ayakkabı',
    brand: 'Puma',
    sku: 'PMA-COC-006',
    description: 'Renkli ve eğlenceli çocuk spor ayakkabısı. Hafif ve rahat.',
    images: [
      'https://via.placeholder.com/800x800?text=Puma+Cocuk+1'
    ],
    variants: [
      { id: 'var-006-1', size: '28', sku: 'PMA-COC-006-28', stock: 0, price: 349.99 },
      { id: 'var-006-2', size: '29', sku: 'PMA-COC-006-29', stock: 0, price: 349.99 },
      { id: 'var-006-3', size: '30', sku: 'PMA-COC-006-30', stock: 0, price: 349.99 },
      { id: 'var-006-4', size: '31', sku: 'PMA-COC-006-31', stock: 0, price: 349.99 }
    ],
    pricing: {
      basePrice: 349.99,
      cost: 175.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 0,
      lowStockThreshold: 10,
      isLowStock: true,
      reservedStock: 0,
      availableStock: 0
    },
    sales: {
      totalSold: 234,
      revenue: 81897.66,
      avgRating: 4.7,
      reviewCount: 98
    },
    seo: {
      metaTitle: 'Çocuk Spor Ayakkabı Mavi - Puma | AsistanApp',
      metaDescription: 'Renkli Puma çocuk spor ayakkabısı. Hafif, rahat, dayanıklı. Çocuklarınız bayılacak!',
      slug: 'cocuk-spor-ayakkabi-mavi-puma'
    },
    status: 'out_of_stock',
    tags: ['çocuk', 'spor', 'puma', 'mavi', 'tükendi'],
    supplier: {
      id: 'sup-006',
      name: 'Puma Türkiye',
      restockDate: '2025-12-15'
    },
    createdAt: '2024-06-18T08:00:00Z',
    updatedAt: '2025-12-09T17:30:00Z'
  },
  {
    id: 'prod-007',
    name: 'Erkek Terlik - Lacivert',
    category: 'Ayakkabı',
    brand: 'Crocs',
    sku: 'CRC-TRL-007',
    description: 'Rahat ev ve günlük kullanım terliği. Hafif ve dayanıklı.',
    images: [
      'https://via.placeholder.com/800x800?text=Crocs+Terlik+1'
    ],
    variants: [
      { id: 'var-007-1', size: '40', sku: 'CRC-TRL-007-40', stock: 25, price: 199.99 },
      { id: 'var-007-2', size: '41', sku: 'CRC-TRL-007-41', stock: 30, price: 199.99 },
      { id: 'var-007-3', size: '42', sku: 'CRC-TRL-007-42', stock: 28, price: 199.99 },
      { id: 'var-007-4', size: '43', sku: 'CRC-TRL-007-43', stock: 22, price: 199.99 },
      { id: 'var-007-5', size: '44', sku: 'CRC-TRL-007-44', stock: 18, price: 199.99 }
    ],
    pricing: {
      basePrice: 199.99,
      cost: 100.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 123,
      lowStockThreshold: 20,
      isLowStock: false,
      reservedStock: 0,
      availableStock: 123
    },
    sales: {
      totalSold: 456,
      revenue: 91195.44,
      avgRating: 4.5,
      reviewCount: 187
    },
    seo: {
      metaTitle: 'Erkek Terlik Lacivert - Crocs | AsistanApp',
      metaDescription: 'Rahat Crocs terlik. Ev ve günlük kullanım için ideal. Hafif ve dayanıklı!',
      slug: 'erkek-terlik-lacivert-crocs'
    },
    status: 'active',
    tags: ['terlik', 'erkek', 'crocs', 'lacivert', 'günlük'],
    supplier: {
      id: 'sup-007',
      name: 'Crocs Türkiye'
    },
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2025-12-10T08:00:00Z'
  },
  {
    id: 'prod-008',
    name: 'Kadın Babet - Siyah Rugan',
    category: 'Ayakkabı',
    brand: 'Hotiç',
    sku: 'HTC-BBT-008',
    description: 'Klasik siyah rugan babet. İş ve günlük kullanım için uygun.',
    images: [
      'https://via.placeholder.com/800x800?text=Hotic+Babet+1',
      'https://via.placeholder.com/800x800?text=Hotic+Babet+2'
    ],
    variants: [
      { id: 'var-008-1', size: '36', sku: 'HTC-BBT-008-36', stock: 14, price: 449.99 },
      { id: 'var-008-2', size: '37', sku: 'HTC-BBT-008-37', stock: 19, price: 449.99 },
      { id: 'var-008-3', size: '38', sku: 'HTC-BBT-008-38', stock: 22, price: 449.99 },
      { id: 'var-008-4', size: '39', sku: 'HTC-BBT-008-39', stock: 17, price: 449.99 },
      { id: 'var-008-5', size: '40', sku: 'HTC-BBT-008-40', stock: 11, price: 449.99 }
    ],
    pricing: {
      basePrice: 449.99,
      cost: 225.00,
      margin: 50.0
    },
    inventory: {
      totalStock: 83,
      lowStockThreshold: 15,
      isLowStock: false,
      reservedStock: 4,
      availableStock: 79
    },
    sales: {
      totalSold: 178,
      revenue: 80098.22,
      avgRating: 4.6,
      reviewCount: 71
    },
    seo: {
      metaTitle: 'Kadın Babet Siyah Rugan - Hotiç | AsistanApp',
      metaDescription: 'Klasik siyah rugan babet. İş ve günlük kullanım. Rahat ve şık!',
      slug: 'kadin-babet-siyah-rugan-hotic'
    },
    status: 'active',
    tags: ['babet', 'kadın', 'hotiç', 'siyah', 'klasik'],
    supplier: {
      id: 'sup-008',
      name: 'Hotiç Mağazaları'
    },
    createdAt: '2024-07-25T15:45:00Z',
    updatedAt: '2025-12-09T14:20:00Z'
  }
];

// Product Statistics
export const mockProductStats = {
  total: 847,
  active: 765,
  draft: 12,
  outOfStock: 35,
  discontinued: 35,
  lowStock: 67,
  totalValue: 4567890.50,
  avgPrice: 623.45,
  topCategory: 'Ayakkabı',
  topBrand: 'Nike',
  totalSold: 23456,
  totalRevenue: 14567890.30
};
