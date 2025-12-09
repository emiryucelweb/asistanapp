import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { CreditCard, TrendingUp, FileText, Download, X, Check } from 'lucide-react';

const BillingSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  logger.debug('🔥 BillingSettings CURRENT VERSION - Modals active!');
  
  const [plan] = useState({
    name: t('settings.billing.plans.pro'),
    price: 499,
    period: t('settings.billing.monthly'),
    features: [
      t('settings.billing.features.unlimitedAI'),
      t('settings.billing.features.sms10k'),
      t('settings.billing.features.storage50gb'),
      t('settings.billing.features.team10')
    ]
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [usage] = useState({
    sms: { used: 3245, total: 10000 },
    ai: { used: 8432, total: -1 },
    storage: { used: 23.5, total: 50 },
    team: { used: 3, total: 10 }
  });

  const [invoices] = useState([
    { id: 1, date: '01 Jan 2025', amount: 499, status: 'paid', invoice: 'INV-2025-001' },
    { id: 2, date: '01 Dec 2024', amount: 499, status: 'paid', invoice: 'INV-2024-012' },
    { id: 3, date: '01 Nov 2024', amount: 499, status: 'paid', invoice: 'INV-2024-011' }
  ]);

  const plans = [
    {
      name: t('settings.billing.plans.starter'),
      price: 199,
      period: t('settings.billing.monthly'),
      features: [
        t('settings.billing.planFeatures.starter.ai5k'),
        t('settings.billing.planFeatures.starter.sms1k'),
        t('settings.billing.planFeatures.starter.storage10gb'),
        t('settings.billing.planFeatures.starter.team3'),
        t('settings.billing.planFeatures.starter.emailSupport')
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: t('settings.billing.plans.pro'),
      price: 499,
      period: t('settings.billing.monthly'),
      features: [
        t('settings.billing.planFeatures.pro.unlimitedAI'),
        t('settings.billing.planFeatures.pro.sms10k'),
        t('settings.billing.planFeatures.pro.storage50gb'),
        t('settings.billing.planFeatures.pro.team10'),
        t('settings.billing.planFeatures.pro.prioritySupport'),
        t('settings.billing.planFeatures.pro.apiAccess')
      ],
      color: 'from-purple-500 to-pink-500',
      recommended: true
    },
    {
      name: t('settings.billing.plans.enterprise'),
      price: 1999,
      period: t('settings.billing.monthly'),
      features: [
        t('settings.billing.planFeatures.enterprise.unlimitedAll'),
        t('settings.billing.planFeatures.enterprise.dedicatedServer'),
        t('settings.billing.planFeatures.enterprise.slaGuarantee'),
        t('settings.billing.planFeatures.enterprise.unlimitedTeam'),
        t('settings.billing.planFeatures.enterprise.support247'),
        t('settings.billing.planFeatures.enterprise.customIntegrations')
      ],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // Gerçek uygulamada PDF oluşturulacak
    alert(t('settings.billing.messages.downloadingInvoice', { invoiceNumber }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.billing.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.billing.subtitle')}</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan.name} Plan</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">₺{plan.price}<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/{plan.period}</span></p>
          </div>
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {t('settings.billing.upgradePlan')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-blue-600">✓</span>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.billing.usageStats')}</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.billing.usage.sms')}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{usage.sms.used.toLocaleString('tr-TR')} / {usage.sms.total.toLocaleString('tr-TR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(usage.sms.used / usage.sms.total) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.billing.usage.aiMessage')}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{usage.ai.used.toLocaleString('tr-TR')} / {t('settings.billing.unlimited')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.billing.usage.storage')}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{usage.storage.used} GB / {usage.storage.total} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(usage.storage.used / usage.storage.total) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <CreditCard className="w-5 h-5 inline mr-2" />
          {t('settings.billing.paymentMethod')}
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.billing.cardExpiry')}: 12/2026</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            {t('settings.billing.changeCard')}
          </button>
        </div>
        <div className="mt-3">
          <label htmlFor="auto-payment-checkbox" className="flex items-center">
            <input id="auto-payment-checkbox" type="checkbox" checked className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('settings.billing.autoPayment')}</span>
          </label>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <FileText className="w-5 h-5 inline mr-2" />
          {t('settings.billing.invoiceHistory')}
        </h3>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.invoice}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-900 dark:text-gray-100">₺{invoice.amount}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{t('settings.billing.paid')}</span>
                <button 
                  onClick={() => handleDownloadInvoice(invoice.invoice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={t('settings.billing.downloadInvoice')}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.billing.upgradeModal.title')}</h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((planOption) => (
                <div
                  key={planOption.name}
                  className={`relative border-2 rounded-xl p-6 ${
                    planOption.recommended
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                      : 'border-gray-200 dark:border-slate-600'
                  }`}
                >
                  {planOption.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {t('settings.billing.upgradeModal.recommended')}
                      </span>
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${planOption.color} flex items-center justify-center mb-4`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{planOption.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₺{planOption.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{planOption.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {planOption.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => {
                      alert(t('settings.billing.messages.changingPlan', { planName: planOption.name }));
                      setShowUpgradeModal(false);
                    }}
                    disabled={planOption.name === plan.name}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      planOption.name === plan.name
                        ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : planOption.recommended
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {planOption.name === plan.name ? t('settings.billing.upgradeModal.currentPlan') : t('settings.billing.upgradeModal.selectPlan')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('settings.billing.paymentModal.title')}</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.billing.paymentModal.cardNumber')}
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('settings.billing.paymentModal.expiryDate')}
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    placeholder={t('settings.billing.placeholders.expiryDate')}
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="card-cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.billing.paymentModal.cardHolder')}
                </label>
                <input
                  id="card-name"
                  type="text"
                  placeholder={t('settings.billing.placeholders.cardHolder')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <CreditCard className="w-4 h-4" />
                  <span>{t('settings.billing.paymentModal.securePayment')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('settings.billing.actions.cancel')}
              </button>
              <button
                onClick={() => {
                  alert(t('settings.billing.messages.updatingPayment'));
                  setShowPaymentModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('settings.billing.actions.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSettings;



