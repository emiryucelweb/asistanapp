/**
 * Type Adapters - Bridge between Domain Types and Component Types
 * 
 * Enterprise Pattern: Type Adapter / Type Bridge
 * 
 * Problem: We have multiple type definitions for the same entities:
 * - Domain types (@/features/agent/types) - Strict, comprehensive
 * - Component types (component files) - Simplified for UI needs
 * - Service types (@/lib/api) - API response shapes
 * 
 * Solution: Type adapters provide structural compatibility
 * without losing type safety at boundaries
 * 
 * @author Enterprise Team
 */

import type { Conversation as DomainConversation, Message as DomainMessage } from '@/features/agent/types';

/**
 * Component-compatible Conversation type
 * Structurally compatible with both domain and component types
 */
export type ComponentConversation = Pick<
  DomainConversation,
  | 'id'
  | 'customerName'
  | 'channel'
  | 'status'
  | 'priority'
  | 'lastMessage'
  | 'lastMessageTime'
  | 'unreadCount'
  | 'assignedTo'
  | 'isLocked'
  | 'lockedBy'
  | 'aiStuck'
  | 'sentiment'
> & {
  assignedToMe?: boolean;
  lockedByName?: string;
  assignedToName?: string;
};

/**
 * Component-compatible Message type
 */
export type ComponentMessage = Pick<
  DomainMessage,
  | 'id'
  | 'sender'
  | 'content'
  | 'timestamp'
  | 'senderName'
  | 'isRead'
> & {
  text: string; // Required alias for content (MessageArea component needs this)
  agentName?: string; // Optional alias for senderName
};

/**
 * Adapt domain conversation to component conversation
 * Proper structural transformation - type-safe
 */
export function adaptConversationForComponent(
  conversation: DomainConversation
): ComponentConversation {
  return {
    id: conversation.id,
    customerName: conversation.customerName,
    channel: conversation.channel,
    status: conversation.status,
    priority: conversation.priority,
    lastMessage: conversation.lastMessage,
    lastMessageTime: conversation.lastMessageTime,
    unreadCount: conversation.unreadCount,
    assignedTo: conversation.assignedTo,
    assignedToName: conversation.assignedToName,
    isLocked: conversation.isLocked,
    lockedBy: conversation.lockedBy,
    lockedByName: conversation.lockedByName,
    aiStuck: conversation.aiStuck,
    sentiment: conversation.sentiment,
  };
}

/**
 * Adapt domain message to component message
 * Type-safe structural transformation
 */
export function adaptMessageForComponent(message: DomainMessage): ComponentMessage {
  return {
    id: message.id,
    sender: message.sender,
    content: message.content,
    timestamp: message.timestamp,
    senderName: message.senderName ?? 'Unknown',
    isRead: message.isRead ?? false,
    text: message.content, // Required alias for MessageArea component
    agentName: message.senderName ?? undefined, // Optional alias
  };
}

/**
 * Adapt array of domain conversations
 */
export function adaptConversationsForComponent(
  conversations: DomainConversation[]
): ComponentConversation[] {
  return conversations.map(adaptConversationForComponent);
}

/**
 * Adapt array of domain messages
 */
export function adaptMessagesForComponent(
  messages: DomainMessage[]
): ComponentMessage[] {
  return messages.map(adaptMessageForComponent);
}

