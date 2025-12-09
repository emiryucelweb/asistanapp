import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Building2, CreditCard, MapPin, User } from 'lucide-react';
import { TenantSubscription } from '@/types';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
}

export interface TenantFormData {
  // Company Info
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  website?: string;
  
  // Contact Person
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Billing Address
  billingCompany: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  taxId?: string;
  
  // Subscription
  plan: TenantSubscription['plan'];
  dataResidency: 'eu' | 'us' | 'tr';
  
  // Features
  voiceEnabled: boolean;
  multiChannel: boolean;
  analytics: boolean;
  customIntegrations: boolean;
  
  // API Configuration (Optional - can be set later by tenant)
  openaiApiKey?: string;
  anthropicApiKey?: string;
  webhookUrl?: string;
  
  // Payment Info
  paymentType?: 'prepaid_yearly' | 'prepaid_6months' | 'monthly_commitment' | 'monthly_flexible';
  paymentReceived?: boolean;
  paymentAmount?: number;
  paymentDate?: string;
}

const CreateTenantModal: React.FC<CreateTenantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation('super-admin');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TenantFormData>({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    billingCompany: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'TR',
    taxId: '',
    plan: 'professional',
    dataResidency: 'tr',
    voiceEnabled: true,
    multiChannel: true,
    analytics: true,
    customIntegrations: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});

  if (!isOpen) return null;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = t('tenants.create.validation.companyNameRequired');
      if (!formData.companyEmail.trim()) newErrors.companyEmail = t('tenants.create.validation.emailRequired');
      if (!formData.companyPhone.trim()) newErrors.companyPhone = t('tenants.create.validation.phoneRequired');
    }

    if (currentStep === 2) {
      if (!formData.contactFirstName.trim()) newErrors.contactFirstName = t('tenants.create.validation.firstNameRequired');
      if (!formData.contactLastName.trim()) newErrors.contactLastName = t('tenants.create.validation.lastNameRequired');
      if (!formData.contactEmail.trim()) newErrors.contactEmail = t('tenants.create.validation.emailRequired');
    }

    if (currentStep === 3) {
      if (!formData.billingCompany.trim()) newErrors.billingCompany = t('tenants.create.validation.companyNameRequired');
      if (!formData.billingStreet.trim()) newErrors.billingStreet = t('tenants.create.validation.addressRequired');
      if (!formData.billingCity.trim()) newErrors.billingCity = t('tenants.create.validation.cityRequired');
      if (!formData.billingPostalCode.trim()) newErrors.billingPostalCode = t('tenants.create.validation.postalCodeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof TenantFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('tenants.create.title')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('tenants.create.misc.step', { current: step, total: 4 })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('tenants.create.labels.companyInfo')}
                </h3>
              </div>

              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tenants.create.labels.companyName')} {t('tenants.create.labels.required')}
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                  }`}
                  placeholder={t('superAdmin.tenants.create.placeholders.companyName')}
                />
                {errors.companyName && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.companyName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.email')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="company-email"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleChange('companyEmail', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.companyEmail ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.companyEmail')}
                  />
                  {errors.companyEmail && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.companyEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.phone')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="company-phone"
                    type="tel"
                    value={formData.companyPhone}
                    onChange={(e) => handleChange('companyPhone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.companyPhone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.companyPhone')}
                  />
                  {errors.companyPhone && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.companyPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tenants.create.labels.website')}
                </label>
                <input
                  id="company-website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="https://acme.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Person */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('tenants.create.labels.contactPerson')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.firstName')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    value={formData.contactFirstName}
                    onChange={(e) => handleChange('contactFirstName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.contactFirstName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.adminFirstName')}
                  />
                  {errors.contactFirstName && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.contactFirstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.lastName')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    value={formData.contactLastName}
                    onChange={(e) => handleChange('contactLastName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.contactLastName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.adminLastName')}
                  />
                  {errors.contactLastName && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.contactLastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.email')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.adminEmail')}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder={t('superAdmin.tenants.create.placeholders.adminPhone')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Billing Address */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('tenants.create.labels.billingAddress')}
                </h3>
              </div>

              <div>
                <label htmlFor="billing-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tenants.create.labels.legalName')} {t('tenants.create.labels.required')}
                </label>
                <input
                  id="billing-company"
                  type="text"
                  value={formData.billingCompany}
                  onChange={(e) => handleChange('billingCompany', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    errors.billingCompany ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                  }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.legalName')}
                />
                {errors.billingCompany && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.billingCompany}</p>
                )}
              </div>

              <div>
                <label htmlFor="billing-street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tenants.create.labels.address')} {t('tenants.create.labels.required')}
                </label>
                <input
                  id="billing-street"
                  type="text"
                  value={formData.billingStreet}
                  onChange={(e) => handleChange('billingStreet', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    errors.billingStreet ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                  }`}
                  placeholder={t('superAdmin.tenants.create.placeholders.address')}
                />
                {errors.billingStreet && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.billingStreet}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.city')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="billing-city"
                    type="text"
                    value={formData.billingCity}
                    onChange={(e) => handleChange('billingCity', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.billingCity ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('superAdmin.tenants.create.placeholders.city')}
                  />
                  {errors.billingCity && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.billingCity}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="billing-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.district')}
                  </label>
                  <input
                    id="billing-state"
                    type="text"
                    value={formData.billingState}
                    onChange={(e) => handleChange('billingState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder={t('superAdmin.tenants.create.placeholders.district')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing-postal-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.postalCode')} {t('tenants.create.labels.required')}
                  </label>
                  <input
                    id="billing-postal-code"
                    type="text"
                    value={formData.billingPostalCode}
                    onChange={(e) => handleChange('billingPostalCode', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      errors.billingPostalCode ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="34000"
                  />
                  {errors.billingPostalCode && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.billingPostalCode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="billing-country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tenants.create.labels.country')}
                  </label>
                  <select
                    id="billing-country"
                    value={formData.billingCountry}
                    onChange={(e) => handleChange('billingCountry', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="TR">{t('tenants.create.countries.TR')}</option>
                    <option value="US">{t('tenants.create.countries.US')}</option>
                    <option value="GB">{t('tenants.create.countries.GB')}</option>
                    <option value="DE">{t('tenants.create.countries.DE')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tenants.create.labels.taxNumber')}
                </label>
                <input
                  id="tax-id"
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>
            </div>
          )}

          {/* Step 4: Subscription & Features */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('tenants.create.labels.planFeatures')}
                </h3>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('tenants.create.labels.planSelection')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'starter', labelKey: 'starter', price: '$499/ay' },
                    { value: 'professional', labelKey: 'professional', price: '$999/ay' },
                    { value: 'enterprise', labelKey: 'enterprise', price: '$2,499/ay' },
                    { value: 'free', labelKey: 'free', price: '14 gün ücretsiz' },
                  ].map((plan) => (
                    <button
                      key={plan.value}
                      onClick={() => handleChange('plan', plan.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.plan === plan.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{t(`super-admin.tenants.create.plans.${plan.labelKey}`)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="data-residency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('tenants.create.labels.dataLocation')}
                </label>
                <select
                  id="data-residency"
                  value={formData.dataResidency}
                  onChange={(e) => handleChange('dataResidency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="tr">{t('tenants.create.dataLocations.tr')}</option>
                  <option value="eu">{t('tenants.create.dataLocations.eu')}</option>
                  <option value="us">{t('tenants.create.dataLocations.us')}</option>
                </select>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('tenants.create.labels.features')}
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'voiceEnabled', labelKey: 'voiceEnabled', descKey: 'voiceDesc' },
                    { key: 'multiChannel', labelKey: 'multiChannel', descKey: 'multiChannelDesc' },
                    { key: 'analytics', labelKey: 'analytics', descKey: 'analyticsDesc' },
                    { key: 'customIntegrations', labelKey: 'customIntegrations', descKey: 'customIntegrationsDesc' },
                  ].map((feature) => (
                    <label
                      key={feature.key}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                    >
                      <span className="sr-only">{t(`super-admin.tenants.create.features.${feature.labelKey}`)}</span>
                      <input
                        type="checkbox"
                        checked={formData[feature.key as keyof TenantFormData] as boolean}
                        onChange={(e) => handleChange(feature.key as keyof TenantFormData, e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t(`super-admin.tenants.create.features.${feature.labelKey}`)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t(`super-admin.tenants.create.features.${feature.descKey}`)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <label htmlFor="payment-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('tenants.create.labels.paymentStatus')}
                </label>
                <select
                  id="payment-type"
                  value={formData.paymentType || 'monthly_flexible'}
                  onChange={(e) => handleChange('paymentType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="prepaid_yearly">{t('tenants.create.paymentTypes.prepaid_yearly')}</option>
                  <option value="prepaid_6months">{t('tenants.create.paymentTypes.prepaid_6months')}</option>
                  <option value="monthly_commitment">{t('tenants.create.paymentTypes.monthly_commitment')}</option>
                  <option value="monthly_flexible">{t('tenants.create.paymentTypes.monthly_flexible')}</option>
                </select>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {t('tenants.create.misc.paymentNote')}
                </p>
              </div>

              {/* API Configuration (Optional) */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t('tenants.create.misc.apiConfigOptional')}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  {t('tenants.create.misc.apiConfigNote')}
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      id="openai-api-key"
                      type="text"
                      value={formData.openaiApiKey || ''}
                      onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder={t('superAdmin.tenants.create.placeholders.apiKeyPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="anthropic-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Anthropic API Key
                    </label>
                    <input
                      id="anthropic-api-key"
                      type="text"
                      value={formData.anthropicApiKey || ''}
                      onChange={(e) => handleChange('anthropicApiKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder={t('superAdmin.tenants.create.placeholders.anthropicKeyPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Webhook URL
                    </label>
                    <input
                      id="webhook-url"
                      type="url"
                      value={formData.webhookUrl || ''}
                      onChange={(e) => handleChange('webhookUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="https://customer-domain.com/webhook"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {step === 1 ? t('tenants.create.buttons.cancel') : t('tenants.create.buttons.back')}
          </button>
          <button
            onClick={step === 4 ? handleSubmit : handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {step === 4 ? t('tenants.create.buttons.create') : t('tenants.create.buttons.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTenantModal;



