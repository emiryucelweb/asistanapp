/* =========================================
   Smart Message Suggestions AI Engine
   Sektör-spesifik akıllı mesaj önerileri
========================================= */

import { BusinessType } from '@/shared/config/business-types';
import { logger } from '@/shared/utils/logger';

export interface SmartSuggestion {
  id: string;
  text: string;
  context: string[];
  businessType: BusinessType;
  confidence: number;
  category: 'greeting' | 'info' | 'sales' | 'support' | 'appointment' | 'closing' | 'apology' | 'thanks';
  variables?: Record<string, string>;
  isTemplate: boolean;
}

export interface Message {
  content: string;
  isFromCustomer: boolean;
  timestamp: Date;
}

export interface SuggestionContext {
  userInput: string;
  conversationHistory: Message[];
  businessType: BusinessType;
  customerName?: string;
  isVIP?: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  sentiment?: 'positive' | 'neutral' | 'negative';
}

class SmartSuggestionsEngine {
  private sectorTemplates: Record<BusinessType, Record<string, SmartSuggestion[]>> = {
    // 🦷 DİŞ KLİNİĞİ
    dental_clinic: {
      greeting: [
        {
          id: 'dental_greeting_1',
          text: 'Merhaba {{customerName}}! Diş kliniğimize hoş geldiniz. Size nasıl yardımcı olabilirim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'dental_clinic',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli hastamız' },
          isTemplate: true
        },
        {
          id: 'dental_greeting_2', 
          text: 'İyi günler! Diş sağlığınız için bugün hangi konuda yardım edebilirim?',
          context: ['iyi günler', 'good morning', 'günaydın'],
          businessType: 'dental_clinic',
          confidence: 0.92,
          category: 'greeting',
          isTemplate: false
        }
      ],
      appointment: [
        {
          id: 'dental_appointment_1',
          text: 'Randevu için müsait günlerimiz: Pazartesi-Cuma 09:00-18:00. Hangi gün size uygun?',
          context: ['randevu', 'appointment', 'tarih', 'saat'],
          businessType: 'dental_clinic',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        },
        {
          id: 'dental_appointment_2',
          text: 'Acil durumlar için bugün içinde yer açabiliriz. Durumunuz acil mi?',
          context: ['acil', 'ağrı', 'urgent', 'emergency'],
          businessType: 'dental_clinic',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'dental_info_1',
          text: 'Diş beyazlatma işlemi 1 saatte tamamlanır ve 2-3 yıl etkili kalır. Fiyatımız 1,200₺',
          context: ['beyazlatma', 'whitening', 'fiyat', 'price'],
          businessType: 'dental_clinic',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        },
        {
          id: 'dental_info_2',
          text: 'İmplant tedaviniz 3-6 ay sürer. İlk muayenede detaylı plan hazırlıyoruz.',
          context: ['implant', 'tedavi', 'süre', 'treatment'],
          businessType: 'dental_clinic',
          confidence: 0.83,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'dental_support_1',
          text: 'Tedavi sonrası ağrı normal olabilir. Verdiğimiz ilaçları kullanın, 2 gün sonra geçer.',
          context: ['ağrı', 'pain', 'tedavi sonrası', 'after treatment'],
          businessType: 'dental_clinic',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    // 🍽️ RESTORAN
    restaurant: {
      greeting: [
        {
          id: 'restaurant_greeting_1',
          text: 'Hoş geldiniz {{customerName}}! Lezzet Durağı Restauranta. Size nasıl yardımcı olabilirim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'restaurant',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli misafirimiz' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'restaurant_appointment_1',
          text: 'Rezervasyon için tarih ve saat tercihlerinizi alabilir miyim? Kaç kişilik masa istiyorsunuz?',
          context: ['rezervasyon', 'reservation', 'masa', 'table'],
          businessType: 'restaurant',
          confidence: 0.92,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'restaurant_info_1',
          text: 'Menümüzde Türk mutfağı ve uluslararası lezzetler var. Özel diyet menümüz de mevcut.',
          context: ['menü', 'menu', 'yemek', 'food'],
          businessType: 'restaurant',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ]
    },

    // 🏨 OTEL
    hotel: {
      greeting: [
        {
          id: 'hotel_greeting_1',
          text: 'Merhaba {{customerName}}! Grand Palace Hotel\'e hoş geldiniz. Konaklama ihtiyaçlarınız için buradayım.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'hotel',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli misafirimiz' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'hotel_appointment_1',
          text: 'Check-in ve check-out tarihlerinizi alabilir miyim? Oda tercihiniz var mı?',
          context: ['rezervasyon', 'reservation', 'oda', 'room'],
          businessType: 'hotel',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ]
    },

    // ☕ KAFE
    cafe: {
      greeting: [
        {
          id: 'cafe_greeting_1',
          text: 'Merhaba {{customerName}}! Coffee Corner Kafe\'ye hoş geldiniz. Bugün hangi lezzeti deneyimlemek istiyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'cafe',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Kahve sevdalısı' },
          isTemplate: true
        }
      ]
    },

    // 👗 BUTİK
    boutique: {
      greeting: [
        {
          id: 'boutique_greeting_1',
          text: 'Merhaba {{customerName}}! Fashion Boutique\'e hoş geldiniz. Hangi tarzda bir parça arıyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'boutique',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Stil sahibi' },
          isTemplate: true
        }
      ]
    },

    // 🛒 E-TİCARET  
    ecommerce: {
      greeting: [
        {
          id: 'ecommerce_greeting_1',
          text: 'Merhaba {{customerName}}! TechShop\'a hoş geldiniz. Hangi ürün hakkında bilgi almak istiyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'ecommerce',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli müşterimiz' },
          isTemplate: true
        }
      ],
      sales: [
        {
          id: 'ecommerce_sales_1',
          text: 'Bu ürün şu anda %20 indirimde! Sipariş vermek ister misiniz?',
          context: ['satın al', 'buy', 'purchase', 'sipariş'],
          businessType: 'ecommerce',
          confidence: 0.88,
          category: 'sales',
          isTemplate: false
        }
      ]
    },

    // 🏥 SAĞLIK & GÜZELLİK - Diğer Sektörler
    hospital: {
      greeting: [
        {
          id: 'hospital_greeting_1',
          text: 'Merhaba {{customerName}}! Hastanemize hoş geldiniz. Sağlığınız için buradayım.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'hospital',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli hastamız' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'hospital_appointment_1',
          text: 'Hangi bölümden randevu almak istiyorsunuz? Dahiliye, kardiyoloji, ortopedi...',
          context: ['randevu', 'appointment', 'doktor', 'muayene'],
          businessType: 'hospital',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'hospital_info_1',
          text: 'Hastanemizde 7/24 acil servis, ameliyathane ve yoğun bakım hizmetleri mevcuttur.',
          context: ['bilgi', 'info', 'hizmet', 'service'],
          businessType: 'hospital',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'hospital_support_1',
          text: 'Tahlil sonuçlarınız hazır. Sistemden kontrol edebilir, doktorunuzla değerlendirebilirsiniz.',
          context: ['tahlil', 'sonuç', 'result', 'test'],
          businessType: 'hospital',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    aesthetic_center: {
      greeting: [
        {
          id: 'aesthetic_greeting_1',
          text: 'Merhaba {{customerName}}! Güzellik yolculuğunuza hoş geldiniz. Size nasıl yardım edebilirim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'aesthetic_center',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Güzel' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'aesthetic_appointment_1',
          text: 'Hangi işlem için randevu almak istiyorsunuz? Botoks, dolgu, lazer epilasyon?',
          context: ['randevu', 'botoks', 'dolgu', 'lazer'],
          businessType: 'aesthetic_center',
          confidence: 0.92,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'aesthetic_info_1',
          text: 'Botoks uygulaması 15 dakikada tamamlanır, etki 4-6 ay sürer. Fiyatımız 1,800₺',
          context: ['botoks', 'fiyat', 'price', 'süre'],
          businessType: 'aesthetic_center',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'aesthetic_support_1',
          text: 'İşlem sonrası ilk 24 saat soğuk kompres uygulayın, masaj yapmayın.',
          context: ['sonrası', 'bakım', 'care', 'after'],
          businessType: 'aesthetic_center',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    dietician: {
      greeting: [
        {
          id: 'dietician_greeting_1',
          text: 'Merhaba {{customerName}}! Sağlıklı beslenme yolculuğunuzda yanınızdayım.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'dietician',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli danışanım' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'dietician_appointment_1',
          text: 'Kilo verme, kilo alma veya özel beslenme programı için randevu alabilirsiniz.',
          context: ['randevu', 'kilo', 'diyet', 'beslenme'],
          businessType: 'dietician',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'dietician_info_1',
          text: 'Kişiye özel beslenme programları hazırlıyoruz. İlk konsültasyon 200₺',
          context: ['program', 'fiyat', 'price', 'diyet'],
          businessType: 'dietician',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'dietician_support_1',
          text: 'Programa uyum konusunda zorluk yaşıyorsanız birlikte çözüm bulalım.',
          context: ['zorluk', 'problem', 'uyum', 'adaptation'],
          businessType: 'dietician',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    hair_salon: {
      greeting: [
        {
          id: 'hair_greeting_1',
          text: 'Merhaba {{customerName}}! Kuaföre hoş geldiniz. Saçlarınız için ne planlıyoruz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'hair_salon',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Güzelim' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'hair_appointment_1',
          text: 'Kesim, boyama, fön veya saç bakımı için hangi gün size uygun?',
          context: ['randevu', 'kesim', 'boyama', 'fön'],
          businessType: 'hair_salon',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'hair_info_1',
          text: 'Saç boyama 150₺, kesim 80₺, fön 60₺. Paket fiyatlarımız da var.',
          context: ['fiyat', 'price', 'boyama', 'kesim'],
          businessType: 'hair_salon',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'hair_support_1',
          text: 'Saç bakımı için önerilerimiz: haftada 2-3 kez şampuan, aylık maske.',
          context: ['bakım', 'care', 'şampuan', 'mask'],
          businessType: 'hair_salon',
          confidence: 0.88,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    beauty_salon: {
      greeting: [
        {
          id: 'beauty_greeting_1',
          text: 'Merhaba {{customerName}}! Güzellik salonuna hoş geldiniz. Kendinizi şımartmaya hazır mısınız?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'beauty_salon',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Prensesim' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'beauty_appointment_1',
          text: 'Cilt bakımı, manikür, pedikür, kaş dizaynı... Hangi hizmet için randevu?',
          context: ['randevu', 'manikür', 'cilt', 'kaş'],
          businessType: 'beauty_salon',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'beauty_info_1',
          text: 'Cilt bakımı 120₺, manikür 100₺, pedikür 120₺. Paket indirimleri mevcut.',
          context: ['fiyat', 'price', 'manikür', 'cilt'],
          businessType: 'beauty_salon',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'beauty_support_1',
          text: 'Cilt bakımından sonra 24 saat güneşe çıkmayın, nemlendirici kullanın.',
          context: ['bakım', 'cilt', 'güneş', 'nemlendirici'],
          businessType: 'beauty_salon',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    spa_massage: {
      greeting: [
        {
          id: 'spa_greeting_1',
          text: 'Merhaba {{customerName}}! Huzur dolu spa deneyimimize hoş geldiniz.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'spa_massage',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli konuk' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'spa_appointment_1',
          text: 'İsveç masajı, aromaterapi, sıcak taş masajı... Hangi terapi için randevu?',
          context: ['randevu', 'masaj', 'terapi', 'spa'],
          businessType: 'spa_massage',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'spa_info_1',
          text: '60 dakika İsveç masajı 300₺, aromaterapi 350₺. Çift kişi paketleri var.',
          context: ['fiyat', 'price', 'masaj', 'süre'],
          businessType: 'spa_massage',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'spa_support_1',
          text: 'Masaj sonrası bol su için, 2 saat ağır yemek yemeyin.',
          context: ['sonrası', 'bakım', 'su', 'yemek'],
          businessType: 'spa_massage',
          confidence: 0.88,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    veterinary: {
      greeting: [
        {
          id: 'vet_greeting_1',
          text: 'Merhaba {{customerName}}! Sevimli dostunuz için veteriner kliniğimize hoş geldiniz.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'veterinary',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Pet dostu' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'vet_appointment_1',
          text: 'Aşı, muayene, ameliyat veya acil durum için randevu alabilirsiniz.',
          context: ['randevu', 'aşı', 'muayene', 'acil'],
          businessType: 'veterinary',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'vet_info_1',
          text: 'Genel muayene 150₺, aşı 80₺, kısırlaştırma 400₺. Acil durumlar 7/24.',
          context: ['fiyat', 'price', 'aşı', 'muayene'],
          businessType: 'veterinary',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'vet_support_1',
          text: 'Pet ilaç kullanım talimatları: Günde 2 kez, yemekten sonra.',
          context: ['ilaç', 'kullanım', 'medicine', 'dosage'],
          businessType: 'veterinary',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🍽️ YİYECEK & İÇECEK - Diğer Sektörler
    fast_food: {
      greeting: [
        {
          id: 'fastfood_greeting_1',
          text: 'Merhaba {{customerName}}! Fast food lezzetlerimize hoş geldiniz. Ne söyleyeceğiz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'fast_food',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Canım' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'fastfood_appointment_1',
          text: 'Sipariş için masa ayırtmak istiyor musunuz yoksa paket servis mi?',
          context: ['rezervasyon', 'masa', 'paket', 'sipariş'],
          businessType: 'fast_food',
          confidence: 0.80,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'fastfood_info_1',
          text: 'Hamburger 25₺, pizza 35₺, patates 15₺. Combo menülerimiz de var!',
          context: ['fiyat', 'menü', 'hamburger', 'pizza'],
          businessType: 'fast_food',
          confidence: 0.90,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'fastfood_support_1',
          text: 'Sipariş takip numaranız: #2024. Ortalama hazırlanma süresi 15 dakika.',
          context: ['sipariş', 'takip', 'süre', 'hazır'],
          businessType: 'fast_food',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    bakery: {
      greeting: [
        {
          id: 'bakery_greeting_1',
          text: 'Merhaba {{customerName}}! Taze fırın lezzetlerimize hoş geldiniz. Ne arıyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'bakery',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Tatlım' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'bakery_appointment_1',
          text: 'Özel pasta siparişi için randevu almak ister misiniz? Ne zaman lazım?',
          context: ['pasta', 'özel', 'sipariş', 'tarih'],
          businessType: 'bakery',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'bakery_info_1',
          text: 'Doğum günü pastası 150₺, düğün pastası 500₺, kurabiyelеr 50₺/kg.',
          context: ['pasta', 'fiyat', 'doğum günü', 'düğün'],
          businessType: 'bakery',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'bakery_support_1',
          text: 'Pastanız hazır! Buzdolabında 3 gün saklanabilir.',
          context: ['hazır', 'saklama', 'buzdolabı', 'süre'],
          businessType: 'bakery',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    catering: {
      greeting: [
        {
          id: 'catering_greeting_1',
          text: 'Merhaba {{customerName}}! Özel etkinlikleriniz için catering hizmetimize hoş geldiniz.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'catering',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Organizatör' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'catering_appointment_1',
          text: 'Etkinlik tarihiniz ve kişi sayınızı öğrenebilir miyim?',
          context: ['etkinlik', 'tarih', 'kişi', 'sayı'],
          businessType: 'catering',
          confidence: 0.92,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'catering_info_1',
          text: 'Kişi başı 80₺ - 150₺ arasında paketler. 50+ kişi minimum.',
          context: ['fiyat', 'kişi başı', 'paket', 'minimum'],
          businessType: 'catering',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'catering_support_1',
          text: 'Etkinlik öncesi 2 gün evvel tüm detayları netleştiriyoruz.',
          context: ['öncesi', 'detay', 'hazırlık', 'onay'],
          businessType: 'catering',
          confidence: 0.88,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    food_delivery: {
      greeting: [
        {
          id: 'delivery_greeting_1',
          text: 'Merhaba {{customerName}}! Lezzeti kapınıza getiriyoruz. Sipariş hazır mıyız?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'food_delivery',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Aç karın' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'delivery_appointment_1',
          text: 'Teslimat için adresinizi ve tercih ettiğiniz saati alabilir miyim?',
          context: ['adres', 'teslimat', 'saat', 'zaman'],
          businessType: 'food_delivery',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'delivery_info_1',
          text: 'Teslimat süresi 30-45 dakika. Minimum sipariş 50₺.',
          context: ['süre', 'teslimat', 'minimum', 'sipariş'],
          businessType: 'food_delivery',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'delivery_support_1',
          text: 'Kurye yola çıktı! Takip numarası: #K2024. Tahmini varış: 25 dakika.',
          context: ['kurye', 'yola çıktı', 'takip', 'varış'],
          businessType: 'food_delivery',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🛍️ PERAKENDE & MODA
    shoe_store: {
      greeting: [
        {
          id: 'shoe_greeting_1',
          text: 'Merhaba {{customerName}}! Ayakkabı mağazamıza hoş geldiniz. Hangi model arıyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'shoe_store',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'ŞIK giyinen' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'shoe_appointment_1',
          text: 'Ayakkabı deneme randevusu için uygun olduğunuz saat?',
          context: ['deneme', 'randevu', 'ayakkabı', 'saat'],
          businessType: 'shoe_store',
          confidence: 0.85,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'shoe_info_1',
          text: 'Kadın ayakkabı 200-800₺, erkek 150-600₺. Tüm numaralar mevcut.',
          context: ['fiyat', 'kadın', 'erkek', 'numara'],
          businessType: 'shoe_store',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'shoe_support_1',
          text: 'İlk 1 hafta rahat etmezse değiştiriyoruz. Garanti belgesi sayklayın.',
          context: ['değişim', 'garanti', 'rahat', 'etmez'],
          businessType: 'shoe_store',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    cosmetics: {
      greeting: [
        {
          id: 'cosmetics_greeting_1',
          text: 'Merhaba {{customerName}}! Güzellik dünyamıza hoş geldiniz. Hangi ürünle ilgileniyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'cosmetics',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Güzelim' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'cosmetics_appointment_1',
          text: 'Makyaj danışmanlığı randevusu için hangi gün uygun?',
          context: ['makyaj', 'danışmanlık', 'randevu', 'gün'],
          businessType: 'cosmetics',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'cosmetics_info_1',
          text: 'Fondöten 150₺, ruj 80₺, maskara 120₺. Ücretsiz makyaj danışmanlığı!',
          context: ['fiyat', 'fondöten', 'ruj', 'maskara'],
          businessType: 'cosmetics',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'cosmetics_support_1',
          text: 'Cilt tipinize uygun ürün önerisi için fotoğrafınızı gönderebilirsiniz.',
          context: ['cilt', 'tipi', 'ürün', 'öneri'],
          businessType: 'cosmetics',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    jewelry: {
      greeting: [
        {
          id: 'jewelry_greeting_1',
          text: 'Merhaba {{customerName}}! Kuyumcumuza hoş geldiniz. Altın, gümüş mü yoksa pırlanta mı?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'jewelry',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Kıymetli' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'jewelry_appointment_1',
          text: 'Özel tasarım veya kıymet takdiri için randevu almak ister misiniz?',
          context: ['tasarım', 'kıymet', 'takdir', 'randevu'],
          businessType: 'jewelry',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'jewelry_info_1',
          text: 'Bugünün altın fiyatı: 2,850₺/gram. Gümüş: 45₺/gram. Pırlanta sertifikalı.',
          context: ['altın', 'fiyat', 'gümüş', 'pırlanta'],
          businessType: 'jewelry',
          confidence: 0.90,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'jewelry_support_1',
          text: 'Mücevheri aylık temizlemeye getirin, parlaklığı korunur.',
          context: ['temizlik', 'aylık', 'parlaklık', 'bakım'],
          businessType: 'jewelry',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    electronics: {
      greeting: [
        {
          id: 'electronics_greeting_1',
          text: 'Merhaba {{customerName}}! Elektronik mağazamıza hoş geldiniz. Hangi cihazla ilgileniyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'electronics',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Teknoloji meraklısı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'electronics_appointment_1',
          text: 'Teknik servis randevusu için cihazınızı ve sorununu öğrenir miyim?',
          context: ['teknik', 'servis', 'cihaz', 'sorun'],
          businessType: 'electronics',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'electronics_info_1',
          text: 'iPhone 15: 45.000₺, Samsung S24: 40.000₺. 2 yıl garanti ve kılıf hediye!',
          context: ['iPhone', 'Samsung', 'fiyat', 'garanti'],
          businessType: 'electronics',
          confidence: 0.90,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'electronics_support_1',
          text: 'Garanti kapsamında tamir ediyoruz. Fatura ve garanti belgesini getirin.',
          context: ['garanti', 'tamir', 'fatura', 'belge'],
          businessType: 'electronics',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    flower_shop: {
      greeting: [
        {
          id: 'flower_greeting_1',
          text: 'Merhaba {{customerName}}! Çiçekçimize hoş geldiniz. Hangi özel gün için?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'flower_shop',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Romantik' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'flower_appointment_1',
          text: 'Özel aranjman için randevu alabilirsiniz. Ne zaman teslim edelim?',
          context: ['aranjman', 'randevu', 'teslim', 'zaman'],
          businessType: 'flower_shop',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'flower_info_1',
          text: 'Gül buketi 200₺, orkide 150₺, düğün aranjmanı 800₺. Taze geldi!',
          context: ['gül', 'orkide', 'düğün', 'fiyat'],
          businessType: 'flower_shop',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'flower_support_1',
          text: 'Çiçekler 5-7 gün durur. Vazoya az su koyun, günde değiştirin.',
          context: ['bakım', 'su', 'vazo', 'süre'],
          businessType: 'flower_shop',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    pet_shop: {
      greeting: [
        {
          id: 'pet_greeting_1',
          text: 'Merhaba {{customerName}}! Sevimli dostlarınız için pet shop’a hoş geldiniz!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'pet_shop',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Hayvan sever' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'pet_appointment_1',
          text: 'Pet grooming randevusu için hangi gün uygun? Kedi mi köpek mi?',
          context: ['grooming', 'randevu', 'kedi', 'köpek'],
          businessType: 'pet_shop',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'pet_info_1',
          text: 'Köpek maması 120₺/15kg, kedi maması 80₺/10kg. Oyuncaklar %20 indirimde.',
          context: ['mama', 'köpek', 'kedi', 'oyuncak'],
          businessType: 'pet_shop',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'pet_support_1',
          text: 'Mama değişiminde ilk 3 gün eski mamayla karıştırın.',
          context: ['mama', 'değişim', 'karıştır', 'gün'],
          businessType: 'pet_shop',
          confidence: 0.83,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🏨 KONAKLAMA & EĞLENCE - Diğer Sektörler
    boutique_hotel: {
      greeting: [
        {
          id: 'boutique_hotel_greeting_1',
          text: 'Merhaba {{customerName}}! Butik otelimize hoş geldiniz. Özel bir konaklama deneyimi hazır.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'boutique_hotel',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'VIP misafirimiz' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'boutique_hotel_appointment_1',
          text: 'Premium suite rezervasyonu için check-in ve check-out tarihlerinizi alabilir miyim?',
          context: ['rezervasyon', 'suite', 'check-in', 'tarih'],
          businessType: 'boutique_hotel',
          confidence: 0.92,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'boutique_hotel_info_1',
          text: 'Deluxe oda 2,500₺, suite 4,000₺. Spa, restoran ve concierge hizmetli.',
          context: ['oda', 'suite', 'fiyat', 'spa'],
          businessType: 'boutique_hotel',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'boutique_hotel_support_1',
          text: 'Concierge hizmetimiz 24/7. Tur, restoran rezervasyonu, transfer... Her şey için buradayız.',
          context: ['concierge', '24/7', 'tur', 'transfer'],
          businessType: 'boutique_hotel',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    resort: {
      greeting: [
        {
          id: 'resort_greeting_1',
          text: 'Merhaba {{customerName}}! Tatil köyümüze hoş geldiniz. Mükemmel bir tatil sizi bekliyor!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'resort',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Tatilci' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'resort_appointment_1',
          text: 'All-inclusive paketimiz için kaç geceli kaç gündük kalacaksınız?',
          context: ['all-inclusive', 'gece', 'gün', 'paket'],
          businessType: 'resort',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'resort_info_1',
          text: '5 yıldızlı tatil köyü. Havuz, spa, eğlence, 4 restoran. Haftalık 15,000₺.',
          context: ['5 yıldız', 'havuz', 'spa', 'restoran'],
          businessType: 'resort',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'resort_support_1',
          text: 'Animasyon takımımız sabah 10’dan gece 24’e kadar aktivite düzenliyor.',
          context: ['animasyon', 'aktivite', 'sabah', 'gece'],
          businessType: 'resort',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    travel_agency: {
      greeting: [
        {
          id: 'travel_greeting_1',
          text: 'Merhaba {{customerName}}! Seyahat acentemize hoş geldiniz. Nereyi keşfetmek istiyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'travel_agency',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Seyahat sever' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'travel_appointment_1',
          text: 'Tur planı için danışmanlık randevusu alabilirsiniz. Kaç kişi ve nereye?',
          context: ['tur', 'danışmanlık', 'kişi', 'nereye'],
          businessType: 'travel_agency',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'travel_info_1',
          text: 'Antalya 3 gece 8,500₺, İstanbul 2 gece 4,500₺. Uçak, otel dahil.',
          context: ['Antalya', 'İstanbul', 'uçak', 'otel'],
          businessType: 'travel_agency',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'travel_support_1',
          text: '24 saat acil destek hattımız var. Tatilde sorun yaşarsanız aranız.',
          context: ['acil', 'destek', '24 saat', 'tatil'],
          businessType: 'travel_agency',
          confidence: 0.87,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    event_planning: {
      greeting: [
        {
          id: 'event_greeting_1',
          text: 'Merhaba {{customerName}}! Özel gününüzü unutulmaz kılmak için buradayız!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'event_planning',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Mutlu çift' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'event_appointment_1',
          text: 'Düğün/nişan/doğum günü planlamasi için görüşme randevusu alalım?',
          context: ['düğün', 'nişan', 'doğum günü', 'planlama'],
          businessType: 'event_planning',
          confidence: 0.92,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'event_info_1',
          text: 'Düğün organizasyonu 50,000-200,000₺. Mekan, catering, dekorasyon dahil.',
          context: ['düğün', 'organizasyon', 'mekan', 'catering'],
          businessType: 'event_planning',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'event_support_1',
          text: 'Etkinlik günü saha koordinatörümüz orada olacak. Her şey kusursuz gerçekleşecek.',
          context: ['koordinatör', 'saha', 'kusursuz', 'gün'],
          businessType: 'event_planning',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    fitness_center: {
      greeting: [
        {
          id: 'fitness_greeting_1',
          text: 'Merhaba {{customerName}}! Spor salonu ailemize hoş geldiniz. Fit kalma zamanı!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'fitness_center',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Sporcu' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'fitness_appointment_1',
          text: 'Kişisel antrenör seansları için hangi saatler size uygun?',
          context: ['antrenör', 'kişisel', 'seans', 'saat'],
          businessType: 'fitness_center',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'fitness_info_1',
          text: 'Aylık üyelik 300₺, yıllık 2,500₺. Grup dersleri ücretsiz!',
          context: ['aylık', 'yıllık', 'üyelik', 'grup'],
          businessType: 'fitness_center',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'fitness_support_1',
          text: 'İlk hafta önce form doldurun, sağlık kontrolü yaptıralım.',
          context: ['form', 'sağlık', 'kontrol', 'önce'],
          businessType: 'fitness_center',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    cinema_theater: {
      greeting: [
        {
          id: 'cinema_greeting_1',
          text: 'Merhaba {{customerName}}! Sinema/tiyatro salonumuza hoş geldiniz. Ne izliyoruz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'cinema_theater',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Sinema sever' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'cinema_appointment_1',
          text: 'Hangi film/oyun için, kaç kişilik bilet rezervasyonu?',
          context: ['film', 'oyun', 'bilet', 'rezervasyon'],
          businessType: 'cinema_theater',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'cinema_info_1',
          text: 'Sinema bileti 45₺, tiyatro 120₺. Patlaymıs mısır kombo 35₺.',
          context: ['sinema', 'tiyatro', 'bilet', 'kombo'],
          businessType: 'cinema_theater',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'cinema_support_1',
          text: 'Gösterim 30 dakika önce gelirseniz en iyi koltukları seçebilirsiniz.',
          context: ['gösterim', '30 dakika', 'koltuk', 'seçim'],
          businessType: 'cinema_theater',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    entertainment: {
      greeting: [
        {
          id: 'entertainment_greeting_1',
          text: 'Merhaba {{customerName}}! Eğlence mekanımıza hoş geldiniz. Gece nasıl geçirelim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'entertainment',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Eğlence arayıcısı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'entertainment_appointment_1',
          text: 'VIP masa rezervasyonu için kaç kişi ve hangi saat aralığı?',
          context: ['VIP', 'masa', 'rezervasyon', 'kişi'],
          businessType: 'entertainment',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'entertainment_info_1',
          text: 'VIP masa 2,000₺, normal masa 800₺. DJ performansı ve canlı müzik var.',
          context: ['VIP', 'masa', 'DJ', 'canlı müzik'],
          businessType: 'entertainment',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'entertainment_support_1',
          text: '18 yaş altı giriş yok. Dress code: şık kiyafet, spor ayakkabı yok.',
          context: ['18 yaş', 'dress code', 'şık', 'spor ayakkabı'],
          businessType: 'entertainment',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🚗 HİZMET & ULAŞIM
    car_rental: {
      greeting: [
        {
          id: 'car_rental_greeting_1',
          text: 'Merhaba {{customerName}}! Araç kiralama hizmetimize hoş geldiniz. Hangi araç tipini tercih ediyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'car_rental',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Sürücü' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'car_rental_appointment_1',
          text: 'Araç teslim alma ve iade tarihleri için uygun olduğunuz zaman?',
          context: ['teslim', 'iade', 'tarih', 'zaman'],
          businessType: 'car_rental',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'car_rental_info_1',
          text: 'Ekonomi araç 150₺/gün, SUV 300₺/gün. Yakıt dolu teslim, dolu iade.',
          context: ['ekonomi', 'SUV', 'fiyat', 'yakıt'],
          businessType: 'car_rental',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'car_rental_support_1',
          text: '24 saat yol yardımı hizmetimiz var. Sorun olursa 0800-123-4567 aranız.',
          context: ['yol yardım', '24 saat', 'sorun', 'telefon'],
          businessType: 'car_rental',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    car_wash: {
      greeting: [
        {
          id: 'car_wash_greeting_1',
          text: 'Merhaba {{customerName}}! Oto yıkamamuza hoş geldiniz. Araçlarınıza özel bakım!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'car_wash',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Araç sahibi' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'car_wash_appointment_1',
          text: 'Detaylı yıkama için randevu alabilirsiniz. Hangi gün size uygun?',
          context: ['detaylı', 'yıkama', 'randevu', 'gün'],
          businessType: 'car_wash',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'car_wash_info_1',
          text: 'Dış yıkama 50₺, iç temizlik 80₺, full detay 200₺. Cila servisimiz de var.',
          context: ['dış', 'iç', 'detay', 'cila'],
          businessType: 'car_wash',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'car_wash_support_1',
          text: 'Yıkama sonrası 24 saat yağmur garantisi. Eğer yağmur yağarsa ücretsiz tekrar.',
          context: ['yağmur', 'garanti', '24 saat', 'ücretsiz'],
          businessType: 'car_wash',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    auto_repair: {
      greeting: [
        {
          id: 'auto_repair_greeting_1',
          text: 'Merhaba {{customerName}}! Oto servisimize hoş geldiniz. Araçlarınızdaki sorun nedir?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'auto_repair',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Araç sahibi' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'auto_repair_appointment_1',
          text: 'Araç muayenesi ve tamir için hangi gün müsaitsiniz? Ne sorunu var?',
          context: ['muayene', 'tamir', 'gün', 'sorun'],
          businessType: 'auto_repair',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'auto_repair_info_1',
          text: 'Muayene ücreti 150₺, işçilik 100₺/saat. Orjinal yedek parça kullanıyoruz.',
          context: ['muayene', 'işçilik', 'yedek parça', 'orjinal'],
          businessType: 'auto_repair',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'auto_repair_support_1',
          text: 'Tamir edilen parçalar için 6 ay garanti veriyoruz. Fatura saklayın.',
          context: ['tamir', 'parça', '6 ay', 'garanti'],
          businessType: 'auto_repair',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    taxi_transfer: {
      greeting: [
        {
          id: 'taxi_greeting_1',
          text: 'Merhaba {{customerName}}! Taksi ve transfer hizmetimize hoş geldiniz. Nereye gideceksiniz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'taxi_transfer',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Yolcu' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'taxi_appointment_1',
          text: 'Havaaalanı transferi için saat kaçta ve hangi adresten alalım?',
          context: ['havaaalanı', 'transfer', 'saat', 'adres'],
          businessType: 'taxi_transfer',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'taxi_info_1',
          text: 'Şehir içi 15₺/km, havaaalanı sabit 250₺. Gece tarife %50 fazla.',
          context: ['şehir içi', 'havaaalanı', 'km', 'gece'],
          businessType: 'taxi_transfer',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'taxi_support_1',
          text: 'Şeför 5 dakika önce aranız adres teyidi için. GPS takipli araç.',
          context: ['şeför', '5 dakika', 'adres', 'GPS'],
          businessType: 'taxi_transfer',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    logistics: {
      greeting: [
        {
          id: 'logistics_greeting_1',
          text: 'Merhaba {{customerName}}! Lojistik hizmetimize hoş geldiniz. Ne taşıyacaksınız?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'logistics',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Gönderici' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'logistics_appointment_1',
          text: 'Kargo alma için adresinize ne zaman gelelim? Yük ağırlığı ne kadar?',
          context: ['kargo', 'alma', 'adres', 'yük'],
          businessType: 'logistics',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'logistics_info_1',
          text: 'Aynı gün kargo 50₺, ertesi gün 25₺. Kübar ağırlık hesabı yapıyoruz.',
          context: ['aynı gün', 'ertesi gün', 'kübar', 'ağırlık'],
          businessType: 'logistics',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'logistics_support_1',
          text: 'Kargo takip kodunuz: LG2024567. Website’den veya SMS ile takip edebilirsiniz.',
          context: ['takip', 'kod', 'website', 'SMS'],
          businessType: 'logistics',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    cleaning: {
      greeting: [
        {
          id: 'cleaning_greeting_1',
          text: 'Merhaba {{customerName}}! Temizlik hizmetimize hoş geldiniz. Hangi alanı temizleyelim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'cleaning',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Ev sahibi' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'cleaning_appointment_1',
          text: 'Ev/ofis temizliği için hangi gün ve saat aralığı uygun?',
          context: ['ev', 'ofis', 'gün', 'saat'],
          businessType: 'cleaning',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'cleaning_info_1',
          text: 'Ev temizliği 200₺, ofis 300₺. Kendi malzemelerimizi getiriyoruz.',
          context: ['ev', 'ofis', 'fiyat', 'malzeme'],
          businessType: 'cleaning',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'cleaning_support_1',
          text: 'Temizlik sonrası kontrol listesi bırakıyoruz. Eksik varsa haber verin.',
          context: ['kontrol', 'liste', 'eksik', 'haber'],
          businessType: 'cleaning',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    decoration: {
      greeting: [
        {
          id: 'decoration_greeting_1',
          text: 'Merhaba {{customerName}}! Dekorasyon hizmetimize hoş geldiniz. Hangi alanları yenileyelim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'decoration',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Ev sahibi' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'decoration_appointment_1',
          text: 'Keşif için evinize ne zaman gelebiliriz? Hangi odaları boyayacaksınız?',
          context: ['keşif', 'ev', 'oda', 'boya'],
          businessType: 'decoration',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'decoration_info_1',
          text: 'Oda boyası 150₺/m2, duvar kağıdı 200₺/m2. Malzeme ve işçilik dahil.',
          context: ['oda', 'boya', 'duvar kağıdı', 'malzeme'],
          businessType: 'decoration',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'decoration_support_1',
          text: 'İş bittikten 2 gün sonra kontrol için geliyoruz. Sorun varsa düzeltiyoruz.',
          context: ['iş', '2 gün', 'kontrol', 'sorun'],
          businessType: 'decoration',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    technical_service: {
      greeting: [
        {
          id: 'technical_greeting_1',
          text: 'Merhaba {{customerName}}! Teknik servisimize hoş geldiniz. Hangi cihazınızda sorun var?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'technical_service',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Müşteri' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'technical_appointment_1',
          text: 'Teknik servis çağrısı için evinizdeki müsait olduğunuz saat?',
          context: ['çağrı', 'ev', 'müsait', 'saat'],
          businessType: 'technical_service',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'technical_info_1',
          text: 'Çıkış ücreti 100₺, işçilik 150₺/saat. Yedek parça ayrıca.',
          context: ['çıkış', 'işçilik', 'yedek parça', 'ücret'],
          businessType: 'technical_service',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'technical_support_1',
          text: 'Tamir sonrası 3 ay garanti veriyoruz. Fatura saymayı unutmayın.',
          context: ['tamir', '3 ay', 'garanti', 'fatura'],
          businessType: 'technical_service',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    security: {
      greeting: [
        {
          id: 'security_greeting_1',
          text: 'Merhaba {{customerName}}! Güvenlik sistemleri hizmetimize hoş geldiniz. Neyi güvence altına alalım?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'security',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Güvenlik arayanlar' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'security_appointment_1',
          text: 'Güvenlik sistemi keşfi için evinize/işyerinize ne zaman gelebiliriz?',
          context: ['keşif', 'sistem', 'ev', 'işyeri'],
          businessType: 'security',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'security_info_1',
          text: 'Kamera sistemi 5,000₺, alarm 2,500₺. Kurulum ve 2 yıl garanti dahil.',
          context: ['kamera', 'alarm', 'kurulum', 'garanti'],
          businessType: 'security',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'security_support_1',
          text: '24/7 izleme merkezimiz var. Alarm durumunda hemen polise haber veriyoruz.',
          context: ['24/7', 'izleme', 'alarm', 'polis'],
          businessType: 'security',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🏢 PROFESYONEL HİZMETLER
    real_estate: {
      greeting: [
        {
          id: 'real_estate_greeting_1',
          text: 'Merhaba {{customerName}}! Emlak danışmanlığımıza hoş geldiniz. Gayrimenkul ihtiyacınız nedir?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'real_estate',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Emlak arayıcısı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'real_estate_appointment_1',
          text: 'Emlak görüşmesi için hangi gün ve saat size uygun? Hangi bölgeyi tercih ediyorsunuz?',
          context: ['görüşme', 'emlak', 'bölge', 'saat'],
          businessType: 'real_estate',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'real_estate_info_1',
          text: '3+1 daire 2.5M₺, 2+1 1.8M₺. Merkezi konumda, krediye uygun.',
          context: ['3+1', '2+1', 'daire', 'fiyat'],
          businessType: 'real_estate',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'real_estate_support_1',
          text: 'Kredi başvurusu sürecinde size yardımcı oluyoruz. Bankalarla anlaşmalıyız.',
          context: ['kredi', 'başvuru', 'banka', 'anlaşma'],
          businessType: 'real_estate',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    legal: {
      greeting: [
        {
          id: 'legal_greeting_1',
          text: 'Merhaba {{customerName}}! Hukuk büromuza hoş geldiniz. Hangi hukuki konuda yardım?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'legal',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Müvekkil' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'legal_appointment_1',
          text: 'Hukuki danışmanlık randevusu için hangi gün uygun? Davanız hangi alanda?',
          context: ['danışmanlık', 'randevu', 'dava', 'alan'],
          businessType: 'legal',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'legal_info_1',
          text: 'İlk görüşme ücretsiz. Dava takip ücreti 5,000₺, başarı payı ayrıca.',
          context: ['görüşme', 'ücretsiz', 'dava', 'başarı'],
          businessType: 'legal',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'legal_support_1',
          text: 'Davanızın her aşamasından haberdar edileceksiniz. 7/24 ulaşabilirsiniz.',
          context: ['dava', 'aşama', 'haberdar', '7/24'],
          businessType: 'legal',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    consulting: {
      greeting: [
        {
          id: 'consulting_greeting_1',
          text: 'Merhaba {{customerName}}! Danışmanlık hizmetimize hoş geldiniz. Hangi alanda rehberlik?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'consulting',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Danışan' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'consulting_appointment_1',
          text: 'Danışmanlık seansları için hangi gün müsaitsiniz? Online mı yüz yüze mi?',
          context: ['seans', 'danışmanlık', 'online', 'yüz yüze'],
          businessType: 'consulting',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'consulting_info_1',
          text: 'Saatlik danışmanlık 500₺, proje bazında 15,000₺. Sektör deneyimimiz 15 yıl.',
          context: ['saatlik', 'proje', 'deneyim', 'yıl'],
          businessType: 'consulting',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'consulting_support_1',
          text: 'Proje sonrası 3 ay ücretsiz destek veriyoruz. Soru ve sorunlarınızı paylaşın.',
          context: ['proje', '3 ay', 'ücretsiz', 'destek'],
          businessType: 'consulting',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    insurance: {
      greeting: [
        {
          id: 'insurance_greeting_1',
          text: 'Merhaba {{customerName}}! Sigorta acentemize hoş geldiniz. Hangi sigortaya ihtiyacınız var?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'insurance',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Sigortalı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'insurance_appointment_1',
          text: 'Sigorta danışmanlığı için randevu alalım. Araç, sağlık, hayat?',
          context: ['danışmanlık', 'araç', 'sağlık', 'hayat'],
          businessType: 'insurance',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'insurance_info_1',
          text: 'Araç sigortası 2,500₺/yıl, sağlık 4,000₺/yıl. Tüm şirketlerle çalışıyoruz.',
          context: ['araç', 'sağlık', 'yıl', 'şirket'],
          businessType: 'insurance',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'insurance_support_1',
          text: 'Hasar durumunda 7/24 destek. Size en yakın ekspertizi yönlendiriyoruz.',
          context: ['hasar', '7/24', 'ekspertiz', 'destek'],
          businessType: 'insurance',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    finance: {
      greeting: [
        {
          id: 'finance_greeting_1',
          text: 'Merhaba {{customerName}}! Mali müşavirliğe hoş geldiniz. Hangi mali işlemle yardım?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'finance',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Müvekkil' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'finance_appointment_1',
          text: 'Muhasebe danışmanlığı randevusu için hangi gün uygun? Şirket mi şahıs mı?',
          context: ['muhasebe', 'danışmanlık', 'şirket', 'şahıs'],
          businessType: 'finance',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'finance_info_1',
          text: 'Aylık muhasebe 800₺, yıl sonu bilanco 2,500₺. Vergi danışmanlığı dahil.',
          context: ['muhasebe', 'bilanco', 'vergi', 'aylık'],
          businessType: 'finance',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'finance_support_1',
          text: 'Vergi dairesi ile ilgili tüm işlemlerinizi biz yürütüyoruz. Endişelenmeyin.',
          context: ['vergi', 'daire', 'işlem', 'yürütmek'],
          businessType: 'finance',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    hr_recruitment: {
      greeting: [
        {
          id: 'hr_greeting_1',
          text: 'Merhaba {{customerName}}! İnsan kaynakları hizmetimize hoş geldiniz. İşe alım mı iş arayışı mı?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'hr_recruitment',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Aday' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'hr_appointment_1',
          text: 'Mülakat randevusu için hangi gün ve saat size uygun? Online mı ofiste mi?',
          context: ['mülakat', 'randevu', 'online', 'ofis'],
          businessType: 'hr_recruitment',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'hr_info_1',
          text: 'Açık pozisyonlar: Yazılım geliştiricisi, pazarlama uzmanı, satış temsilcisi.',
          context: ['pozisyon', 'yazılım', 'pazarlama', 'satış'],
          businessType: 'hr_recruitment',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'hr_support_1',
          text: 'CV hazırlama ve mülakat tekniği konusunda ücretsiz danışmanlık.',
          context: ['CV', 'mülakat', 'teknik', 'ücretsiz'],
          businessType: 'hr_recruitment',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    freelancer: {
      greeting: [
        {
          id: 'freelancer_greeting_1',
          text: 'Merhaba {{customerName}}! Freelance hizmetlerime hoş geldiniz. Hangi projede yardımcı olabilirim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'freelancer',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Müşteri' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'freelancer_appointment_1',
          text: 'Proje görüşmesi için ne zaman uygun? Online toplantı mı tercih edersiniz?',
          context: ['proje', 'görüşme', 'online', 'toplantı'],
          businessType: 'freelancer',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'freelancer_info_1',
          text: 'Saatlik ücret 200₺, proje bazında fiyatlandırma. 5 yıl deneyim, portfolio mevcut.',
          context: ['saatlik', 'proje', 'fiyat', 'deneyim'],
          businessType: 'freelancer',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'freelancer_support_1',
          text: 'Proje teslim sonrası 1 ay ücretsiz revizyon hakkınız var.',
          context: ['teslim', '1 ay', 'revizyon', 'ücretsiz'],
          businessType: 'freelancer',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    career_counseling: {
      greeting: [
        {
          id: 'career_greeting_1',
          text: 'Merhaba {{customerName}}! Kariyer danışmanlığına hoş geldiniz. Hangi alanda rehberlik?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'career_counseling',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Danışan' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'career_appointment_1',
          text: 'Kariyer danışmanlık seansları için hangi gün uygun? Bireysel mi grup mu?',
          context: ['seans', 'danışmanlık', 'bireysel', 'grup'],
          businessType: 'career_counseling',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'career_info_1',
          text: 'Bireysel seans 300₺, grup 150₺. CV hazırlama, mülakat kocu, kariyer planlama.',
          context: ['bireysel', 'grup', 'CV', 'mülakat'],
          businessType: 'career_counseling',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'career_support_1',
          text: '6 ay boyunca WhatsApp üzerinden ücretsiz destek ve takip.',
          context: ['6 ay', 'WhatsApp', 'ücretsiz', 'takip'],
          businessType: 'career_counseling',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 🎓 EĞİTİM & KÜLTÜR
    tutoring: {
      greeting: [
        {
          id: 'tutoring_greeting_1',
          text: 'Merhaba {{customerName}}! Özel ders merkezimize hoş geldiniz. Hangi derste destek?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'tutoring',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Öğrenci' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'tutoring_appointment_1',
          text: 'Ders programı için hangi gün ve saatler size uygun? Online mı yüz yüze mi?',
          context: ['program', 'ders', 'online', 'yüz yüze'],
          businessType: 'tutoring',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'tutoring_info_1',
          text: 'Matematik 150₺/saat, Fizik 120₺/saat, İngilizce 100₺/saat. Grup dersi %30 indirim.',
          context: ['matematik', 'fizik', 'İngilizce', 'grup'],
          businessType: 'tutoring',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'tutoring_support_1',
          text: 'Sınav öncesi ücretsiz tekrar seansı ve ödev yardımı hizmetimiz var.',
          context: ['sınav', 'ücretsiz', 'tekrar', 'ödev'],
          businessType: 'tutoring',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    university: {
      greeting: [
        {
          id: 'university_greeting_1',
          text: 'Merhaba {{customerName}}! Üniversitemize hoş geldiniz. Hangi bölüm hakkında bilgi?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'university',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Öğrenci adayı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'university_appointment_1',
          text: 'Danışmanınızla görüşme randevusu alabilirsiniz. Hangi fakulty ı?',
          context: ['danışman', 'görüşme', 'fakültY', 'randevu'],
          businessType: 'university',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'university_info_1',
          text: 'Mühendislik 25,000₺/yıl, İşletme 20,000₺/yıl. Burs imkanları mevcut.',
          context: ['mühendislik', 'işletme', 'yıl', 'burs'],
          businessType: 'university',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'university_support_1',
          text: 'Öğrenci işleri ile ilgili her konuda 7/24 destek hattımız var.',
          context: ['öğrenci işleri', '7/24', 'destek', 'hat'],
          businessType: 'university',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    private_school: {
      greeting: [
        {
          id: 'private_school_greeting_1',
          text: 'Merhaba {{customerName}}! Özel okulumuza hoş geldiniz. Hangi sınıf için bilgi?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'private_school',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Veli' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'private_school_appointment_1',
          text: 'Veli görüşmesi için hangi gün uygun? Öğrenci kayıt mı bilgilendirme mi?',
          context: ['veli', 'görüşme', 'kayıt', 'bilgilendirme'],
          businessType: 'private_school',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'private_school_info_1',
          text: 'Okul ücreti 35,000₺/yıl. Yemek, servis, etkinlikler dahil. Sınıf mevcudu max 20.',
          context: ['ücret', 'yemek', 'servis', 'sınıf'],
          businessType: 'private_school',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'private_school_support_1',
          text: 'Veli portalından notları, devamsizlıkları ve etkinlikleri takip edebilirsiniz.',
          context: ['portal', 'not', 'devamsızlık', 'etkinlik'],
          businessType: 'private_school',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    online_education: {
      greeting: [
        {
          id: 'online_education_greeting_1',
          text: 'Merhaba {{customerName}}! Online eğitim platformumuza hoş geldiniz. Hangi kursa ilgi var?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'online_education',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Öğrenci' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'online_education_appointment_1',
          text: 'Canlı ders programa için hangi saat dilimi uygun? Hafta içi mi hafta sonu mu?',
          context: ['canlı ders', 'saat', 'hafta içi', 'hafta sonu'],
          businessType: 'online_education',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'online_education_info_1',
          text: 'Kurs ücreti 500₺, sınırsız erişim. Sertifika dahil, canlı soru-cevap var.',
          context: ['kurs', 'ücret', 'sınırsız', 'sertifika'],
          businessType: 'online_education',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'online_education_support_1',
          text: 'Teknik destek 7/24. Eğitmen ile WhatsApp grubu var.',
          context: ['teknik', 'destek', '7/24', 'WhatsApp'],
          businessType: 'online_education',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    language_school: {
      greeting: [
        {
          id: 'language_greeting_1',
          text: 'Merhaba {{customerName}}! Dil okulumuza hoş geldiniz. Hangi dili öğrenmek istiyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'language_school',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Dil öğrenici' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'language_appointment_1',
          text: 'Dil dersi programa için hangi seviyedesiniz? Grup mu bireysel mi?',
          context: ['ders', 'seviye', 'grup', 'bireysel'],
          businessType: 'language_school',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'language_info_1',
          text: 'İngilizce 200₺/saat, Almanca 250₺/saat. Grup dersi %40 indirimli.',
          context: ['İngilizce', 'Almanca', 'grup', 'indirim'],
          businessType: 'language_school',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'language_support_1',
          text: 'Dil seviye tespit sınavı ücretsiz. Sertifika programları da mevcut.',
          context: ['seviye', 'test', 'ücretsiz', 'sertifika'],
          businessType: 'language_school',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    library_culture: {
      greeting: [
        {
          id: 'library_greeting_1',
          text: 'Merhaba {{customerName}}! Kütüphane ve kültür merkezimize hoş geldiniz.',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'library_culture',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Kitap sever' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'library_appointment_1',
          text: 'Kültürel etkinlikler için rezervasyon alınız. Hangi etkinliğe katılacaksınız?',
          context: ['etkinlik', 'rezervasyon', 'kültürel', 'katılmak'],
          businessType: 'library_culture',
          confidence: 0.85,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'library_info_1',
          text: 'Üyelik ücretsiz. 50,000 kitap, 5,000 e-kitap. Çalışma alanları rezerve edilebilir.',
          context: ['üyelik', 'kitap', 'e-kitap', 'çalışma'],
          businessType: 'library_culture',
          confidence: 0.80,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'library_support_1',
          text: 'Kitap önerisi ve araştırma yardımı için kütüphanecilerimize başvurun.',
          context: ['öneri', 'araştırma', 'yardım', 'kütüphaneci'],
          businessType: 'library_culture',
          confidence: 0.75,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // 📦 E-TİCARET & DİJİTAL
    social_commerce: {
      greeting: [
        {
          id: 'social_commerce_greeting_1',
          text: 'Merhaba {{customerName}}! Sosyal medya mağazamıza hoş geldiniz. Hangi ürünü beğendiniz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'social_commerce',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Takipçi' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'social_commerce_appointment_1',
          text: 'Canlı yayınımızda ürünleri tanıtacağız. Ne zaman uygun?',
          context: ['canlı yayın', 'ürün', 'tanıtm', 'zaman'],
          businessType: 'social_commerce',
          confidence: 0.85,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'social_commerce_info_1',
          text: 'Instagram’dan sipariş %10 indirimli. Kargo ücretsiz, kapıda ödeme mevcut.',
          context: ['Instagram', 'sipariş', 'indirim', 'kargo'],
          businessType: 'social_commerce',
          confidence: 0.90,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'social_commerce_support_1',
          text: 'DM’den 7/24 sipariş takibi. Story’de yeni ürünleri kaçırmayın.',
          context: ['DM', '7/24', 'takip', 'story'],
          businessType: 'social_commerce',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    dropshipping: {
      greeting: [
        {
          id: 'dropshipping_greeting_1',
          text: 'Merhaba {{customerName}}! Online mağazamıza hoş geldiniz. Ürünlerimizi keşfedin!',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'dropshipping',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Alıcı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'dropshipping_appointment_1',
          text: 'Ürün danışmanlığı için WhatsApp’tan ulaşabilirsiniz.',
          context: ['danışmanlık', 'WhatsApp', 'ulaşmak', 'ürün'],
          businessType: 'dropshipping',
          confidence: 0.80,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'dropshipping_info_1',
          text: 'Ürünler direkt tedarikçiden gelnir. Teslimat 7-14 gün, kargo takipli.',
          context: ['tedarikçi', 'teslimat', 'gün', 'takip'],
          businessType: 'dropshipping',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'dropshipping_support_1',
          text: 'İade garantisi var. Memnun kalmazsanız 14 gün içinde iade.',
          context: ['iade', 'garanti', 'memnun', '14 gün'],
          businessType: 'dropshipping',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    digital_products: {
      greeting: [
        {
          id: 'digital_products_greeting_1',
          text: 'Merhaba {{customerName}}! Dijital ürün mağazamıza hoş geldiniz. Hangi dijital hizmet?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'digital_products',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Dijital kullanıcı' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'digital_products_appointment_1',
          text: 'Webinar ve online etkinliklerimize katılabilirsiniz. Hangi konuda?',
          context: ['webinar', 'online', 'etkinlik', 'konu'],
          businessType: 'digital_products',
          confidence: 0.82,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'digital_products_info_1',
          text: 'E-kitap 50₺, online kurs 300₺, template 25₺. Anlyk indirme linki.',
          context: ['e-kitap', 'kurs', 'template', 'indirme'],
          businessType: 'digital_products',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'digital_products_support_1',
          text: 'Dijital ürünlerde teknik sorun olursa 7/24 destek ekibimiz var.',
          context: ['teknik', 'sorun', '7/24', 'destek'],
          businessType: 'digital_products',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    gaming: {
      greeting: [
        {
          id: 'gaming_greeting_1',
          text: 'Merhaba {{customerName}}! Oyun şirketimize hoş geldiniz. Hangi oyunumuzla ilgili yardım?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'gaming',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Oyuncu' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'gaming_appointment_1',
          text: 'Turnuva ve e-spor etkinliklerimize katılmak ister misiniz?',
          context: ['turnuva', 'e-spor', 'etkinlik', 'katılmak'],
          businessType: 'gaming',
          confidence: 0.85,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'gaming_info_1',
          text: 'Oyun içi satın alımlar, karakter upgrades, premium pass mevcut.',
          context: ['satın alım', 'karakter', 'upgrade', 'premium'],
          businessType: 'gaming',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'gaming_support_1',
          text: 'Oyun bugs ve teknik sorunlar için ticket sistemi var. Hızlı çözüm.',
          context: ['bug', 'teknik', 'ticket', 'çözüm'],
          businessType: 'gaming',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    media_streaming: {
      greeting: [
        {
          id: 'media_streaming_greeting_1',
          text: 'Merhaba {{customerName}}! Streaming platformumuza hoş geldiniz. Hangi içerik arıyorsunuz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'media_streaming',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'İzleyici' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'media_streaming_appointment_1',
          text: 'Canlı yayınlarımıza katılabilirsiniz. Bildirim almak ister misiniz?',
          context: ['canlı yayın', 'katılmak', 'bildirim', 'almak'],
          businessType: 'media_streaming',
          confidence: 0.80,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'media_streaming_info_1',
          text: 'Aylık abonelik 29₺, yıllık 299₺. 4K kalite, sınırsız izleme.',
          context: ['abonelik', 'aylık', 'yıllık', '4K'],
          businessType: 'media_streaming',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'media_streaming_support_1',
          text: 'Video donma, ses problemi gibi teknik sorunlar için 7/24 destek.',
          context: ['video', 'donma', 'ses', 'teknik'],
          businessType: 'media_streaming',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    // ⚖️ KAMU & SİVİL TOPLUM
    municipality: {
      greeting: [
        {
          id: 'municipality_greeting_1',
          text: 'Merhaba {{customerName}}! Belediyemize hoş geldiniz. Hangi hizmet için yardım?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'municipality',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Vatanış' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'municipality_appointment_1',
          text: 'Vatanış kabul günleri Salı-Perşembe 09:00-12:00. Hangi konu?',
          context: ['kabul', 'gün', 'saat', 'konu'],
          businessType: 'municipality',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'municipality_info_1',
          text: 'İmar izni, işyeri ruhsatı, vergi işlemleri online yapılabilir.',
          context: ['ımar', 'ruhsat', 'vergi', 'online'],
          businessType: 'municipality',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'municipality_support_1',
          text: 'Belediye hizmetleri hakkında şikâyet için Alo 153’ü arayabilirsiniz.',
          context: ['hizmet', 'şikâyet', 'Alo 153', 'aramak'],
          businessType: 'municipality',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    ngo: {
      greeting: [
        {
          id: 'ngo_greeting_1',
          text: 'Merhaba {{customerName}}! Derneğimize hoş geldiniz. Nasıl yardımcı olabilirsiniz?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'ngo',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Gönüllü' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'ngo_appointment_1',
          text: 'Gönüllülük etkinliklerimize katılabilirsiniz. Hangi alanda?',
          context: ['gönüllü', 'etkinlik', 'katılmak', 'alan'],
          businessType: 'ngo',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'ngo_info_1',
          text: 'Bağış yapabilir, gönüllü olabilir veya projelerimizi destekleyebilirsiniz.',
          context: ['bağış', 'gönüllü', 'proje', 'destek'],
          businessType: 'ngo',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'ngo_support_1',
          text: 'Sosyal sorumluluk projeleri hakkında bilgi almak için bize ulaşın.',
          context: ['sosyal', 'sorumluluk', 'proje', 'bilgi'],
          businessType: 'ngo',
          confidence: 0.82,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    union: {
      greeting: [
        {
          id: 'union_greeting_1',
          text: 'Merhaba {{customerName}}! Sendikamıza hoş geldiniz. Üyelik haklarınız neler?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'union',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Üye' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'union_appointment_1',
          text: 'Sendika toplantılarımız her ay ilk Pazartesi. Katılacak mısınız?',
          context: ['toplantı', 'ay', 'Pazartesi', 'katılmak'],
          businessType: 'union',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'union_info_1',
          text: 'Üye avantajları: Hukuki destek, toplu sözleşme, sosyal yardım.',
          context: ['üye', 'avantaj', 'hukuki', 'sözleşme'],
          businessType: 'union',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'union_support_1',
          text: 'İş haklarınızın ihlal edildiğini düşünüyorsanız hemen başvurun.',
          context: ['ış hakkı', 'ihlal', 'düşünmek', 'başvuru'],
          businessType: 'union',
          confidence: 0.90,
          category: 'support',
          isTemplate: false
        }
      ]
    },

    visa_passport: {
      greeting: [
        {
          id: 'visa_greeting_1',
          text: 'Merhaba {{customerName}}! Vize danışmanlığımıza hoş geldiniz. Hangi ülkeye?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'visa_passport',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Başvuran' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'visa_appointment_1',
          text: 'Vize başvuru danışmanlığı için randevu alabilirsiniz.',
          context: ['başvuru', 'danışmanlık', 'randevu', 'almak'],
          businessType: 'visa_passport',
          confidence: 0.90,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'visa_info_1',
          text: 'AB vizesi 500₺, ABD vizesi 800₺. Evrak hazırlama dahil.',
          context: ['AB', 'ABD', 'vize', 'evrak'],
          businessType: 'visa_passport',
          confidence: 0.88,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'visa_support_1',
          text: 'Vize reddedilirse %80 ücret iadesi. Tekrar başvuru için destek.',
          context: ['ret', 'iade', 'ücret', 'tekrar'],
          businessType: 'visa_passport',
          confidence: 0.85,
          category: 'support',
          isTemplate: false
        }
      ]
    },
    other: {
      greeting: [
        {
          id: 'other_greeting_1',
          text: 'Merhaba {{customerName}}! İşletmemize hoş geldiniz. Size nasıl yardımcı olabilirim?',
          context: ['merhaba', 'hello', 'selam'],
          businessType: 'other',
          confidence: 0.95,
          category: 'greeting',
          variables: { customerName: 'Değerli müşterimiz' },
          isTemplate: true
        }
      ],
      appointment: [
        {
          id: 'other_appointment_1',
          text: 'Görüşme randevusu almak ister misiniz? Hangi gün size uygun?',
          context: ['görüşme', 'randevu', 'gün', 'uygun'],
          businessType: 'other',
          confidence: 0.88,
          category: 'appointment',
          isTemplate: false
        }
      ],
      info: [
        {
          id: 'other_info_1',
          text: 'Hizmetlerimiz ve fiyatlarımız hakkında detaylı bilgi verebilirim.',
          context: ['hizmet', 'fiyat', 'detay', 'bilgi'],
          businessType: 'other',
          confidence: 0.85,
          category: 'info',
          isTemplate: false
        }
      ],
      support: [
        {
          id: 'other_support_1',
          text: 'Her türlü soru ve sorunlarınız için size yardımcı olmaya hazırım.',
          context: ['soru', 'sorun', 'yardım', 'hazır'],
          businessType: 'other',
          confidence: 0.80,
          category: 'support',
          isTemplate: false
        }
      ]
    }
  };

  // Ana suggestion engine metodu
  generateSuggestions(context: SuggestionContext): SmartSuggestion[] {
    const { userInput, conversationHistory, businessType, customerName, isVIP, timeOfDay, sentiment } = context;
    
    const suggestions: SmartSuggestion[] = [];
    
    // 1. Context-based suggestions
    const contextSuggestions = this.getContextBasedSuggestions(userInput, businessType);
    suggestions.push(...contextSuggestions);
    
    // 2. Time-based suggestions
    const timeSuggestions = this.getTimeBasedSuggestions(timeOfDay, businessType);
    suggestions.push(...timeSuggestions);
    
    // 3. Conversation flow suggestions
    const flowSuggestions = this.getConversationFlowSuggestions(conversationHistory, businessType);
    suggestions.push(...flowSuggestions);
    
    // 4. Sentiment-based suggestions
    if (sentiment) {
      const sentimentSuggestions = this.getSentimentBasedSuggestions(sentiment, businessType);
      suggestions.push(...sentimentSuggestions);
    }
    
    // 5. Personalize suggestions
    const personalizedSuggestions = this.personalizeSuggestions(suggestions, customerName, isVIP);
    
    // 6. Sort by confidence and return top 3
    return personalizedSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  private getContextBasedSuggestions(userInput: string, businessType: BusinessType): SmartSuggestion[] {
    const input = userInput.toLowerCase();
    const templates = this.sectorTemplates[businessType] || {};
    const suggestions: SmartSuggestion[] = [];
    
    for (const [, categoryTemplates] of Object.entries(templates)) {
      for (const template of categoryTemplates) {
        const matches = template.context.some(keyword => 
          input.includes(keyword.toLowerCase())
        );
        
        if (matches) {
          suggestions.push(template);
        }
      }
    }
    
    return suggestions;
  }

  private getTimeBasedSuggestions(timeOfDay: string, businessType: BusinessType): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    
    // Sabah greetings
    if (timeOfDay === 'morning') {
      suggestions.push({
        id: 'time_morning',
        text: 'Günaydın! Size nasıl yardımcı olabilirim?',
        context: ['morning'],
        businessType,
        confidence: 0.75,
        category: 'greeting',
        isTemplate: false
      });
    }
    
    // Akşam greetings
    if (timeOfDay === 'evening') {
      suggestions.push({
        id: 'time_evening',
        text: 'İyi akşamlar! Size nasıl yardımcı olabilirim?',
        context: ['evening'],
        businessType,
        confidence: 0.75,
        category: 'greeting',
        isTemplate: false
      });
    }
    
    return suggestions;
  }

  private getConversationFlowSuggestions(history: Message[], businessType: BusinessType): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    
    // İlk mesaj ise greeting öner
    if (history.length === 0) {
      const greetings = this.sectorTemplates[businessType]?.greeting || [];
      suggestions.push(...greetings);
    }
    
    // Son mesajlar customer'dan geliyorsa response öner
    const lastMessage = history[history.length - 1];
    if (lastMessage?.isFromCustomer) {
      suggestions.push({
        id: 'flow_response',
        text: 'Anladım, size hemen yardım edeyim.',
        context: ['response'],
        businessType,
        confidence: 0.70,
        category: 'support',
        isTemplate: false
      });
    }
    
    return suggestions;
  }

  private getSentimentBasedSuggestions(sentiment: string, businessType: BusinessType): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    
    if (sentiment === 'negative') {
      suggestions.push({
        id: 'sentiment_negative',
        text: 'Üzgünüm, yaşadığınız sorun için. Hemen çözüm bulalım.',
        context: ['negative'],
        businessType,
        confidence: 0.85,
        category: 'apology',
        isTemplate: false
      });
    }
    
    if (sentiment === 'positive') {
      suggestions.push({
        id: 'sentiment_positive',
        text: 'Çok güzel! Size nasıl daha iyi hizmet verebilirim?',
        context: ['positive'],
        businessType,
        confidence: 0.80,
        category: 'thanks',
        isTemplate: false
      });
    }
    
    return suggestions;
  }

  private personalizeSuggestions(
    suggestions: SmartSuggestion[], 
    customerName?: string, 
    isVIP?: boolean
  ): SmartSuggestion[] {
    return suggestions.map(suggestion => {
      let personalizedText = suggestion.text;
      
      // Replace variables
      if (suggestion.variables && customerName) {
        personalizedText = personalizedText.replace('{{customerName}}', customerName);
      } else if (personalizedText.includes('{{customerName}}')) {
        personalizedText = personalizedText.replace('{{customerName}}', suggestion.variables?.customerName || 'Değerli müşterimiz');
      }
      
      // VIP handling
      if (isVIP && suggestion.category === 'greeting') {
        personalizedText = personalizedText.replace('Merhaba', 'Merhaba Değerli VIP müşterimiz');
        suggestion.confidence += 0.05; // VIP için confidence artır
      }
      
      return {
        ...suggestion,
        text: personalizedText
      };
    });
  }

  // Yeni suggestion ekleme metodu (learning için)
  addSuggestion(businessType: BusinessType, category: string, suggestion: SmartSuggestion): void {
    if (!this.sectorTemplates[businessType]) {
      this.sectorTemplates[businessType] = {};
    }
    
    if (!this.sectorTemplates[businessType][category]) {
      this.sectorTemplates[businessType][category] = [];
    }
    
    this.sectorTemplates[businessType][category].push(suggestion);
  }

  // Usage analytics için
  trackSuggestionUsage(suggestionId: string): void {
    // Analytics tracking logic here
    logger.debug(`Suggestion used: ${suggestionId}`);
  }
}

// Singleton instance
export const smartSuggestionsEngine = new SmartSuggestionsEngine();

// Helper functions
export const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export const detectSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['teşekkür', 'memnun', 'harika', 'güzel', 'süper', 'excellent', 'great'];
  const negativeWords = ['kötü', 'berbat', 'sorun', 'problem', 'şikayet', 'bad', 'terrible'];
  
  const lowerText = text.toLowerCase();
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};
