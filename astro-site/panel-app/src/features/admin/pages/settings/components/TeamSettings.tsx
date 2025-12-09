import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Users, UserPlus, Shield, Mail, Trash2, Edit2, X } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const TeamSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  logger.debug('🔥 TeamSettings CURRENT VERSION - Edit Modal active!');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Admin User', email: 'admin@asistanapp.com', role: 'owner', status: 'active', lastLogin: t('settings.team.sampleData.lastLogin2min') },
    { id: 2, name: t('settings.team.sampleData.drName'), email: 'ayse@asistanapp.com', role: 'manager', status: 'active', lastLogin: t('settings.team.sampleData.lastLogin1h') },
    { id: 3, name: t('settings.team.sampleData.receptionistName'), email: 'elif@asistanapp.com', role: 'agent', status: 'active', lastLogin: t('settings.team.sampleData.lastLogin5min') }
  ]);

  const [newMember, setNewMember] = useState({ email: '', role: 'agent' });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showRolePermissionsModal, setShowRolePermissionsModal] = useState(false);

  const roles = [
    { value: 'owner', label: t('settings.team.roles.owner.label'), description: t('settings.team.roles.owner.description') },
    { value: 'admin', label: t('settings.team.roles.admin.label'), description: t('settings.team.roles.admin.description') },
    { value: 'manager', label: t('settings.team.roles.manager.label'), description: t('settings.team.roles.manager.description') },
    { value: 'agent', label: t('settings.team.roles.agent.label'), description: t('settings.team.roles.agent.description') },
    { value: 'readonly', label: t('settings.team.roles.readonly.label'), description: t('settings.team.roles.readonly.description') }
  ];

  const handleInvite = () => {
    if (newMember.email) {
      alert(t('settings.team.messages.inviteSent', { email: newMember.email }));
      setNewMember({ email: '', role: 'agent' });
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({...member});
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      setTeamMembers(teamMembers.map(m => 
        m.id === editingMember.id ? editingMember : m
      ));
      setShowEditModal(false);
      setEditingMember(null);
    }
  };

  const handleRemove = (id: number) => {
    if (confirm(t('settings.team.messages.confirmRemove'))) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      alert(t('settings.team.messages.userRemoved'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.team.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('settings.team.subtitle')}</p>
      </div>

      {/* Invite New Member */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <UserPlus className="w-5 h-5 inline mr-2 text-blue-500" />
          {t('settings.team.inviteNewMember')}
        </h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            placeholder="email@example.com"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          />
          <select
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <button
            onClick={handleInvite}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {t('settings.team.sendInvite')}
          </button>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Users className="w-5 h-5 inline mr-2" />
          {t('settings.team.teamMembers')} ({teamMembers.length})
        </h3>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Shield className="w-3 h-3" />
                    {roles.find(r => r.value === member.role)?.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{t('settings.team.lastLogin')}: {member.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={t('settings.team.edit')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title={t('settings.team.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.team.rolePermissions')}</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.value} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{role.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingRole(role.value);
                    setShowRolePermissionsModal(true);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t('settings.team.editRole')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('settings.team.editMember')}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="team-member-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.team.labels.name')}
                </label>
                <input
                  id="team-member-name"
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="team-member-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.team.labels.email')}
                </label>
                <input
                  id="team-member-email"
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="team-member-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.team.labels.role')}
                </label>
                <select
                  id="team-member-role"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  disabled={editingMember.role === 'owner'}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="team-member-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.team.labels.status')}
                </label>
                <select
                  id="team-member-status"
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({...editingMember, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="active">{t('settings.team.status.active')}</option>
                  <option value="inactive">{t('settings.team.status.inactive')}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('settings.team.cancel')}
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('settings.team.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Modal */}
      {showRolePermissionsModal && editingRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {roles.find(r => r.value === editingRole)?.label} {t('settings.team.permissionsModal.title')}
              </h3>
              <button
                onClick={() => {
                  setShowRolePermissionsModal(false);
                  setEditingRole(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Dashboard İzinleri */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.team.permissionsModal.sections.dashboard')}</h4>
                <div className="space-y-2">
                  <label htmlFor="perm-dashboard-view" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.dashboardView')}</span>
                    <input id="perm-dashboard-view" type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.dashboardView')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.dashboardViewDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-reports-view" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.reportsView')}</span>
                    <input id="perm-reports-view" type="checkbox" defaultChecked={editingRole !== 'readonly'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.reportsView')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.reportsViewDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-reports-export" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.reportsExport')}</span>
                    <input id="perm-reports-export" type="checkbox" defaultChecked={editingRole === 'owner' || editingRole === 'admin'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.reportsExport')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.reportsExportDesc')}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Konuşma İzinleri */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.team.permissionsModal.sections.conversations')}</h4>
                <div className="space-y-2">
                  <label htmlFor="perm-conversations-view" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.conversationsView')}</span>
                    <input id="perm-conversations-view" type="checkbox" defaultChecked={editingRole !== 'readonly'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.conversationsView')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.conversationsViewDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-send-message" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.sendMessage')}</span>
                    <input id="perm-send-message" type="checkbox" defaultChecked={editingRole !== 'readonly'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.sendMessage')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.sendMessageDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-assign-conversation" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.assignConversation')}</span>
                    <input id="perm-assign-conversation" type="checkbox" defaultChecked={editingRole === 'owner' || editingRole === 'admin' || editingRole === 'manager'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.assignConversation')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.assignConversationDesc')}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ekip İzinleri */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.team.permissionsModal.sections.teamManagement')}</h4>
                <div className="space-y-2">
                  <label htmlFor="perm-add-team-member" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.addTeamMember')}</span>
                    <input id="perm-add-team-member" type="checkbox" defaultChecked={editingRole === 'owner' || editingRole === 'admin'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.addTeamMember')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.addTeamMemberDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-edit-team-member" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.editTeamMember')}</span>
                    <input id="perm-edit-team-member" type="checkbox" defaultChecked={editingRole === 'owner' || editingRole === 'admin'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.editTeamMember')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.editTeamMemberDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-edit-role-permissions" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.editRolePermissions')}</span>
                    <input id="perm-edit-role-permissions" type="checkbox" defaultChecked={editingRole === 'owner'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.editRolePermissions')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.editRolePermissionsDesc')}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ayarlar İzinleri */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.team.permissionsModal.sections.settingsConfig')}</h4>
                <div className="space-y-2">
                  <label htmlFor="perm-assistant-settings" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.assistantSettings')}</span>
                    <input id="perm-assistant-settings" type="checkbox" defaultChecked={editingRole === 'owner' || editingRole === 'admin'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.assistantSettings')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.assistantSettingsDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-billing-payment" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.billingPayment')}</span>
                    <input id="perm-billing-payment" type="checkbox" defaultChecked={editingRole === 'owner'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.billingPayment')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.billingPaymentDesc')}</p>
                    </div>
                  </label>
                  <label htmlFor="perm-api-integrations" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                    <span className="sr-only">{t('settings.team.permissionsModal.permissions.apiIntegrations')}</span>
                    <input id="perm-api-integrations" type="checkbox" defaultChecked={editingRole === 'owner'} className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.team.permissionsModal.permissions.apiIntegrations')}</p>
                      <p className="text-xs text-gray-500">{t('settings.team.permissionsModal.permissions.apiIntegrationsDesc')}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
              <button
                onClick={() => {
                  setShowRolePermissionsModal(false);
                  setEditingRole(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('settings.team.cancel')}
              </button>
              <button
                onClick={() => {
                  alert(t('settings.team.messages.permissionsSaved'));
                  setShowRolePermissionsModal(false);
                  setEditingRole(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('settings.team.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSettings;



