/**
 * 404 Not Found Page
 * Displayed when user navigates to non-existent route
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth-store';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Role-based dashboard path
  const getDashboardPath = () => {
    if (user?.role === 'agent') return '/agent/dashboard';
    // @ts-expect-error - super_admin will be added to UserRole type
    if (user?.role === 'super_admin') return '/asistansuper/dashboard';
    return '/admin/dashboard';
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(getDashboardPath());
  };

  const handleSearch = () => {
    // @ts-expect-error - super_admin will be added to UserRole type
    const basePath = user?.role === 'agent' ? '/agent' : user?.role === 'super_admin' ? '/asistansuper' : '/admin';
    navigate(`${basePath}/help`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated 404 Illustration */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative p-8 bg-white dark:bg-slate-800 rounded-full shadow-xl">
                <FileQuestion className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
            <span className="block text-gray-900 dark:text-gray-100 font-semibold">{t('errors.notFound.goBack')}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">{t('errors.notFound.previousPage')}</span>
          </button>

          <button
            onClick={handleGoHome}
            className="px-6 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <Home className="w-6 h-6 mx-auto mb-2" />
            <span className="block font-semibold">{t('errors.notFound.home')}</span>
            <span className="block text-sm text-blue-100">{t('errors.notFound.goToDashboard')}</span>
          </button>

          <button
            onClick={handleSearch}
            className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all group"
          >
            <Search className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 mx-auto mb-2 transition-colors" />
            <span className="block text-gray-900 dark:text-gray-100 font-semibold">{t('errors.notFound.help')}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">{t('errors.notFound.getSupport')}</span>
          </button>
        </div>

        {/* Popular Pages */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('errors.notFound.popularPages')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => navigate(getDashboardPath())}
              className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                // @ts-expect-error - super_admin will be added to UserRole type
                navigate(`${user?.role === 'agent' ? '/agent' : user?.role === 'super_admin' ? '/asistansuper' : '/admin'}/conversations`);
              }}
              className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              Konuşmalar
            </button>
            <button
              onClick={() => {
                // @ts-expect-error - super_admin will be added to UserRole type
                navigate(`${user?.role === 'agent' ? '/agent' : user?.role === 'super_admin' ? '/asistansuper' : '/admin'}/reports`);
              }}
              className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              Raporlar
            </button>
            <button
              onClick={() => {
                // @ts-expect-error - super_admin will be added to UserRole type
                navigate(`${user?.role === 'agent' ? '/agent' : user?.role === 'super_admin' ? '/asistansuper' : '/admin'}/settings`);
              }}
              className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              Ayarlar
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorun devam ederse{' '}
            <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
              destek ekibimizle
            </a>{' '}
            iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

