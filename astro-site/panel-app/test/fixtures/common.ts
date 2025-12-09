/**
 * Common Test Fixtures
 * 
 * Predefined test data used across multiple tests
 * Realistic data for consistent testing
 */

import { 
  createMockUser, 
  createMockConversation, 
  createMockMessage,
  createMockCustomer,
  createMockQuickReply,
  createMockNotification,
} from '../utils/test-factories';

// ============================================================================
// USERS
// ============================================================================

export const AGENT_USER = createMockUser({
  id: 'agent-1',
  name: 'Agent John',
  email: 'john@company.com',
  role: 'agent',
  status: 'online',
});

export const ADMIN_USER = createMockUser({
  id: 'admin-1',
  name: 'Admin Sarah',
  email: 'sarah@company.com',
  role: 'admin',
  status: 'online',
});

export const OWNER_USER = createMockUser({
  id: 'owner-1',
  name: 'Owner Mike',
  email: 'mike@company.com',
  role: 'owner',
  status: 'online',
});

// ============================================================================
// CUSTOMERS
// ============================================================================

export const CUSTOMER_1 = createMockCustomer({
  id: 'cust-1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '+905551234567',
  tags: ['vip', 'premium'],
});

export const CUSTOMER_2 = createMockCustomer({
  id: 'cust-2',
  name: 'Bob Smith',
  email: 'bob@example.com',
  phone: '+905557654321',
  tags: [],
});

export const CUSTOMER_VIP = createMockCustomer({
  id: 'cust-vip',
  name: 'VIP Customer',
  email: 'vip@example.com',
  phone: '+905559876543',
  tags: ['vip', 'high-value', 'priority'],
  notes: 'Very important customer',
});

// ============================================================================
// CONVERSATIONS
// ============================================================================

export const CONVERSATION_WAITING = createMockConversation({
  id: 'conv-waiting-1',
  status: 'waiting',
  customer: CUSTOMER_1,
  unreadCount: 3,
  priority: 'high',
});

export const CONVERSATION_ASSIGNED = createMockConversation({
  id: 'conv-assigned-1',
  status: 'assigned',
  customer: CUSTOMER_2,
  assignedTo: AGENT_USER.id,
  unreadCount: 1,
  priority: 'normal',
});

export const CONVERSATION_RESOLVED = createMockConversation({
  id: 'conv-resolved-1',
  status: 'resolved',
  customer: CUSTOMER_1,
  assignedTo: AGENT_USER.id,
  unreadCount: 0,
  priority: 'low',
});

export const CONVERSATION_WHATSAPP = createMockConversation({
  id: 'conv-wa-1',
  channel: 'whatsapp',
  customer: CUSTOMER_1,
  status: 'waiting',
});

export const CONVERSATION_INSTAGRAM = createMockConversation({
  id: 'conv-ig-1',
  channel: 'instagram',
  customer: CUSTOMER_2,
  status: 'assigned',
  assignedTo: AGENT_USER.id,
});

// ============================================================================
// MESSAGES
// ============================================================================

export const MESSAGE_FROM_CUSTOMER = createMockMessage({
  id: 'msg-1',
  content: 'Hello, I need help with my order',
  sender: 'customer',
  senderName: CUSTOMER_1.name,
  conversationId: CONVERSATION_WAITING.id,
});

export const MESSAGE_FROM_AGENT = createMockMessage({
  id: 'msg-2',
  content: 'Hello! I would be happy to help. Can you provide your order number?',
  sender: 'agent',
  senderName: AGENT_USER.name,
  conversationId: CONVERSATION_ASSIGNED.id,
});

export const MESSAGE_FROM_AI = createMockMessage({
  id: 'msg-3',
  content: 'I understand you need help with your order. Let me transfer you to an agent.',
  sender: 'ai',
  senderName: 'AI Assistant',
  conversationId: CONVERSATION_WAITING.id,
});

// ============================================================================
// QUICK REPLIES
// ============================================================================

export const QUICK_REPLY_GREETING = createMockQuickReply({
  id: 'qr-1',
  title: 'Greeting',
  content: 'Hello! How can I help you today?',
  category: 'greeting',
  shortcut: '/hello',
});

export const QUICK_REPLY_ORDER = createMockQuickReply({
  id: 'qr-2',
  title: 'Order Status',
  content: 'Your order is being processed. Expected delivery: 2-3 business days.',
  category: 'order',
  shortcut: '/order-status',
});

export const QUICK_REPLY_RETURN = createMockQuickReply({
  id: 'qr-3',
  title: 'Return Policy',
  content: 'You can return items within 30 days. Would you like to start a return?',
  category: 'return',
  shortcut: '/return',
});

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const NOTIFICATION_MENTION = createMockNotification({
  id: 'notif-1',
  type: 'mention',
  title: 'You were mentioned',
  message: 'John mentioned you in conversation #1234',
  read: false,
});

export const NOTIFICATION_ASSIGNMENT = createMockNotification({
  id: 'notif-2',
  type: 'assignment',
  title: 'New assignment',
  message: 'You were assigned to conversation #5678',
  read: false,
});

export const NOTIFICATION_SYSTEM = createMockNotification({
  id: 'notif-3',
  type: 'system',
  title: 'System maintenance',
  message: 'Scheduled maintenance tonight at 2 AM',
  read: true,
});

// ============================================================================
// LISTS/ARRAYS
// ============================================================================

export const MOCK_CONVERSATIONS = [
  CONVERSATION_WAITING,
  CONVERSATION_ASSIGNED,
  CONVERSATION_RESOLVED,
];

export const MOCK_MESSAGES = [
  MESSAGE_FROM_CUSTOMER,
  MESSAGE_FROM_AGENT,
  MESSAGE_FROM_AI,
];

export const MOCK_QUICK_REPLIES = [
  QUICK_REPLY_GREETING,
  QUICK_REPLY_ORDER,
  QUICK_REPLY_RETURN,
];

export const MOCK_NOTIFICATIONS = [
  NOTIFICATION_MENTION,
  NOTIFICATION_ASSIGNMENT,
  NOTIFICATION_SYSTEM,
];

// ============================================================================
// CONSTANTS
// ============================================================================

export const TEST_DATES = {
  PAST: new Date('2024-01-01T00:00:00Z'),
  RECENT: new Date('2024-01-14T00:00:00Z'),
  NOW: new Date('2024-01-15T10:00:00Z'),
  FUTURE: new Date('2024-12-31T23:59:59Z'),
};

export const TEST_FILE_TYPES = {
  PDF: 'application/pdf',
  IMAGE_PNG: 'image/png',
  IMAGE_JPG: 'image/jpeg',
  VIDEO_MP4: 'video/mp4',
  DOC: 'application/msword',
};

export const TEST_PHONE_NUMBERS = {
  VALID_TR: '+905551234567',
  VALID_US: '+15551234567',
  VALID_UK: '+441234567890',
  INVALID: '12345',
};

export const TEST_EMAILS = {
  VALID: 'test@example.com',
  VALID_WITH_PLUS: 'test+tag@example.com',
  INVALID: 'notanemail',
};

