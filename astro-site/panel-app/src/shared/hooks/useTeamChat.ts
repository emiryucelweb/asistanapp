/**
 * Team Chat Hook
 * Agent-to-Agent Real-time Communication
 * 
 * Enterprise-level team chat system with:
 * - WebSocket real-time messaging
 * - Channel management (public, private, direct)
 * - Message history with pagination
 * - Typing indicators
 * - Read receipts
 * - Online status tracking
 * - File sharing support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuthStore } from '@/shared/stores/auth-store';
import { logger } from '@/shared/utils/logger';
import toast from 'react-hot-toast';

// Types
export interface TeamChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: TeamMember[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  unreadCount?: number;
  lastMessage?: TeamChatMessage;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: number;
}

export interface TeamChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: number;
  edited?: boolean;
  editedAt?: number;
  readBy: string[]; // User IDs who read this message
  replyTo?: string; // Message ID being replied to
}

export interface TypingIndicator {
  channelId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

interface UseTeamChatOptions {
  autoConnect?: boolean;
  pageSize?: number;
}

interface UseTeamChatReturn {
  // State
  channels: TeamChannel[];
  messages: Map<string, TeamChatMessage[]>;
  activeChannel: TeamChannel | null;
  typingUsers: Map<string, TypingIndicator[]>;
  isLoading: boolean;
  
  // Actions
  sendMessage: (channelId: string, content: string, type?: 'text' | 'file' | 'image') => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  createChannel: (name: string, type: TeamChannel['type'], memberIds?: string[]) => Promise<TeamChannel | null>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  setActiveChannel: (channel: TeamChannel | null) => void;
  loadMessages: (channelId: string, before?: number) => Promise<void>;
  markAsRead: (channelId: string) => void;
  startTyping: (channelId: string) => void;
  stopTyping: (channelId: string) => void;
  uploadFile: (channelId: string, file: File) => Promise<void>;
  searchMessages: (channelId: string, query: string) => Promise<TeamChatMessage[]>;
}

export function useTeamChat(options: UseTeamChatOptions = {}): UseTeamChatReturn {
  const { autoConnect = true, pageSize = 50 } = options;
  
  // State
  const [channels, setChannels] = useState<TeamChannel[]>([]);
  const [messages, setMessages] = useState<Map<string, TeamChatMessage[]>>(new Map());
  const [activeChannel, setActiveChannel] = useState<TeamChannel | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  // Hooks
  const { user } = useAuthStore();
  const { sendMessage: wsSendMessage } = useWebSocket();

  /**
   * Load channels on mount
   */
  useEffect(() => {
    if (autoConnect && user) {
      loadChannels();
    }
   
  // TODO: Missing loadChannels dependency
  }, [autoConnect, user]);

  /**
   * Listen to WebSocket messages for team chat
   */
  useEffect(() => {
    const handleTeamChatMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'team_chat_message':
            handleNewMessage(data.payload);
            break;
          case 'team_chat_typing':
            handleTypingIndicator(data.payload);
            break;
          case 'team_chat_read':
            handleReadReceipt(data.payload);
            break;
          case 'team_member_status':
            handleMemberStatusChange(data.payload);
            break;
        }
      } catch (error) {
        logger.error('Failed to parse team chat WebSocket message', error as Error);
      }
    };

    window.addEventListener('message', handleTeamChatMessage);
    return () => window.removeEventListener('message', handleTeamChatMessage);
   
  // TODO: Missing handleNewMessage dependency
  }, []);

  /**
   * Load all channels
   */
  const loadChannels = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      const response = await fetch(`/api/v1/team-chat/channels`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
        logger.debug('Loaded team channels', { count: data.channels?.length });
      } else {
        // ✅ PRODUCTION READY: No fallback mock data
        // If API fails, show error and empty state
        setChannels([]);
        logger.warn('Failed to load team channels - empty state shown');
        toast.error('Kanallar yüklenemedi');
      }
    } catch (error) {
      logger.error('Failed to load team channels', error as Error);
      toast.error('Kanallar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Load messages for a channel
   */
  const loadMessages = useCallback(async (channelId: string, before?: number) => {
    if (!user) return;
    
    try {
      const url = new URL(`/api/v1/team-chat/channels/${channelId}/messages`, window.location.origin);
      if (before) url.searchParams.set('before', before.toString());
      url.searchParams.set('limit', pageSize.toString());
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => {
          const channelMessages = prev.get(channelId) || [];
          const newMessages = [...channelMessages, ...data.messages];
          // Remove duplicates and sort by timestamp
          const uniqueMessages = Array.from(
            new Map(newMessages.map(m => [m.id, m])).values()
          ).sort((a, b) => a.timestamp - b.timestamp);
          
          const newMap = new Map(prev);
          newMap.set(channelId, uniqueMessages);
          return newMap;
        });
        logger.debug('Loaded messages', { channelId, count: data.messages?.length });
      }
    } catch (error) {
      logger.error('Failed to load messages', error as Error, { channelId });
      toast.error('Mesajlar yüklenemedi');
    }
  }, [user, pageSize]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (
    channelId: string,
    content: string,
    type: 'text' | 'file' | 'image' = 'text'
  ) => {
    if (!user || !content.trim()) return;
    
    const message: TeamChatMessage = {
      id: `temp-${Date.now()}`,
      channelId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.profile?.avatar,
      content: content.trim(),
      type,
      timestamp: Date.now(),
      readBy: [user.id],
    };
    
    // Optimistic update
    setMessages(prev => {
      const channelMessages = prev.get(channelId) || [];
      const newMap = new Map(prev);
      newMap.set(channelId, [...channelMessages, message]);
      return newMap;
    });
    
    try {
      // Send via WebSocket
      wsSendMessage('team_chat_message', message);
      
      // Also send via API for persistence
      await fetch(`/api/v1/team-chat/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ content, type }),
      });
      
      logger.debug('Message sent', { channelId });
    } catch (error) {
      logger.error('Failed to send message', error as Error, { channelId });
      toast.error('Mesaj gönderilemedi');
      
      // Revert optimistic update
      setMessages(prev => {
        const channelMessages = prev.get(channelId) || [];
        const newMap = new Map(prev);
        newMap.set(channelId, channelMessages.filter(m => m.id !== message.id));
        return newMap;
      });
    }
  }, [user, wsSendMessage]);

  /**
   * Edit a message
   */
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!user || !newContent.trim()) return;
    
    try {
      await fetch(`/api/v1/team-chat/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ content: newContent.trim() }),
      });
      
      // Update local state
      setMessages(prev => {
        const newMap = new Map(prev);
        for (const [channelId, channelMessages] of newMap.entries()) {
          const index = channelMessages.findIndex(m => m.id === messageId);
          if (index !== -1) {
            const updatedMessages = [...channelMessages];
            updatedMessages[index] = {
              ...updatedMessages[index],
              content: newContent.trim(),
              edited: true,
              editedAt: Date.now(),
            };
            newMap.set(channelId, updatedMessages);
            break;
          }
        }
        return newMap;
      });
      
      logger.debug('Message edited', { messageId });
    } catch (error) {
      logger.error('Failed to edit message', error as Error, { messageId });
      toast.error('Mesaj düzenlenemedi');
    }
  }, [user]);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;
    
    try {
      await fetch(`/api/v1/team-chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      // Update local state
      setMessages(prev => {
        const newMap = new Map(prev);
        for (const [channelId, channelMessages] of newMap.entries()) {
          const filtered = channelMessages.filter(m => m.id !== messageId);
          if (filtered.length !== channelMessages.length) {
            newMap.set(channelId, filtered);
            break;
          }
        }
        return newMap;
      });
      
      logger.debug('Message deleted', { messageId });
    } catch (error) {
      logger.error('Failed to delete message', error as Error, { messageId });
      toast.error('Mesaj silinemedi');
    }
  }, [user]);

  /**
   * Create a new channel
   */
  const createChannel = useCallback(async (
    name: string,
    type: TeamChannel['type'],
    memberIds: string[] = []
  ): Promise<TeamChannel | null> => {
    if (!user || !name.trim()) return null;
    
    try {
      const response = await fetch('/api/v1/team-chat/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name: name.trim(), type, memberIds }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newChannel = data.channel;
        setChannels(prev => [...prev, newChannel]);
        logger.debug('Channel created', { channelId: newChannel.id, name });
        toast.success('Kanal oluşturuldu');
        return newChannel;
      }
      return null;
    } catch (error) {
      logger.error('Failed to create channel', error as Error, { name });
      toast.error('Kanal oluşturulamadı');
      return null;
    }
  }, [user]);

  /**
   * Join a channel
   */
  const joinChannel = useCallback(async (channelId: string) => {
    if (!user) return;
    
    try {
      await fetch(`/api/v1/team-chat/channels/${channelId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      logger.debug('Joined channel', { channelId });
      toast.success('Kanala katıldınız');
      await loadChannels();
    } catch (error) {
      logger.error('Failed to join channel', error as Error, { channelId });
      toast.error('Kanala katılınamadı');
    }
  }, [user, loadChannels]);

  /**
   * Leave a channel
   */
  const leaveChannel = useCallback(async (channelId: string) => {
    if (!user) return;
    
    try {
      await fetch(`/api/v1/team-chat/channels/${channelId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      setChannels(prev => prev.filter(c => c.id !== channelId));
      setMessages(prev => {
        const newMap = new Map(prev);
        newMap.delete(channelId);
        return newMap;
      });
      
      if (activeChannel?.id === channelId) {
        setActiveChannel(null);
      }
      
      logger.debug('Left channel', { channelId });
      toast.success('Kanaldan ayrıldınız');
    } catch (error) {
      logger.error('Failed to leave channel', error as Error, { channelId });
      toast.error('Kanaldan ayrılınamadı');
    }
  }, [user, activeChannel]);

  /**
   * Mark channel messages as read
   */
  const markAsRead = useCallback((channelId: string) => {
    if (!user) return;
    
    // Update unread count
    setChannels(prev =>
      prev.map(c =>
        c.id === channelId ? { ...c, unreadCount: 0 } : c
      )
    );
    
    // Send read receipt via WebSocket
    wsSendMessage('team_chat_read', { channelId, userId: user.id });
  }, [user, wsSendMessage]);

  /**
   * Start typing indicator
   */
  const startTyping = useCallback((channelId: string) => {
    if (!user) return;
    
    wsSendMessage('team_chat_typing', {
      channelId,
      userId: user.id,
      userName: user.name,
      isTyping: true,
    });
  }, [user, wsSendMessage]);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback((channelId: string) => {
    if (!user) return;
    
    wsSendMessage('team_chat_typing', {
      channelId,
      userId: user.id,
      userName: user.name,
      isTyping: false,
    });
  }, [user, wsSendMessage]);

  /**
   * Upload a file
   */
  const uploadFile = useCallback(async (channelId: string, file: File) => {
    if (!user) return;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('channelId', channelId);
      
      const response = await fetch('/api/v1/team-chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        await sendMessage(channelId, data.fileUrl, file.type.startsWith('image/') ? 'image' : 'file');
        logger.debug('File uploaded', { channelId, fileName: file.name });
      }
    } catch (error) {
      logger.error('Failed to upload file', error as Error, { channelId });
      toast.error('Dosya yüklenemedi');
    }
  }, [user, sendMessage]);

  /**
   * Search messages
   */
  const searchMessages = useCallback(async (channelId: string, query: string): Promise<TeamChatMessage[]> => {
    if (!user || !query.trim()) return [];
    
    try {
      const response = await fetch(
        `/api/v1/team-chat/channels/${channelId}/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      }
      return [];
    } catch (error) {
      logger.error('Failed to search messages', error as Error, { channelId, query });
      return [];
    }
  }, [user]);

  // Event Handlers
  const handleNewMessage = (message: TeamChatMessage) => {
    setMessages(prev => {
      const channelMessages = prev.get(message.channelId) || [];
      const newMap = new Map(prev);
      newMap.set(message.channelId, [...channelMessages, message]);
      return newMap;
    });
    
    // Update unread count if not active channel
    if (activeChannel?.id !== message.channelId && message.senderId !== user?.id) {
      setChannels(prev =>
        prev.map(c =>
          c.id === message.channelId
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: message }
            : c
        )
      );
    }
  };

  const handleTypingIndicator = (indicator: TypingIndicator & { isTyping: boolean }) => {
    setTypingUsers(prev => {
      const channelTyping = prev.get(indicator.channelId) || [];
      const newMap = new Map(prev);
      
      if (indicator.isTyping) {
        if (!channelTyping.find(t => t.userId === indicator.userId)) {
          newMap.set(indicator.channelId, [...channelTyping, indicator]);
        }
        
        // Clear timeout
        const existingTimeout = typingTimeoutRef.current.get(`${indicator.channelId}-${indicator.userId}`);
        if (existingTimeout) clearTimeout(existingTimeout);
        
        // Set new timeout
        const timeout = setTimeout(() => {
          setTypingUsers(prev2 => {
            const channelTyping2 = prev2.get(indicator.channelId) || [];
            const newMap2 = new Map(prev2);
            newMap2.set(
              indicator.channelId,
              channelTyping2.filter(t => t.userId !== indicator.userId)
            );
            return newMap2;
          });
        }, 3000);
        
        typingTimeoutRef.current.set(`${indicator.channelId}-${indicator.userId}`, timeout);
      } else {
        newMap.set(
          indicator.channelId,
          channelTyping.filter(t => t.userId !== indicator.userId)
        );
      }
      
      return newMap;
    });
  };

  const handleReadReceipt = (payload: { channelId: string; userId: string; messageIds: string[] }) => {
    setMessages(prev => {
      const channelMessages = prev.get(payload.channelId);
      if (!channelMessages) return prev;
      
      const newMap = new Map(prev);
      newMap.set(
        payload.channelId,
        channelMessages.map(m =>
          payload.messageIds.includes(m.id) && !m.readBy.includes(payload.userId)
            ? { ...m, readBy: [...m.readBy, payload.userId] }
            : m
        )
      );
      return newMap;
    });
  };

  const handleMemberStatusChange = (payload: { memberId: string; status: TeamMember['status'] }) => {
    setChannels(prev =>
      prev.map(c => ({
        ...c,
        members: c.members.map(m =>
          m.id === payload.memberId ? { ...m, status: payload.status } : m
        ),
      }))
    );
  };

  return {
    channels,
    messages,
    activeChannel,
    typingUsers,
    isLoading,
    sendMessage,
    editMessage,
    deleteMessage,
    createChannel,
    joinChannel,
    leaveChannel,
    setActiveChannel,
    loadMessages,
    markAsRead,
    startTyping,
    stopTyping,
    uploadFile,
    searchMessages,
  };
}
