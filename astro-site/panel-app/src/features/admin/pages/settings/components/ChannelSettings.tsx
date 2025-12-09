import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { MessageSquare, Instagram, Globe, Phone, CheckCircle, Save } from 'lucide-react';

const ChannelSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [isSaving, setIsSaving] = useState(false);
  const [channels, setChannels] = useState({
    whatsapp: { enabled: true, phone: '+90 555 123 4567', apiToken: 'wa_token_xxxxx', verified: true },
    instagram: { enabled: true, username: '@asistanapp', connected: true },
    facebook: { enabled: false, pageId: '', connected: false },
    web: { enabled: true, color: '#3B82F6', position: 'bottom-right' },
    phone: { enabled: true, number: '+90 212 555 1234', recordCalls: true }
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert(t('settings.channels.messages.settingsSaved'));
    logger.debug('Channels saved:', channels);
  };

  const handleConnect = (channel: string) => {
    alert(t('settings.channels.messages.oauthOpening', { channel }));
    // Simulated connection
    if (channel === 'instagram') {
      setTimeout(() => {
        setChannels({ ...channels, instagram: { ...channels.instagram, connected: true } });
        alert(t('settings.channels.messages.instagramConnected'));
      }, 1000);
    } else if (channel === 'facebook') {
      setTimeout(() => {
        setChannels({ ...channels, facebook: { ...channels.facebook, connected: true, pageId: 'page_12345' } });
        alert(t('settings.channels.messages.facebookConnected'));
      }, 1000);
    }
  };

  const handleDisconnect = (channel: string) => {
    if (confirm(t('settings.channels.messages.confirmDisconnect', { channel }))) {
      if (channel === 'instagram') {
        setChannels({ ...channels, instagram: { ...channels.instagram, connected: false } });
      } else if (channel === 'facebook') {
        setChannels({ ...channels, facebook: { ...channels.facebook, connected: false } });
      }
      alert(t('settings.channels.messages.channelDisconnected', { channel }));
    }
  };

  const copyEmbedCode = () => {
    const code = `<script src="https://asistanapp.com/widget.js" data-id="your-id"></script>`;
    navigator.clipboard.writeText(code);
    alert(t('settings.channels.messages.embedCopied'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.channels.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.channels.subtitle')}</p>
      </div>

      {/* WhatsApp */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.channels.whatsapp.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.channels.whatsapp.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {channels.whatsapp.verified && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                {t('settings.channels.whatsapp.verified')}
              </span>
            )}
            <label htmlFor="channel-whatsapp" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.channels.whatsapp.enabled')}</span>
              <input
                id="channel-whatsapp"
                type="checkbox"
                checked={channels.whatsapp.enabled}
                onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
        {channels.whatsapp.enabled && (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="whatsapp-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.channels.whatsapp.phoneLabel')}</label>
                <input
                  id="whatsapp-phone"
                  type="tel"
                  value={channels.whatsapp.phone}
                  onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, phone: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="whatsapp-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.channels.whatsapp.apiToken')}</label>
                <input
                  id="whatsapp-token"
                  type="password"
                  value={channels.whatsapp.apiToken}
                  onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, apiToken: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instagram */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.channels.instagram.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.channels.instagram.subtitle')}</p>
            </div>
          </div>
          <label htmlFor="channel-instagram" className="relative inline-flex items-center cursor-pointer">
            <span className="sr-only">{t('settings.channels.instagram.enabled')}</span>
            <input
              id="channel-instagram"
              type="checkbox"
              checked={channels.instagram.enabled}
              onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, enabled: e.target.checked } })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </div>
        {channels.instagram.enabled && (
          <div className="mt-4">
            {channels.instagram.connected ? (
              <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{channels.instagram.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.channels.instagram.connectedAccount')}</p>
                </div>
                <button 
                  onClick={() => handleDisconnect('Instagram')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  {t('settings.channels.instagram.disconnect')}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleConnect('instagram')}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                {t('settings.channels.instagram.connect')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Web Widget */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.channels.web.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.channels.web.subtitle')}</p>
            </div>
          </div>
          <label htmlFor="channel-web" className="relative inline-flex items-center cursor-pointer">
            <span className="sr-only">{t('settings.channels.web.enabled')}</span>
            <input
              id="channel-web"
              type="checkbox"
              checked={channels.web.enabled}
              onChange={(e) => setChannels({ ...channels, web: { ...channels.web, enabled: e.target.checked } })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {channels.web.enabled && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="web-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.channels.web.colorLabel')}</label>
                <input
                  id="web-color"
                  type="color"
                  value={channels.web.color}
                  onChange={(e) => setChannels({ ...channels, web: { ...channels.web, color: e.target.value } })}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-slate-600"
                />
              </div>
              <div>
                <label htmlFor="web-position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.channels.web.positionLabel')}</label>
                <select
                  id="web-position"
                  value={channels.web.position}
                  onChange={(e) => setChannels({ ...channels, web: { ...channels.web, position: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="bottom-right">{t('settings.channels.web.positionBottomRight')}</option>
                  <option value="bottom-left">{t('settings.channels.web.positionBottomLeft')}</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.channels.web.embedCode')}</p>
                <button 
                  onClick={copyEmbedCode}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  {t('settings.channels.copy')}
                </button>
              </div>
              <code className="text-xs bg-gray-900 text-green-400 p-3 rounded block overflow-x-auto">
                {`<script src="https://asistanapp.com/widget.js" data-id="your-id"></script>`}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.channels.phone.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.channels.phone.subtitle')}</p>
            </div>
          </div>
          <label htmlFor="channel-phone" className="relative inline-flex items-center cursor-pointer">
            <span className="sr-only">{t('settings.channels.phone.enabled')}</span>
            <input
              id="channel-phone"
              type="checkbox"
              checked={channels.phone.enabled}
              onChange={(e) => setChannels({ ...channels, phone: { ...channels.phone, enabled: e.target.checked } })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        {channels.phone.enabled && (
          <div className="space-y-3 mt-4">
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.channels.phone.numberLabel')}</label>
              <input
                id="phone-number"
                type="tel"
                value={channels.phone.number}
                onChange={(e) => setChannels({ ...channels, phone: { ...channels.phone, number: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.channels.phone.recordCalls')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.channels.phone.recordDescription')}</p>
              </div>
              <label htmlFor="phone-record" className="relative inline-flex items-center cursor-pointer">
                <span className="sr-only">{t('settings.channels.phone.recordCalls')}</span>
                <input
                  id="phone-record"
                  type="checkbox"
                  checked={channels.phone.recordCalls}
                  onChange={(e) => setChannels({ ...channels, phone: { ...channels.phone, recordCalls: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
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
              {t('settings.common.save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChannelSettings;
