/**
 * Mock Data Factories
 * Type-safe mock data generators for testing
 * 
 * @module test/utils/mock-factories
 */

import type { 
  Conversation, 
  Message,
  ConversationId,
  MessageId,
  UserId,
  CustomerId,
  AgentId,
  ISOTimestamp,
} from '@/features/agent/types';
import type { 
  ConversationStatus,
  ConversationPriority,
  Channel,
  MessageSender,
  MessageType,
} from '@/features/agent/constants';

// ============================================================================
// BRANDED TYPE HELPERS
// ============================================================================

/**
 * Create branded ID helpers
 */
function createBrandedId<T>(value: string): T {
  return value as T;
}

export function createUserId(id?: string): UserId {
  return createBrandedId<UserId>(id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

export function createCustomerId(id?: string): CustomerId {
  return createBrandedId<CustomerId>(id || `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

export function createAgentId(id?: string): AgentId {
  return createBrandedId<AgentId>(id || `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

export function createConversationId(id?: string): ConversationId {
  return createBrandedId<ConversationId>(id || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

export function createMessageId(id?: string): MessageId {
  return createBrandedId<MessageId>(id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

export function createISOTimestamp(date?: Date): ISOTimestamp {
  return (date || new Date()).toISOString() as ISOTimestamp;
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock message
 */
export function createMockMessage(overrides?: Partial<Message>): Message {
  const id = overrides?.id || createMessageId();
  const conversationId = overrides?.conversationId || createConversationId('conv-test');
  
  return {
    id,
    conversationId,
    content: overrides?.content || 'Test message',
    sender: (overrides?.sender || 'customer') as MessageSender,
    senderId: overrides?.senderId || createUserId('customer-test'),
    senderName: overrides?.senderName || 'Test Customer',
    timestamp: overrides?.timestamp || createISOTimestamp(),
    type: (overrides?.type || 'text') as MessageType,
    attachments: overrides?.attachments || [],
    metadata: overrides?.metadata || {},
    ...overrides,
  } as Message;
}

/**
 * Mock conversation overrides type
 * Allows string for branded ID fields for test convenience
 */
type ConversationOverrides = Omit<Partial<Conversation>, 'id' | 'customerId'> & {
  id?: string | ConversationId;
  customerId?: string | CustomerId;
};

/**
 * Generate mock conversation
 * 
 * @param overrides - Optional partial conversation data to override defaults
 * @returns Fully typed Conversation object
 * 
 * Note: Returns the full Conversation type from agent/types.
 * If using with components that have narrower Channel types,
 * you may need to cast in your test.
 */
export function createMockConversation(overrides?: ConversationOverrides): Conversation {
  // Handle id with proper type conversion
  const id = typeof overrides?.id === 'string' 
    ? createConversationId(overrides.id) 
    : (overrides?.id || createConversationId());
  const customerId = typeof overrides?.customerId === 'string'
    ? createCustomerId(overrides.customerId)
    : (overrides?.customerId || createCustomerId());
  
  // Destructure branded fields from overrides to avoid duplicate in spread
  const { id: _id, customerId: _customerId, ...restOverrides } = overrides || {};
  
  return {
    id,
    customerId,
    customerName: restOverrides?.customerName || 'Test Customer',
    customerEmail: restOverrides?.customerEmail || 'test@example.com',
    customerPhone: restOverrides?.customerPhone || '+905551234567',
    customerAvatar: restOverrides?.customerAvatar,
    channel: (restOverrides?.channel || 'whatsapp') as Channel,
    status: (restOverrides?.status || 'waiting') as ConversationStatus,
    priority: (restOverrides?.priority || 'normal') as ConversationPriority,
    sentiment: restOverrides?.sentiment,
    lastMessage: restOverrides?.lastMessage || 'Test last message',
    lastMessageTime: restOverrides?.lastMessageTime || createISOTimestamp(),
    createdAt: restOverrides?.createdAt || createISOTimestamp(),
    updatedAt: restOverrides?.updatedAt || createISOTimestamp(),
    unreadCount: restOverrides?.unreadCount ?? 0,
    assignedTo: restOverrides?.assignedTo,
    assignedToName: restOverrides?.assignedToName,
    assignedAt: restOverrides?.assignedAt,
    isLocked: restOverrides?.isLocked ?? false,
    lockedBy: restOverrides?.lockedBy,
    lockedByName: restOverrides?.lockedByName,
    aiStuck: restOverrides?.aiStuck ?? false,
    tags: restOverrides?.tags || [],
    metadata: restOverrides?.metadata || {},
    ...restOverrides,
  } as Conversation;
}

/**
 * Generate multiple mock conversations
 */
export function createMockConversations(
  count: number, 
  overrides?: Partial<Conversation>
): Conversation[] {
  return Array.from({ length: count }, (_, index) =>
    createMockConversation({
      ...overrides,
      id: createConversationId(`conv-test-${index + 1}`),
      customerName: `Test Customer ${index + 1}`,
    })
  );
}

/**
 * Generate multiple mock messages
 */
export function createMockMessages(
  count: number, 
  conversationId: ConversationId, 
  overrides?: Partial<Message>
): Message[] {
  return Array.from({ length: count }, (_, index) => {
    const timestamp = new Date(Date.now() - (count - index) * 60000);
    
    return createMockMessage({
      ...overrides,
      id: createMessageId(`msg-test-${index + 1}`),
      conversationId,
      timestamp: createISOTimestamp(timestamp),
      content: `Test message ${index + 1}`,
    });
  });
}

/**
 * Mock Agent Profile
 */
export interface MockAgentProfile {
  id: AgentId;
  name: string;
  email: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  avatarUrl?: string;
  maxConcurrentChats: number;
  currentLoad: number;
}

export function createMockAgentProfile(overrides?: Partial<MockAgentProfile>): MockAgentProfile {
  const id = overrides?.id || createAgentId();
  
  return {
    id,
    name: overrides?.name || 'Test Agent',
    email: overrides?.email || `agent${id}@test.com`,
    status: overrides?.status || 'available',
    avatarUrl: overrides?.avatarUrl,
    maxConcurrentChats: overrides?.maxConcurrentChats ?? 5,
    currentLoad: overrides?.currentLoad ?? 0,
    ...overrides,
  };
}

/**
 * Mock Customer
 */
export interface MockCustomer {
  id: CustomerId;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
}

export function createMockCustomer(overrides?: Partial<MockCustomer>): MockCustomer {
  const id = overrides?.id || createCustomerId();
  
  return {
    id,
    name: overrides?.name || 'Test Customer',
    email: overrides?.email || `customer${id}@test.com`,
    phone: overrides?.phone || '+905551234567',
    avatarUrl: overrides?.avatarUrl,
    tags: overrides?.tags || [],
    metadata: overrides?.metadata || {},
    createdAt: overrides?.createdAt || createISOTimestamp(),
    ...overrides,
  };
}
