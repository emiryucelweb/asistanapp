/**
 * MessageInput Component
 * 
 * Message input area with file attachments, emoji picker, and quick replies
 * 
 * Features:
 * - Text input with auto-resize
 * - File upload (documents, images, videos)
 * - File preview and removal
 * - Emoji picker
 * - Quick replies button
 * - Send button with validation
 * - Keyboard shortcuts (Enter to send, Ctrl+Enter)
 * - Draft auto-save (handled by parent)
 * - Optimized with React.memo and useCallback
 * 
 * @module agent/components/MessageInput
 */

import React, { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  File, 
  Zap, 
  FileText,
  Smile,
  X
} from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { toBoolean } from '@/shared/utils/type-helpers';

// Types
interface MessageInputProps {
  // State
  messageInput: string;
  attachedFiles: File[];
  showEmojiPicker: boolean | null;
  
  // Permissions
  canSendMessage: boolean;
  isLocked: boolean;
  lockedBy?: string;
  
  // Callbacks
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onToggleQuickReplies: () => void;
  onToggleNotes: () => void;
  
  // UI State
  isUploading?: boolean;
}

/**
 * MessageInput Component
 * Memoized for performance - only re-renders when props change
 */
const MessageInput: React.FC<MessageInputProps> = memo(({
  messageInput,
  attachedFiles,
  showEmojiPicker,
  canSendMessage,
  isLocked,
  lockedBy,
  onMessageChange,
  onSendMessage,
  onAddFiles,
  onRemoveFile,
  onToggleEmojiPicker,
  onEmojiSelect,
  onToggleQuickReplies,
  onToggleNotes,
  isUploading = false,
}) => {
  const { t } = useTranslation('agent');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Local UI state
  const [showFileMenu, setShowFileMenu] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddFiles(files);
    }
    // Reset input
    e.target.value = '';
    setShowFileMenu(false);
  }, [onAddFiles]);

  // Handle key down (modern React best practice)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim() || attachedFiles.length > 0) {
        onSendMessage();
      }
    }
  }, [messageInput, attachedFiles.length, onSendMessage]);

  // Handle emoji click
  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  }, [onEmojiSelect]);

  // Render locked state
  if (!canSendMessage) {
    return (
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <div className="text-center py-4">
          <div className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2">
            🔒
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLocked && lockedBy 
              ? t('conversations.messageInput.lockedBy', { name: lockedBy })
              : t('conversations.messageInput.mustTakeOver')
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {t('conversations.messageInput.cannotSend')}
          </p>
        </div>
      </div>
    );
  }

  // Render input area
  return (
    <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
      <div className="flex items-end gap-2">
        {/* Quick Replies Button */}
        <button
          onClick={onToggleQuickReplies}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors flex-shrink-0"
          title={t('conversations.messageInput.quickReplies')}
          aria-label={t('conversations.messageInput.quickReplies')}
        >
          <Zap className="w-5 h-5" />
        </button>

        {/* Notes Button */}
        <button 
          onClick={onToggleNotes}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors flex-shrink-0"
          title={t('conversations.messageInput.notes')}
          aria-label={t('conversations.messageInput.notes')}
        >
          <FileText className="w-5 h-5" />
        </button>
        
        {/* File Upload */}
        <div className="relative flex-shrink-0">
          <button 
            onClick={() => setShowFileMenu(!showFileMenu)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          title={t('conversations.messageInput.addFile')}
          aria-label={t('conversations.messageInput.addFile')}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {showFileMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowFileMenu(false)} />
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl z-20 py-2 min-w-[160px]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <File className="w-4 h-4" />
                  {t('conversations.messageInput.file')}
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <ImageIcon className="w-4 h-4" />
                  {t('conversations.messageInput.photoVideo')}
                </button>
              </div>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
        </div>
        
        {/* Emoji Picker */}
        <div className="relative flex-shrink-0">
          <button 
            onClick={onToggleEmojiPicker}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          title={t('conversations.messageInput.addEmoji')}
          aria-label={t('conversations.messageInput.addEmoji')}
          >
            <Smile className="w-5 h-5" />
          </button>
          {toBoolean(showEmojiPicker) && (
            <>
              <div className="fixed inset-0 z-10" onClick={onToggleEmojiPicker} />
              <div className="absolute bottom-full left-0 mb-2 z-20">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </>
          )}
        </div>
        
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg max-w-md">
            <div className="flex items-center gap-2 flex-wrap">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm"
                >
                  <Paperclip className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="ml-1 text-red-500 hover:text-red-600 transition-colors"
                    title={t('conversations.messageInput.removeFile')}
                    aria-label={t('conversations.messageInput.removeFile')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Message Input */}
        <textarea
          ref={messageInputRef}
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('conversations.messageInput.placeholder')}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-gray-100 resize-none"
          rows={1}
          style={{ minHeight: '42px', maxHeight: '120px' }}
        />
        
        {/* Send Button */}
        <button
          onClick={onSendMessage}
          disabled={!messageInput.trim() && attachedFiles.length === 0}
          className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          title={t('conversations.messageInput.sendMessage')}
          aria-label={t('conversations.messageInput.sendMessage')}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('messages.send')}</span>
        </button>
      </div>
      
      {/* Uploading indicator */}
      {isUploading && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <div className="flex items-center justify-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-orange-500 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
          {t('conversations.messageInput.uploading')}
        </div>
      )}
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;

