/**
 * useTeamChat Hook - Centralized State Management for Team Chat
 * 
 * Consolidates 43+ useState hooks into a single, organized hook
 * Enterprise Pattern: Single Source of Truth for Component State
 */
import { useState, useRef } from 'react';
import type { TeamChannel, TeamChatMessage } from '@/types';

export interface TeamChatState {
  // Data State
  channels: TeamChannel[];
  selectedChannel: TeamChannel | null;
  messages: TeamChatMessage[];
  notifications: any[];
  
  // Input State
  messageInput: string;
  channelSearchQuery: string;
  messageSearchQuery: string;
  editingContent: string;
  
  // UI State - Modals
  showNotifications: boolean;
  showUserMenu: boolean;
  showSearchModal: boolean;
  showCreateChannelModal: boolean;
  showMembersSidebar: boolean;
  showChannelInfoModal: boolean;
  showNewDMModal: boolean;
  showThreadSidebar: boolean;
  
  // UI State - Inline Menus
  showAttachMenu: boolean;
  showEmojiPicker: boolean;
  showMentionMenu: boolean;
  showScrollButton: boolean;
  showMessageActions: string | null;
  showReactionPicker: string | null;
  showDeleteConfirm: string | null;
  editingMessageId: string | null;
  
  // Message State
  replyingTo: TeamChatMessage | null;
  selectedThreadMessage: TeamChatMessage | null;
  threadReplies: TeamChatMessage[];
  typingUsers: string[];
  isSending: boolean;
  
  // Call State
  showCallModal: 'voice' | 'video' | null;
  callStatus: 'calling' | 'connected' | 'ended';
  callDuration: number;
  isMicMuted: boolean;
  isVideoOff: boolean;
  isSpeakerMuted: boolean;
}

export interface TeamChatRefs {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
}

export function useTeamChat() {
  // Data State
  const [channels, setChannels] = useState<TeamChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<TeamChannel | null>(null);
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Input State
  const [messageInput, setMessageInput] = useState('');
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [editingContent, setEditingContent] = useState('');
  
  // UI State - Modals
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showMembersSidebar, setShowMembersSidebar] = useState(false);
  const [showChannelInfoModal, setShowChannelInfoModal] = useState(false);
  const [showNewDMModal, setShowNewDMModal] = useState(false);
  const [showThreadSidebar, setShowThreadSidebar] = useState(false);
  
  // UI State - Inline Menus
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  // Message State
  const [replyingTo, setReplyingTo] = useState<TeamChatMessage | null>(null);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState<TeamChatMessage | null>(null);
  const [threadReplies, setThreadReplies] = useState<TeamChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  // Call State
  const [showCallModal, setShowCallModal] = useState<'voice' | 'video' | null>(null);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  return {
    // Data
    channels,
    setChannels,
    selectedChannel,
    setSelectedChannel,
    messages,
    setMessages,
    notifications,
    setNotifications,
    
    // Input
    messageInput,
    setMessageInput,
    channelSearchQuery,
    setChannelSearchQuery,
    messageSearchQuery,
    setMessageSearchQuery,
    editingContent,
    setEditingContent,
    
    // UI - Modals
    showNotifications,
    setShowNotifications,
    showUserMenu,
    setShowUserMenu,
    showSearchModal,
    setShowSearchModal,
    showCreateChannelModal,
    setShowCreateChannelModal,
    showMembersSidebar,
    setShowMembersSidebar,
    showChannelInfoModal,
    setShowChannelInfoModal,
    showNewDMModal,
    setShowNewDMModal,
    showThreadSidebar,
    setShowThreadSidebar,
    
    // UI - Inline Menus
    showAttachMenu,
    setShowAttachMenu,
    showEmojiPicker,
    setShowEmojiPicker,
    showMentionMenu,
    setShowMentionMenu,
    showScrollButton,
    setShowScrollButton,
    showMessageActions,
    setShowMessageActions,
    showReactionPicker,
    setShowReactionPicker,
    showDeleteConfirm,
    setShowDeleteConfirm,
    editingMessageId,
    setEditingMessageId,
    
    // Message
    replyingTo,
    setReplyingTo,
    selectedThreadMessage,
    setSelectedThreadMessage,
    threadReplies,
    setThreadReplies,
    typingUsers,
    setTypingUsers,
    isSending,
    setIsSending,
    
    // Call
    showCallModal,
    setShowCallModal,
    callStatus,
    setCallStatus,
    callDuration,
    setCallDuration,
    isMicMuted,
    setIsMicMuted,
    isVideoOff,
    setIsVideoOff,
    isSpeakerMuted,
    setIsSpeakerMuted,
    
    // Refs
    refs: {
      messagesEndRef,
      fileInputRef,
      imageInputRef,
      videoInputRef,
    },
  };
}

