/**
 * TeamChatPage - Internal Team Communication
 * 
 * Enterprise-grade modular architecture
 * Refactored from 1,818 lines monolithic to clean component composition
 * 
 * Architecture:
 * - Custom hooks for state management (useTeamChat, useTeamChatActions, etc.)
 * - Modular UI components (Header, Sidebar, Input)
 * - Reusable modals (Call, Search, CreateChannel, etc.)
 * - Pure utility functions
 * - Separation of concerns (UI, Logic, State, Effects)
 * 
 * Features:
 * - Real-time team messaging
 * - Channel management
 * - Direct messages
 * - File sharing
 * - Voice/Video calls
 * - Message search
 * - Keyboard shortcuts
 * 
 * @author Enterprise Team
 * @version 2.0.0 (Refactored)
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import { logger } from '@/shared/utils/logger';

// Custom Hooks
import {
  useTeamChat,
  useTeamChatActions,
  useTeamChatKeyboard,
  useTeamChatEffects,
} from './hooks';

// UI Components
import {
  TeamChatHeader,
  TeamChatSidebar,
  TeamChatInput,
} from './components';

// Modals
import {
  CallModal,
  CreateChannelModal,
  DeleteConfirmModal,
  SearchModal,
  type ChannelFormData,
} from './components/modals';

// Utilities
import { formatTime } from './utils/helpers';

// Types
import type { TeamChannel } from '@/types';

/**
 * TeamChatPage - Main orchestrator component
 * 
 * Responsibilities:
 * - Compose UI from modular components
 * - Coordinate state between hooks
 * - Handle high-level business logic
 * - Manage modal visibility
 * 
 * This component is now ~300 lines (down from 1,818)
 * All complexity is delegated to specialized hooks and components
 */
const TeamChatPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const location = useLocation();
  
  // ==================== AUTH ====================
  const { user } = useAuthStore();

  // ==================== STATE MANAGEMENT ====================
  const state = useTeamChat();

  // ==================== BUSINESS LOGIC ====================
  const actions = useTeamChatActions({
    selectedChannel: state.selectedChannel,
    messageInput: state.messageInput,
    isSending: state.isSending,
    messages: state.messages,
    replyingTo: state.replyingTo,
    setMessages: state.setMessages,
    setMessageInput: state.setMessageInput,
    setReplyingTo: state.setReplyingTo,
    setIsSending: state.setIsSending,
    messagesEndRef: state.refs.messagesEndRef,
  });

  // ==================== SIDE EFFECTS ====================
  useTeamChatEffects({
    showCallModal: state.showCallModal,
    callStatus: state.callStatus,
    setCallStatus: state.setCallStatus,
    setCallDuration: state.setCallDuration,
    setIsMicMuted: state.setIsMicMuted,
    setIsVideoOff: state.setIsVideoOff,
    setIsSpeakerMuted: state.setIsSpeakerMuted,
    onMount: () => {
      logger.info('[TeamChatPage] Component mounted', {
        userId: user?.id,
        userRole: user?.role,
      });
      
      // TODO: Load initial data
      // fetchChannels();
      // fetchNotifications();
    },
  });

  // ==================== KEYBOARD SHORTCUTS ====================
  useTeamChatKeyboard({
    setShowSearchModal: state.setShowSearchModal,
    setShowCreateChannelModal: state.setShowCreateChannelModal,
    setShowCallModal: state.setShowCallModal,
    setShowChannelInfoModal: state.setShowChannelInfoModal,
    setShowNewDMModal: state.setShowNewDMModal,
    setShowNotifications: state.setShowNotifications,
    setShowUserMenu: state.setShowUserMenu,
    setShowMembersSidebar: state.setShowMembersSidebar,
    enabled: true,
  });

  // ==================== PERMISSIONS ====================
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const canManageChannels = isAdmin;

  // ==================== EVENT HANDLERS ====================

  /**
   * Handle channel selection
   */
  const handleChannelSelect = (channel: TeamChannel) => {
    logger.debug('[TeamChatPage] Channel selected', { channelId: channel.id });
    
    state.setSelectedChannel(channel);
    actions.loadMessagesForChannel(channel.id);
    
    // Close mobile sidebar if needed
    state.setShowMembersSidebar(false);
  };

  /**
   * Handle channel creation
   */
  const handleCreateChannel = (formData: ChannelFormData) => {
    logger.info('[TeamChatPage] Creating channel', { formData });
    
    // TODO: Send to API
    // try {
    //   const response = await teamService.createChannel(formData);
    //   state.setChannels(prev => [...prev, response.data]);
    //   state.setShowCreateChannelModal(false);
    //   showSuccess('Kanal başarıyla oluşturuldu');
    // } catch (error) {
    //   logger.error('[TeamChatPage] Failed to create channel:', error);
    //   showError('Kanal oluşturulamadı');
    // }
    
    alert(t('teamChat.channelCreated', { name: formData.name }));
    state.setShowCreateChannelModal(false);
  };

  /**
   * Handle notification click
   */
  const handleNotificationClick = (notification: any) => {
    logger.debug('[TeamChatPage] Notification clicked', { notificationId: notification.id });
    
    // Navigate to channel
    if (notification.channelId) {
      const targetChannel = state.channels.find(ch => ch.id === notification.channelId);
      if (targetChannel) {
        handleChannelSelect(targetChannel);
      }
    }
    
    // Scroll to message
    if (notification.messageId) {
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${notification.messageId}`);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Highlight message
          messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
          setTimeout(() => {
            messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30');
          }, 2000);
        }
      }, 300);
    }
  };

  /**
   * Handle mention notification from agent panel
   * When agent clicks on mention notification, it navigates here with channelId and messageId query params
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const channelId = searchParams.get('channelId');
    const messageId = searchParams.get('messageId');
    
    if (channelId && messageId) {
      logger.debug('[TeamChatPage] Handling mention notification', { channelId, messageId });
      
      // Find and select the channel
      const targetChannel = state.channels.find(ch => ch.id === channelId);
      if (targetChannel) {
        handleChannelSelect(targetChannel);
        
        // Scroll to the message after a short delay
        setTimeout(() => {
          const messageElement = document.getElementById(`message-${messageId}`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the message
            messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
            setTimeout(() => {
              messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30');
            }, 2000);
          } else {
            logger.warn('[TeamChatPage] Message element not found', { messageId });
          }
        }, 500);
      } else {
        logger.warn('[TeamChatPage] Channel not found', { channelId });
      }
    }
  }, [location.search, state.channels]);

  /**
   * Handle message search click
   */
  const handleSearchMessageClick = (messageId: string) => {
    logger.debug('[TeamChatPage] Search result clicked', { messageId });
    
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight message
      messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
      setTimeout(() => {
        messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30');
      }, 2000);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      {/* ========== HEADER ========== */}
      <TeamChatHeader
        user={user}
        notifications={state.notifications}
        showNotifications={state.showNotifications}
        showUserMenu={state.showUserMenu}
        setShowNotifications={state.setShowNotifications}
        setShowUserMenu={state.setShowUserMenu}
        setShowSearchModal={state.setShowSearchModal}
        onNotificationClick={handleNotificationClick}
      />

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ========== SIDEBAR ========== */}
        <TeamChatSidebar
          channels={state.channels}
          selectedChannel={state.selectedChannel}
          searchQuery={state.channelSearchQuery}
          canManageChannels={canManageChannels}
          setSearchQuery={state.setChannelSearchQuery}
          setShowCreateChannelModal={state.setShowCreateChannelModal}
          setShowNewDMModal={state.setShowNewDMModal}
          onChannelSelect={handleChannelSelect}
        />

        {/* ========== MESSAGES AREA ========== */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
          {state.selectedChannel ? (
            <>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4">
                {state.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>{t('teamChat.messages.noMessages')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.messages.map((message) => (
                      <div
                        key={message.id}
                        id={`message-${message.id}`}
                        className="flex items-start gap-3 transition-colors duration-300"
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`}
                          alt={t('teamChat.messages.userAvatar')}
                          className="w-10 h-10 rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {t('teamChat.messages.user', { userId: message.userId })}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={state.refs.messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <TeamChatInput
                messageInput={state.messageInput}
                isSending={state.isSending}
                replyingTo={state.replyingTo}
                showAttachMenu={state.showAttachMenu}
                showEmojiPicker={state.showEmojiPicker}
                showMentionMenu={state.showMentionMenu}
                fileInputRef={state.refs.fileInputRef}
                imageInputRef={state.refs.imageInputRef}
                videoInputRef={state.refs.videoInputRef}
                setMessageInput={state.setMessageInput}
                setReplyingTo={state.setReplyingTo}
                setShowAttachMenu={state.setShowAttachMenu}
                setShowEmojiPicker={state.setShowEmojiPicker}
                setShowMentionMenu={state.setShowMentionMenu}
                onSendMessage={actions.handleSendMessage}
                onFileUpload={actions.handleFileUpload}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">{t('teamChat.selectChannel')}</p>
                <p className="text-sm">{t('teamChat.selectChannelDescription')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Call Modal */}
      {state.showCallModal && (
        <CallModal
          callType={state.showCallModal}
          callStatus={state.callStatus}
          selectedChannel={state.selectedChannel}
          callDuration={state.callDuration}
          isMicMuted={state.isMicMuted}
          isVideoOff={state.isVideoOff}
          isSpeakerMuted={state.isSpeakerMuted}
          setIsMicMuted={state.setIsMicMuted}
          setIsVideoOff={state.setIsVideoOff}
          setIsSpeakerMuted={state.setIsSpeakerMuted}
          setCallStatus={state.setCallStatus}
          setShowCallModal={state.setShowCallModal}
        />
      )}

      {/* Create Channel Modal */}
      {state.showCreateChannelModal && (
        <CreateChannelModal
          onCreateChannel={handleCreateChannel}
          onClose={() => state.setShowCreateChannelModal(false)}
          isSubmitting={false}
        />
      )}

      {/* Delete Confirm Modal */}
      {state.showDeleteConfirm && (
        <DeleteConfirmModal
          messageId={state.showDeleteConfirm}
          onConfirm={actions.handleDeleteMessage}
          onCancel={() => state.setShowDeleteConfirm(null)}
        />
      )}

      {/* Search Modal */}
      {state.showSearchModal && (
        <SearchModal
          messages={state.messages}
          searchQuery={state.messageSearchQuery}
          setSearchQuery={state.setMessageSearchQuery}
          onClose={() => {
            state.setShowSearchModal(false);
            state.setMessageSearchQuery('');
          }}
          onMessageClick={handleSearchMessageClick}
        />
      )}
    </div>
  );
};

export default TeamChatPage;
