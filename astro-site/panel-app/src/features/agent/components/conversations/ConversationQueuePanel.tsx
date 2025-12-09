 

/**
 * Conversation Queue Panel
 * 
 * Displays unassigned conversations waiting in queue
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/features/agent/utils/locale';
import { Clock, Users, AlertCircle, UserPlus, X } from 'lucide-react';
import { conversationAssignmentService } from '@/services/conversation-assignment.service';
import type { Conversation } from '@/types';
import { useAuthStore } from '@/shared/stores/auth-store';
import { showSuccess, showError } from '@/shared/utils/toast';
import { logger } from '@/shared/utils/logger';
import { ModernLoader } from '@/shared/ui/loading';

/**
 * Agent interface for queue panel
 * Represents available agents for conversation assignment
 */
interface AvailableAgent {
  id: string;
  name: string;
  activeConversations: number;
  maxConversations: number;
  status: 'available' | 'busy' | 'away';
}

interface ConversationQueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationQueuePanel: React.FC<ConversationQueuePanelProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation('agent');
  const { user } = useAuthStore();
  const [queuedConversations, setQueuedConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<AvailableAgent[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadQueuedConversations();
      loadAvailableAgents();
    }
  }, [isOpen]);

  const loadQueuedConversations = async () => {
    setIsLoading(true);
    try {
      const conversations = await conversationAssignmentService.getQueuedConversations();
      setQueuedConversations(conversations);
    } catch (error) {
      logger.error('Failed to load queued conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableAgents = async () => {
    try {
      const agents = await conversationAssignmentService.getAvailableAgents();
      // Map Agent status to AvailableAgent status
      const mappedAgents: AvailableAgent[] = agents.map(agent => ({
        ...agent,
        status: agent.status === 'online' ? 'available' : agent.status === 'offline' ? 'away' : 'busy'
      }));
      setAvailableAgents(mappedAgents);
    } catch (error) {
      logger.error('Failed to load available agents:', error);
    }
  };

  const handleTakeConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const result = await conversationAssignmentService.takeAsOwner(conversationId, user.id);
      if (result.success) {
        showSuccess(t('queue.takeOverSuccess'));
        loadQueuedConversations();
      } else {
        showError(result.message || t('queue.takeOverError'));
      }
    } catch (error) {
      showError(t('queue.takeOverError'));
    }
  };

  const handleAssignToAgent = async (conversationId: string, agentId: string) => {
    if (!user) return;

    try {
      const result = await conversationAssignmentService.manualAssign(
        conversationId,
        agentId,
        user.id
      );
      if (result.success) {
        showSuccess(t('queue.assignSuccess'));
        loadQueuedConversations();
        setSelectedConversation(null);
      } else {
        showError(result.message || t('queue.assignError'));
      }
    } catch (error) {
      showError(t('queue.assignError'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('queue.title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('queue.waitingCount', { count: queuedConversations.length })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              type="button"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Available Agents Summary */}
          {availableAgents.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t('queue.availableAgents', { count: availableAgents.length })}
                </p>
              </div>
            </div>
          )}

          {/* No Agents Warning */}
          {availableAgents.length === 0 && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    {t('queue.noAvailableAgents')}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    {t('queue.noAvailableAgentsDesc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <ModernLoader variant="spinner" size="lg" color="primary" />
            </div>
          )}

          {/* Queue List */}
          {!isLoading && queuedConversations.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">{t('queue.noQueue')}</p>
            </div>
          )}

          {!isLoading && queuedConversations.length > 0 && (
            <div className="space-y-3">
              {queuedConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-bold rounded">
                          {t('queue.position', { position: conversation.queuePosition || index + 1 })}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {conversation.customer?.profile?.email || conversation.customer?.profile?.phone || t('queue.unknownCustomer')}
                        </span>
                        <span className="px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded capitalize">
                          {conversation.channel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {conversation.messages && conversation.messages.length > 0
                          ? conversation.messages[conversation.messages.length - 1].content
                          : t('queue.noLastMessage')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('queue.waitingFor', { time: conversation.waitingSince ? formatDateTime(new Date(conversation.waitingSince), i18n.language) : t('queue.unknownTime') })}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {/* Take as Owner */}
                      <button
                        onClick={() => handleTakeConversation(conversation.id)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                        type="button"
                      >
                        <UserPlus className="w-4 h-4" />
                        {t('queue.takeOver')}
                      </button>

                      {/* Assign to Agent */}
                      {availableAgents.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSelectedConversation(
                                selectedConversation === conversation.id ? null : conversation.id
                              )
                            }
                            className="px-3 py-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
                            type="button"
                          >
                            {t('queue.assign')}
                          </button>

                          {/* Agent Dropdown */}
                          {selectedConversation === conversation.id && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
                              <div className="p-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                                  {t('queue.selectAgent')}
                                </p>
                                {availableAgents.map((agent) => (
                                  <button
                                    key={agent.id}
                                    onClick={() => handleAssignToAgent(conversation.id, agent.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-left"
                                    type="button"
                                  >
                                    <span className="text-sm text-gray-900 dark:text-white">
                                      {agent.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {agent.activeConversations}/{agent.maxConversations}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationQueuePanel;
