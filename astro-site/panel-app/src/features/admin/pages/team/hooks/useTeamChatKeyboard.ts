/**
 * useTeamChatKeyboard Hook - Centralized Keyboard Shortcut Management
 * 
 * Implements enterprise-grade keyboard navigation and shortcuts
 * Follows WCAG 2.1 AA accessibility standards
 * 
 * @see https://www.w3.org/WAI/WCAG21/Understanding/keyboard
 */
import { useEffect } from 'react';
import { logger } from '@/shared/utils/logger';

interface UseTeamChatKeyboardProps {
  /**
   * Modal visibility state setters
   */
  setShowSearchModal: (show: boolean) => void;
  setShowCreateChannelModal: (show: boolean) => void;
  setShowCallModal: (show: 'voice' | 'video' | null) => void;
  setShowChannelInfoModal: (show: boolean) => void;
  setShowNewDMModal: (show: boolean) => void;
  setShowNotifications: (show: boolean) => void;
  setShowUserMenu: (show: boolean) => void;
  setShowMembersSidebar: (show: boolean) => void;
  
  /**
   * Optional: Enable/disable keyboard shortcuts
   * @default true
   */
  enabled?: boolean;
}

/**
 * Centralized keyboard shortcut management for Team Chat
 * 
 * Supported Shortcuts:
 * - Esc: Close all modals and menus
 * - Cmd/Ctrl + K: Open search modal
 * - Cmd/Ctrl + /: Show keyboard shortcuts help (future)
 * 
 * @param props Configuration object
 */
export function useTeamChatKeyboard(props: UseTeamChatKeyboardProps) {
  const {
    setShowSearchModal,
    setShowCreateChannelModal,
    setShowCallModal,
    setShowChannelInfoModal,
    setShowNewDMModal,
    setShowNotifications,
    setShowUserMenu,
    setShowMembersSidebar,
    enabled = true,
  } = props;

  useEffect(() => {
    if (!enabled) {
      logger.debug('[TeamChat] Keyboard shortcuts disabled');
      return;
    }

    /**
     * Keyboard event handler
     * Implements escape key for modal dismissal (WCAG 2.1 AA requirement)
     * 
     * @see https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR27
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key: Close all modals and overlays
      if (event.key === 'Escape') {
        logger.debug('[TeamChat] Escape key pressed - closing all modals', {
          timestamp: new Date().toISOString(),
        });

        setShowSearchModal(false);
        setShowCreateChannelModal(false);
        setShowCallModal(null);
        setShowChannelInfoModal(false);
        setShowNewDMModal(false);
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowMembersSidebar(false);
        
        // Prevent default behavior
        event.preventDefault();
        return;
      }

      // Cmd/Ctrl + K: Open search modal
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        logger.debug('[TeamChat] Search shortcut triggered', {
          timestamp: new Date().toISOString(),
        });

        setShowSearchModal(true);
        event.preventDefault();
        return;
      }

      // Future shortcuts can be added here
      // Examples:
      // - Cmd/Ctrl + N: New channel
      // - Cmd/Ctrl + Shift + K: New DM
      // - Cmd/Ctrl + /: Show shortcuts help
    };

    // Attach event listener
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    logger.debug('[TeamChat] Keyboard shortcuts initialized', {
      enabled,
      supportedKeys: ['Escape', 'Cmd/Ctrl+K'],
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      logger.debug('[TeamChat] Keyboard shortcuts cleaned up');
    };
  }, [
    enabled,
    setShowSearchModal,
    setShowCreateChannelModal,
    setShowCallModal,
    setShowChannelInfoModal,
    setShowNewDMModal,
    setShowNotifications,
    setShowUserMenu,
    setShowMembersSidebar,
  ]);

  // No return value - this is a side-effect only hook
  return null;
}

