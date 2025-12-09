/* =========================================
   AsistanApp - Complete Business Type Configuration System
   62 Sektör - Tam Entegrasyon
========================================= */

// 🏥 SAĞLIK & GÜZELLİK
export type HealthBeautyType = 
  | 'dental_clinic'    | 'hospital'        | 'aesthetic_center' | 'dietician'
  | 'hair_salon'       | 'beauty_salon'    | 'spa_massage'      | 'veterinary';

// 🍽️ YİYECEK & İÇECEK  
export type FoodBeverageType =
  | 'cafe'             | 'restaurant'      | 'fast_food'       | 'bakery'
  | 'catering'         | 'food_delivery';

// 🛍️ PERAKENDE & MODA
export type RetailFashionType =
  | 'boutique'         | 'shoe_store'      | 'cosmetics'       | 'jewelry'
  | 'electronics'      | 'flower_shop'     | 'pet_shop';

// 🏨 KONAKLAMA & EĞLENCE
export type HospitalityType =
  | 'hotel'            | 'boutique_hotel'  | 'resort'          | 'travel_agency'
  | 'event_planning'   | 'fitness_center'  | 'cinema_theater'  | 'entertainment';

// 🚗 HİZMET & ULAŞIM
export type ServiceTransportType =
  | 'car_rental'       | 'car_wash'        | 'auto_repair'     | 'taxi_transfer'
  | 'logistics'        | 'cleaning'        | 'decoration'      | 'technical_service'
  | 'security';

// 🏢 PROFESYONEL HİZMETLER
export type ProfessionalType =
  | 'real_estate'      | 'legal'           | 'consulting'      | 'insurance'
  | 'finance'          | 'hr_recruitment'  | 'freelancer'      | 'career_counseling';

// 🎓 EĞİTİM & KÜLTÜR
export type EducationCultureType =
  | 'tutoring'         | 'university'      | 'private_school'  | 'online_education'
  | 'language_school'  | 'library_culture';

// 📦 E-TİCARET & DİJİTAL
export type EcommerceDigitalType =
  | 'social_commerce'  | 'ecommerce'       | 'dropshipping'    | 'digital_products'
  | 'gaming'           | 'media_streaming';

// ⚖️ KAMU & SİVİL TOPLUM
export type PublicCivilType =
  | 'municipality'     | 'ngo'             | 'union'           | 'visa_passport' | 'other';

export type BusinessType = 
  | HealthBeautyType     | FoodBeverageType    | RetailFashionType
  | HospitalityType      | ServiceTransportType| ProfessionalType
  | EducationCultureType | EcommerceDigitalType| PublicCivilType;

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  href: string;
  enabled: boolean;
  critical?: boolean;
  optional?: boolean;
}

export interface BusinessTypeConfig {
  id: BusinessType;
  name: string;
  description: string;
  emoji: string;
  category: string;
  modules: ModuleConfig[];
  terminology: {
    customers: string;
    appointments?: string;
    products?: string;
    orders?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// ==============================================
// 🌍 KAPSAMLI SEKTÖR KONFİGÜRASYONLARI (62 SEKTÖR)
// ==============================================

export const businessTypeConfigs: Record<BusinessType, BusinessTypeConfig> = {
  
  // ===========================================
  // 🏥 SAĞLIK & GÜZELLİK (8 SEKTÖR)
  // ===========================================
  
  dental_clinic: {
    id: 'dental_clinic', name: 'Diş Kliniği', category: '🏥 Sağlık & Güzellik',
    description: 'Diş sağlığı ve tedavi hizmetleri', emoji: '🦷',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Diş Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Diş Hastaları', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Hasta İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Diş Tedavileri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Tedavi Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Klinik Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Tedavi Planları', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'Diş Hastaları', appointments: 'Diş Randevuları', products: 'Diş Tedavileri', orders: 'Tedavi Planları' },
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#e0f2fe' }
  },

  hospital: {
    id: 'hospital', name: 'Hastane & Poliklinik', category: '🏥 Sağlık & Güzellik',
    description: 'Genel sağlık hizmetleri ve poliklinik', emoji: '🏥',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Hasta Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Hastalar', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Hasta İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Tıbbi Branşlar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Hasta Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Hastane Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Tıbbi Müdahaleler', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'Hastalar', appointments: 'Hasta Randevuları', products: 'Tıbbi Branşlar', orders: 'Tıbbi Müdahaleler' },
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#fef2f2' }
  },

  aesthetic_center: {
    id: 'aesthetic_center', name: 'Estetik Merkezi', category: '🏥 Sağlık & Güzellik',
    description: 'Estetik ve güzellik işlemleri', emoji: '✨',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Seanslar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'İşlemler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Paketler', icon: 'ClipboardList', href: '/orders', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Analitik', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Seanslar', products: 'İşlemler', orders: 'Paketler' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  dietician: {
    id: 'dietician', name: 'Diyetisyen', category: '🏥 Sağlık & Güzellik',
    description: 'Beslenme danışmanlığı ve diyet programları', emoji: '🥗',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Kontroller', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Danışanlar', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Programlar', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İlerleme', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Danışanlar', appointments: 'Kontroller', products: 'Programlar', orders: 'Satışlar' },
    colors: { primary: '#16a34a', secondary: '#15803d', accent: '#f0fdf4' }
  },

  hair_salon: {
    id: 'hair_salon', name: 'Kuaför & Berber', category: '🏥 Sağlık & Güzellik',
    description: 'Saç bakımı ve styling hizmetleri', emoji: '💇',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Randevular', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Analitik', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Randevular', products: 'Hizmetler', orders: 'Paketler' },
    colors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#f3e8ff' }
  },

  beauty_salon: {
    id: 'beauty_salon', name: 'Güzellik Salonu', category: '🏥 Sağlık & Güzellik',
    description: 'Kapsamlı güzellik bakım hizmetleri', emoji: '💅',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Randevular', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Paketler', icon: 'ClipboardList', href: '/orders', enabled: true, optional: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Analitik', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Randevular', products: 'Hizmetler', orders: 'Paketler' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  spa_massage: {
    id: 'spa_massage', name: 'Spa & Masaj', category: '🏥 Sağlık & Güzellik',
    description: 'Rahatlama ve wellness hizmetleri', emoji: '🧘',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Seanslar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Terapiler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Paketler', icon: 'ClipboardList', href: '/orders', enabled: true, optional: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Analitik', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Seanslar', products: 'Terapiler', orders: 'Paketler' },
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#cffafe' }
  },

  veterinary: {
    id: 'veterinary', name: 'Veteriner Kliniği', category: '🏥 Sağlık & Güzellik',
    description: 'Evcil hayvan sağlık hizmetleri', emoji: '🐾',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Muayeneler', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Pet Sahipleri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Raporlar', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Pet Sahipleri', appointments: 'Muayeneler', products: 'Hizmetler', orders: 'Tedaviler' },
    colors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' }
  },
  
  // ===========================================
  // 🍽️ YİYECEK & İÇECEK (6 SEKTÖR)
  // ===========================================
  
  cafe: {
    id: 'cafe', name: 'Kafe', category: '🍽️ Yiyecek & İçecek',
    description: 'Kafe ve kahve dükkanı', emoji: '☕',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Kahve Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'products', name: 'Kahve & İçecek Menüsü', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'customers', name: 'Kafe Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri Sohbetleri', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Masa Rezervasyonları', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Kafe Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Kafe Müşterileri', appointments: 'Masa Rezervasyonları', products: 'Kahve & İçecek Menüsü', orders: 'Kahve Siparişleri' },
    colors: { primary: '#92400e', secondary: '#78350f', accent: '#fef3c7' }
  },

  restaurant: {
    id: 'restaurant', name: 'Restaurant', category: '🍽️ Yiyecek & İçecek',
    description: 'Restaurant ve yemek hizmetleri', emoji: '🍽️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Restoran Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'products', name: 'Restoran Menüsü', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'appointments', name: 'Masa Rezervasyonları', icon: 'Calendar', href: '/appointments', enabled: true },
      { id: 'customers', name: 'Restoran Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Restoran Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Restoran Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Restoran Müşterileri', appointments: 'Masa Rezervasyonları', products: 'Restoran Menüsü', orders: 'Restoran Siparişleri' },
    colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' }
  },

  fast_food: {
    id: 'fast_food', name: 'Fast Food', category: '🍽️ Yiyecek & İçecek',
    description: 'Hızlı yemek ve fast food hizmetleri', emoji: '🍔',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Hızlı Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'products', name: 'Fast Food Menüsü', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'customers', name: 'Fast Food Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sipariş İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Hızlı Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Fast Food Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: false },
    ],
    terminology: { customers: 'Fast Food Müşterileri', appointments: 'Rezervasyonlar', products: 'Fast Food Menüsü', orders: 'Hızlı Siparişler' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  bakery: {
    id: 'bakery', name: 'Pastane', category: '🍽️ Yiyecek & İçecek',
    description: 'Pastane ve fırın ürünleri', emoji: '🧁',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Pastane Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'products', name: 'Pasta & Unlu Mamüller', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'customers', name: 'Pastane Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Özel Pasta Siparişleri', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Pastane Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Pastane Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Pastane Müşterileri', appointments: 'Özel Pasta Siparişleri', products: 'Pasta & Unlu Mamüller', orders: 'Pastane Siparişleri' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  catering: {
    id: 'catering', name: 'Catering', category: '🍽️ Yiyecek & İçecek',
    description: 'Catering ve toplu yemek hizmetleri', emoji: '🍱',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Organizasyonlar', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'appointments', name: 'Etkinlikler', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'products', name: 'Menü Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Etkinlik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Etkinlikler', products: 'Paketler', orders: 'Organizasyonlar' },
    colors: { primary: '#10b981', secondary: '#059669', accent: '#d1fae5' }
  },

  food_delivery: {
    id: 'food_delivery', name: 'Yemek Sipariş', category: '🍽️ Yiyecek & İçecek',
    description: 'Online yemek sipariş platformu', emoji: '🚚',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'products', name: 'Menü', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Teslimat Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: false },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Rezervasyonlar', products: 'Menü', orders: 'Teslimat' },
    colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fff7ed' }
  },

  // ===========================================
  // 🛍️ PERAKENDE & MODA (7 SEKTÖR)
  // ===========================================
  
  boutique: {
    id: 'boutique', name: 'Butik', category: '🛍️ Perakende & Moda',
    description: 'Butik moda mağazası', emoji: '👗',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Moda Ürünleri', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Butik Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Butik Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Moda Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Butik Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Kıyafet Provaları', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
    ],
    terminology: { customers: 'Butik Müşterileri', appointments: 'Kıyafet Provaları', products: 'Moda Ürünleri', orders: 'Butik Siparişleri' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  shoe_store: {
    id: 'shoe_store', name: 'Ayakkabı Mağazası', category: '🛍️ Perakende & Moda',
    description: 'Ayakkabı ve aksesuar satışı', emoji: '👠',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Ayakkabı & Aksesuar', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Ayakkabı Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Ayakkabı Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Ayakkabı Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Mağaza Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Ayakkabı Deneme', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
    ],
    terminology: { customers: 'Ayakkabı Müşterileri', appointments: 'Ayakkabı Deneme', products: 'Ayakkabı & Aksesuar', orders: 'Ayakkabı Siparişleri' },
    colors: { primary: '#92400e', secondary: '#78350f', accent: '#fef3c7' }
  },

  cosmetics: {
    id: 'cosmetics', name: 'Kozmetik Mağaza', category: '🛍️ Perakende & Moda',
    description: 'Kozmetik ve güzellik ürünleri', emoji: '💄',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Kozmetik Ürünleri', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Kozmetik Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Kozmetik Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Güzellik Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Makyaj & Güzellik Danışmanlığı', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Kozmetik Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Kozmetik Mağaza Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Kozmetik Müşterileri', appointments: 'Makyaj & Güzellik Danışmanlığı', products: 'Kozmetik Ürünleri', orders: 'Kozmetik Siparişleri' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  jewelry: {
    id: 'jewelry', name: 'Kuyumcu', category: '🛍️ Perakende & Moda',
    description: 'Mücevher ve değerli taş satışı', emoji: '💎',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Mücevher & Altın', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Mücevher Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Kuyumcu Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Mücevher Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Özel Tasarım & Değerlendirme', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Mücevher Satış Raporları', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Kuyumcu Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Kuyumcu Müşterileri', appointments: 'Özel Tasarım & Değerlendirme', products: 'Mücevher & Altın', orders: 'Mücevher Siparişleri' },
    colors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#f3e8ff' }
  },

  electronics: {
    id: 'electronics', name: 'Elektronik Mağaza', category: '🛍️ Perakende & Moda',
    description: 'Elektronik ve telefon aksesuarları', emoji: '📱',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Ürünler', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Teknik Servis', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Servis', products: 'Elektronik', orders: 'Siparişler' },
    colors: { primary: '#1f2937', secondary: '#111827', accent: '#f3f4f6' }
  },

  flower_shop: {
    id: 'flower_shop', name: 'Çiçekçi', category: '🛍️ Perakende & Moda',
    description: 'Çiçek ve hediye hizmetleri', emoji: '🌸',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Çiçekler', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Özel Günler', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Özel Günler', products: 'Çiçek Aranjmanları', orders: 'Siparişler' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  pet_shop: {
    id: 'pet_shop', name: 'Pet Shop', category: '🛍️ Perakende & Moda',
    description: 'Evcil hayvan ürünleri ve hizmetleri', emoji: '🐕',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Pet Ürünleri', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Pet Sahipleri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Grooming', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Pet Sahipleri', appointments: 'Bakım', products: 'Pet Ürünleri', orders: 'Siparişler' },
    colors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' }
  },

  // ===========================================
  // 🏨 KONAKLAMA & EĞLENCE (8 SEKTÖR)
  // ===========================================
  
  hotel: {
    id: 'hotel', name: 'Otel', category: '🏨 Konaklama & Eğlence',
    description: 'Otel ve konaklama hizmetleri', emoji: '🏨',
    modules: [
      { id: 'dashboard', name: 'Otel Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Otel Rezervasyonları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Otel Misafirleri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Misafir İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Oda Tipleri & Suites', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Check-in/Check-out', icon: 'ClipboardList', href: '/orders', enabled: true },
        { id: 'packages', name: 'Otel Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Doluluk & Gelir Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Otel Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Otel Misafirleri', appointments: 'Otel Rezervasyonları', products: 'Oda Tipleri & Suites', orders: 'Check-in/Check-out İşlemleri' },
    colors: { primary: '#3b82f6', secondary: '#2563eb', accent: '#dbeafe' }
  },

  boutique_hotel: {
    id: 'boutique_hotel', name: 'Butik Otel & Pansiyon', category: '🏨 Konaklama & Eğlence',
    description: 'Butik otel ve pansiyon işletmeleri', emoji: '🏡',
    modules: [
      { id: 'dashboard', name: 'Butik Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Premium Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'VIP Misafirler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Concierge İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Signature Suites', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Butik Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Premium Doluluk Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Butik Otel Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'VIP Check-in/out', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'VIP Misafirler', appointments: 'Premium Rezervasyonlar', products: 'Signature Suites & Lüks Odalar', orders: 'VIP Check-in/Check-out' },
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#f3e8ff' }
  },

  resort: {
    id: 'resort', name: 'Tatil Köyü', category: '🏨 Konaklama & Eğlence',
    description: 'Resort ve tatil köyü işletmeleri', emoji: '🏖️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Misafirler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Paketler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Rezervasyon Satışları', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Doluluk Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Misafirler', appointments: 'Rezervasyonlar', products: 'Tatil Paketleri', orders: 'Rezervasyon Satışları' },
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#cffafe' }
  },

  travel_agency: {
    id: 'travel_agency', name: 'Turizm Acentesi', category: '🏨 Konaklama & Eğlence',
    description: 'Turizm ve seyahat acentesi', emoji: '✈️',
    modules: [
      { id: 'dashboard', name: 'Acente Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Seyahat Danışmanlığı', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Seyahat Müşterileri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Tatil & Tur Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Bilet & Rezervasyonlar', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Müşteri Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Tur Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Seyahat Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Acente Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Seyahat Müşterileri', appointments: 'Seyahat Danışmanlığı', products: 'Tatil & Tur Paketleri', orders: 'Bilet & Rezervasyonlar' },
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#e0f2fe' }
  },

  event_planning: {
    id: 'event_planning', name: 'Organizasyon & Etkinlik', category: '🏨 Konaklama & Eğlence',
    description: 'Düğün, doğum günü ve etkinlik organizasyonu', emoji: '🎉',
    modules: [
      { id: 'dashboard', name: 'Organizasyon Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Etkinlik Planlama', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Etkinlik Müşterileri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Organizasyon Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Düğün & Etkinlik Kontratları', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Müşteri Koordinasyonu', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Etkinlik Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Etkinlik & Gelir Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Organizasyon Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Etkinlik Müşterileri', appointments: 'Etkinlik Planlama Toplantıları', products: 'Organizasyon Paketleri', orders: 'Düğün & Etkinlik Kontratları' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  fitness_center: {
    id: 'fitness_center', name: 'Spor Salonu & Fitness', category: '🏨 Konaklama & Eğlence',
    description: 'Spor salonu, fitness center, yoga', emoji: '💪',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Antrenman Seansları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Üyeler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Programlar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Üyelikler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Üye Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Üyeler', appointments: 'Antrenman Seansları', products: 'Fitness Programları', orders: 'Üyelikler' },
    colors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' }
  },

  cinema_theater: {
    id: 'cinema_theater', name: 'Sinema & Tiyatro', category: '🏨 Konaklama & Eğlence',
    description: 'Sinema, tiyatro gişe hizmetleri', emoji: '🎬',
    modules: [
      { id: 'dashboard', name: 'Sinema Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Seans Rezervasyonları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Sinema İzleyicileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'products', name: 'Filmler & Tiyatro Oyunları', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Bilet & Kombiler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'İzleyici İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Sinema Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Gösterim & Gişe Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Sinema Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Sinema İzleyicileri', appointments: 'Seans Rezervasyonları', products: 'Filmler & Tiyatro Oyunları', orders: 'Bilet & Kombiler' },
    colors: { primary: '#7c2d12', secondary: '#92400e', accent: '#fed7aa' }
  },

  entertainment: {
    id: 'entertainment', name: 'Eğlence Mekânı', category: '🏨 Konaklama & Eğlence',
    description: 'Eğlence ve gece hayatı mekânları', emoji: '🎪',
    modules: [
      { id: 'dashboard', name: 'Eğlence Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Masa & Etkinlik Rezervasyonları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Eğlence Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'products', name: 'Gece Hayatı & Etkinlikler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Müşteri Etkileşimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Eğlence Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Eğlence & Etkinlik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Eğlence Mekânı Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'VIP Servis & Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'Eğlence Müşterileri', appointments: 'Masa & Etkinlik Rezervasyonları', products: 'Gece Hayatı & Etkinlikler', orders: 'VIP Servis & Siparişler' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  // ===========================================
  // 🚗 HİZMET & ULAŞIM (9 SEKTÖR)
  // ===========================================
  
  car_rental: {
    id: 'car_rental', name: 'Araç Kiralama', category: '🚗 Hizmet & Ulaşım',
    description: 'Araç kiralama hizmetleri', emoji: '🚙',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Araç Filosu', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Kiralama İşlemleri', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Kiralama Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Rezervasyonlar', products: 'Araçlar', orders: 'Kiralama İşlemleri' },
    colors: { primary: '#64748b', secondary: '#475569', accent: '#f1f5f9' }
  },

  car_wash: {
    id: 'car_wash', name: 'Oto Yıkama & Bakım', category: '🚗 Hizmet & Ulaşım',
    description: 'Oto yıkama ve bakım hizmetleri', emoji: '🚿',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Randevular', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'İşlemler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İşlem Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Randevular', products: 'Yıkama Paketleri', orders: 'İşlemler' },
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#cffafe' }
  },

  auto_repair: {
    id: 'auto_repair', name: 'Oto Servis & Tamir', category: '🚗 Hizmet & Ulaşım',
    description: 'Araç servisi ve tamir hizmetleri', emoji: '🔧',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Servis Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Yedek Parça', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Servis Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Servis Randevuları', products: 'Yedek Parça', orders: 'Siparişler' },
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#fef2f2' }
  },

  taxi_transfer: {
    id: 'taxi_transfer', name: 'Taksi & Transfer', category: '🚗 Hizmet & Ulaşım',
    description: 'Taksi ve transfer hizmetleri', emoji: '🚕',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Rezervasyonlar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Yolcular', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Güzergahlar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Seferler', icon: 'ClipboardList', href: '/orders', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Sefer Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Yolcular', appointments: 'Rezervasyonlar', products: 'Güzergahlar', orders: 'Seferler' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  logistics: {
    id: 'logistics', name: 'Nakliye & Lojistik', category: '🚗 Hizmet & Ulaşım',
    description: 'Nakliye ve lojistik hizmetleri', emoji: '🚛',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Taşıma Planları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'orders', name: 'Gönderi Takibi', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Lojistik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Taşıma Planları', products: 'Lojistik Hizmetleri', orders: 'Gönderi Takibi' },
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#e0f2fe' }
  },

  cleaning: {
    id: 'cleaning', name: 'Temizlik Şirketi', category: '🚗 Hizmet & Ulaşım',
    description: 'Profesyonel temizlik hizmetleri', emoji: '🧽',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Temizlik Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Temizlik Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İş Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Temizlik Randevuları', products: 'Temizlik Paketleri', orders: 'İş Siparişleri' },
    colors: { primary: '#10b981', secondary: '#059669', accent: '#d1fae5' }
  },

  decoration: {
    id: 'decoration', name: 'Boya & Dekorasyon', category: '🚗 Hizmet & Ulaşım',
    description: 'Boya ve dekorasyon hizmetleri', emoji: '🎨',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Proje Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Projeler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Proje Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Proje Randevuları', products: 'Dekorasyon Hizmetleri', orders: 'Projeler' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  technical_service: {
    id: 'technical_service', name: 'Teknik Servis', category: '🚗 Hizmet & Ulaşım',
    description: 'Tesisat, klima, kombi servisleri', emoji: '🔧',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Servis Çağrıları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Servis Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Servis Çağrıları', products: 'Teknik Hizmetler', orders: 'İş Emirleri' },
    colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' }
  },

  security: {
    id: 'security', name: 'Güvenlik & Alarm', category: '🚗 Hizmet & Ulaşım',
    description: 'Güvenlik ve alarm sistem hizmetleri', emoji: '🔒',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Kurulum Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Güvenlik Sistemleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Kurulum İşleri', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Güvenlik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Kurulum Randevuları', products: 'Güvenlik Sistemleri', orders: 'Kurulum İşleri' },
    colors: { primary: '#1f2937', secondary: '#111827', accent: '#f3f4f6' }
  },

  // ===========================================
  // 🏢 PROFESYONEL HİZMETLER (8 SEKTÖR)
  // ===========================================

  real_estate: {
    id: 'real_estate', name: 'Emlak & Gayrimenkul', category: '🏢 Profesyonel Hizmetler',
    description: 'Emlak danışmanlığı ve gayrimenkul hizmetleri', emoji: '🏠',
    modules: [
      { id: 'dashboard', name: 'Emlak Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Emlak Görüşmeleri', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Emlak Müşterileri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Gayrimenkul Portföyü', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'conversations', name: 'Müşteri Danışmanlığı', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Emlak Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Emlak Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Emlak Ofisi Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Satış Sözleşmeleri', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'Emlak Müşterileri', appointments: 'Emlak Görüşmeleri', products: 'Gayrimenkul Portföyü', orders: 'Satış Sözleşmeleri' },
    colors: { primary: '#0891b2', secondary: '#0e7490', accent: '#cffafe' }
  },

  legal: {
    id: 'legal', name: 'Hukuk & Avukatlık', category: '🏢 Profesyonel Hizmetler',
    description: 'Avukatlık ve hukuki danışmanlık', emoji: '⚖️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Randevular', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müvekkiller', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Dava Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: false },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Müvekkiller', appointments: 'Randevular', products: 'Hukuki Hizmetler', orders: 'Davalar' },
    colors: { primary: '#7c2d12', secondary: '#92400e', accent: '#fed7aa' }
  },

  consulting: {
    id: 'consulting', name: 'Danışmanlık', category: '🏢 Profesyonel Hizmetler',
    description: 'İş danışmanlığı ve yönetim hizmetleri', emoji: '💼',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Danışmanlık Seansları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Danışmanlık Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Proje Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Danışmanlık Seansları', products: 'Danışmanlık Paketleri', orders: 'Projeler' },
    colors: { primary: '#1f2937', secondary: '#374151', accent: '#f3f4f6' }
  },

  insurance: {
    id: 'insurance', name: 'Sigorta Acentesi', category: '🏢 Profesyonel Hizmetler',
    description: 'Sigorta acentesi ve broker hizmetleri', emoji: '🛡️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Danışmanlık', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Sigorta Ürünleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Poliçeler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Danışmanlık', products: 'Sigorta Ürünleri', orders: 'Poliçeler' },
    colors: { primary: '#3b82f6', secondary: '#2563eb', accent: '#dbeafe' }
  },

  finance: {
    id: 'finance', name: 'Finans & Muhasebe', category: '🏢 Profesyonel Hizmetler',
    description: 'Mali müşavirlik ve muhasebe hizmetleri', emoji: '📊',
    modules: [
      { id: 'dashboard', name: 'Mali Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Mali Müşavirlik Randevuları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Mali Müvekkiller', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Mali Danışmanlık', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Mali Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Mali & Muhasebe Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Mali Müşavirlik Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'products', name: 'Mali Hizmetler & Paketler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Mali İşlemler & Dosyalar', icon: 'ClipboardList', href: '/orders', enabled: true },
    ],
    terminology: { customers: 'Mali Müvekkiller', appointments: 'Mali Müşavirlik Randevuları', products: 'Mali Hizmetler & Paketler', orders: 'Mali İşlemler & Dosyalar' },
    colors: { primary: '#1f2937', secondary: '#111827', accent: '#f3f4f6' }
  },

  hr_recruitment: {
    id: 'hr_recruitment', name: 'İK & İşe Alım', category: '🏢 Profesyonel Hizmetler',
    description: 'İnsan kaynakları ve işe alım hizmetleri', emoji: '👥',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Mülakatlar', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Adaylar', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Pozisyonlar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İşe Alım Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'İş Adayları', appointments: 'Mülakatlar', products: 'İş Pozisyonları', orders: 'İşe Alımlar' },
    colors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' }
  },

  freelancer: {
    id: 'freelancer', name: 'Freelancer Platform', category: '🏢 Profesyonel Hizmetler',
    description: 'Freelancer ve serbest çalışan platformu', emoji: '💻',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Proje Toplantıları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Projeler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Proje Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Proje Toplantıları', products: 'Freelance Hizmetler', orders: 'Projeler' },
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#f3e8ff' }
  },

  career_counseling: {
    id: 'career_counseling', name: 'Kariyer Danışmanlığı', category: '🏢 Profesyonel Hizmetler',
    description: 'Kariyer ve eğitim danışmanlığı', emoji: '🎯',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Danışmanlık Seansları', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Danışanlar', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Danışmanlık Paketleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Başarı Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Danışanlar', appointments: 'Danışmanlık Seansları', products: 'Kariyer Paketleri', orders: 'Başarılar' },
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' }
  },

  // ===========================================
  // 🎓 EĞİTİM & KÜLTÜR (6 SEKTÖR)
  // ===========================================

  tutoring: {
    id: 'tutoring', name: 'Özel Ders & Etüt', category: '🎓 Eğitim & Kültür',
    description: 'Özel ders ve etüt merkezi', emoji: '📚',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Ders Programı', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Öğrenciler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Dersler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Başarı Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Öğrenciler', appointments: 'Ders Programı', products: 'Dersler', orders: 'Kayıtlar' },
    colors: { primary: '#3b82f6', secondary: '#2563eb', accent: '#dbeafe' }
  },

  university: {
    id: 'university', name: 'Üniversite & Öğrenci İşleri', category: '🎓 Eğitim & Kültür',
    description: 'Üniversite ve öğrenci işleri', emoji: '🏛️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Danışmanlık', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Öğrenciler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Programlar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Akademik Rapor', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Öğrenciler', appointments: 'Danışmanlık', products: 'Eğitim Programları', orders: 'Kayıtlar' },
    colors: { primary: '#7c2d12', secondary: '#92400e', accent: '#fed7aa' }
  },

  private_school: {
    id: 'private_school', name: 'Özel Okul & Kurs', category: '🎓 Eğitim & Kültür',
    description: 'Özel okul ve kurs merkezleri', emoji: '🎒',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Veli Görüşmeleri', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Veliler & Öğrenciler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Kurslar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Öğrenci Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Veliler & Öğrenciler', appointments: 'Veli Görüşmeleri', products: 'Kurslar', orders: 'Kayıtlar' },
    colors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' }
  },

  online_education: {
    id: 'online_education', name: 'Online Eğitim Platform', category: '🎓 Eğitim & Kültür',
    description: 'Online eğitim platformu', emoji: '💻',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Canlı Dersler', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Öğrenciler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Kurslar', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Kurs Satışları', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Öğrenme Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Öğrenciler', appointments: 'Canlı Dersler', products: 'Online Kurslar', orders: 'Kurs Satışları' },
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#f3e8ff' }
  },

  language_school: {
    id: 'language_school', name: 'Dil Okulu', category: '🎓 Eğitim & Kültür',
    description: 'Dil okulu ve yaz kampları', emoji: '🗣️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Dil Dersleri', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Öğrenciler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Dil Kursları', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İlerleme Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Öğrenciler', appointments: 'Dil Dersleri', products: 'Dil Kursları', orders: 'Kayıtlar' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  library_culture: {
    id: 'library_culture', name: 'Kütüphane & Kültür', category: '🎓 Eğitim & Kültür',
    description: 'Kütüphane ve kültür merkezleri', emoji: '📖',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Etkinlikler', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Üyeler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'products', name: 'Kitaplar & Etkinlikler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Kullanım Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Üyeler', appointments: 'Kültürel Etkinlikler', products: 'Kitaplar & Etkinlikler', orders: 'Rezervasyonlar' },
    colors: { primary: '#92400e', secondary: '#78350f', accent: '#fef3c7' }
  },

  // ===========================================
  // 📦 E-TİCARET & DİJİTAL (6 SEKTÖR)
  // ===========================================

  social_commerce: {
    id: 'social_commerce', name: 'Sosyal Ticaret', category: '📦 E-Ticaret & Dijital',
    description: 'Instagram/TikTok üzerinden satış', emoji: '📱',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Ürünler', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Takipçiler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'DM Yönetimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Sosyal Medya Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Canlı Yayınlar', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
    ],
    terminology: { customers: 'Takipçiler', appointments: 'Canlı Yayınlar', products: 'Ürünler', orders: 'Siparişler' },
    colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fff7ed' }
  },

  ecommerce: {
    id: 'ecommerce', name: 'E-Ticaret Mağazası', category: '📦 E-Ticaret & Dijital',
    description: 'Online mağaza ve e-ticaret sitesi', emoji: '🛒',
    modules: [
      { id: 'dashboard', name: 'E-Ticaret Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Online Ürün Kataloğu', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Online Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'E-Ticaret Müşterileri', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Canlı Destek & Chat', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'E-Ticaret Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış & Trafik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Mağaza Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Ürün Danışmanlığı', icon: 'Calendar', href: '/appointments', enabled: true },
    ],
    terminology: { customers: 'E-Ticaret Müşterileri', appointments: 'Ürün Danışmanlığı', products: 'Online Ürün Kataloğu', orders: 'Online Siparişler' },
    colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fff7ed' }
  },

  dropshipping: {
    id: 'dropshipping', name: 'Dropshipping', category: '📦 E-Ticaret & Dijital',
    description: 'Dropshipping işletme modeli', emoji: '📦',
    modules: [
      { id: 'dashboard', name: 'Dropshipping Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Supplier Ürünleri', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Drop Siparişleri', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Drop Müşterileri', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Müşteri & Supplier İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Dropship Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Kar Marjı & Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Dropshipping Ayarları', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Supplier Görüşmeleri', icon: 'Calendar', href: '/appointments', enabled: true },
    ],
    terminology: { customers: 'Drop Müşterileri', appointments: 'Supplier Görüşmeleri', products: 'Supplier Ürünleri', orders: 'Drop Siparişleri' },
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#cffafe' }
  },

  digital_products: {
    id: 'digital_products', name: 'Dijital Ürünler', category: '📦 E-Ticaret & Dijital',
    description: 'Dijital ürün ve kurs satışı', emoji: '💾',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'products', name: 'Dijital Ürünler', icon: 'ShoppingBag', href: '/products', enabled: true, critical: true },
      { id: 'orders', name: 'Satışlar', icon: 'ClipboardList', href: '/orders', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true },
      { id: 'conversations', name: 'Destek', icon: 'MessageCircle', href: '/conversations', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Satış Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Webinar', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Webinar', products: 'Dijital Ürünler', orders: 'Satışlar' },
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#f3e8ff' }
  },

  gaming: {
    id: 'gaming', name: 'Oyun Şirketi', category: '📦 E-Ticaret & Dijital',
    description: 'Oyun şirketi ve oyun içi destek', emoji: '🎮',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Oyuncular', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Oyun Desteği', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Oyun İçi Öğeler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Oyuncu Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'appointments', name: 'Turnuvalar', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Oyuncular', appointments: 'Turnuvalar', products: 'Oyun İçi Öğeler', orders: 'Satın Alımlar' },
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fdf2f8' }
  },

  media_streaming: {
    id: 'media_streaming', name: 'Medya & Streaming', category: '📦 E-Ticaret & Dijital',
    description: 'Medya ve streaming platformu', emoji: '📺',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Aboneler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'İzleyici Desteği', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'İçerikler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'appointments', name: 'Canlı Yayınlar', icon: 'Calendar', href: '/appointments', enabled: true, optional: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'İzlenme Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Aboneler', appointments: 'Canlı Yayınlar', products: 'İçerikler', orders: 'Abonelikler' },
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#fef2f2' }
  },

  // ===========================================
  // ⚖️ KAMU & SİVİL TOPLUM (4 SEKTÖR)
  // ===========================================

  municipality: {
    id: 'municipality', name: 'Belediye', category: '⚖️ Kamu & Sivil Toplum',
    description: 'Belediye halkla ilişkiler', emoji: '🏛️',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Vatandaşlar', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Halk İletişim', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Vatandaş Kabul', icon: 'Calendar', href: '/appointments', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Hizmet Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Vatandaşlar', appointments: 'Vatandaş Kabul', products: 'Belediye Hizmetleri', orders: 'Başvurular' },
    colors: { primary: '#1f2937', secondary: '#111827', accent: '#f3f4f6' }
  },

  ngo: {
    id: 'ngo', name: 'STK & Dernek', category: '⚖️ Kamu & Sivil Toplum',
    description: 'Sivil toplum kuruluşları ve dernekler', emoji: '🤝',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Üyeler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Üye İletişim', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Etkinlikler', icon: 'Calendar', href: '/appointments', enabled: true },
      { id: 'products', name: 'Projeler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Proje Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Üyeler', appointments: 'Etkinlikler', products: 'Projeler', orders: 'Bağışlar' },
    colors: { primary: '#10b981', secondary: '#059669', accent: '#d1fae5' }
  },

  union: {
    id: 'union', name: 'Sendika & Meslek Odası', category: '⚖️ Kamu & Sivil Toplum',
    description: 'Sendika ve meslek odası', emoji: '👷',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Üyeler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Üye İletişim', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'appointments', name: 'Toplantılar', icon: 'Calendar', href: '/appointments', enabled: true },
      { id: 'products', name: 'Hizmetler', icon: 'ShoppingBag', href: '/products', enabled: true },
        { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Üyelik Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: false },
    ],
    terminology: { customers: 'Üyeler', appointments: 'Toplantılar', products: 'Sendika Hizmetleri', orders: 'Üyelik' },
    colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' }
  },

  visa_passport: {
    id: 'visa_passport', name: 'Vize & Pasaport Danışmanlığı', category: '⚖️ Kamu & Sivil Toplum',
    description: 'Vize ve pasaport danışmanlık hizmetleri', emoji: '🛂',
    modules: [
      { id: 'dashboard', name: 'Vize Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'appointments', name: 'Vize Danışmanlığı', icon: 'Calendar', href: '/appointments', enabled: true, critical: true },
      { id: 'customers', name: 'Vize Başvuranları', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'conversations', name: 'Başvuran İletişimi', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'products', name: 'Vize & Pasaport Hizmetleri', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Vize Başvuru Dosyaları', icon: 'ClipboardList', href: '/orders', enabled: true },
        { id: 'packages', name: 'Vize Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Vize Başvuru Raporu', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Vize Danışmanlığı Ayarları', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Vize Başvuranları', appointments: 'Vize Danışmanlığı', products: 'Vize & Pasaport Hizmetleri', orders: 'Vize Başvuru Dosyaları' },
    colors: { primary: '#3b82f6', secondary: '#2563eb', accent: '#dbeafe' }
  },

  // ===========================================
  // 🔧 LEGACY COMPATIBILITY
  // ===========================================
  
  other: {
    id: 'other', name: 'Diğer', category: '🔧 Genel',
    description: 'Genel işletme türü', emoji: '🏢',
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'Home', href: '/dashboard', enabled: true, critical: true },
      { id: 'customers', name: 'Müşteriler', icon: 'Users', href: '/customers', enabled: true, critical: true },
      { id: 'appointments', name: 'Randevular', icon: 'Calendar', href: '/appointments', enabled: true },
      { id: 'products', name: 'Ürünler', icon: 'ShoppingBag', href: '/products', enabled: true },
      { id: 'orders', name: 'Siparişler', icon: 'ClipboardList', href: '/orders', enabled: true },
      { id: 'conversations', name: 'Sohbetler', icon: 'MessageCircle', href: '/conversations', enabled: true },
      { id: 'packages', name: 'Paket Yönetimi', icon: 'Package', href: '/packages', enabled: true },
      { id: 'analytics', name: 'Raporlar', icon: 'BarChart3', href: '/analytics', enabled: true },
      { id: 'settings', name: 'Ayarlar', icon: 'Settings', href: '/settings', enabled: true },
    ],
    terminology: { customers: 'Müşteriler', appointments: 'Randevular', products: 'Ürünler', orders: 'Siparişler' },
    colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#f3f4f6' }
  }
};

// Default business type
export const DEFAULT_BUSINESS_TYPE: BusinessType = 'dental_clinic';

// Auto-detection keywords (genişletilmiş)
export const detectBusinessType = (businessName: string, description?: string): BusinessType => {
  const text = `${businessName} ${description || ''}`.toLowerCase();
  
  const keywords = {
    // Health & Beauty
    dental_clinic: ['diş', 'dental', 'ortodonti', 'implant', 'çürük'],
    hospital: ['hastane', 'poliklinik', 'sağlık', 'doktor', 'hekım'],
    aesthetic_center: ['estetik', 'botox', 'dolgu', 'lazer', 'cilt'],
    dietician: ['diyet', 'beslenme', 'kilo', 'nutrisyon', 'diyetisyen'],
    hair_salon: ['kuaför', 'berber', 'saç', 'kesim', 'boyama'],
    beauty_salon: ['güzellik', 'cilt bakım', 'manikür', 'pedikür'],
    spa_massage: ['spa', 'masaj', 'wellness', 'terapi', 'rahatlama'],
    veterinary: ['veteriner', 'hayvan', 'kedi', 'köpek', 'pet'],
    
    // Food & Beverage
    cafe: ['kafe', 'kahve', 'coffee', 'espresso'],
    restaurant: ['restaurant', 'restoran', 'yemek', 'lokanta'],
    fast_food: ['fast food', 'hamburger', 'pizza', 'döner'],
    bakery: ['pastane', 'fırın', 'pasta', 'kek', 'ekmek'],
    catering: ['catering', 'organizasyon', 'etkinlik', 'düğün yemeği'],
    food_delivery: ['yemek sipariş', 'delivery', 'teslimat'],
    
    // Retail & Fashion
    boutique: ['butik', 'moda', 'kıyafet', 'giyim'],
    shoe_store: ['ayakkabı', 'bot', 'sandalet', 'spor ayakkabı'],
    cosmetics: ['kozmetik', 'makyaj', 'parfüm', 'güzellik ürün'],
    jewelry: ['kuyumcu', 'mücevher', 'altın', 'gümüş', 'pırlanta'],
    electronics: ['elektronik', 'telefon', 'bilgisayar', 'aksesuar'],
    flower_shop: ['çiçekçi', 'çiçek', 'buket', 'aranjman'],
    pet_shop: ['pet shop', 'evcil hayvan', 'köpek maması', 'kedi']
  };
  
  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return type as BusinessType;
    }
  }
  
  return DEFAULT_BUSINESS_TYPE;
};

// Get business config
export const getBusinessTypeConfig = (businessType: BusinessType): BusinessTypeConfig => {
  return businessTypeConfigs[businessType] || businessTypeConfigs[DEFAULT_BUSINESS_TYPE];
};

// Get enabled modules
export const getEnabledModules = (businessType: BusinessType): ModuleConfig[] => {
  const config = getBusinessTypeConfig(businessType);
  return config.modules.filter(module => module.enabled);
};

// Check module enabled
export const isModuleEnabled = (businessType: BusinessType, moduleId: string): boolean => {
  const config = getBusinessTypeConfig(businessType);
  const module = config.modules.find(m => m.id === moduleId);
  return module?.enabled ?? false;
};

// Get all business types by category
export const getBusinessTypesByCategory = (): Record<string, BusinessTypeConfig[]> => {
  const categories: Record<string, BusinessTypeConfig[]> = {};
  
  Object.values(businessTypeConfigs).forEach(config => {
    if (!categories[config.category]) {
      categories[config.category] = [];
    }
    categories[config.category].push(config);
  });
  
  return categories;
};
