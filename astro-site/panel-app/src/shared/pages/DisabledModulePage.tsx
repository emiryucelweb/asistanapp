import React from 'react';
import { AlertCircle } from 'lucide-react';

const DisabledModulePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Modül Devre Dışı
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bu modül şu anda aktif değil. Lütfen yöneticinizle iletişime geçin.
        </p>
      </div>
    </div>
  );
};

export default DisabledModulePage;

