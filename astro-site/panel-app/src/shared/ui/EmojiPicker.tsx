/**
 * Emoji Picker Component
 */
import React, { useState } from 'react';
import { Search, Smile, Heart, ThumbsUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose?: () => void;
  position?: 'top' | 'bottom';
}

const EMOJI_CATEGORIES = {
  recent: {
    label: 'Son Kullanılanlar',
    icon: Clock,
    emojis: ['😊', '👍', '❤️', '😂', '🎉', '🔥', '✨', '💯'],
  },
  smileys: {
    label: 'Yüz İfadeleri',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
      '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
      '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠',
      '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️',
    ],
  },
  gestures: {
    label: 'El İşaretleri',
    icon: ThumbsUp,
    emojis: [
      '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
      '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐',
      '🖖', '👋', '🤝', '💪', '🙏', '✍️', '💅', '🤳',
    ],
  },
  hearts: {
    label: 'Kalpler',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '♥️', '💌',
    ],
  },
  symbols: {
    label: 'Semboller',
    icon: Smile,
    emojis: [
      '✨', '⭐', '🌟', '💫', '✔️', '✅', '❌', '❗',
      '❓', '⚠️', '🔥', '💯', '🎉', '🎊', '🎈', '🎁',
      '🏆', '🥇', '🥈', '🥉', '⚡', '💥', '💢', '💨',
    ],
  },
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  onClose,
  position = 'bottom',
}) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('recent');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    // Save to recent (in real app, would save to localStorage)
  };

  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES).flatMap(cat => cat.emojis).filter(emoji => emoji.includes(searchQuery))
    : EMOJI_CATEGORIES[selectedCategory].emojis;

  return (
    <div 
      className={`
        absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} 
        right-0 z-50
        w-80 bg-white dark:bg-slate-800 
        rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700
        overflow-hidden
      `}
    >
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Emoji ara..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((key) => {
            const category = EMOJI_CATEGORIES[key];
            const Icon = category.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`
                  p-2 rounded-lg transition-colors flex-shrink-0
                  ${selectedCategory === key
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }
                `}
                title={category.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="p-2 max-h-64 overflow-y-auto">
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="
                  w-9 h-9 flex items-center justify-center text-2xl
                  rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700
                  transition-colors cursor-pointer
                "
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            Emoji bulunamadı
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filteredEmojis.length} emoji
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('close')}
          </button>
        )}
      </div>
    </div>
  );
};

// Emoji Button Component
interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
  position?: 'top' | 'bottom';
  className?: string;
}

export const EmojiButton: React.FC<EmojiButtonProps> = ({
  onEmojiSelect,
  position = 'bottom',
  className = '',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`
          p-2 rounded-lg transition-colors
          hover:bg-gray-100 dark:hover:bg-slate-700
          ${className}
        `}
        title="Emoji ekle"
      >
        <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            role="button"
            tabIndex={-1}
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowPicker(false)}
            aria-label="Close emoji picker"
          />
          
          {/* Picker */}
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              onEmojiSelect(emoji);
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
            position={position}
          />
        </>
      )}
    </div>
  );
};

