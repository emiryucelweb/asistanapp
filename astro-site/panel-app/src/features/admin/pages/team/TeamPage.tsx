import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  Activity,
  Award,
  Calendar,
  MessageSquare,
  Settings,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  User
} from 'lucide-react';
import { formatNumber } from '@/shared/utils/formatters';
import { FormModal, ConfirmModal } from '@/shared/ui';
import { showSuccess } from '@/shared/utils/toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar: string;
  joinDate: string;
  lastActive: string;
  performance: {
    conversationsHandled: number;
    avgResponseTime: string;
    satisfactionScore: number;
    tasksCompleted: number;
  };
  permissions: string[];
  leave: {
    annualDays: number;
    usedDays: number;
    remainingDays: number;
    currentLeaveStart?: string;
    currentLeaveEnd?: string;
  };
}

const TeamPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    department: '',
    dailyBreakMinutes: 30, // Günlük mola süresi (dakika)
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    annualLeaveDays: 20,
    usedLeaveDays: 0,
    remainingLeaveDays: 20,
    currentLeaveStart: '',
    currentLeaveEnd: '',
  });

  // API-ready: Fetch team members from backend
  const teamMembers: TeamMember[] = [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'agent': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-blue-100 text-blue-700';
      case 'agent': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return t('team.roles.owner');
      case 'admin': return t('team.roles.admin');
      case 'agent': return t('team.roles.agent');
      case 'viewer': return t('team.roles.viewer');
      default: return role;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'on_leave': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return t('team.status.active');
      case 'inactive': return t('team.status.inactive');
      case 'on_leave': return t('team.status.onLeave');
      default: return status;
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const teamStats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    onLeave: teamMembers.filter(m => m.status === 'on_leave').length,
    avgSatisfaction: (teamMembers.reduce((acc, m) => acc + m.performance.satisfactionScore, 0) / teamMembers.length).toFixed(1)
  };

  return (
    <div className="flex flex-col max-w-[1600px] mx-auto px-8 py-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            {t('team.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('team.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          {t('team.addMember.title')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('team.stats.totalTeam')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{teamStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('team.stats.activeMembers')}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{teamStats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('team.stats.onLeave')}</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{teamStats.onLeave}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('team.stats.avgSatisfaction')}</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{teamStats.avgSatisfaction}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('team.search')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">{t('team.filters.allRoles')}</option>
            <option value="owner">{t('team.roles.owner')}</option>
            <option value="admin">{t('team.roles.admin')}</option>
            <option value="agent">{t('team.roles.agent')}</option>
            <option value="viewer">{t('team.roles.viewer')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">{t('team.filters.allStatuses')}</option>
            <option value="active">{t('team.status.active')}</option>
            <option value="inactive">{t('team.status.inactive')}</option>
            <option value="on_leave">{t('team.status.onLeave')}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${( viewMode === 'grid' ) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
            >
              {t('team.viewModes.grid')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${( viewMode === 'list' ) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
            >
              {t('team.viewModes.list')}
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.department}</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={t('team.moreOptions')}
                  >
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                  
                  {/* Dropdown Menu */}
                  {selectedMember?.id === member.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setSelectedMember(null)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setShowEditModal(true);
                            setSelectedMember(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                          <span>{t('team.actions.edit')}</span>
                        </button>
                        
                        {/* Acil İzin Butonu */}
                        <button
                          onClick={() => {
                            const newStatus = member.status === 'on_leave' ? 'active' : 'on_leave';
                            showSuccess(
                              member.status === 'on_leave' 
                                ? t('team.messages.memberActivated', { name: member.name })
                                : t('team.messages.memberMarkedLeave', { name: member.name })
                            );
                            setSelectedMember(null);
                            // TODO: Update member status in backend
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 border-t border-gray-200 dark:border-slate-700 ${
                            member.status === 'on_leave'
                              ? 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {member.status === 'on_leave' ? t('team.actions.endLeave') : t('team.actions.markEmergencyLeave')}
                            </span>
                            <span className="text-xs opacity-75">
                              {member.status === 'on_leave' ? t('team.actions.makeActive') : t('team.actions.quickLeave')}
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setDeleteConfirmMember(member);
                            setSelectedMember(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-slate-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{t('team.actions.delete')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(member.role)}`}>
                  {getRoleIcon(member.role)}
                  {getRoleLabel(member.role)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                  {getStatusLabel(member.status)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {member.lastActive}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('team.gridLabels.conversations')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatNumber(member.performance.conversationsHandled)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('team.gridLabels.satisfaction')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{member.performance.satisfactionScore}/5</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('team.gridLabels.avgResponse')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{member.performance.avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('team.gridLabels.tasks')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatNumber(member.performance.tasksCompleted)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {t('team.gridLabels.details')}
                </button>
                <button 
                  onClick={() => {
                    setEditingMember(member);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.member')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.performance')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.lastActivity')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('team.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getRoleBadgeColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{formatNumber(member.performance.conversationsHandled)} {t('team.performance.conversations')}</p>
                        <p className="text-gray-600 dark:text-gray-400">{member.performance.satisfactionScore}/5 ⭐</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.lastActive}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        {t('team.gridLabels.details')}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingMember(member);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmMember(member)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('team.addMember.title')}</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Kişisel Bilgiler */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('team.addMember.personalInfo')}
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('team.addMember.name')}</label>
                  <input
                    type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder={t('team.placeholders.name')}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('team.addMember.email')}</label>
                  <input
                    type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder={t('team.placeholders.email')}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('team.addMember.phone')}</label>
                  <input
                    type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder={t('team.placeholders.phone')}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('team.addMember.department')}</label>
                    <input
                      type="text"
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      placeholder={t('team.placeholders.department')}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('team.addMember.roleAndPermissions')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('team.addMember.role')}</label>
                    <select 
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                    >
                    <option value="agent">{t('team.roles.agent')}</option>
                    <option value="admin">{t('team.roles.admin')}</option>
                    <option value="viewer">{t('team.roles.viewer')}</option>
                  </select>
                </div>
                </div>
              </div>

              {/* Günlük Mola Süresi */}
                <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('team.addMemberModal.dailyBreakRight')}
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('team.addMemberModal.dailyBreakMinutes')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={newMember.dailyBreakMinutes}
                    onChange={(e) => setNewMember({ ...newMember, dailyBreakMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="30"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('team.addMemberModal.dailyBreakDesc')}
                  </p>
                </div>
              </div>

              {/* Haftalık Çalışma Programı */}
                <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('team.addMemberModal.weeklySchedule')}
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
                    {t('team.addMemberModal.weeklyScheduleDesc')}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'monday', label: t('team.addMemberModal.workingDays.monday'), short: t('team.addMemberModal.workingDaysShort.mon') },
                      { key: 'tuesday', label: t('team.addMemberModal.workingDays.tuesday'), short: t('team.addMemberModal.workingDaysShort.tue') },
                      { key: 'wednesday', label: t('team.addMemberModal.workingDays.wednesday'), short: t('team.addMemberModal.workingDaysShort.wed') },
                      { key: 'thursday', label: t('team.addMemberModal.workingDays.thursday'), short: t('team.addMemberModal.workingDaysShort.thu') },
                      { key: 'friday', label: t('team.addMemberModal.workingDays.friday'), short: t('team.addMemberModal.workingDaysShort.fri') },
                      { key: 'saturday', label: t('team.addMemberModal.workingDays.saturday'), short: t('team.addMemberModal.workingDaysShort.sat') },
                      { key: 'sunday', label: t('team.addMemberModal.workingDays.sunday'), short: t('team.addMemberModal.workingDaysShort.sun') },
                    ].map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setNewMember({
                          ...newMember,
                          workingDays: {
                            ...newMember.workingDays,
                            [day.key]: !newMember.workingDays[day.key as keyof typeof newMember.workingDays]
                          }
                        })}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                          newMember.workingDays[day.key as keyof typeof newMember.workingDays]
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="hidden md:inline">{day.label}</span>
                          <span className="md:hidden">{day.short}</span>
                          <span className="text-xs">
                            {newMember.workingDays[day.key as keyof typeof newMember.workingDays] 
                              ? t('team.addMemberModal.working')
                              : t('team.addMemberModal.dayOff')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                      {t('team.addMemberModal.workingDay')}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded">
                      {t('team.addMemberModal.weekendDayOff')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yıllık İzin Hakları */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('team.addMemberModal.annualLeaveRights')}
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{t('team.addMemberModal.optional')}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.addMemberModal.annualLeaveDays')}
                    </label>
                  <input
                      type="number"
                      min="0"
                      max="365"
                      value={newMember.annualLeaveDays}
                      onChange={(e) => {
                        const annual = parseInt(e.target.value) || 0;
                        setNewMember({ 
                          ...newMember, 
                          annualLeaveDays: annual,
                          remainingLeaveDays: annual - newMember.usedLeaveDays
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                      placeholder="20"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('team.addMemberModal.defaultDays')}
                    </p>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.addMemberModal.usedLeaveDays')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={newMember.annualLeaveDays}
                      value={newMember.usedLeaveDays}
                      onChange={(e) => {
                        const used = parseInt(e.target.value) || 0;
                        setNewMember({ 
                          ...newMember, 
                          usedLeaveDays: used,
                          remainingLeaveDays: newMember.annualLeaveDays - used
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('team.addMemberModal.previouslyUsed')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.addMemberModal.remainingLeaveDays')}
                    </label>
                    <div className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-semibold flex items-center justify-between">
                      <span>{newMember.remainingLeaveDays}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        newMember.remainingLeaveDays > 10 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : newMember.remainingLeaveDays > 5
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {newMember.remainingLeaveDays > 10 ? t('team.addMemberModal.sufficient') : newMember.remainingLeaveDays > 5 ? t('team.addMemberModal.medium') : t('team.addMemberModal.low')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('team.addMemberModal.autoCalculated')}
                    </p>
                  </div>
                </div>
                
                {/* İzin Tarihleri */}
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('team.addMemberModal.currentLeaveDates')}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('team.addMemberModal.leaveStartDate')}
                      </label>
                      <input
                        type="date"
                        value={newMember.currentLeaveStart}
                        onChange={(e) => setNewMember({ ...newMember, currentLeaveStart: e.target.value })}
                        className="w-full px-4 py-2.5 border border-yellow-300 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('team.addMemberModal.leaveEndDate')}
                      </label>
                      <input
                        type="date"
                        value={newMember.currentLeaveEnd}
                        onChange={(e) => setNewMember({ ...newMember, currentLeaveEnd: e.target.value })}
                        min={newMember.currentLeaveStart}
                        className="w-full px-4 py-2.5 border border-yellow-300 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 flex items-start gap-1">
                    <span>💡</span>
                    <span>{t('team.addMemberModal.leaveDatesHint')}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setNewMember({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'agent',
                    department: '',
                    dailyBreakMinutes: 30,
                    workingDays: {
                      monday: true,
                      tuesday: true,
                      wednesday: true,
                      thursday: true,
                      friday: true,
                      saturday: false,
                      sunday: false,
                    },
                    annualLeaveDays: 20,
                    usedLeaveDays: 0,
                    remainingLeaveDays: 20,
                    currentLeaveStart: '',
                    currentLeaveEnd: '',
                  });
                }}
                className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors font-medium"
              >
                {t('team.actions.cancel')}
              </button>
              <button
                onClick={() => {
                  showSuccess(t('team.messages.memberAdded', { 
                    name: newMember.name || t('team.newMember'), 
                    leave: newMember.annualLeaveDays, 
                    break: newMember.dailyBreakMinutes 
                  }));
                  setShowAddMember(false);
                  setNewMember({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'agent',
                    department: '',
                    dailyBreakMinutes: 30,
                    workingDays: {
                      monday: true,
                      tuesday: true,
                      wednesday: true,
                      thursday: true,
                      friday: true,
                      saturday: false,
                      sunday: false,
                    },
                    annualLeaveDays: 20,
                    usedLeaveDays: 0,
                    remainingLeaveDays: 20,
                    currentLeaveStart: '',
                    currentLeaveEnd: '',
                  });
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('team.actions.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedMember.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMember.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('team.detailModal.role')}</p>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedMember.role)}
                    <p className="font-medium text-gray-900 dark:text-gray-100">{getRoleLabel(selectedMember.role)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('team.detailModal.status')}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{getStatusLabel(selectedMember.status)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('team.detailModal.department')}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedMember.department}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('team.detailModal.joinDate')}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedMember.joinDate}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {t('team.performance.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600 mb-1">{t('team.performance.conversations')}</p>
                    <p className="text-2xl font-bold text-blue-700">{formatNumber(selectedMember.performance.conversationsHandled)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-600 mb-1">{t('team.performance.satisfaction')}</p>
                    <p className="text-2xl font-bold text-green-700">{selectedMember.performance.satisfactionScore}/5</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-purple-600 mb-1">{t('team.performance.avgResponse')}</p>
                    <p className="text-2xl font-bold text-purple-700">{selectedMember.performance.avgResponseTime}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-orange-600 mb-1">{t('team.performance.tasks')}</p>
                    <p className="text-2xl font-bold text-orange-700">{formatNumber(selectedMember.performance.tasksCompleted)}</p>
                  </div>
                </div>
              </div>

              {/* Leave Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {t('team.leave.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{t('team.leave.annualDays')}</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedMember.leave.annualDays} {t('team.leave.days')}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">{t('team.leave.usedDays')}</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{selectedMember.leave.usedDays} {t('team.leave.days')}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">{t('team.leave.remainingDays')}</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{selectedMember.leave.remainingDays} {t('team.leave.days')}</p>
                  </div>
                </div>
                
                {selectedMember.leave.currentLeaveStart && selectedMember.leave.currentLeaveEnd && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                      🏖️ {t('team.leave.currentlyOnLeave')}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-yellow-700 dark:text-yellow-400">
                      <div>
                        <span className="font-medium">{t('team.leave.startDate')}:</span> {selectedMember.leave.currentLeaveStart}
                      </div>
                      <div>
                        <span className="font-medium">{t('team.leave.endDate')}:</span> {selectedMember.leave.currentLeaveEnd}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {t('team.permissions.title')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors font-medium"
              >
                {t('team.detailModal.close')}
              </button>
              <button 
                onClick={() => {
                  setEditingMember(selectedMember);
                  setShowEditModal(true);
                  setSelectedMember(null);
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {t('team.actions.edit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      <FormModal
        isOpen={showEditModal && !!editingMember}
        onClose={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                }}
        onSubmit={() => {
          setIsSubmitting(true);
          logger.debug('Updating member:', { member: editingMember });
          
          // Simulate API call
          setTimeout(() => {
            showSuccess(t('team.messages.memberUpdated', { name: editingMember?.name }));
            setIsSubmitting(false);
            setShowEditModal(false);
            setEditingMember(null);
          }, 1000);
        }}
        title={t('team.modals.editMember')}
        submitText={t('team.actions.saveChanges')}
        cancelText={t('team.actions.cancel')}
        isLoading={isSubmitting}
        size="lg"
      >
        {editingMember && (
          <div className="space-y-6">
              {/* Kişisel Bilgiler */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('team.editMemberModal.personalInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.fullName')}
                    </label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={editingMember.phone}
                        onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.department')}
                    </label>
                    <input
                      type="text"
                      value={editingMember.department}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Rol ve Durum */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('team.editMemberModal.roleAndStatus')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.role')}
                    </label>
                    <select
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="owner">{t('team.roles.owner')}</option>
                      <option value="admin">{t('team.roles.admin')}</option>
                      <option value="agent">{t('team.roles.agent')}</option>
                      <option value="viewer">{t('team.roles.viewer')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('team.editMemberModal.status')}
                    </label>
                    <select
                      value={editingMember.status}
                      onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">{t('team.editMemberModal.statusOptions.active')}</option>
                      <option value="inactive">{t('team.editMemberModal.statusOptions.inactive')}</option>
                      <option value="on_leave">{t('team.editMemberModal.statusOptions.onLeave')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bilgilendirme */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {t('team.editMemberModal.changeNotification')}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      {t('team.editMemberModal.changeNotificationDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmMember}
        onClose={() => setDeleteConfirmMember(null)}
        onConfirm={() => {
          setIsSubmitting(true);
          logger.debug('Deleting team member:', { member: deleteConfirmMember });
          
          // Simulate API call
          setTimeout(() => {
            alert(t('team.messages.memberRemoved', { name: deleteConfirmMember?.name }));
            setIsSubmitting(false);
            setDeleteConfirmMember(null);
          }, 1000);
        }}
        title={t('team.modals.removeMember')}
        message={t('team.messages.confirmDelete', { name: deleteConfirmMember?.name })}
        confirmText={t('team.actions.remove')}
        cancelText={t('team.actions.cancel')}
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TeamPage;

