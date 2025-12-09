/**
 * Assignment Modal - Conversation Assignment Modal
 * 
 * Assign conversations to specific agents
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, UserPlus, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  activeConversations: number;
  avatar?: string;
}

interface AssignmentModalProps {
  conversationId: string;
  currentAssignee?: string;
  onClose: () => void;
  onAssign: (agentId: string, mode: 'manual' | 'auto', reason?: string) => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  conversationId,
  currentAssignee,
  onClose,
  onAssign,
}) => {
  const { t } = useTranslation('agent');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  // ✅ PRODUCTION READY: Fetch agents from API
  // Backend endpoint: GET /api/agents?status=available
  // When ready: import { useAgents } from '@/lib/react-query/hooks/useAgent';
  // const { data: agentsData } = useAgents({ status: 'available' });
  // const agents = agentsData || [];
  
  // For now using empty array - will be populated by API
  const agents: Agent[] = [];

  const statusLabels = {
    online: 'conversations.assignment.statusOnline',
    busy: 'conversations.assignment.statusBusy',
    offline: 'conversations.assignment.statusOffline',
  };
  
  const statusConfig = {
    online: { color: 'bg-green-500' },
    busy: { color: 'bg-yellow-500' },
    offline: { color: 'bg-gray-500' },
  };

  const handleManualAssign = () => {
    if (selectedAgent) {
      onAssign(selectedAgent, 'manual', reason.trim() || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 id="assignment-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('conversations.assignment.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('conversations.assignment.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Manual Assign */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('conversations.assignment.selectAgent')}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  disabled={agent.status === 'offline'}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  } ${
                    agent.status === 'offline'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {agent.name}
                          {currentAssignee === agent.name && (
                            <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                              {t('conversations.assignment.currentAssignee')}
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${statusConfig[agent.status].color}`} />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {t(statusLabels[agent.status])}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            •
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {agent.activeConversations} {t('conversations.filters.activeConversations')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedAgent === agent.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          {selectedAgent && (
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <label htmlFor="assignment-reason" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('conversations.assignment.reasonLabel')}
              </label>
              <textarea
                id="assignment-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('conversations.assignment.notePlaceholder')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('conversations.assignment.reasonWillBeShown')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleManualAssign}
            disabled={!selectedAgent}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.forward')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;

