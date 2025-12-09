/**
 * 404 Not Found Page
 * Beautiful error page for missing routes
 * 
 * @module shared/pages/errors/NotFoundPage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 leading-none select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <HelpCircle className="w-20 h-20 md:w-32 md:h-32 text-orange-300 dark:text-orange-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Sayfa Bulunamadı
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa
          </button>
        </div>

        {/* Search Suggestions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Bunları aramayı deneyin:
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <button
              onClick={() => navigate('/agent/conversations')}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              📬 Konuşmalar
            </button>
            <button
              onClick={() => navigate('/agent/dashboard')}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate('/agent/profile')}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              👤 Profil
            </button>
            <button
              onClick={() => navigate('/agent/ai-chat')}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
            >
              🤖 AI Asistan
            </button>
          </div>
        </div>

        {/* Help Link */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Sorun devam ediyorsa{' '}
          <a
            href="mailto:support@example.com"
            className="text-orange-600 dark:text-orange-400 hover:underline"
          >
            destek ekibine ulaşın
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

