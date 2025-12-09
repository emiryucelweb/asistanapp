/**
 * Test Factories - Shared across all panels
 * 
 * Factory functions to create test data
 * DRY principle - single source of truth
 * 
 * @usage
 * ```typescript
 * import { createMockUser, createMockConversation } from '@/test/utils/test-factories';
 * 
 * const user = createMockUser({ name: 'Custom Name' });
 * ```
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Conversation {
  id: string;
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  channel: 'whatsapp' | 'instagram' | 'web' | 'phone';
  status: 'waiting' | 'assigned' | 'resolved';
  assignedTo?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
  tags?: string[];
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

// ============================================================================
// USER FACTORIES
// ============================================================================

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'admin' | 'owner' | 'super-admin';
  avatar?: string;
  status?: 'online' | 'offline' | 'busy';
}

export const createMockUser = (overrides?: Partial<MockUser>): MockUser => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'agent',
  avatar: '/avatar.jpg',
  status: 'online',
  ...overrides,
});

// ============================================================================
// CONVERSATION FACTORIES
// ============================================================================

export const createMockConversation = (overrides?: Partial<Conversation>): Conversation => ({
  id: 'conv-123',
  customer: {
    id: 'cust-123',
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '+905551234567',
    avatar: '/customer-avatar.jpg',
  },
  status: 'waiting',
  channel: 'whatsapp',
  lastMessage: {
    id: 'msg-123',
    content: 'Test message',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    sender: 'customer',
    type: 'text',
  },
  unreadCount: 1,
  assignedTo: null,
  tags: [],
  priority: 'normal',
  createdAt: new Date('2024-01-15T09:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  ...overrides,
} as Conversation);

// ============================================================================
// MESSAGE FACTORIES
// ============================================================================

export interface MockMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'customer' | 'agent' | 'ai';
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status?: 'sending' | 'sent' | 'failed';
  attachments?: MockAttachment[];
}

export const createMockMessage = (overrides?: Partial<MockMessage>): MockMessage => ({
  id: 'msg-123',
  conversationId: 'conv-123',
  content: 'Test message',
  sender: 'customer',
  senderName: 'Test Customer',
  timestamp: new Date('2024-01-15T10:00:00Z'),
  type: 'text',
  status: 'sent',
  ...overrides,
});

// ============================================================================
// FILE/ATTACHMENT FACTORIES
// ============================================================================

export interface MockAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export const createMockFile = (overrides?: Partial<File & { name?: string; size?: number; type?: string }>): File => {
  const name = overrides?.name || 'test-file.pdf';
  const size = overrides?.size || 1024;
  const type = overrides?.type || 'application/pdf';
  
  const blob = new Blob(['test content'], { type });
  const file = new File([blob], name, { type });
  
  // Set size property (readonly normally)
  Object.defineProperty(file, 'size', { value: size });
  
  return file;
};

export const createMockAttachment = (overrides?: Partial<MockAttachment>): MockAttachment => ({
  id: 'att-123',
  name: 'test-file.pdf',
  size: 1024,
  type: 'application/pdf',
  url: '/uploads/test-file.pdf',
  ...overrides,
});

// ============================================================================
// CUSTOMER FACTORIES
// ============================================================================

export interface MockCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  tags?: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

export const createMockCustomer = (overrides?: Partial<MockCustomer>): MockCustomer => ({
  id: 'cust-123',
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '+905551234567',
  avatar: '/customer-avatar.jpg',
  tags: [],
  notes: '',
  metadata: {},
  ...overrides,
});

// ============================================================================
// QUICK REPLY FACTORIES
// ============================================================================

export interface MockQuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
  shortcut?: string;
}

export const createMockQuickReply = (overrides?: Partial<MockQuickReply>): MockQuickReply => ({
  id: 'qr-123',
  title: 'Greeting',
  content: 'Hello! How can I help you?',
  category: 'greeting',
  shortcut: '/hello',
  ...overrides,
});

// ============================================================================
// NOTIFICATION FACTORIES
// ============================================================================

export interface MockNotification {
  id: string;
  type: 'mention' | 'assignment' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

export const createMockNotification = (overrides?: Partial<MockNotification>): MockNotification => ({
  id: 'notif-123',
  type: 'mention',
  title: 'You were mentioned',
  message: 'John mentioned you in a conversation',
  timestamp: new Date('2024-01-15T10:00:00Z'),
  read: false,
  data: {},
  ...overrides,
});

// ============================================================================
// EMERGENCY CALL FACTORIES
// ============================================================================

export interface MockEmergencyCall {
  id: string;
  customerName: string;
  customerPhone: string;
  conversationId: string;
  priority: 'critical' | 'urgent' | 'high' | 'medium' | 'low';
  timestamp: Date;
  messages: MockMessage[];
}

export const createMockEmergencyCall = (overrides?: Partial<MockEmergencyCall>): MockEmergencyCall => ({
  id: 'call-123',
  customerName: 'Emergency Customer',
  customerPhone: '+905551234567',
  conversationId: 'conv-emergency-123',
  priority: 'critical',
  timestamp: new Date('2024-01-15T10:00:00Z'),
  messages: [],
  ...overrides,
});

// ============================================================================
// REPORT/ANALYTICS FACTORIES
// ============================================================================

export interface MockReport {
  id: string;
  type: 'performance' | 'satisfaction' | 'volume';
  title: string;
  data: Record<string, unknown>;
  generatedAt: Date;
}

export const createMockReport = (overrides?: Partial<MockReport>): MockReport => ({
  id: 'report-123',
  type: 'performance',
  title: 'Agent Performance Report',
  data: {
    totalConversations: 150,
    avgResponseTime: 45,
    satisfactionScore: 4.5,
  },
  generatedAt: new Date('2024-01-15T10:00:00Z'),
  ...overrides,
});

// ============================================================================
// BATCH FACTORIES
// ============================================================================

/**
 * Create multiple mock items at once
 */
export const createMockItems = <T extends { id?: string }>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overrides?: Partial<T> | ((index: number) => Partial<T>)
): T[] => {
  return Array.from({ length: count }, (_, index) => {
    const itemOverrides = typeof overrides === 'function' 
      ? overrides(index) 
      : overrides;
    
    const baseOverrides = itemOverrides ? { ...itemOverrides } : {};
    const hasId = baseOverrides && 'id' in baseOverrides;
    const idPrefix = hasId && baseOverrides.id ? baseOverrides.id : 'item';
    
    return factory({
      ...baseOverrides,
      id: `${idPrefix}-${index}`,
    } as Partial<T>);
  });
};

/**
 * Examples:
 * 
 * const users = createMockItems(createMockUser, 5);
 * const conversations = createMockItems(createMockConversation, 10, (i) => ({ 
 *   customer: { name: `Customer ${i}` } 
 * }));
 */

