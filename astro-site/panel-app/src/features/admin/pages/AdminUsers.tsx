/**
 * Super Admin Users Page - Kullanıcı Yönetimi
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  X,
  Building2,
  User,
  Calendar,
} from 'lucide-react';
import { FormModal, ConfirmModal } from '@/shared/ui';
import { showSuccess, showError } from '@/shared/utils/toast';

const AdminUsers: React.FC = () => {
  const { t } = useTranslation('admin');
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@acme.com',
      phone: '+90 555 123 4567',
      tenant: 'Acme E-commerce',
      role: 'owner',
      status: 'active',
      lastLogin: t('system.mockData.time.2hours'),
      avatar: null,
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      email: 'ayse@techstart.io',
      phone: '+90 555 234 5678',
      tenant: 'TechStart SaaS',
      role: 'admin',
      status: 'active',
      lastLogin: t('system.mockData.time.1day'),
      avatar: null,
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      email: 'mehmet@fashion.com',
      phone: '+90 555 345 6789',
      tenant: 'Fashion Boutique',
      role: 'manager',
      status: 'inactive',
      lastLogin: t('system.mockData.time.1day') || '5 days ago',
      avatar: null,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    tenant: '',
    role: 'agent',
    password: '',
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
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle user status
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Update local state immediately for better UX
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));

      // TODO: Call API to update user status
      // await superAdminUsersApi.toggleUserStatus(userId, newStatus);
      
      const user = users.find(u => u.id === userId);
      showSuccess(t('users.messages.statusChanged', { 
        name: user?.name, 
        status: newStatus === 'active' ? t('users.status.active') : t('users.status.inactive') 
      }));
      logger.info('[AdminUsers] User status toggled', { userId, newStatus });
      
      setShowActionsMenu(null);
    } catch (error) {
      // Revert on error
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: currentStatus } : u
      ));
      showError(t('users.messages.statusChangeFailed'));
      logger.error('[AdminUsers] Toggle status failed', { error });
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      manager: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      agent: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    const labels = {
      owner: t('users.roles.owner'),
      admin: t('users.roles.admin'),
      manager: t('users.roles.manager'),
      agent: t('users.roles.agent'),
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('users.pageTitle')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('users.pageSubtitle')}
          </p>
        </div>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>{t('users.addNewUser')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.stats.totalUsers')}</p>
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.stats.active')}</p>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">142</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.stats.inactive')}</p>
            <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">14</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.stats.admins')}</p>
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('users.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>{t('users.filter')}</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="admin-users-status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.filterLabels.status')}
                </label>
                <select
                  id="admin-users-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('users.filterOptions.all')}</option>
                  <option value="active">{t('users.filterOptions.active')}</option>
                  <option value="inactive">{t('users.filterOptions.inactive')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="admin-users-role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.filterLabels.role')}
                </label>
                <select
                  id="admin-users-role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('users.filterOptions.all')}</option>
                  <option value="owner">{t('users.roles.owner')}</option>
                  <option value="admin">{t('users.roles.admin')}</option>
                  <option value="manager">{t('users.roles.manager')}</option>
                  <option value="agent">{t('users.roles.agent')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.tenant')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.lastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('users.tableHeaders.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {user.tenant}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {user.status === 'active' ? t('users.status.active') : t('users.status.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.lastLogin}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        title={t('users.edit')}
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          title={t('users.moreActions')}
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        {/* Actions Dropdown */}
                        {showActionsMenu === user.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20">
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.status)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                              >
                                {user.status === 'active' ? (
                                  <>
                                    <Ban className="w-4 h-4 text-orange-600" />
                                    <span>{t('users.actions.deactivate')}</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>{t('users.actions.activate')}</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmUser(user);
                                  setShowActionsMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-slate-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>{t('users.delete')}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <FormModal
        isOpen={showEditModal && !!selectedUser}
        onClose={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
        onSubmit={() => {
          setIsSubmitting(true);
          logger.debug('Updating user:', selectedUser);
          
          // Simulate API call
          setTimeout(() => {
            showSuccess(t('users.messages.userUpdated', { name: selectedUser.name }));
            setIsSubmitting(false);
            setShowEditModal(false);
            setSelectedUser(null);
          }, 1000);
        }}
        title={t('users.modals.editUser')}
        submitText={t('users.save')}
        cancelText={t('users.cancel')}
        isLoading={isSubmitting}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
              <div>
                <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.formLabels.name')}
                </label>
                <input
                  id="edit-user-name"
                  type="text"
                  defaultValue={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-user-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.formLabels.email')}
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  defaultValue={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-user-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.formLabels.phone')}
                </label>
                <input
                  id="edit-user-phone"
                  type="tel"
                  defaultValue={selectedUser.phone}
                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-user-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.formLabels.role')}
                </label>
                <select
                id="edit-user-role"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="owner">{t('users.roles.owner')}</option>
                  <option value="admin">{t('users.roles.admin')}</option>
                  <option value="manager">{t('users.roles.manager')}</option>
                  <option value="agent">{t('users.roles.agent')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-user-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.formLabels.status')}
                </label>
                <select
                id="edit-user-status"
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">{t('users.status.active')}</option>
                  <option value="inactive">{t('users.status.inactive')}</option>
                </select>
          </div>
        </div>
      )}
      </FormModal>

      {/* Yeni Kullanıcı Ekleme Modal */}
      <FormModal
        isOpen={showAddUserModal}
        onClose={() => {
                  setShowAddUserModal(false);
                  setNewUser({
                    name: '',
                    email: '',
                    phone: '',
                    tenant: '',
                    role: 'agent',
                    password: '',
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
        onSubmit={() => {
          // Validation
          if (!newUser.name || !newUser.email || !newUser.tenant || !newUser.password) {
            showError(t('users.validation.allFieldsRequired'));
            return;
          }
          if (newUser.password.length < 8) {
            showError(t('users.validation.passwordMinLength'));
            return;
          }
          
          setIsSubmitting(true);
          logger.debug('Creating new user:', newUser);
          
          // Simulate API call
          setTimeout(() => {
            showSuccess(t('users.messages.userAdded', { name: newUser.name, tenant: newUser.tenant, role: newUser.role }));
            setIsSubmitting(false);
            setShowAddUserModal(false);
            setNewUser({
              name: '',
              email: '',
              phone: '',
              tenant: '',
              role: 'agent',
              password: '',
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
          }, 1000);
        }}
        title={t('users.modals.addUser')}
        submitText={t('users.createUser')}
        cancelText={t('users.cancel')}
        isLoading={isSubmitting}
        submitDisabled={!newUser.name || !newUser.email || !newUser.tenant || !newUser.password}
        size="lg"
      >
        <div className="space-y-6">
              {/* Kullanıcı Bilgileri */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('users.addUserModal.userInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="add-user-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.fullName')}
                    </label>
                    <input
                      id="add-user-name"
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder={t('users.placeholders.name')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="add-user-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="add-user-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder={t('users.placeholders.email')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="add-user-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="add-user-phone"
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        placeholder={t('users.placeholders.phone')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="add-user-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.password')}
                    </label>
                    <input
                      id="add-user-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder={t('users.placeholders.password')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Firma ve Rol */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {t('users.addUserModal.tenantAndRole')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="add-user-tenant" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.tenant')}
                    </label>
                    <select
                      id="add-user-tenant"
                      value={newUser.tenant}
                      onChange={(e) => setNewUser({ ...newUser, tenant: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('users.addUserModal.selectTenant')}</option>
                      <option value="acme">Acme E-commerce</option>
                      <option value="techstart">TechStart SaaS</option>
                      <option value="fashion">Fashion Boutique</option>
                      <option value="healthcare">HealthCare Plus</option>
                      <option value="food">Food Delivery Co</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="add-user-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.role')}
                    </label>
                    <select
                      id="add-user-role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="agent">{t('users.roles.agent')}</option>
                      <option value="manager">{t('users.roles.manager')}</option>
                      <option value="admin">{t('users.roles.admin')}</option>
                      <option value="owner">{t('users.roles.owner')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Günlük Mola Süresi */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('users.addUserModal.dailyBreak')}
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                  <label htmlFor="add-user-daily-break" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('users.addUserModal.dailyBreakMinutes')}
                  </label>
                  <input
                    id="add-user-daily-break"
                    type="number"
                    min="0"
                    max="120"
                    value={newUser.dailyBreakMinutes}
                    onChange={(e) => setNewUser({ ...newUser, dailyBreakMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="30"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('users.addUserModal.dailyBreakDescription')}
                  </p>
                </div>
              </div>

              {/* Haftalık Çalışma Programı */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('users.addUserModal.weeklySchedule')}
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
                    {t('users.addUserModal.selectWorkingDays')}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'monday', label: t('users.addUserModal.days.monday'), short: t('users.addUserModal.daysShort.mon') },
                      { key: 'tuesday', label: t('users.addUserModal.days.tuesday'), short: t('users.addUserModal.daysShort.tue') },
                      { key: 'wednesday', label: t('users.addUserModal.days.wednesday'), short: t('users.addUserModal.daysShort.wed') },
                      { key: 'thursday', label: t('users.addUserModal.days.thursday'), short: t('users.addUserModal.daysShort.thu') },
                      { key: 'friday', label: t('users.addUserModal.days.friday'), short: t('users.addUserModal.daysShort.fri') },
                      { key: 'saturday', label: t('users.addUserModal.days.saturday'), short: t('users.addUserModal.daysShort.sat') },
                      { key: 'sunday', label: t('users.addUserModal.days.sunday'), short: t('users.addUserModal.daysShort.sun') },
                    ].map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setNewUser({
                          ...newUser,
                          workingDays: {
                            ...newUser.workingDays,
                            [day.key]: !newUser.workingDays[day.key as keyof typeof newUser.workingDays]
                          }
                        })}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                          newUser.workingDays[day.key as keyof typeof newUser.workingDays]
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="hidden md:inline">{day.label}</span>
                          <span className="md:hidden">{day.short}</span>
                          <span className="text-xs">
                            {newUser.workingDays[day.key as keyof typeof newUser.workingDays] ? t('users.addUserModal.working') : t('users.addUserModal.dayOff')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                      {t('users.addUserModal.workingDay')}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded">
                      {t('users.addUserModal.weekendOrDayOff')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yıllık İzin Hakları */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('users.addUserModal.annualLeave')}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({t('users.addUserModal.optional')})</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="add-user-annual-leave" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.annualLeaveDays')}
                    </label>
                    <input
                      id="add-user-annual-leave"
                      type="number"
                      min="0"
                      max="365"
                      value={newUser.annualLeaveDays}
                      onChange={(e) => {
                        const annual = parseInt(e.target.value) || 0;
                        setNewUser({ 
                          ...newUser, 
                          annualLeaveDays: annual,
                          remainingLeaveDays: annual - newUser.usedLeaveDays
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('users.addUserModal.defaultDays')}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="add-user-used-leave" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.usedLeave')}
                    </label>
                    <input
                      id="add-user-used-leave"
                      type="number"
                      min="0"
                      max={newUser.annualLeaveDays}
                      value={newUser.usedLeaveDays}
                      onChange={(e) => {
                        const used = parseInt(e.target.value) || 0;
                        setNewUser({ 
                          ...newUser, 
                          usedLeaveDays: used,
                          remainingLeaveDays: newUser.annualLeaveDays - used
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('users.addUserModal.previouslyUsed')}
                    </p>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('users.addUserModal.remainingLeave')}
                    </div>
                    <div className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-semibold flex items-center justify-between">
                      <span>{newUser.remainingLeaveDays}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        newUser.remainingLeaveDays > 10 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : newUser.remainingLeaveDays > 5
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {newUser.remainingLeaveDays > 10 ? t('users.addUserModal.sufficient') : newUser.remainingLeaveDays > 5 ? t('users.addUserModal.medium') : t('users.addUserModal.low')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('users.addUserModal.autoCalculated')}
                    </p>
                  </div>
                </div>
                
                
                {/* İzin Tarihleri */}
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('users.addUserModal.currentLeaveDates')}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="add-user-leave-start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('users.addUserModal.leaveStartDate')}
                      </label>
                      <input
                        id="add-user-leave-start"
                        type="date"
                        value={newUser.currentLeaveStart}
                        onChange={(e) => setNewUser({ ...newUser, currentLeaveStart: e.target.value })}
                        className="w-full px-4 py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="add-user-leave-end" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('users.addUserModal.leaveEndDate')}
                      </label>
                      <input
                        id="add-user-leave-end"
                        type="date"
                        value={newUser.currentLeaveEnd}
                        onChange={(e) => setNewUser({ ...newUser, currentLeaveEnd: e.target.value })}
                        min={newUser.currentLeaveStart}
                        className="w-full px-4 py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 flex items-start gap-1">
                    <span>💡</span>
                    <span>{t('users.addUserModal.leaveDatesHint')}</span>
                  </p>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>
                      {t('users.addUserModal.leaveManagementInfo')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Bilgilendirme */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {t('users.addUserModal.securityNotice')}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      {t('users.addUserModal.securityNoticeDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={() => {
          setIsSubmitting(true);
          logger.debug('Deleting user:', deleteConfirmUser);
          
          // Simulate API call
          setTimeout(() => {
            showSuccess(t('users.messages.userDeleted', { name: deleteConfirmUser.name }));
            setIsSubmitting(false);
            setDeleteConfirmUser(null);
          }, 1000);
        }}
        title={t('users.modals.deleteUser')}
        message={t('users.messages.confirmDelete', { name: deleteConfirmUser?.name })}
        confirmText={t('users.delete')}
        cancelText={t('users.cancel')}
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminUsers;



