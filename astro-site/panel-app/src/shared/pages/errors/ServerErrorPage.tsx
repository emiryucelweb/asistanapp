/**
 * 500 Server Error Page
 * Beautiful error page for server errors
 * 
 * @module shared/pages/errors/ServerErrorPage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle, MessageCircle } from 'lucide-react';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReload = (): void => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 leading-none select-none">
              500
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AlertTriangle className="w-20 h-20 md:w-32 md:h-32 text-red-300 dark:text-red-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Sunucu Hatası
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sunucumuzda bir sorun oluştu. Ekibimiz sorunu çözmek için çalışıyor.
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-8">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            Sistem durumu kontrol ediliyor...
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Sayfayı Yenile
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa
          </button>
        </div>

        {/* Information Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 text-left">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ne Yapabilirsiniz?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Birkaç dakika bekleyin</strong> ve sayfayı yenilemeyi deneyin
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Çerezlerinizi temizleyin</strong> ve tekrar giriş yapın
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Sorun devam ederse</strong> destek ekibiyle iletişime geçin
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Support Link */}
        <div className="mt-8">
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Destek Ekibi ile İletişime Geç
          </a>
        </div>

        {/* Error ID (for support) */}
        <div className="mt-4 text-xs text-gray-400 dark:text-gray-600">
      { }
          Error ID: {Math.random().toString(36).substring(2, 15)}
        </div>
      { }
      </div>
    </div>
  );
};

export default ServerErrorPage;

