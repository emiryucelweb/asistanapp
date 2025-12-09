import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Camera, Mail, Phone, Lock, Globe, Clock, Save, Shield, LogOut, Check } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@asistanapp.com',
    phone: '+90 555 123 4567',
    avatar: '',
    locale: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', ip: '192.168.1.100', location: 'Istanbul, TR', lastActive: t('settings.profile.lastActive2min'), current: true },
    { id: 2, device: 'Safari on iPhone', ip: '78.186.45.12', location: 'Ankara, TR', lastActive: t('settings.profile.lastActive3h'), current: false },
    { id: 3, device: 'Firefox on Mac', ip: '85.34.78.90', location: 'Izmir, TR', lastActive: t('settings.profile.lastActive1d'), current: false }
  ]);

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t('settings.profile.messages.fileTooLarge'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
        alert(t('settings.profile.messages.photoUploaded'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (confirm(t('settings.profile.messages.confirmRemovePhoto'))) {
      setFormData({ ...formData, avatar: '' });
      alert(t('settings.profile.messages.photoRemoved'));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert(t('settings.profile.messages.profileSaved'));
    logger.debug('Profile data saved:', formData);
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) {
      alert(t('settings.profile.messages.currentPasswordRequired'));
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert(t('settings.profile.messages.passwordTooShort'));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('settings.profile.messages.passwordMismatch'));
      return;
    }
    alert(t('settings.profile.messages.passwordChanged'));
    logger.debug('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTerminateSession = (sessionId: number) => {
    if (confirm(t('settings.profile.messages.confirmEndSession'))) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      alert(t('settings.profile.messages.sessionEnded'));
    }
  };

  const handleToggle2FA = () => {
    if (!is2FAEnabled) {
      setShow2FAModal(true);
    } else {
      if (confirm(t('settings.profile.messages.confirmDisable2FA'))) {
        setIs2FAEnabled(false);
        alert(t('settings.profile.messages.twoFADisabled'));
      }
    }
  };

  const handleConfirm2FA = () => {
    if (twoFACode.length === 6) {
      setIs2FAEnabled(true);
      setShow2FAModal(false);
      setTwoFACode('');
      alert(t('settings.profile.messages.twoFAEnabled'));
    } else {
      alert(t('settings.profile.messages.twoFAVerificationFailed'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.profile.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('settings.profile.description')}</p>
      </div>

      {/* Profile Picture */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.profile.profilePhoto')}</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
            )}
            <button 
              onClick={handleUploadPhoto}
              className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button 
              onClick={handleUploadPhoto}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              {t('settings.profile.uploadPhoto')}
            </button>
            <button 
              onClick={handleRemovePhoto}
              disabled={!formData.avatar}
              className="ml-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('settings.profile.remove')}
            </button>
            <p className="text-xs text-gray-500 mt-2">{t('settings.profile.photoRequirements')}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.profile.personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.firstName')}</label>
            <input
              id="profile-first-name"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="profile-last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.lastName')}</label>
            <input
              id="profile-last-name"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              {t('settings.profile.phone')}
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.profile.preferences')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="profile-locale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              {t('settings.profile.language')}
            </label>
            <select
              id="profile-locale"
              value={formData.locale}
              onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="tr">{t('settings.profile.languageTurkish')}</option>
              <option value="en">{t('settings.profile.languageEnglish')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="profile-timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              {t('settings.profile.timezone')}
            </label>
            <select
              id="profile-timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="Europe/Istanbul">{t('settings.profile.timezoneIstanbul')}</option>
              <option value="Europe/London">{t('settings.profile.timezoneLondon')}</option>
              <option value="America/New_York">{t('settings.profile.timezoneNewYork')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="profile-date-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.dateFormat')}</label>
            <select
              id="profile-date-format"
              value={formData.dateFormat}
              onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Lock className="w-5 h-5 inline mr-2" />
          {t('settings.profile.changePassword')}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.currentPassword')}</label>
            <input
              id="profile-current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={t('settings.profile.passwordPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.newPassword')}</label>
              <input
                id="profile-new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                placeholder={t('settings.profile.passwordPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="profile-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profile.confirmNewPassword')}</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                placeholder={t('settings.profile.passwordPlaceholder')}
              />
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
          >
            {t('settings.profile.updatePassword')}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Shield className="w-5 h-5 inline mr-2" />
              {t('settings.profile.twoFA')}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{t('settings.profile.twoFADesc')}</p>
          </div>
          <label htmlFor="enable-2fa" className="relative inline-flex items-center cursor-pointer">
            <span className="sr-only">{t('settings.profile.twoFA')}</span>
            <input 
              id="enable-2fa"
              type="checkbox" 
              checked={is2FAEnabled}
              onChange={handleToggle2FA}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {is2FAEnabled ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-300">
              {t('settings.profile.twoFAActive')}
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t('settings.profile.twoFARecommended')}
            </p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.profile.activeSessions')}</h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg border ${session.current ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                  {session.current && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">{t('settings.profile.sessionActive')}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.ip} • {session.location}</p>
                <p className="text-xs text-gray-500 mt-1">{t('settings.profile.sessionLastActivity')}: {session.lastActive}</p>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleTerminateSession(session.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  {t('settings.profile.terminateSession')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors font-medium"
        >
          {t('settings.common.cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="flex items-center justify-center gap-0.5">
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
              {t('settings.common.saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('settings.common.saveChanges')}
            </>
          )}
        </button>
      </div>

      {/* 2FA QR Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('settings.profile.enable2FA')}</h3>
            
            {/* QR Code Placeholder */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">{t('settings.profile.qrCode')}</p>
                  <p className="text-xs text-gray-500">{t('settings.profile.scanWithAuthenticator')}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('settings.profile.twoFAInstructions')}
            </p>

            <input
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={t('settings.profile.twoFACode')}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              maxLength={6}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  setTwoFACode('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                {t('settings.common.cancel')}
              </button>
              <button
                onClick={handleConfirm2FA}
                disabled={twoFACode.length !== 6}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('settings.profile.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;

