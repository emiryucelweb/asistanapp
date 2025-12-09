/**
 * Centralized i18n Mock
 * 
 * Used by all test files across all panels
 * Single source of truth for translation mocks
 * 
 * @usage
 * ```typescript
 * import { setupI18nMock } from '@/test/mocks/i18n.mock';
 * 
 * // In test file
 * setupI18nMock();
 * ```
 */

import { vi } from 'vitest';

/**
 * Common translations used across all panels
 */
export const commonTranslations: Record<string, string> = {
  // Common actions
  'common.save': 'Kaydet',
  'common.cancel': 'İptal',
  'common.delete': 'Sil',
  'common.edit': 'Düzenle',
  'common.close': 'Kapat',
  'common.search': 'Ara',
  'common.filter': 'Filtrele',
  'common.loading': 'Yükleniyor...',
  'common.error': 'Hata',
  'common.success': 'Başarılı',
  'common.confirm': 'Onayla',
  
  // Theme
  'theme.switchToLight': 'Açık Temaya Geç',
  'theme.switchToDark': 'Koyu Temaya Geç',
};

/**
 * Agent Panel specific translations
 */
export const agentTranslations: Record<string, string> = {
  // Conversations
  'conversations.title': 'Konuşmalar',
  'conversations.noConversations': 'Konuşma bulunamadı',
  'conversations.searchWithShortcut': 'Konuşmalarda ara',
  'conversations.selectConversation': 'Bir konuşma seçin',
  
  // Message Input
  'conversations.messageInput.placeholder': 'Mesajınızı yazın...',
  'conversations.messageInput.sendMessage': 'Mesaj Gönder',
  'conversations.messageInput.addFile': 'Dosya Ekle',
  'conversations.messageInput.uploading': 'Yükleniyor...',
  
  // Conversation Header
  'conversations.header.close': 'Kapat',
  'conversations.header.back': 'Geri',
  'conversations.header.fullscreen': 'Tam Ekran',
  'conversations.header.exitFullscreen': 'Tam Ekrandan Çık',
  'conversations.header.tags': 'Etiketler',
  'conversations.header.takeOver': 'Devral',
  'conversations.header.resolve': 'Çöz',
  'conversations.header.addNote': 'Not Ekle',
  
  // Quick Replies
  'quickReplies.title': 'Hızlı Yanıtlar',
  'quickReplies.searchPlaceholder': 'Şablon ara...',
  'quickReplies.noTemplates': 'Şablon bulunamadı',
  'quickReplies.categories.all': 'Tümü',
  'quickReplies.categories.greeting': 'Selamlama',
  
  // Typing Indicator
  'typingIndicator.defaultName': 'Someone',
};

/**
 * Admin Panel specific translations
 */
export const adminTranslations: Record<string, string> = {
  'admin.dashboard.title': 'Yönetim Paneli',
  'admin.users.title': 'Kullanıcılar',
  'admin.reports.title': 'Raporlar',
};

/**
 * Owner Panel specific translations
 */
export const ownerTranslations: Record<string, string> = {
  'owner.dashboard.title': 'İşletme Paneli',
  'owner.settings.title': 'Ayarlar',
};

/**
 * All translations combined
 */
export const allTranslations = {
  ...commonTranslations,
  ...agentTranslations,
  ...adminTranslations,
  ...ownerTranslations,
};

/**
 * Create translation function with custom translations
 */
export const createTranslationFunction = (
  customTranslations: Record<string, string> = {}
) => {
  const translations = { ...allTranslations, ...customTranslations };
  
  return (key: string, options?: Record<string, unknown>) => {
    let translation = translations[key] || key;
    
    // Replace template variables
    if (options) {
      Object.entries(options).forEach(([optKey, value]) => {
        const placeholder = `{{${optKey}}}`;
        translation = translation.replace(placeholder, String(value));
        
        // Also replace ${key} syntax
        const dollarPlaceholder = `\${${optKey}}`;
        translation = translation.replace(dollarPlaceholder, String(value));
        
        // Direct interpolation (for count, name, etc.)
        if (translation.includes(`${optKey}:`)) {
          translation = translation.replace(`${optKey}:`, '') + ` ${value}`;
        }
      });
    }
    
    return translation;
  };
};

/**
 * Setup i18n mock for tests
 * 
 * @param customTranslations - Additional translations specific to test
 */
export const setupI18nMock = (customTranslations: Record<string, string> = {}) => {
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: createTranslationFunction(customTranslations),
      i18n: {
        language: 'tr',
        changeLanguage: vi.fn(),
      },
    }),
    Trans: ({ children }: { children: React.ReactNode }) => children,
  }));
};

/**
 * Create mock translation hook for inline use
 */
export const mockUseTranslation = (customTranslations: Record<string, string> = {}) => ({
  t: createTranslationFunction(customTranslations),
  i18n: {
    language: 'tr',
    changeLanguage: vi.fn(),
  },
});

