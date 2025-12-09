/**
 * 500 Server Error Page
 * Displayed when a server error occurs
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ServerCrash, RefreshCw, Home, HelpCircle } from 'lucide-react';

const ServerErrorPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleContactSupport = () => {
    navigate('/help');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Error Illustration */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="relative p-8 bg-white rounded-full shadow-xl">
                <ServerCrash className="w-24 h-24 text-red-600" />
              </div>
            </div>
          </div>

          {/* 500 Text */}
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
            500
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sunucu Hatası
          </h2>
          <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
            Üzgünüz, sunucuda beklenmeyen bir hata oluştu. Ekibimiz sorunu çözmek için çalışıyor.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Hata Kodu: <code className="px-2 py-1 bg-gray-100 rounded text-red-600 font-mono">ERR_SERVER_500</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleRefresh}
            className="px-6 py-4 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <RefreshCw className="w-6 h-6 mx-auto mb-2" />
            <span className="block font-semibold">{t('errors.serverError.refresh')}</span>
            <span className="block text-sm text-red-100">{t('errors.serverError.reloadPage')}</span>
          </button>

          <button
            onClick={handleGoHome}
            className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <Home className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
            <span className="block text-gray-900 font-semibold">{t('errors.serverError.home')}</span>
            <span className="block text-sm text-gray-500">{t('errors.serverError.goToDashboard')}</span>
          </button>

          <button
            onClick={handleContactSupport}
            className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all group"
          >
            <HelpCircle className="w-6 h-6 text-gray-600 group-hover:text-orange-600 mx-auto mb-2 transition-colors" />
            <span className="block text-gray-900 font-semibold">{t('errors.serverError.support')}</span>
            <span className="block text-sm text-gray-500">{t('errors.serverError.getHelp')}</span>
          </button>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('errors.serverError.whatCanYouDo')}</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                {t('errors.serverError.tip1')}
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                {t('errors.serverError.tip2')}
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                {t('errors.serverError.tip3')}
              </p>
            </li>
          </ul>
        </div>

        {/* System Status */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ServerCrash className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-orange-900 mb-1">
                Sistem Durumu
              </h4>
              <p className="text-sm text-orange-700">
                Teknik ekibimiz sorunu çözmek için çalışıyor. Anlayışınız için teşekkür ederiz.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Hata ID: <code className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono text-xs">
          { }
              {Date.now().toString(36).toUpperCase()}
            </code>
          { }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;

