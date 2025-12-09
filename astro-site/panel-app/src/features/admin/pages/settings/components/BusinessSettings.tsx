import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Building2, MapPin, Phone, Mail, Globe, Clock, Save, Upload } from 'lucide-react';
import { showSuccess, showError } from '@/shared/utils/toast';

const BusinessSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: t('settings.business.mockData.businessName'),
    businessType: 'dental_clinic',
    description: t('settings.business.placeholders.description'),
    taxNumber: '1234567890',
    tradeRegister: 'Istanbul-123456',
    phone: '+90 212 555 1234',
    email: 'info@asistanapp.com',
    website: 'https://asistanapp.com',
    instagram: '@asistanapp',
    facebook: 'asistanapp',
    linkedin: 'asistanapp',
    address: t('settings.business.placeholders.address'),
    city: 'Istanbul',
    district: t('settings.business.placeholders.district'),
    postalCode: '34330'
  });

  const [workingHours, setWorkingHours] = useState([
    { day: t('settings.business.workingHours.days.monday'), enabled: true, start: '09:00', end: '18:00' },
    { day: t('settings.business.workingHours.days.tuesday'), enabled: true, start: '09:00', end: '18:00' },
    { day: t('settings.business.workingHours.days.wednesday'), enabled: true, start: '09:00', end: '18:00' },
    { day: t('settings.business.workingHours.days.thursday'), enabled: true, start: '09:00', end: '18:00' },
    { day: t('settings.business.workingHours.days.friday'), enabled: true, start: '09:00', end: '18:00' },
    { day: t('settings.business.workingHours.days.saturday'), enabled: true, start: '10:00', end: '16:00' },
    { day: t('settings.business.workingHours.days.sunday'), enabled: false, start: '10:00', end: '16:00' }
  ]);

  const businessTypes = [
    { value: 'dental_clinic', label: t('settings.business.businessTypes.dental_clinic') },
    { value: 'hospital', label: t('settings.business.businessTypes.hospital') },
    { value: 'aesthetic_center', label: t('settings.business.businessTypes.aesthetic_center') },
    { value: 'hair_salon', label: t('settings.business.businessTypes.hair_salon') },
    { value: 'beauty_salon', label: t('settings.business.businessTypes.beauty_salon') },
    { value: 'cafe', label: t('settings.business.businessTypes.cafe') },
    { value: 'restaurant', label: t('settings.business.businessTypes.restaurant') },
    { value: 'hotel', label: t('settings.business.businessTypes.hotel') },
    { value: 'fitness_center', label: t('settings.business.businessTypes.fitness_center') },
    { value: 'other', label: t('settings.business.businessTypes.other') }
  ];

  const handleUploadLogo = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        showError(t('settings.business.messages.logoTooLarge'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        showSuccess(t('settings.business.messages.logoUploaded'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API call to save business data
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    showSuccess(t('settings.business.messages.settingsSaved'));
    logger.debug('Business data saved:', { formData, workingHours, logoPreview });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.business.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('settings.business.subtitle')}</p>
      </div>

      {/* Logo */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.business.logo.section')}</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-white" />
            )}
          </div>
          <div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button 
              onClick={handleUploadLogo}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {t('settings.business.logo.upload')}
            </button>
            <p className="text-xs text-gray-500 mt-2">{t('settings.business.logo.requirements')}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.business.basicInfo')}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.companyName')}</label>
              <input
                id="business-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.sector')}</label>
              <select
                id="business-type"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tax-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.taxNumber')}</label>
              <input
                id="tax-number"
                type="text"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="business-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.description')}</label>
              <textarea
                id="business-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.business.contactInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="business-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              {t('settings.business.labels.phone')}
            </label>
            <input
              id="business-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="business-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              {t('settings.business.labels.email')}
            </label>
            <input
              id="business-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="business-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              {t('settings.business.labels.website')}
            </label>
            <input
              id="business-website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="business-instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.instagram')}</label>
            <input
              id="business-instagram"
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={t('settings.business.instagramPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <MapPin className="w-5 h-5 inline mr-2" />
          {t('settings.business.addressInfo')}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="business-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.fullAddress')}</label>
            <textarea
              id="business-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="business-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.city')}</label>
              <select
                id="business-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value="Istanbul">{t('settings.business.cities.Istanbul')}</option>
                <option value="Ankara">{t('settings.business.cities.Ankara')}</option>
                <option value="Izmir">{t('settings.business.cities.Izmir')}</option>
                <option value="Bursa">{t('settings.business.cities.Bursa')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="business-district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.district')}</label>
              <input
                id="business-district"
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="business-postal-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.business.labels.postalCode')}</label>
              <input
                id="business-postal-code"
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Clock className="w-5 h-5 inline mr-2" />
          {t('settings.business.workingHours.title')}
        </h3>
        <div className="space-y-3">
          {workingHours.map((day, index) => (
            <div key={day.day} className="flex items-center gap-4">
              <label htmlFor={`working-hours-${index}`} className="flex items-center cursor-pointer">
                <input
                  id={`working-hours-${index}`}
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(e) => {
                    const newHours = [...workingHours];
                    newHours[index].enabled = e.target.checked;
                    setWorkingHours(newHours);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 w-24">{day.day}</span>
              </label>
              {day.enabled ? (
                <>
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => {
                      const newHours = [...workingHours];
                      newHours[index].start = e.target.value;
                      setWorkingHours(newHours);
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => {
                      const newHours = [...workingHours];
                      newHours[index].end = e.target.value;
                      setWorkingHours(newHours);
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </>
              ) : (
                <span className="text-sm text-gray-400">{t('settings.business.workingHours.closed')}</span>
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
              {t('settings.common.save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BusinessSettings;

