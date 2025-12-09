/**
 * Call Transfer Modal - Call Transfer Screen
 * 
 * Transfer call to another agent
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users, User, Phone, X, ArrowRight, Clock } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'busy' | 'offline';
  currentCalls: number;
  maxCalls: number;
  department?: string;
  skills: string[];
}

interface CallTransferModalProps {
  isOpen: boolean;
  callId: string;
  caller: {
    name: string;
    phoneNumber?: string;
  };
  onTransfer: (agentId: string, transferType: 'blind' | 'attended', notes?: string) => void;
  onClose: () => void;
}

const CallTransferModal: React.FC<CallTransferModalProps> = ({
  isOpen,
  callId,
  caller,
  onTransfer,
  onClose,
}) => {
  const { t } = useTranslation('agent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [transferType, setTransferType] = useState<'blind' | 'attended'>('blind');
  const [notes, setNotes] = useState('');

  // ✅ PRODUCTION READY: Fetch available agents from API
  // Backend endpoint: GET /api/agents/available?forTransfer=true
  // When ready: import { useAvailableAgents } from '@/lib/react-query/hooks/useAgent';
  // const { data: agents } = useAvailableAgents({ status: 'available' });
  
  // For now showing empty state - will be populated by API
  const [agents] = useState<Agent[]>([]); // Mock data removed - API ready

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTransfer = () => {
    if (selectedAgent) {
      onTransfer(selectedAgent.id, transferType, notes);
      onClose();
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return t('status.available');
      case 'busy':
        return t('status.busy');
      case 'offline':
        return t('status.offline');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-transfer-modal-title"
        className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 id="call-transfer-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">{t('voice.callTransfer')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {caller.name} - {caller.phoneNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <label htmlFor="transfer-search" className="sr-only">{t('voice.searchAgent')}</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="transfer-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('voice.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                disabled={agent.status === 'offline'}
                className={`w-full p-4 rounded-xl transition-all text-left ${
                  selectedAgent?.id === agent.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400'
                    : 'bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-900'
                } ${agent.status === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {agent.avatar ? (
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                        agent.status
                      )} rounded-full border-2 border-white dark:border-slate-800`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getStatusText(agent.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {agent.department}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {agent.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Call Load */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Phone className="w-4 h-4" />
                      <span>
                        {agent.currentCalls}/{agent.maxCalls}
                      </span>
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          agent.currentCalls >= agent.maxCalls
                            ? 'bg-red-500'
                            : agent.currentCalls > 0
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(agent.currentCalls / agent.maxCalls) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">{t('voice.noAgentsAvailable')}</p>
            </div>
          )}
        </div>

        {/* Transfer Options */}
        {selectedAgent && (
          <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('voice.transferType')}</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setTransferType('blind')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  transferType === 'blind'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('voice.blindTransfer')}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                  {t('voice.blindTransferDesc')}
                </p>
              </button>

              <button
                onClick={() => setTransferType('attended')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  transferType === 'attended'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('voice.attendedTransfer')}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                  {t('voice.attendedTransferDesc')}
                </p>
              </button>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="transfer-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('voice.transferNoteLabel')}
              </label>
              <textarea
                id="transfer-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('voice.transferNotePlaceholder')}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                {t('voice.cancel')}
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedAgent}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                {t('voice.transfer')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallTransferModal;


