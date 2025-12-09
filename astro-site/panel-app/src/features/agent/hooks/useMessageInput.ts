 

/**
 * useMessageInput Hook
 * Comprehensive message input management with validation, drafts, and file handling
 * 
 * @module agent/hooks/useMessageInput
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSendMessage } from '@/lib/react-query/hooks/useConversations';
import { validateMessage, validateFiles } from '../utils/validation';
import { STORAGE_KEYS, TIMEOUTS, FILE_UPLOAD } from '../constants';
import { logger } from '@/shared/utils/logger';
import { showSuccess, showError } from '@/shared/utils/toast';
import type { ConversationId } from '../types';

export interface UseMessageInputOptions {
  conversationId: ConversationId;
  onSendSuccess?: () => void;
  onSendError?: (error: Error) => void;
  enableDraftAutoSave?: boolean;
  maxFiles?: number;
}

export interface UseMessageInputReturn {
  // State
  content: string;
  attachments: File[];
  isSending: boolean;
  isUploading: boolean;
  draftSaved: boolean;
  
  // Actions
  setContent: (content: string) => void;
  addAttachments: (files: File[]) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  sendMessage: () => Promise<void>;
  clearInput: () => void;
  
  // Validation
  validation: {
    isValid: boolean;
    error?: string;
  };
}

/**
 * Custom hook for message input management
 */
export function useMessageInput(options: UseMessageInputOptions): UseMessageInputReturn {
  const { t } = useTranslation('agent');
  const {
    conversationId,
    onSendSuccess,
    onSendError,
    enableDraftAutoSave = true,
    maxFiles = FILE_UPLOAD.MAX_FILES_PER_MESSAGE,
  } = options;

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const sendMessageMutation = useSendMessage();
  const isSending = (sendMessageMutation as any).isPending || false;

  // Draft auto-save
  const draftKey = `${STORAGE_KEYS.DRAFT_PREFIX}${conversationId}`;
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // Load draft on mount
  useEffect(() => {
    if (enableDraftAutoSave) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setContent(savedDraft);
        setDraftSaved(true);
        logger.debug('Draft loaded', { conversationId });
      }
    }
  }, [conversationId, draftKey, enableDraftAutoSave]);

  // Auto-save draft
  useEffect(() => {
    if (!enableDraftAutoSave || !content.trim()) {
      setDraftSaved(false);
      return;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, content);
        setDraftSaved(true);
        logger.debug('Draft auto-saved', { conversationId });
      } catch (error) {
        logger.error('Failed to save draft', error as Error);
      }
    }, TIMEOUTS.DRAFT_AUTOSAVE);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, conversationId, draftKey, enableDraftAutoSave]);

  // Content validation
  const validation = useCallback(() => {
    if (!content.trim() && attachments.length === 0) {
      return { isValid: false, error: t('messages.validation.messageOrFileRequired') };
    }

    if (content.trim()) {
      const messageValidation = validateMessage(content, t);
      if (!messageValidation.valid) {
        return { isValid: false, error: messageValidation.error };
      }
    }

    if (attachments.length > maxFiles) {
      return { isValid: false, error: t('messages.validation.maxFilesExceeded', { maxFiles }) };
    }

    return { isValid: true };
  }, [content, attachments, maxFiles, t]);

  // Set content
  const handleSetContent = useCallback((newContent: string) => {
    setContent(newContent);
    setDraftSaved(false);
  }, []);

  // Add attachments
  const addAttachments = useCallback((files: File[]) => {
    const validation = validateFiles(files, t);
    
    if (!validation.valid) {
      showError(validation.error || t('messages.validation.invalidFiles'));
      return;
    }

    const validFiles = validation.validFiles || [];
    
    setAttachments(prev => {
      const newAttachments = [...prev, ...validFiles].slice(0, maxFiles);
      logger.debug('Attachments added', { count: validFiles.length, total: newAttachments.length });
      return newAttachments;
    });

    showSuccess(t('messages.validation.filesAdded', { count: validFiles.length }));
  }, [maxFiles, t]);

  // Remove attachment
  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => {
      const newAttachments = prev.filter((_, i) => i !== index);
      logger.debug('Attachment removed', { index, remaining: newAttachments.length });
      return newAttachments;
    });
  }, []);

  // Clear attachments
  const clearAttachments = useCallback(() => {
    setAttachments([]);
    logger.debug('Attachments cleared');
  }, []);

  // Clear input
  const clearInput = useCallback(() => {
    setContent('');
    setAttachments([]);
    setDraftSaved(false);
    
    // Clear draft from storage
    if (enableDraftAutoSave) {
      localStorage.removeItem(draftKey);
    }
    
    logger.debug('Input cleared', { conversationId });
  }, [conversationId, draftKey, enableDraftAutoSave]);

  // Send message
  const sendMessage = useCallback(async () => {
    const validationResult = validation();
    
    if (!validationResult.isValid) {
      showError(validationResult.error || t('messages.validation.invalidMessage'));
      return;
    }

    try {
      logger.debug('Sending message', {
        conversationId,
        contentLength: content.length,
        attachmentsCount: attachments.length,
      });

      // Set uploading state if there are attachments
      if (attachments.length > 0) {
        setIsUploading(true);
      }

      await sendMessageMutation.mutateAsync({
        conversationId: conversationId as string,
        content: content.trim() || t('messages.fileSent'),
        attachments,
      });

      logger.info('Message sent successfully', { conversationId });
      
      // Clear input on success
      clearInput();
      
      // Success callback
      if (onSendSuccess) {
        onSendSuccess();
      }
      
    } catch (error) {
      logger.error('Failed to send message', error as Error, { conversationId });
      
      // Error callback
      if (onSendError) {
        onSendError(error as Error);
      }
      
      showError(t('messages.sendFailed'));
    } finally {
      setIsUploading(false);
    }
  }, [
    validation,
    content,
    attachments,
    conversationId,
    sendMessageMutation,
    clearInput,
    onSendSuccess,
    onSendError,
    t,
  ]);

  return {
    // State
    content,
    attachments,
    isSending,
    isUploading,
    draftSaved,
    
    // Actions
    setContent: handleSetContent,
    addAttachments,
    removeAttachment,
    clearAttachments,
    sendMessage,
    clearInput,
    
    // Validation
    validation: validation(),
  };
}

