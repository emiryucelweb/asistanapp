/**
 * TeamChatInput Component - Message Composition Area
 * 
 * Enterprise-grade input component with rich features
 * Implements accessibility and keyboard shortcuts
 * 
 * Features:
 * - Multi-line textarea with auto-resize
 * - File/image/video upload
 * - Emoji picker trigger
 * - @mention support
 * - Reply-to message UI
 * - Send button with loading state
 * - Character/file size validation
 * 
 * @see https://www.w3.org/WAI/WCAG21/Understanding/keyboard
 */
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  AtSign,
} from 'lucide-react';
import type { TeamChatMessage } from '@/types';

interface TeamChatInputProps {
  /**
   * Current message input value
   */
  messageInput: string;
  
  /**
   * Whether a message is currently being sent
   */
  isSending: boolean;
  
  /**
   * Message being replied to (if any)
   */
  replyingTo: TeamChatMessage | null;
  
  /**
   * UI state
   */
  showAttachMenu: boolean;
  showEmojiPicker: boolean;
  showMentionMenu: boolean;
  
  /**
   * Refs for file inputs
   */
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  
  /**
   * State setters
   */
  setMessageInput: (value: string) => void;
  setReplyingTo: (message: TeamChatMessage | null) => void;
  setShowAttachMenu: (show: boolean) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowMentionMenu: (show: boolean) => void;
  
  /**
   * Callbacks
   */
  onSendMessage: () => void;
  onFileUpload: (file: File, type: 'image' | 'video' | 'file') => void;
}

/**
 * TeamChatInput - Professional message composition interface
 * 
 * Implements:
 * - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
 * - Auto-focus on mount
 * - File upload validation
 * - ARIA labels for accessibility
 * - Responsive design
 */
export function TeamChatInput(props: TeamChatInputProps) {
  const { t } = useTranslation('admin');
  const {
    messageInput,
    isSending,
    replyingTo,
    showAttachMenu,
    showEmojiPicker,
    showMentionMenu,
    fileInputRef,
    imageInputRef,
    videoInputRef,
    setMessageInput,
    setReplyingTo,
    setShowAttachMenu,
    setShowEmojiPicker,
    setShowMentionMenu,
    onSendMessage,
    onFileUpload,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set height based on content, max 200px
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [messageInput]);

  /**
   * Auto-focus textarea on mount
   */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /**
   * Handle keyboard shortcuts
   * - Enter: Send message (unless Shift is pressed)
   * - Shift+Enter: New line
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
    
    // Check for @ mention trigger
    if (event.key === '@') {
      setShowMentionMenu(true);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'video' | 'file'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileUpload(file, type);
    
    // Reset input
    event.target.value = '';
  };

  /**
   * Check if send button should be disabled
   */
  const isSendDisabled = !messageInput.trim() || isSending;

  return (
    <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 sm:p-4">
      {/* Reply-to Preview */}
      {replyingTo && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {t('teamChat.input.replyingTo')}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t('teamChat.input.user', { userId: replyingTo.userId })}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
              {replyingTo.content}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors flex-shrink-0"
            aria-label={t('teamChat.input.cancelReply')}
            type="button"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Left Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Attachment Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={t('team.chat.addFile')}
              aria-expanded={showAttachMenu}
              disabled={isSending}
              type="button"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </button>

            {showAttachMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAttachMenu(false)}
                  aria-hidden="true"
                />
                
                {/* Menu */}
                <div 
                  className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden"
                  role="menu"
                  aria-label={t('team.chat.fileOptions')}
                >
                  <button
                    onClick={() => {
                      imageInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    role="menuitem"
                    type="button"
                  >
                    <ImageIcon className="w-4 h-4" aria-hidden="true" />
                    <span>{t('teamChat.input.image')}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      videoInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    role="menuitem"
                    type="button"
                  >
                    <VideoIcon className="w-4 h-4" aria-hidden="true" />
                    <span>{t('teamChat.input.video')}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    role="menuitem"
                    type="button"
                  >
                    <Paperclip className="w-4 h-4" aria-hidden="true" />
                    <span>{t('teamChat.input.file')}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Emoji Picker Trigger */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('teamChat.input.addEmoji')}
            aria-expanded={showEmojiPicker}
            disabled={isSending}
            type="button"
          >
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>

          {/* Mention Trigger */}
          <button
            onClick={() => setShowMentionMenu(!showMentionMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('teamChat.input.mentionUser')}
            aria-expanded={showMentionMenu}
            disabled={isSending}
            type="button"
          >
            <AtSign className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('teamChat.input.messagePlaceholder')}
            disabled={isSending}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
            aria-label={t('teamChat.input.typeMessage')}
            style={{ minHeight: '40px', maxHeight: '200px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={onSendMessage}
          disabled={isSendDisabled}
          className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors flex-shrink-0 disabled:cursor-not-allowed"
          aria-label={t('teamChat.input.send')}
          type="button"
        >
          <Send 
            className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} 
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Character Count (optional) */}
      {messageInput.length > 900 && (
        <div className="mt-1 text-right">
          <span className={`text-xs ${
            messageInput.length > 1000 
              ? 'text-red-600 dark:text-red-400 font-semibold' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {messageInput.length}/1000
          </span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={(e) => handleFileChange(e, 'file')}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'image')}
        className="hidden"
        aria-hidden="true"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => handleFileChange(e, 'video')}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}

