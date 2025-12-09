/**
 * Conversation Hooks - Centralized Export
 * 
 * Enterprise Pattern: Barrel Export
 * 
 * All business logic hooks for AgentConversations page:
 * - useConversationActions → Takeover, send, resolve, copy actions
 * - useConversationDraft → Draft message auto-save/load
 * - useConversationKeyboard → Comprehensive keyboard shortcuts
 * 
 * Benefits:
 * - Single import point for all conversation hooks
 * - Clean separation of concerns
 * - Easy to test and maintain
 * - Reusable across different pages
 */

export { useConversationActions } from './useConversationActions';
export { useConversationDraft } from './useConversationDraft';
export { useConversationKeyboard } from './useConversationKeyboard';

