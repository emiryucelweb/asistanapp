/* =========================================
   Message Templates Library Service
   Comprehensive template management system
   Production-ready with robust error handling
========================================= */

import { BusinessType } from '@/shared/config/business-types';

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'faq' | 'appointment' | 'info' | 'sales' | 'support' | 'apology' | 'thanks' | 'closing' | 'pricing' | 'availability';
  businessTypes: BusinessType[];
  variables: TemplateVariable[];
  isGlobal: boolean; // Global templates apply to all business types
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  tags: string[];
  shortcut?: string; // Keyboard shortcut like /greeting1
  language: 'tr' | 'en';
  version: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue: string;
  required: boolean;
  type: 'text' | 'number' | 'date' | 'email' | 'phone';
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface TemplateUsageAnalytics {
  templateId: string;
  usedAt: Date;
  businessType: BusinessType;
  agentId: string;
  conversationId: string;
  responseTime: number; // milliseconds saved
}

class MessageTemplatesService {
  private templates: Map<string, MessageTemplate> = new Map();
  private categories: Map<string, TemplateCategory> = new Map();
  private analytics: TemplateUsageAnalytics[] = [];

  constructor() {
    this.initializeDefaultCategories();
    this.initializeDefaultTemplates();
  }

  private initializeDefaultCategories(): void {
    const categories: TemplateCategory[] = [
      {
        id: 'greeting',
        name: 'Karşılama',
        description: 'Müşteri karşılama mesajları',
        icon: 'MessageCircle',
        color: 'text-green-600 bg-green-100',
        isActive: true
      },
      {
        id: 'faq',
        name: 'Sık Sorulan Sorular',
        description: 'Yaygın sorulara hazır yanıtlar',
        icon: 'HelpCircle',
        color: 'text-blue-600 bg-blue-100',
        isActive: true
      },
      {
        id: 'appointment',
        name: 'Randevu',
        description: 'Randevu ile ilgili mesajlar',
        icon: 'Calendar',
        color: 'text-purple-600 bg-purple-100',
        isActive: true
      },
      {
        id: 'info',
        name: 'Bilgilendirme',
        description: 'Ürün/hizmet bilgilendirme',
        icon: 'Info',
        color: 'text-cyan-600 bg-cyan-100',
        isActive: true
      },
      {
        id: 'sales',
        name: 'Satış',
        description: 'Satış ve pazarlama mesajları',
        icon: 'ShoppingBag',
        color: 'text-orange-600 bg-orange-100',
        isActive: true
      },
      {
        id: 'support',
        name: 'Destek',
        description: 'Müşteri destek mesajları',
        icon: 'Headphones',
        color: 'text-indigo-600 bg-indigo-100',
        isActive: true
      },
      {
        id: 'apology',
        name: 'Özür',
        description: 'Özür dileme mesajları',
        icon: 'AlertCircle',
        color: 'text-red-600 bg-red-100',
        isActive: true
      },
      {
        id: 'thanks',
        name: 'Teşekkür',
        description: 'Teşekkür mesajları',
        icon: 'Heart',
        color: 'text-pink-600 bg-pink-100',
        isActive: true
      },
      {
        id: 'closing',
        name: 'Kapanış',
        description: 'Konuşma kapanış mesajları',
        icon: 'CheckCircle',
        color: 'text-gray-600 bg-gray-100',
        isActive: true
      },
      {
        id: 'pricing',
        name: 'Fiyatlandırma',
        description: 'Fiyat ve ödeme bilgileri',
        icon: 'DollarSign',
        color: 'text-yellow-600 bg-yellow-100',
        isActive: true
      },
      {
        id: 'availability',
        name: 'Müsaitlik',
        description: 'Müsaitlik ve çalışma saatleri',
        icon: 'Clock',
        color: 'text-emerald-600 bg-emerald-100',
        isActive: true
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
      // GREETING TEMPLATES
      {
        title: 'Genel Karşılama',
        content: 'Merhaba {{customerName}}! {{businessName}}\'a hoş geldiniz. Size nasıl yardımcı olabilirim?',
        category: 'greeting',
        businessTypes: ['other'], // Will be available for all
        variables: [
          { name: 'customerName', description: 'Müşteri adı', defaultValue: 'Değerli müşterimiz', required: false, type: 'text' },
          { name: 'businessName', description: 'İşletme adı', defaultValue: 'İşletmemiz', required: false, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['karşılama', 'genel'],
        shortcut: '/hello',
        language: 'tr',
        version: '1.0.0'
      },
      {
        title: 'Zamana Özel Karşılama',
        content: '{{timeGreeting}}! Size nasıl yardımcı olabilirim?',
        category: 'greeting',
        businessTypes: ['other'],
        variables: [
          { name: 'timeGreeting', description: 'Zamana göre karşılama', defaultValue: 'İyi günler', required: true, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['karşılama', 'zaman'],
        shortcut: '/hi',
        language: 'tr',
        version: '1.0.0'
      },

      // DENTAL CLINIC SPECIFIC
      {
        title: 'Diş Kliniği Karşılama',
        content: 'Merhaba {{customerName}}! Diş kliniğimize hoş geldiniz. Diş sağlığınız için size nasıl yardımcı olabilirim?',
        category: 'greeting',
        businessTypes: ['dental_clinic'],
        variables: [
          { name: 'customerName', description: 'Hasta adı', defaultValue: 'Değerli hastamız', required: false, type: 'text' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['diş', 'hasta', 'karşılama'],
        shortcut: '/dental-hi',
        language: 'tr',
        version: '1.0.0'
      },
      {
        title: 'Randevu Bilgilendirme',
        content: 'Randevu için müsait günlerimiz {{availableDays}}. Hangi gün ve saat dilimi size uygun?',
        category: 'appointment',
        businessTypes: ['dental_clinic'],
        variables: [
          { name: 'availableDays', description: 'Müsait günler', defaultValue: 'Pazartesi-Cuma 09:00-18:00', required: true, type: 'text' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['randevu', 'müsaitlik'],
        shortcut: '/appointment',
        language: 'tr',
        version: '1.0.0'
      },
      {
        title: 'Diş Beyazlatma Bilgisi',
        content: 'Diş beyazlatma işlemi {{duration}} sürmektedir. Ücretimiz {{price}}. İşlem {{effectDuration}} etkili kalır.',
        category: 'info',
        businessTypes: ['dental_clinic'],
        variables: [
          { name: 'duration', description: 'İşlem süresi', defaultValue: '1 saat', required: true, type: 'text' },
          { name: 'price', description: 'Ücret', defaultValue: '1,200₺', required: true, type: 'text' },
          { name: 'effectDuration', description: 'Etki süresi', defaultValue: '2-3 yıl', required: true, type: 'text' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['beyazlatma', 'fiyat', 'bilgi'],
        shortcut: '/whitening',
        language: 'tr',
        version: '1.0.0'
      },

      // RESTAURANT SPECIFIC
      {
        title: 'Restoran Karşılama',
        content: 'Hoş geldiniz {{customerName}}! {{restaurantName}} Restoran\'a. Rezervasyon mu yapmak istiyorsunuz?',
        category: 'greeting',
        businessTypes: ['restaurant'],
        variables: [
          { name: 'customerName', description: 'Misafir adı', defaultValue: 'Değerli misafirimiz', required: false, type: 'text' },
          { name: 'restaurantName', description: 'Restoran adı', defaultValue: 'Lezzet Durağı', required: false, type: 'text' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['restoran', 'karşılama', 'rezervasyon'],
        shortcut: '/restaurant-hi',
        language: 'tr',
        version: '1.0.0'
      },
      {
        title: 'Masa Rezervasyonu',
        content: 'Rezervasyon için {{date}} tarihinde {{time}} saatinde {{guests}} kişilik masa ayırtabilirsiniz. Onaylıyor musunuz?',
        category: 'appointment',
        businessTypes: ['restaurant'],
        variables: [
          { name: 'date', description: 'Tarih', defaultValue: 'bugün', required: true, type: 'date' },
          { name: 'time', description: 'Saat', defaultValue: '20:00', required: true, type: 'text' },
          { name: 'guests', description: 'Kişi sayısı', defaultValue: '4', required: true, type: 'number' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['rezervasyon', 'masa', 'tarih'],
        shortcut: '/reservation',
        language: 'tr',
        version: '1.0.0'
      },

      // HOTEL SPECIFIC
      {
        title: 'Otel Karşılama',
        content: 'Merhaba {{guestName}}! {{hotelName}} Hotel\'e hoş geldiniz. Konaklama ihtiyaçlarınız için buradayım.',
        category: 'greeting',
        businessTypes: ['hotel'],
        variables: [
          { name: 'guestName', description: 'Misafir adı', defaultValue: 'Değerli misafirimiz', required: false, type: 'text' },
          { name: 'hotelName', description: 'Otel adı', defaultValue: 'Grand Palace', required: false, type: 'text' }
        ],
        isGlobal: false,
        isActive: true,
        tags: ['otel', 'konaklama', 'karşılama'],
        shortcut: '/hotel-hi',
        language: 'tr',
        version: '1.0.0'
      },

      // COMMON FAQ TEMPLATES
      {
        title: 'Çalışma Saatleri',
        content: 'Çalışma saatlerimiz {{workingHours}}. {{additionalInfo}}',
        category: 'faq',
        businessTypes: ['other'],
        variables: [
          { name: 'workingHours', description: 'Çalışma saatleri', defaultValue: 'Pazartesi-Cuma 09:00-18:00', required: true, type: 'text' },
          { name: 'additionalInfo', description: 'Ek bilgi', defaultValue: 'Cumartesi 09:00-14:00 açığız.', required: false, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['saat', 'çalışma', 'faq'],
        shortcut: '/hours',
        language: 'tr',
        version: '1.0.0'
      },
      {
        title: 'İletişim Bilgileri',
        content: 'İletişim bilgilerimiz:\n📞 Telefon: {{phone}}\n📧 E-posta: {{email}}\n📍 Adres: {{address}}',
        category: 'info',
        businessTypes: ['other'],
        variables: [
          { name: 'phone', description: 'Telefon numarası', defaultValue: '0212 xxx xxxx', required: true, type: 'phone' },
          { name: 'email', description: 'E-posta adresi', defaultValue: 'info@business.com', required: true, type: 'email' },
          { name: 'address', description: 'Adres', defaultValue: 'İstanbul, Türkiye', required: true, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['iletişim', 'telefon', 'adres'],
        shortcut: '/contact',
        language: 'tr',
        version: '1.0.0'
      },

      // APOLOGY TEMPLATES
      {
        title: 'Genel Özür',
        content: 'Yaşadığınız sorun için çok üzgünüz {{customerName}}. Bu durumu hemen düzeltmek için elimizden geleni yapacağız.',
        category: 'apology',
        businessTypes: ['other'],
        variables: [
          { name: 'customerName', description: 'Müşteri adı', defaultValue: '', required: false, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['özür', 'sorun', 'çözüm'],
        shortcut: '/sorry',
        language: 'tr',
        version: '1.0.0'
      },

      // THANKS TEMPLATES
      {
        title: 'Teşekkür ve Kapanış',
        content: 'Bizi tercih ettiğiniz için teşekkür ederiz {{customerName}}! Başka bir konuda yardıma ihtiyacınız olursa her zaman buradayız. 😊',
        category: 'thanks',
        businessTypes: ['other'],
        variables: [
          { name: 'customerName', description: 'Müşteri adı', defaultValue: '', required: false, type: 'text' }
        ],
        isGlobal: true,
        isActive: true,
        tags: ['teşekkür', 'kapanış'],
        shortcut: '/thanks',
        language: 'tr',
        version: '1.0.0'
      }
    ];

    defaultTemplates.forEach((templateData, index) => {
      const template: MessageTemplate = {
        ...templateData,
        id: `template_${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: Math.floor(Math.random() * 50) // Mock usage data
      };
      this.templates.set(template.id, template);
    });
  }

  // TEMPLATE CRUD OPERATIONS
  getAllTemplates(): MessageTemplate[] {
    return Array.from(this.templates.values()).sort((a, b) => b.usageCount - a.usageCount);
  }

  getTemplatesByBusinessType(businessType: BusinessType): MessageTemplate[] {
    return this.getAllTemplates().filter(template => 
      template.isGlobal || template.businessTypes.includes(businessType)
    );
  }

  getTemplatesByCategory(category: string, businessType?: BusinessType): MessageTemplate[] {
    let templates = this.getAllTemplates().filter(template => template.category === category);
    
    if (businessType) {
      templates = templates.filter(template => 
        template.isGlobal || template.businessTypes.includes(businessType)
      );
    }
    
    return templates;
  }

  getTemplateById(id: string): MessageTemplate | null {
    return this.templates.get(id) || null;
  }

  searchTemplates(query: string, businessType?: BusinessType): MessageTemplate[] {
    const searchTerm = query.toLowerCase();
    let templates = this.getAllTemplates();
    
    if (businessType) {
      templates = this.getTemplatesByBusinessType(businessType);
    }
    
    return templates.filter(template => 
      template.title.toLowerCase().includes(searchTerm) ||
      template.content.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      template.shortcut?.toLowerCase().includes(searchTerm)
    );
  }

  createTemplate(templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): MessageTemplate {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const template: MessageTemplate = {
      ...templateData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
    
    this.templates.set(id, template);
    return template;
  }

  updateTemplate(id: string, updates: Partial<MessageTemplate>): MessageTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;
    
    const updatedTemplate: MessageTemplate = {
      ...template,
      ...updates,
      id, // Preserve ID
      createdAt: template.createdAt, // Preserve creation date
      updatedAt: new Date()
    };
    
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // TEMPLATE USAGE
  useTemplate(templateId: string, variables: Record<string, string> = {}): string {
    const template = this.templates.get(templateId);
    if (!template) return '';
    
    // Increment usage count
    template.usageCount++;
    template.updatedAt = new Date();
    
    // Replace variables in content
    let content = template.content;
    
    // Replace template variables
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue;
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      content = content.replace(regex, value);
    });
    
    // Track analytics
    this.trackUsage(templateId);
    
    return content;
  }

  // CATEGORIES
  getAllCategories(): TemplateCategory[] {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  getCategoryById(id: string): TemplateCategory | null {
    return this.categories.get(id) || null;
  }

  // ANALYTICS
  private trackUsage(templateId: string): void {
    const usage: TemplateUsageAnalytics = {
      templateId,
      usedAt: new Date(),
      businessType: 'other', // Would come from context in real app
      agentId: 'current_agent', // Would come from auth context
      conversationId: 'current_conversation',
      responseTime: Math.floor(Math.random() * 5000) // Mock response time saved
    };
    
    this.analytics.push(usage);
    
    // Keep only last 1000 records
    if (this.analytics.length > 1000) {
      this.analytics = this.analytics.slice(-1000);
    }
  }

  getUsageAnalytics(templateId?: string): TemplateUsageAnalytics[] {
    if (templateId) {
      return this.analytics.filter(usage => usage.templateId === templateId);
    }
    return this.analytics;
  }

  getPopularTemplates(limit = 10): MessageTemplate[] {
    return this.getAllTemplates()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // UTILITY METHODS
  duplicateTemplate(id: string, newTitle?: string): MessageTemplate | null {
    const original = this.templates.get(id);
    if (!original) return null;
    
      const { id: _originalId, createdAt: _createdAt, updatedAt: _updatedAt, usageCount: _usageCount, ...templateData } = original;
      const duplicate = this.createTemplate({
        ...templateData,
        title: newTitle || `${original.title} (Kopya)`
      });
    
    return duplicate;
  }

  exportTemplates(businessType?: BusinessType): MessageTemplate[] {
    if (businessType) {
      return this.getTemplatesByBusinessType(businessType);
    }
    return this.getAllTemplates();
  }

  importTemplates(templates: MessageTemplate[]): { success: number; errors: string[] } {
    const results = { success: 0, errors: [] as string[] };
    
    templates.forEach(template => {
      try {
        // Validate template
        if (!template.title || !template.content || !template.category) {
          results.errors.push(`Invalid template: ${template.title || 'Unknown'}`);
          return;
        }
        
        // Check for duplicate shortcuts
        const existingWithShortcut = this.getAllTemplates().find(t => 
          t.shortcut && t.shortcut === template.shortcut
        );
        
        if (existingWithShortcut) {
          template.shortcut = undefined; // Remove conflicting shortcut
        }
        
        this.createTemplate(template);
        results.success++;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push(`Error importing ${template.title}: ${errorMessage}`);
      }
    });
    
    return results;
  }
}

// Singleton instance
export const messageTemplatesService = new MessageTemplatesService();

// Helper function to process template shortcuts in text
export const processTemplateShortcuts = (text: string, businessType: BusinessType): string | null => {
  const shortcutMatch = text.match(/^\/[\w-]+$/);
  if (!shortcutMatch) return null;
  
  const shortcut = shortcutMatch[0];
  const templates = messageTemplatesService.getTemplatesByBusinessType(businessType);
  const template = templates.find(t => t.shortcut === shortcut);
  
  if (template) {
    return messageTemplatesService.useTemplate(template.id);
  }
  
  return null;
};

// Default variables for common use cases
export const getDefaultVariables = (businessType: BusinessType): Record<string, string> => {
  const baseVariables = {
    businessName: 'İşletmemiz',
    customerName: 'Değerli müşterimiz',
    timeGreeting: getTimeBasedGreeting(),
    currentDate: new Date().toLocaleDateString('tr-TR'),
    currentTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  
  // Business type specific variables
  const businessSpecific: Record<BusinessType, Record<string, string>> = {
    dental_clinic: {
      ...baseVariables,
      customerName: 'Değerli hastamız',
      businessName: 'Diş Kliniğimiz',
      availableDays: 'Pazartesi-Cuma 09:00-18:00',
      emergencyPhone: '0212 xxx xxxx'
    },
    restaurant: {
      ...baseVariables,
      customerName: 'Değerli misafirimiz',
      businessName: 'Restoran\'ımız',
      restaurantName: 'Lezzet Durağı',
      reservationPhone: '0212 xxx xxxx'
    },
    hotel: {
      ...baseVariables,
      guestName: 'Değerli misafirimiz',
      hotelName: 'Hotel\'imiz',
      checkInTime: '14:00',
      checkOutTime: '12:00'
    },
    // Add other business types as needed
    hospital: baseVariables,
    aesthetic_center: baseVariables,
    dietician: baseVariables,
    hair_salon: baseVariables,
    beauty_salon: baseVariables,
    spa_massage: baseVariables,
    veterinary: baseVariables,
    cafe: baseVariables,
    fast_food: baseVariables,
    bakery: baseVariables,
    catering: baseVariables,
    food_delivery: baseVariables,
    boutique: baseVariables,
    shoe_store: baseVariables,
    cosmetics: baseVariables,
    jewelry: baseVariables,
    electronics: baseVariables,
    flower_shop: baseVariables,
    pet_shop: baseVariables,
    boutique_hotel: baseVariables,
    resort: baseVariables,
    travel_agency: baseVariables,
    event_planning: baseVariables,
    fitness_center: baseVariables,
    cinema_theater: baseVariables,
    entertainment: baseVariables,
    car_rental: baseVariables,
    car_wash: baseVariables,
    auto_repair: baseVariables,
    taxi_transfer: baseVariables,
    logistics: baseVariables,
    cleaning: baseVariables,
    decoration: baseVariables,
    technical_service: baseVariables,
    security: baseVariables,
    real_estate: baseVariables,
    legal: baseVariables,
    consulting: baseVariables,
    insurance: baseVariables,
    finance: baseVariables,
    hr_recruitment: baseVariables,
    freelancer: baseVariables,
    career_counseling: baseVariables,
    tutoring: baseVariables,
    university: baseVariables,
    private_school: baseVariables,
    online_education: baseVariables,
    language_school: baseVariables,
    library_culture: baseVariables,
    ecommerce: baseVariables,
    social_commerce: baseVariables,
    dropshipping: baseVariables,
    digital_products: baseVariables,
    gaming: baseVariables,
    media_streaming: baseVariables,
    municipality: baseVariables,
    ngo: baseVariables,
    union: baseVariables,
    visa_passport: baseVariables,
    other: baseVariables
  };
  
  return businessSpecific[businessType] || baseVariables;
};

// Helper function for time-based greetings
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Günaydın';
  if (hour >= 12 && hour < 17) return 'İyi günler';
  if (hour >= 17 && hour < 22) return 'İyi akşamlar';
  return 'İyi geceler';
};
