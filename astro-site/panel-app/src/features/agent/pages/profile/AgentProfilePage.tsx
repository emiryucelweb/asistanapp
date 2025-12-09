/**
 * Agent Profile Page - Agent Profile Settings
 * 
 * ARCHITECTURE:
 * - Uses preferencesService (works offline with localStorage)
 * - Backend-ready: just change flag in preferences.service.ts
 * - Zero code changes needed for backend migration
 * - Full i18n support with dynamic locale
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/features/agent/utils/locale';
import { 
  User, Mail, Phone, Building2, Calendar, Edit2, Save, X, Key, 
  Moon, Sun, Bell, Volume2, Globe, Clock, Loader2 as Loader
} from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/shared/utils/toast';
import { useThemeStore } from '@/shared/stores/theme-store';
import { authService } from '@/lib/api/services';
import { useAuthStore } from '@/shared/stores/auth-store';
import { logger } from '@/shared/utils/logger';
import { preferencesService, AgentPreferences as IAgentPreferences } from '@/lib/services/preferences';
import { ProfileLoadingState } from '@/shared/ui/loading';

interface ProfileForm {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

// Use the shared interface from preferencesService
type Preferences = IAgentPreferences;

const AgentProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation('agent');
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  // Loading states
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSavingPreference, setIsSavingPreference] = useState(false);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [tempProfile, setTempProfile] = useState<ProfileForm>(profileForm);
  const [isResetingPassword, setIsResetingPassword] = useState(false);

  // Preferences state - Initialize with current i18n language
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,
    soundEnabled: true,
    callSounds: true,
    chatSounds: true,
    language: (i18n.language as 'tr' | 'en') || 'tr',
    autoAssign: true,
  });

  // Load preferences from service (localStorage or API)
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsProfileLoading(true);
        const loadedPrefs = await preferencesService.getAll();
        setPreferences(loadedPrefs);
        
        // Sync i18n language with stored preference
        if (loadedPrefs.language && loadedPrefs.language !== i18n.language) {
          await i18n.changeLanguage(loadedPrefs.language);
        }
        
        logger.debug('Preferences loaded', loadedPrefs);
      } catch (error) {
        logger.error('Failed to load preferences', error as Error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadPreferences();
  }, [i18n]);

  // Load profile data
  useEffect(() => {
    if (user) {
      const formData: ProfileForm = {
        name: user.name || t('profile.defaultName'),
        email: user.email || t('profile.defaultEmail'),
        phone: '', // Will be loaded from backend when ready
        bio: '',
      };
      setProfileForm(formData);
      setTempProfile(formData);
    }
  }, [user, t]);

  // Handle profile edit
  const handleSave = async () => {
    if (!user?.id) return;

    try {
      // TODO: Replace with real API call when backend is ready
      // await api.patch(`/smart-assignment/agents/${user.id}`, { name: tempProfile.name });
      
      // For now, just update local state
      setProfileForm(tempProfile);
      setIsEditing(false);
      showSuccess(t('profile.profileUpdated'));
      logger.debug('Profile updated (mock)', tempProfile);
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      showError(t('profile.profileUpdateFailed'));
    }
  };

  const handleCancel = () => {
    setTempProfile(profileForm);
    setIsEditing(false);
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!profileForm.email) {
      showError(t('profile.security.emailNotFound'));
      return;
    }

    setIsResetingPassword(true);
    const loadingToast = showLoading(t('profile.security.sendingResetEmail'));

    try {
      await authService.requestPasswordReset(profileForm.email);
      dismissToast(loadingToast);
      showSuccess(t('profile.security.resetEmailSent', { email: profileForm.email }), 5000);
    } catch (error) {
      dismissToast(loadingToast);
      logger.error('Password reset failed', error as Error);
      showError(t('profile.security.resetEmailFailed'));
    } finally {
      setIsResetingPassword(false);
    }
  };

  // Handle preference change
  const handlePreferenceChange = async (key: keyof Preferences, value: boolean | string) => {
    // Save previous value for rollback
    const prevValue = preferences[key];

    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));
    setIsSavingPreference(true);

    try {
      // Save to service (localStorage now, API when backend is ready)
      await preferencesService.update(key, value);

      // If language changed successfully, update i18n and show success
      if (key === 'language' && typeof value === 'string') {
        await i18n.changeLanguage(value);
        showSuccess(t('profile.languageChanged'));
      } else {
        // For other preferences, show generic success message
        showSuccess(t('profile.preferenceSaved'));
      }
      
      logger.debug('Preference saved', { key, value });
    } catch (error) {
      // Revert optimistic update with previous value
      setPreferences(prev => ({ ...prev, [key]: prevValue }));
      logger.error('Failed to save preference', error as Error);
      showError(t('profile.preferencesFailed'));
    } finally {
      setIsSavingPreference(false);
    }
  };

  // Handle theme toggle (with service sync)
  const handleThemeToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    toggleTheme(); // Update zustand store

    try {
      // Save to service (localStorage now, API when backend is ready)
      await preferencesService.update('theme', newTheme);
      logger.debug('Theme preference saved', { theme: newTheme });
    } catch (error) {
      logger.error('Failed to save theme preference', error as Error);
    }
  };

  // Format date with dynamic locale
  const formatJoinDate = () => {
    return formatDate(new Date(), i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isProfileLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ProfileLoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t('profile.sections.profileInfo')}
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                type="button"
              >
                <Edit2 className="w-4 h-4" />
                {t('profile.edit')}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                  {t('common:cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSavingPreference}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  type="button"
                >
                  {isSavingPreference ? (
                    <div className="flex items-center justify-center gap-0.5 w-4 h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-white animate-bounce"
                          style={{
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '0.6s',
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('common:save')}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              {isEditing ? (
                <div>
                  <label htmlFor="agent-name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    {t('profile.fields.name')}
                  </label>
                  <input
                    id="agent-name"
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    {t('profile.fields.name')}
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">{profileForm.name}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                {t('profile.fields.email')}
              </div>
              <p className="text-gray-900 dark:text-gray-100">{profileForm.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.fields.emailImmutable')}
              </p>
            </div>

            {/* Phone (Optional) */}
            {profileForm.phone && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4" />
                  {t('profile.fields.phone')}
                </div>
                <p className="text-gray-900 dark:text-gray-100">{profileForm.phone}</p>
              </div>
            )}

            {/* Role */}
            {user?.role && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building2 className="w-4 h-4" />
                  {t('profile.fields.role')}
                </div>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
              </div>
            )}

            {/* Join Date */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                {t('profile.fields.joinDate')}
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                {formatJoinDate()}
              </p>
            </div>
          </div>
        </div>

        {/* Password Reset */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('profile.sections.security')}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {t('profile.security.passwordReset')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('profile.security.sendResetLink')}
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={isResetingPassword}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              type="button"
            >
              {isResetingPassword ? (
                <div className="flex items-center justify-center gap-0.5 w-4 h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-gray-700 dark:bg-gray-300 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.6s',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Key className="w-4 h-4" />
              )}
              {t('profile.security.resetButton')}
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('profile.sections.preferences')}
          </h2>

          <div className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.preferences.theme.label')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {theme === 'dark' ? t('profile.preferences.theme.dark') : t('profile.preferences.theme.light')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                aria-label={t('profile.settingsLabels.changeTheme')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-gray-300 dark:bg-orange-500"
                type="button"
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.preferences.emailNotifications.label')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.preferences.emailNotifications.description')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                aria-label={t('profile.settingsLabels.emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  preferences.emailNotifications ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                type="button"
              >
                <span
                  className={`${
                    preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.preferences.pushNotifications.label')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.preferences.pushNotifications.description')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                aria-label={t('profile.settingsLabels.pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  preferences.pushNotifications ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                type="button"
              >
                <span
                  className={`${
                    preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.preferences.soundEffects.label')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.preferences.soundEffects.description')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}
                aria-label={t('profile.settingsLabels.soundEffects')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  preferences.soundEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                type="button"
              >
                <span
                  className={`${
                    preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Auto Assign */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.preferences.autoAssign.label')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.preferences.autoAssign.description')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('autoAssign', !preferences.autoAssign)}
                aria-label={t('profile.settingsLabels.autoAssign')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  preferences.autoAssign ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                type="button"
              >
                <span
                  className={`${
                    preferences.autoAssign ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.languageLabel')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.languageDescription')}
                  </p>
                </div>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="tr">{t('profile.languages.tr')}</option>
                <option value="en">{t('profile.languages.en')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
