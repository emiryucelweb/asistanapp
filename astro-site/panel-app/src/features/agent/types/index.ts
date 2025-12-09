 

/**
 * Agent Panel Type Definitions
 * Comprehensive, strict type definitions for Agent Panel
 * 
 * @module agent/types
 */

import type {
  ConversationStatus,
  ConversationPriority,
  Channel,
  AgentStatus,
  MessageSender,
  MessageType,
  Sentiment,
} from '../constants';

// ============================================================================
// BRANDED TYPES (for type safety)
// ============================================================================

/**
 * Branded type helper
 */
type Brand<K, T> = K & { __brand: T };

/**
 * User ID (branded for type safety)
 */
export type UserId = Brand<string, 'UserId'>;

/**
 * Conversation ID (branded for type safety)
 */
export type ConversationId = Brand<string, 'ConversationId'>;

/**
 * Message ID (branded for type safety)
 */
export type MessageId = Brand<string, 'MessageId'>;

/**
 * Agent ID (branded for type safety)
 */
export type AgentId = Brand<string, 'AgentId'>;

/**
 * Customer ID (branded for type safety)
 */
export type CustomerId = Brand<string, 'CustomerId'>;

/**
 * Tag ID (branded for type safety)
 */
export type TagId = Brand<string, 'TagId'>;

// ============================================================================
// TIMESTAMP TYPES
// ============================================================================

/**
 * ISO 8601 timestamp string
 */
export type ISOTimestamp = Brand<string, 'ISOTimestamp'>;

/**
 * Unix timestamp (milliseconds)
 */
export type UnixTimestamp = Brand<number, 'UnixTimestamp'>;

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

/**
 * Base conversation interface
 */
export interface Conversation {
  readonly id: ConversationId;
  readonly customerId: CustomerId;
  readonly customerName: string;
  readonly customerEmail?: string;
  readonly customerPhone?: string;
  readonly customerAvatar?: string;
  readonly channel: Channel;
  readonly status: ConversationStatus;
  readonly priority: ConversationPriority;
  readonly sentiment?: Sentiment;
  readonly lastMessage: string;
  readonly lastMessageTime: ISOTimestamp;
  readonly createdAt: ISOTimestamp;
  readonly updatedAt: ISOTimestamp;
  readonly unreadCount: number;
  readonly assignedTo?: AgentId;
  readonly assignedToName?: string;
  readonly assignedAt?: ISOTimestamp;
  readonly isLocked: boolean;
  readonly lockedBy?: AgentId;
  readonly lockedByName?: string;
  readonly aiStuck: boolean;
  readonly tags: ReadonlyArray<Tag>;
  readonly metadata?: ConversationMetadata;
}

/**
 * Conversation metadata (flexible structure)
 */
export interface ConversationMetadata {
  readonly aiAttempts?: number;
  readonly transferCount?: number;
  readonly firstResponseTime?: number;
  readonly averageResponseTime?: number;
  readonly resolutionTime?: number;
  readonly customerLifetimeValue?: number;
  readonly customerSegment?: string;
  readonly source?: string;
  readonly referrer?: string;
  readonly utmParams?: Record<string, string>;
  readonly orderNumber?: string;
  // Extended metadata fields for various scenarios
  readonly paymentAmount?: number;
  readonly estimatedValue?: number;
  readonly cartValue?: number;
  readonly satisfactionScore?: number;
  readonly previousComplaints?: number;
  readonly detectedLanguage?: string;
  readonly vipTier?: string;
  readonly timestamp?: string;
  readonly appointmentTime?: string;
  readonly specialNotes?: string;
  readonly urgencyLevel?: string;
  /**
   * Custom fields for extensibility
   * Allows additional dynamic properties while maintaining type safety
   */
  readonly customFields?: Record<string, unknown>;
}

/**
 * Conversation with messages (for detail view)
 */
export interface ConversationWithMessages extends Conversation {
  readonly messages: ReadonlyArray<Message>;
}

/**
 * Conversation filter options
 */
export interface ConversationFilter {
  readonly status?: ConversationStatus | ConversationStatus[];
  readonly priority?: ConversationPriority | ConversationPriority[];
  readonly channel?: Channel | Channel[];
  readonly assignedTo?: AgentId | AgentId[];
  readonly tags?: TagId | TagId[];
  readonly sentiment?: Sentiment | Sentiment[];
  readonly searchQuery?: string;
  readonly dateRange?: DateRange;
  readonly hasUnread?: boolean;
  readonly isAiStuck?: boolean;
}

/**
 * Date range filter
 */
export interface DateRange {
  readonly from: ISOTimestamp;
  readonly to: ISOTimestamp;
}

/**
 * Conversation sort options
 */
export type ConversationSortBy = 
  | 'priority'
  | 'lastMessageTime'
  | 'createdAt'
  | 'updatedAt'
  | 'unreadCount';

export type SortOrder = 'asc' | 'desc';

export interface ConversationSort {
  readonly sortBy: ConversationSortBy;
  readonly order: SortOrder;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

/**
 * Base message interface
 */
export interface Message {
  readonly id: MessageId;
  readonly conversationId: ConversationId;
  readonly sender: MessageSender;
  readonly senderId?: UserId;
  readonly senderName?: string;
  readonly senderAvatar?: string;
  readonly type: MessageType;
  readonly content: string;
  readonly timestamp: ISOTimestamp;
  readonly isRead: boolean;
  readonly isDelivered: boolean;
  readonly isFailed: boolean;
  readonly attachments?: ReadonlyArray<Attachment>;
  readonly metadata?: MessageMetadata;
}

/**
 * System message (assignment, transfer, etc.)
 */
import { MESSAGE_SENDER } from '../constants';

export interface SystemMessage extends Message {
  readonly sender: typeof MESSAGE_SENDER.SYSTEM;
  readonly systemType: SystemMessageType;
  readonly systemData?: SystemMessageData;
}

/**
 * System message types
 */
export type SystemMessageType =
  | 'assignment'
  | 'transfer'
  | 'resolution'
  | 'reopened'
  | 'tag_added'
  | 'note_added';

/**
 * System message data
 */
export interface SystemMessageData {
  readonly assignedBy?: AgentId;
  readonly assignedByName?: string;
  readonly assignedTo?: AgentId;
  readonly assignedToName?: string;
  readonly reason?: string;
  readonly previousAgent?: AgentId;
  readonly previousAgentName?: string;
}

/**
 * Message metadata
 */
export interface MessageMetadata {
  readonly aiGenerated?: boolean;
  readonly aiModel?: string;
  readonly aiConfidence?: number;
  readonly editedAt?: ISOTimestamp;
  readonly deletedAt?: ISOTimestamp;
  readonly replyTo?: MessageId;
  readonly forwarded?: boolean;
  readonly translatedFrom?: string;
  readonly customFields?: Record<string, unknown>;
}

/**
 * File attachment
 */
export interface Attachment {
  readonly id: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly fileType: string;
  readonly mimeType: string;
  readonly url: string;
  readonly thumbnailUrl?: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly uploadedAt: ISOTimestamp;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

/**
 * Agent profile
 */
export interface AgentProfile {
  readonly id: AgentId;
  readonly name: string;
  readonly email: string;
  readonly avatar?: string;
  readonly phone?: string;
  readonly role: AgentRole;
  readonly department?: string;
  readonly status: AgentStatus;
  readonly isOnline: boolean;
  readonly lastSeenAt?: ISOTimestamp;
  readonly createdAt: ISOTimestamp;
  readonly stats: AgentStats;
  readonly preferences: AgentPreferences;
  readonly skills?: ReadonlyArray<string>;
  readonly languages?: ReadonlyArray<string>;
}

/**
 * Agent role
 */
export type AgentRole = 'agent' | 'senior_agent' | 'team_lead' | 'supervisor';

/**
 * Agent statistics
 */
export interface AgentStats {
  readonly activeConversations: number;
  readonly totalConversations: number;
  readonly resolvedConversations: number;
  readonly averageResponseTime: number;
  readonly averageResolutionTime: number;
  readonly satisfactionScore: number;
  readonly totalMessages: number;
  readonly lastUpdatedAt: ISOTimestamp;
}

/**
 * Agent preferences
 */
export interface AgentPreferences {
  readonly autoAssign: boolean;
  readonly maxConcurrentConversations: number;
  readonly notificationSettings: NotificationSettings;
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: 'tr' | 'en';
  readonly timezone: string;
  readonly dailyBreakMinutes: number;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  readonly email: boolean;
  readonly push: boolean;
  readonly desktop: boolean;
  readonly sound: boolean;
  readonly newMessage: boolean;
  readonly assignment: boolean;
  readonly mention: boolean;
  readonly emergencyCall: boolean;
}

/**
 * Agent workload
 */
export interface AgentWorkload {
  readonly agentId: AgentId;
  readonly agentName: string;
  readonly activeConversations: number;
  readonly maxConcurrentConversations: number;
  readonly utilizationRate: number;
  readonly status: AgentStatus;
  readonly isAvailable: boolean;
  readonly isOnline: boolean; // For isAgentAvailable type guard
}

/**
 * Agent metrics (time-based)
 */
export interface AgentMetrics {
  readonly agentId: AgentId;
  readonly period: DateRange;
  readonly conversations: ConversationMetrics;
  readonly performance: PerformanceMetrics;
  readonly activity: ActivityMetrics;
}

/**
 * Conversation metrics
 */
export interface ConversationMetrics {
  readonly total: number;
  readonly assigned: number;
  readonly resolved: number;
  readonly transferred: number;
  readonly abandoned: number;
  readonly resolutionRate: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  readonly averageResponseTime: number;
  readonly averageResolutionTime: number;
  readonly firstResponseTime: number;
  readonly satisfactionScore: number;
  readonly messagesSent: number;
  readonly messagesReceived: number;
}

/**
 * Activity metrics
 */
export interface ActivityMetrics {
  readonly activeTime: number;
  readonly breakTime: number;
  readonly awayTime: number;
  readonly onlineRate: number;
  readonly busyRate: number;
  readonly availableRate: number;
}

// ============================================================================
// TAG TYPES
// ============================================================================

/**
 * Tag
 */
export interface Tag {
  readonly id: TagId;
  readonly name: string;
  readonly color: string;
  readonly category?: string;
  readonly description?: string;
  readonly usageCount: number;
  readonly createdAt: ISOTimestamp;
}

/**
 * Tag category
 */
export interface TagCategory {
  readonly id: string;
  readonly name: string;
  readonly icon?: string;
  readonly tags: ReadonlyArray<Tag>;
}

// ============================================================================
// QUICK REPLY TYPES
// ============================================================================

/**
 * Quick reply template
 */
export interface QuickReply {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly category: string;
  readonly keywords?: ReadonlyArray<string>;
  readonly shortcut?: string;
  readonly usageCount: number;
  readonly createdBy: AgentId;
  readonly createdAt: ISOTimestamp;
  readonly updatedAt: ISOTimestamp;
}

/**
 * Quick reply category
 */
export interface QuickReplyCategory {
  readonly id: string;
  readonly name: string;
  readonly icon?: string;
  readonly quickReplies: ReadonlyArray<QuickReply>;
}

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

/**
 * Customer profile
 */
export interface CustomerProfile {
  readonly id: CustomerId;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly segment?: string;
  readonly lifetimeValue?: number;
  readonly totalConversations: number;
  readonly resolvedConversations: number;
  readonly averageSatisfaction?: number;
  readonly tags: ReadonlyArray<Tag>;
  readonly customFields?: Record<string, unknown>;
  readonly createdAt: ISOTimestamp;
  readonly lastSeenAt?: ISOTimestamp;
}

/**
 * Customer history
 */
export interface CustomerHistory {
  readonly customerId: CustomerId;
  readonly conversations: ReadonlyArray<Conversation>;
  readonly orders?: ReadonlyArray<Order>;
  readonly tickets?: ReadonlyArray<Ticket>;
  readonly notes: ReadonlyArray<Note>;
}

/**
 * Customer order (e-commerce)
 */
export interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: string;
  readonly totalAmount: number;
  readonly currency: string;
  readonly createdAt: ISOTimestamp;
}

/**
 * Customer ticket
 */
export interface Ticket {
  readonly id: string;
  readonly ticketNumber: string;
  readonly subject: string;
  readonly status: string;
  readonly priority: ConversationPriority;
  readonly createdAt: ISOTimestamp;
}

/**
 * Note
 */
export interface Note {
  readonly id: string;
  readonly content: string;
  readonly createdBy: AgentId;
  readonly createdByName: string;
  readonly createdAt: ISOTimestamp;
  readonly isPinned: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  readonly data: ReadonlyArray<T>;
  readonly pagination: Pagination;
}

/**
 * Pagination info
 */
export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

/**
 * API error detail
 */
export interface ApiErrorDetail {
  readonly field?: string;
  readonly message: string;
  readonly code?: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Conversation list view state
 */
export interface ConversationListState {
  readonly filters: ConversationFilter;
  readonly sort: ConversationSort;
  readonly selectedConversationId: ConversationId | null;
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

/**
 * Message input state
 */
export interface MessageInputState {
  readonly content: string;
  readonly attachments: File[];
  readonly isUploading: boolean;
  readonly isSending: boolean;
  readonly replyTo: MessageId | null;
  readonly draftSaved: boolean;
}

/**
 * Modal state
 */
export interface ModalState {
  readonly isOpen: boolean;
  readonly data: unknown;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | 'new_message'
  | 'message_read'
  | 'typing_start'
  | 'typing_stop'
  | 'conversation_assigned'
  | 'conversation_resolved'
  | 'agent_status_changed'
  | 'emergency_call';

/**
 * WebSocket event
 */
export interface WebSocketEvent<T = unknown> {
  readonly type: WebSocketEventType;
  readonly data: T;
  readonly timestamp: ISOTimestamp;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Deep readonly (recursive)
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * Result type (for error handling)
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for system messages
 */
export function isSystemMessage(message: Message): message is SystemMessage {
  return message.sender === 'system';
}

/**
 * Type guard for checking if conversation is assigned to specific agent
 */
export function isAssignedToAgent(
  conversation: Conversation,
  agentId: AgentId
): boolean {
  return conversation.assignedTo === agentId;
}

/**
 * Type guard for checking if conversation has unread messages
 */
export function hasUnreadMessages(conversation: Conversation): boolean {
  return conversation.unreadCount > 0;
}

/**
 * Type guard for checking if agent is available
 */
export function isAgentAvailable(agent: AgentProfile | AgentWorkload): boolean {
  return agent.status === 'available' && agent.isOnline;
}

