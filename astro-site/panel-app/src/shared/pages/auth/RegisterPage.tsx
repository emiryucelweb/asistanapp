import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex items-center justify-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">AsistanApp</h2>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Hesap Oluştur
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Kayıt işlemi henüz aktif değil. Lütfen yöneticinizle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
