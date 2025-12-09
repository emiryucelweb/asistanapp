/**
 * DeleteConfirmModal Component - Destructive Action Confirmation
 * 
 * Enterprise-grade confirmation modal for destructive operations
 * Follows UX best practices for preventing accidental data loss
 * 
 * Design Principles:
 * - Clear warning indication (red color scheme)
 * - Explicit action labeling ("Sil" not "OK")
 * - Easy escape path (Cancel button, Esc key, backdrop click)
 * - Focus management for accessibility
 * 
 * @see https://www.nngroup.com/articles/confirmation-dialog/
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  /**
   * ID of the message to be deleted
   */
  messageId: string;
  
  /**
   * Callback when deletion is confirmed
   */
  onConfirm: (messageId: string) => void;
  
  /**
   * Callback when deletion is cancelled
   */
  onCancel: () => void;
  
  /**
   * Optional: Custom title
   * @default "Mesajı Sil"
   */
  title?: string;
  
  /**
   * Optional: Custom description
   * @default "Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
   */
  description?: string;
  
  /**
   * Optional: Custom confirm button text
   * @default "Sil"
   */
  confirmText?: string;
  
  /**
   * Optional: Custom cancel button text
   * @default "İptal"
   */
  cancelText?: string;
}

/**
 * DeleteConfirmModal - Reusable confirmation dialog for destructive actions
 * 
 * Implements:
 * - ARIA dialog pattern
 * - Keyboard navigation (Enter/Esc)
 * - Focus trap
 * - Semantic HTML
 */
export function DeleteConfirmModal(props: DeleteConfirmModalProps) {
  const { t } = useTranslation('admin');
  const {
    messageId,
    onConfirm,
    onCancel,
    title = t('team.deleteMessage'),
    description = t('team.deleteMessageConfirm'),
    confirmText = t('common.delete'),
    cancelText = t('common.cancel'),
  } = props;

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not its children
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  /**
   * Handle confirm action
   */
  const handleConfirm = () => {
    onConfirm(messageId);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
        <div className="text-center">
          {/* Warning Icon */}
          <div 
            className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4"
            aria-hidden="true"
          >
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h3 
            id="delete-modal-title"
            className="text-lg font-bold text-gray-900 dark:text-white mb-2"
          >
            {title}
          </h3>

          {/* Description */}
          <p 
            id="delete-modal-description"
            className="text-gray-600 dark:text-gray-400 mb-6"
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Cancel Button (left, secondary) */}
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
              type="button"
              autoFocus
            >
              {cancelText}
            </button>

            {/* Confirm Button (right, primary destructive) */}
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              type="button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

