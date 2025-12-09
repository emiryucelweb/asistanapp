/**
 * Mock Factories - Re-export from src/test/utils/mock-factories
 * 
 * ENTERPRISE GRADE: Single source of truth for mock data
 * All factories use the correct types from @/features/agent/types
 */

export {
  // ID Generators
  createUserId,
  createCustomerId,
  createAgentId,
  createConversationId,
  createMessageId,
  createISOTimestamp,
  
  // Conversation Factories
  createMockConversation,
  createMockConversations,
  
  // Message Factories
  createMockMessage,
  createMockMessages,
  
  // Agent/Customer Factories
  createMockAgentProfile,
  createMockCustomer,
} from '../../src/test/utils/mock-factories';

// Re-export types from agent/types for convenience
export type {
  Conversation,
  Message,
  ConversationId,
  MessageId,
  UserId,
  CustomerId,
  AgentId,
  ISOTimestamp,
} from '../../src/features/agent/types';
