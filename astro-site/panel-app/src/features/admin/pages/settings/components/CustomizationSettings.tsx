import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Palette, Sun, Moon, Globe, DollarSign, Save } from 'lucide-react';
import { useThemeStore } from '@/shared/stores/theme-store';
import { changeLanguage } from '@/shared/i18n/config';

const CustomizationSettings: React.FC = () => {
  const { t, i18n } = useTranslation('admin');
  const { theme: currentTheme, setTheme } = useThemeStore();
  
  const [customization, setCustomization] = useState({
    theme: currentTheme,
    accentColor: '#3B82F6',
    language: i18n.language || 'tr',
    currency: 'TRY',
    numberFormat: 'tr',
    defaultPage: '/dashboard'
  });

  // Sayfa yüklendiğinde kaydedilmiş ayarları yükle ve uygula
  // CRITICAL FIX: Empty dependency array to run only on mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedCustomization = localStorage.getItem('customization');
      if (savedCustomization) {
        try {
          const parsed = JSON.parse(savedCustomization);
          setCustomization(parsed);
          
          // Kaydedilmiş ayarları uygula
          if (parsed.theme) {
            setTheme(parsed.theme);
          }
          if (parsed.accentColor) {
            document.documentElement.style.setProperty('--accent-color', parsed.accentColor);
          }
          if (parsed.language && parsed.language !== i18n.language) {
            await changeLanguage(parsed.language);
          }
          
          logger.debug('Settings loaded from localStorage', parsed);
        } catch (error) {
          logger.error('Failed to load settings', error);
        }
      }
    };
    
    loadSettings();
  }, []); // Only run once on mount

  const themes = [
    { value: 'light', label: t('settings.customization.appearance.light'), icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: t('settings.customization.appearance.dark'), icon: <Moon className="w-5 h-5" /> }
  ];

  const accentColors = [
    { value: '#3B82F6', label: t('settings.customization.accentColor.blue'), color: 'bg-blue-500' },
    { value: '#8B5CF6', label: t('settings.customization.accentColor.purple'), color: 'bg-purple-500' },
    { value: '#10B981', label: t('settings.customization.accentColor.green'), color: 'bg-green-500' },
    { value: '#F59E0B', label: t('settings.customization.accentColor.orange'), color: 'bg-orange-500' },
    { value: '#EF4444', label: t('settings.customization.accentColor.red'), color: 'bg-red-500' }
  ];

  const handleSave = async () => {
    logger.debug('🔥 SAVE CLICKED - Applying settings', customization);
    
    // 1. Tema değişikliğini theme-store üzerinden uygula (otomatik olarak localStorage'a kaydeder)
    setTheme(customization.theme as 'light' | 'dark');
    logger.debug('✅ Theme applied:', { theme: customization.theme });
    
    // 2. Vurgu rengini uygula (CSS değişkeni olarak)
    document.documentElement.style.setProperty('--accent-color', customization.accentColor);
    logger.debug('✅ Accent color applied:', { accentColor: customization.accentColor });
    
    // 3. Dil ayarını uygula (GERÇEK i18n değişimi)
    const languageChanged = customization.language !== i18n.language;
    if (languageChanged) {
      logger.debug('🌐 Attempting language change', { 
        from: i18n.language, 
        to: customization.language 
      });
      
      try {
        await changeLanguage(customization.language as 'tr' | 'en');
        logger.debug('✅ changeLanguage() completed', { 
          newLanguage: i18n.language,
          expected: customization.language 
        });
        
        // CRITICAL: Force re-render by updating HTML lang attribute AFTER i18n change
        document.documentElement.setAttribute('lang', customization.language);
        
        // CRITICAL: Verify the change actually worked
        if (i18n.language !== customization.language) {
          logger.error('❌ Language change FAILED!', {
            expected: customization.language,
            actual: i18n.language
          });
          alert(`ERROR: Language change failed!\nExpected: ${customization.language}\nActual: ${i18n.language}\n\nCheck console for details.`);
          return;
        }
        
        logger.debug('✅ Language verified:', { language: i18n.language });
      } catch (error) {
        logger.error('❌ Language change threw error:', error);
        alert(`ERROR changing language: ${error}\n\nCheck console for details.`);
        return;
      }
    } else {
      logger.debug('ℹ️ Language unchanged:', { language: i18n.language });
    }
    
    // 4. Para birimi ve sayı formatını localStorage'a kaydet
    logger.debug('✅ Currency:', { currency: customization.currency });
    logger.debug('✅ Number format:', { numberFormat: customization.numberFormat });
    logger.debug('✅ Default page:', { defaultPage: customization.defaultPage });
    
    // Tüm ayarları localStorage'a kaydet
    localStorage.setItem('customization', JSON.stringify(customization));
    logger.debug('✅ Settings saved to localStorage');
    
    // CRITICAL: If language changed, show message and RELOAD to ensure all components update
    if (languageChanged) {
      const confirmReload = confirm(
        t('settings.customization.messages.languageChangeConfirm', {
          language: customization.language === 'en' ? t('settings.customization.languages.en') : t('settings.customization.languages.tr')
        })
      );
      
      if (confirmReload) {
        logger.debug('🔄 Reloading page to apply language change...');
        window.location.reload();
      } else {
        logger.debug('⚠️ User cancelled reload - UI may not update!');
      }
      return;
    }
    
    // Show success message (only if no language change)
    const themeText = customization.theme === 'dark' 
      ? t('settings.customization.messages.themeDark') 
      : t('settings.customization.messages.themeLight');
    const accentColorLabel = accentColors.find(c => c.value === customization.accentColor)?.label;
    const numberFormatText = customization.numberFormat === 'tr' ? 'TR' : 'EN';
    
    const messages = [
      t('settings.customization.messages.settingsSaved'),
      '',
      t('settings.customization.messages.themeApplied', { theme: themeText }),
      t('settings.customization.messages.accentColorApplied', { color: accentColorLabel }),
      t('settings.customization.messages.currencyApplied', { currency: customization.currency }),
      t('settings.customization.messages.numberFormatApplied', { format: numberFormatText })
    ];
    
    alert(messages.join('\n'));
    logger.debug('✅ Customization saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.customization.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('settings.customization.subtitle')}</p>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Palette className="w-5 h-5 inline mr-2" />
          {t('settings.customization.appearance.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setCustomization({ ...customization, theme: theme.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                customization.theme === theme.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${customization.theme === theme.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {theme.icon}
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{theme.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.customization.accentColor.title')}</h3>
        <div className="grid grid-cols-5 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setCustomization({ ...customization, accentColor: color.value })}
              className={`p-4 rounded-lg border-2 transition-all ${
                customization.accentColor === color.value
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-200 dark:border-slate-700 hover:scale-105'
              }`}
            >
              <div className={`w-full h-12 ${color.color} rounded-lg mb-2`}></div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{color.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Globe className="w-5 h-5 inline mr-2" />
          {t('settings.customization.localization.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="customization-language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.customization.localization.language')}</label>
            <select
              id="customization-language"
              value={customization.language}
              onChange={(e) => setCustomization({ ...customization, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="tr">{t('settings.customization.localization.languageTurkish')}</option>
              <option value="en">{t('settings.customization.localization.languageEnglish')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="customization-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              {t('settings.customization.localization.currency')}
            </label>
            <select
              id="customization-currency"
              value={customization.currency}
              onChange={(e) => setCustomization({ ...customization, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="TRY">{t('settings.customization.localization.currencyTRY')}</option>
              <option value="USD">{t('settings.customization.localization.currencyUSD')}</option>
              <option value="EUR">{t('settings.customization.localization.currencyEUR')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="customization-number-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.customization.localization.numberFormat')}</label>
            <select
              id="customization-number-format"
              value={customization.numberFormat}
              onChange={(e) => setCustomization({ ...customization, numberFormat: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="tr">{t('settings.customization.localization.numberFormatTR')}</option>
              <option value="en">{t('settings.customization.localization.numberFormatEN')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.customization.dashboard.title')}</h3>
        <div>
          <label htmlFor="customization-default-page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.customization.dashboard.defaultPage')}</label>
          <select
            id="customization-default-page"
            value={customization.defaultPage}
            onChange={(e) => setCustomization({ ...customization, defaultPage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="/dashboard">{t('settings.customization.dashboard.pages.dashboard')}</option>
            <option value="/conversations">{t('settings.customization.dashboard.pages.conversations')}</option>
            <option value="/appointments">{t('settings.customization.dashboard.pages.appointments')}</option>
            <option value="/reports">{t('settings.customization.dashboard.pages.reports')}</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.customization.preview.title')}</h3>
        <div className={`p-6 rounded-lg ${customization.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50 dark:bg-slate-900'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: customization.accentColor }}
            ></div>
            <div>
              <p className={`font-semibold ${customization.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.customization.preview.sampleTitle')}
              </p>
              <p className={`text-sm ${customization.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.customization.preview.sampleDescription')}
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: customization.accentColor }}
          >
            {t('settings.customization.sampleButton')}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors font-medium">
          {t('settings.common.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2 shadow-lg"
          style={{ backgroundColor: customization.accentColor }}
        >
          <Save className="w-4 h-4" />
          {t('settings.common.save')}
        </button>
      </div>
    </div>
  );
};

export default CustomizationSettings;



