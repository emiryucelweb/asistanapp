/**
 * Agent Panel Constants
 * Centralized constants for consistency and maintainability
 * 
 * @module agent/constants
 */

// ============================================================================
// CONVERSATION CONSTANTS
// ============================================================================

/**
 * Conversation status types
 */
export const CONVERSATION_STATUS = {
  WAITING: 'waiting',
  ASSIGNED: 'assigned',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  TRANSFERRED: 'transferred',
} as const;

export type ConversationStatus = typeof CONVERSATION_STATUS[keyof typeof CONVERSATION_STATUS];

/**
 * Conversation priority levels
 */
export const CONVERSATION_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type ConversationPriority = typeof CONVERSATION_PRIORITY[keyof typeof CONVERSATION_PRIORITY];

/**
 * Priority weights for sorting (higher = more important)
 */
export const PRIORITY_WEIGHTS: Record<ConversationPriority, number> = {
  [CONVERSATION_PRIORITY.URGENT]: 4,
  [CONVERSATION_PRIORITY.HIGH]: 3,
  [CONVERSATION_PRIORITY.MEDIUM]: 2,
  [CONVERSATION_PRIORITY.LOW]: 1,
};

/**
 * Priority display labels
 * ⚠️  DEPRECATED: Use i18n instead - t('common.priority.urgent'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: agent:common.priority.*
 */
export const PRIORITY_LABELS: Record<ConversationPriority, string> = {
  [CONVERSATION_PRIORITY.URGENT]: 'Acil',
  [CONVERSATION_PRIORITY.HIGH]: 'Yüksek',
  [CONVERSATION_PRIORITY.MEDIUM]: 'Normal',
  [CONVERSATION_PRIORITY.LOW]: 'Düşük',
};

/**
 * Priority color classes (Tailwind)
 */
export const PRIORITY_COLORS: Record<ConversationPriority, string> = {
  [CONVERSATION_PRIORITY.URGENT]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  [CONVERSATION_PRIORITY.HIGH]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  [CONVERSATION_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [CONVERSATION_PRIORITY.LOW]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

// ============================================================================
// CHANNEL CONSTANTS
// ============================================================================

/**
 * Communication channels
 */
export const CHANNELS = {
  WHATSAPP: 'whatsapp',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  WEB: 'web',
  PHONE: 'phone',
  EMAIL: 'email',
  TELEGRAM: 'telegram',
} as const;

export type Channel = typeof CHANNELS[keyof typeof CHANNELS];

/**
 * Channel display icons (emoji)
 */
export const CHANNEL_ICONS: Record<Channel, string> = {
  [CHANNELS.WHATSAPP]: '💬',
  [CHANNELS.INSTAGRAM]: '📷',
  [CHANNELS.FACEBOOK]: '👥',
  [CHANNELS.WEB]: '🌐',
  [CHANNELS.PHONE]: '📞',
  [CHANNELS.EMAIL]: '📧',
  [CHANNELS.TELEGRAM]: '✈️',
};

/**
 * Channel color classes (Tailwind)
 */
export const CHANNEL_COLORS: Record<Channel, string> = {
  [CHANNELS.WHATSAPP]: 'bg-green-100 dark:bg-green-900/30',
  [CHANNELS.INSTAGRAM]: 'bg-pink-100 dark:bg-pink-900/30',
  [CHANNELS.FACEBOOK]: 'bg-indigo-100 dark:bg-indigo-900/30',
  [CHANNELS.WEB]: 'bg-blue-100 dark:bg-blue-900/30',
  [CHANNELS.PHONE]: 'bg-orange-100 dark:bg-orange-900/30',
  [CHANNELS.EMAIL]: 'bg-purple-100 dark:bg-purple-900/30',
  [CHANNELS.TELEGRAM]: 'bg-sky-100 dark:bg-sky-900/30',
};

/**
 * Channel display names
 * ⚠️  DEPRECATED: Use i18n instead - t('common.channels.whatsapp'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: agent:common.channels.*
 */
export const CHANNEL_LABELS: Record<Channel, string> = {
  [CHANNELS.WHATSAPP]: 'WhatsApp',
  [CHANNELS.INSTAGRAM]: 'Instagram',
  [CHANNELS.FACEBOOK]: 'Facebook',
  [CHANNELS.WEB]: 'Web',
  [CHANNELS.PHONE]: 'Telefon',
  [CHANNELS.EMAIL]: 'E-posta',
  [CHANNELS.TELEGRAM]: 'Telegram',
};

// ============================================================================
// AGENT STATUS CONSTANTS
// ============================================================================

/**
 * Agent availability statuses
 */
export const AGENT_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  AWAY: 'away',
  ON_BREAK: 'on_break',
  OFFLINE: 'offline',
} as const;

export type AgentStatus = typeof AGENT_STATUS[keyof typeof AGENT_STATUS];

/**
 * Agent status display labels
 * ⚠️  DEPRECATED: Use i18n instead - t('status.available'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: agent:status.*
 */
export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  [AGENT_STATUS.AVAILABLE]: 'Müsait',
  [AGENT_STATUS.BUSY]: 'Meşgul',
  [AGENT_STATUS.AWAY]: 'Uzakta',
  [AGENT_STATUS.ON_BREAK]: 'Molada',
  [AGENT_STATUS.OFFLINE]: 'Çevrimdışı',
};

/**
 * Agent status color classes (Tailwind)
 */
export const AGENT_STATUS_COLORS: Record<AgentStatus, string> = {
  [AGENT_STATUS.AVAILABLE]: 'text-green-500',
  [AGENT_STATUS.BUSY]: 'text-red-500',
  [AGENT_STATUS.AWAY]: 'text-yellow-500',
  [AGENT_STATUS.ON_BREAK]: 'text-orange-500',
  [AGENT_STATUS.OFFLINE]: 'text-gray-500',
};

/**
 * Agent status background colors (Tailwind)
 */
export const AGENT_STATUS_BG_COLORS: Record<AgentStatus, string> = {
  [AGENT_STATUS.AVAILABLE]: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  [AGENT_STATUS.BUSY]: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  [AGENT_STATUS.AWAY]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  [AGENT_STATUS.ON_BREAK]: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  [AGENT_STATUS.OFFLINE]: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
};

// ============================================================================
// MESSAGE CONSTANTS
// ============================================================================

/**
 * Message sender types
 */
export const MESSAGE_SENDER = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  AI: 'ai',
  SYSTEM: 'system',
} as const;

export type MessageSender = typeof MESSAGE_SENDER[keyof typeof MESSAGE_SENDER];

/**
 * Message types
 */
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  LOCATION: 'location',
  CONTACT: 'contact',
  STICKER: 'sticker',
} as const;

export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];

// ============================================================================
// SENTIMENT CONSTANTS
// ============================================================================

/**
 * Customer sentiment states
 */
export const SENTIMENT = {
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  ANGRY: 'angry',
  SAD: 'sad',
  CONFUSED: 'confused',
} as const;

export type Sentiment = typeof SENTIMENT[keyof typeof SENTIMENT];

/**
 * Sentiment display emojis
 */
export const SENTIMENT_EMOJIS: Record<Sentiment, string> = {
  [SENTIMENT.HAPPY]: '😊',
  [SENTIMENT.NEUTRAL]: '😐',
  [SENTIMENT.ANGRY]: '😠',
  [SENTIMENT.SAD]: '😢',
  [SENTIMENT.CONFUSED]: '🤔',
};

/**
 * Sentiment color classes (Tailwind)
 */
export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [SENTIMENT.HAPPY]: 'text-green-600 dark:text-green-400',
  [SENTIMENT.NEUTRAL]: 'text-gray-600 dark:text-gray-400',
  [SENTIMENT.ANGRY]: 'text-red-600 dark:text-red-400',
  [SENTIMENT.SAD]: 'text-blue-600 dark:text-blue-400',
  [SENTIMENT.CONFUSED]: 'text-yellow-600 dark:text-yellow-400',
};

// ============================================================================
// PERFORMANCE CONSTANTS
// ============================================================================

/**
 * Metrics thresholds
 */
export const METRICS_THRESHOLDS = {
  /** Average response time target (seconds) */
  RESPONSE_TIME_TARGET: 600, // 10 minutes
  /** Excellent satisfaction score */
  SATISFACTION_EXCELLENT: 4.5,
  /** Good satisfaction score */
  SATISFACTION_GOOD: 4.0,
  /** Warning satisfaction score */
  SATISFACTION_WARNING: 3.5,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
  /** Conversation list page size */
  CONVERSATION_LIST_SIZE: 50,
  /** Message history page size */
  MESSAGE_HISTORY_SIZE: 100,
} as const;

/**
 * Auto-refresh intervals (milliseconds)
 */
export const REFRESH_INTERVALS = {
  /** Dashboard metrics refresh */
  DASHBOARD_METRICS: 30000, // 30 seconds
  /** Conversation list refresh */
  CONVERSATION_LIST: 10000, // 10 seconds
  /** Message polling */
  MESSAGE_POLLING: 5000, // 5 seconds
  /** Agent status sync */
  AGENT_STATUS_SYNC: 60000, // 1 minute
} as const;

// ============================================================================
// FILE UPLOAD CONSTANTS
// ============================================================================

/**
 * File upload constraints
 */
export const FILE_UPLOAD = {
  /** Maximum file size (bytes) - 10MB */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  /** Maximum image size (bytes) - 5MB */
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  /** Maximum video size (bytes) - 50MB */
  MAX_VIDEO_SIZE: 50 * 1024 * 1024,
  /** Maximum number of files per message */
  MAX_FILES_PER_MESSAGE: 10,
  /** Allowed image MIME types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  /** Allowed video MIME types */
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],
  /** Allowed document MIME types */
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// ============================================================================
// TIMEOUT CONSTANTS
// ============================================================================

/**
 * Operation timeouts (milliseconds)
 */
export const TIMEOUTS = {
  /** API request timeout */
  API_REQUEST: 30000, // 30 seconds
  /** File upload timeout */
  FILE_UPLOAD: 120000, // 2 minutes
  /** Draft auto-save debounce */
  DRAFT_AUTOSAVE: 2000, // 2 seconds
  /** Toast notification duration */
  TOAST_DURATION: 3000, // 3 seconds
  /** Typing indicator timeout */
  TYPING_INDICATOR: 3000, // 3 seconds
} as const;

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

/**
 * Keyboard shortcut keys
 */
export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'k',
  SEND_MESSAGE: 'Enter',
  QUICK_REPLIES: '/',
  CLOSE_MODAL: 'Escape',
  NEXT_CONVERSATION: 'n',
  PREV_CONVERSATION: 'p',
  RESOLVE_CONVERSATION: 'r',
  TRANSFER_CONVERSATION: 't',
  ADD_TAG: 't',
  ADD_NOTE: 'n',
  UPLOAD_FILE: 'f',
  HELP: '?',
  FULLSCREEN: 'F11',
} as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Input validation constraints
 */
export const VALIDATION = {
  /** Minimum message length */
  MESSAGE_MIN_LENGTH: 1,
  /** Maximum message length */
  MESSAGE_MAX_LENGTH: 4000,
  /** Maximum note length */
  NOTE_MAX_LENGTH: 2000,
  /** Maximum tag length */
  TAG_MAX_LENGTH: 50,
  /** Maximum tags per conversation */
  MAX_TAGS_PER_CONVERSATION: 10,
  /** Phone number regex */
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  /** Email regex */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

/**
 * LocalStorage key prefixes
 */
export const STORAGE_KEYS = {
  /** Draft message prefix */
  DRAFT_PREFIX: 'draft_',
  /** Filter preferences */
  FILTER_PREFERENCES: 'agent_filter_preferences',
  /** View preferences */
  VIEW_PREFERENCES: 'agent_view_preferences',
  /** Sidebar collapsed state */
  SIDEBAR_COLLAPSED: 'agent_sidebar_collapsed',
  /** Theme preference */
  THEME: 'theme_preference',
} as const;

// ============================================================================
// ACCESSIBILITY CONSTANTS
// ============================================================================

/**
 * ARIA labels
 * ⚠️  DEPRECATED: Use i18n instead - t('aria.searchInput'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: agent:aria.*
 */
export const ARIA_LABELS = {
  SEARCH_INPUT: 'Konuşmalarda ara',
  MESSAGE_INPUT: 'Mesaj yaz',
  SEND_BUTTON: 'Mesaj gönder',
  ATTACH_FILE: 'Dosya ekle',
  EMOJI_PICKER: 'Emoji seç',
  CONVERSATION_LIST: 'Konuşma listesi',
  MESSAGE_LIST: 'Mesaj listesi',
  CLOSE_MODAL: 'Kapat',
  BACK_BUTTON: 'Geri',
  REFRESH_BUTTON: 'Yenile',
  FULLSCREEN_TOGGLE: 'Tam ekran',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-facing error messages
 * ⚠️  DEPRECATED: Use i18n instead - t('errors.networkError'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: common:errors.*
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  UNAUTHORIZED: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
  FORBIDDEN: 'Bu işlem için yetkiniz yok.',
  NOT_FOUND: 'İstenilen kaynak bulunamadı.',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük.',
  INVALID_FILE_TYPE: 'Geçersiz dosya türü.',
  MESSAGE_TOO_LONG: 'Mesaj çok uzun.',
  VALIDATION_ERROR: 'Girdiğiniz bilgileri kontrol edin.',
  TIMEOUT_ERROR: 'İşlem zaman aşımına uğradı.',
  UNKNOWN_ERROR: 'Bilinmeyen bir hata oluştu.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * User-facing success messages
 * ⚠️  DEPRECATED: Use i18n instead - t('success.messageSent'), etc.
 * This constant is kept for backwards compatibility only.
 * @deprecated Use i18n translations: common:success.*
 */
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Mesaj gönderildi',
  CONVERSATION_ASSIGNED: 'Konuşma atandı',
  CONVERSATION_RESOLVED: 'Konuşma çözüldü',
  CONVERSATION_TRANSFERRED: 'Konuşma transfer edildi',
  FILE_UPLOADED: 'Dosya yüklendi',
  NOTE_SAVED: 'Not kaydedildi',
  TAG_ADDED: 'Etiket eklendi',
  STATUS_UPDATED: 'Durum güncellendi',
  PROFILE_UPDATED: 'Profil güncellendi',
} as const;

